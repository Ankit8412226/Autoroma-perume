# 12_PAYMENT_SYSTEM.md — Payment Architecture & Specification

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: Backend Engineers, Security Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Payment Gateway](#1-payment-gateway)
2. [Flow Diagram](#2-flow-diagram)
3. [Razorpay Configuration](#3-razorpay-configuration)
4. [Order Creation](#4-order-creation)
5. [Client-Side Integration](#5-client-side-integration)
6. [Payment Verification](#6-payment-verification)
7. [Webhook Processing](#7-webhook-processing)
8. [Invoice Generation](#8-invoice-generation)
9. [Refund Processing](#9-refund-processing)
10. [Retry Logic](#10-retry-logic)
11. [Security](#11-security)

---

## 1. Payment Gateway

**Razorpay** is the sole payment gateway in Phase 1.

| Capability | Support |
|---|---|
| Credit/Debit Cards | ✅ |
| UPI (GPay, PhonePe, BHIM) | ✅ |
| Net Banking | ✅ |
| Wallets (Paytm, Amazon Pay) | ✅ |
| EMI | ✅ (auto on supported cards) |
| International Cards | ✅ |
| Currency | INR only (Phase 1) |

### Environment Keys

```bash
# Server-side (never exposed to client)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Client-side (safe to expose — public key only)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
```

---

## 2. Flow Diagram

```
CUSTOMER                    NEXT.JS SERVER              RAZORPAY
    │                           │                           │
    │ 1. Click "Confirm & Pay"  │                           │
    │──────────────────────────►│                           │
    │                           │ 2. Validate cart + prices  │
    │                           │──────────────────────────►│
    │                           │ 3. POST /v1/orders        │
    │                           │◄──────────────────────────│
    │                           │    razorpay_order_id       │
    │                           │                           │
    │ 4. Return order_id + key  │                           │
    │◄──────────────────────────│                           │
    │                           │                           │
    │ 5. Open Razorpay modal    │                           │
    │──────────────────────────────────────────────────────►│
    │                           │                           │
    │ 6. User pays (UPI/Card)   │                           │
    │◄──────────────────────────────────────────────────────│
    │                           │                           │
    │ 7. Razorpay returns:      │                           │
    │    payment_id, signature   │                           │
    │                           │                           │
    │ 8. POST /api/payment/verify                           │
    │──────────────────────────►│                           │
    │                           │ 9. Verify HMAC signature  │
    │                           │                           │
    │ 10. Redirect to /success  │                           │
    │◄──────────────────────────│                           │
    │                           │                           │
    │                           │◄──────────────────────────│
    │                           │ 11. Webhook: payment.captured
    │                           │ 12. Update order CONFIRMED │
    │                           │ 13. Decrement inventory   │
    │                           │ 14. Send email            │
```

---

## 3. Razorpay Configuration

```typescript
// src/lib/payment/razorpay.ts
import 'server-only'
import Razorpay from 'razorpay'

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are not configured')
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})
```

---

## 4. Order Creation

```typescript
// app/api/payment/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { razorpay } from '@/lib/payment/razorpay'
import { calculateOrderTotal } from '@/features/checkout/lib/calculateOrderTotal'
import { createOrderSchema } from '@/features/checkout/schemas/createOrder.schema'
import { generateOrderNumber } from '@/utils/generateOrderNumber'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
    }

    const body = await req.json()
    const validated = createOrderSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', details: validated.error.flatten() } }, { status: 400 })
    }

    const { cartItems, addressId, couponCode } = validated.data

    // Fetch and validate address
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id }
    })
    if (!address) return NextResponse.json({ success: false, error: { code: 'ADDRESS_NOT_FOUND' } }, { status: 404 })

    // Fetch coupon if provided
    let coupon = null
    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: { code: couponCode.toUpperCase(), isActive: true }
      })
    }

    // Calculate totals server-side
    const totals = await calculateOrderTotal(cartItems, coupon ?? undefined)

    // Create internal order (PENDING)
    const orderNumber = await generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        ...totals,
        couponId: coupon?.id,
        couponCode: coupon?.code,
        couponDiscount: totals.discount,
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          address1: address.address1,
          address2: address.address2 ?? undefined,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country,
        },
        items: {
          create: await buildOrderItems(cartItems)
        }
      }
    })

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totals.total,           // In paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        customerName: session.user.name ?? '',
        customerEmail: session.user.email,
      }
    })

    // Link Razorpay order to our order
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id }
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: totals.total,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Payment order creation failed:', error)
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

---

## 5. Client-Side Integration

```typescript
// src/features/checkout/hooks/useRazorpayCheckout.ts
'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface RazorpayOptions {
  orderId: string
  razorpayOrderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  keyId: string
}

export function useRazorpayCheckout() {
  const router = useRouter()

  const openCheckout = useCallback((opts: RazorpayOptions) => {
    return new Promise<void>((resolve, reject) => {
      // Razorpay script must be loaded globally
      // Added to app/layout.tsx: <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      
      if (typeof window.Razorpay === 'undefined') {
        reject(new Error('Razorpay script not loaded'))
        return
      }

      const rzp = new window.Razorpay({
        key: opts.keyId,
        amount: opts.amount,
        currency: 'INR',
        name: 'Maison Noir',
        description: `Order ${opts.orderId}`,
        image: '/images/logo-gold.svg',
        order_id: opts.razorpayOrderId,
        prefill: {
          name: opts.customerName,
          email: opts.customerEmail,
          contact: opts.customerPhone,
        },
        theme: {
          color: '#C9A96E',     // Brand gold
          backdrop_color: '#080808',
        },
        modal: {
          backdropclose: false,  // Prevent accidental close
          confirm_close: true,   // Confirm before closing
          animation: true,
        },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const verifyData = await verifyRes.json()
            
            if (verifyData.success) {
              router.push(`/checkout/success?orderId=${opts.orderId}`)
              resolve()
            } else {
              reject(new Error('Payment verification failed'))
            }
          } catch {
            reject(new Error('Payment verification request failed'))
          }
        },
      })

      rzp.on('payment.failed', (response: { error: { description: string } }) => {
        reject(new Error(response.error.description))
      })

      rzp.open()
    })
  }, [router])

  return { openCheckout }
}
```

---

## 6. Payment Verification

```typescript
// app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { verifyRazorpaySignature } from '@/lib/payment/verifySignature'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ success: false }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

  // Verify signature
  const isValid = verifyRazorpaySignature(
    `${razorpay_order_id}|${razorpay_payment_id}`,
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET!
  )

  if (!isValid) {
    return NextResponse.json({
      success: false,
      error: { code: 'PAYMENT_VERIFICATION_FAILED' }
    }, { status: 422 })
  }

  // Update order (primary update comes from webhook — this is backup)
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: razorpay_order_id, userId: session.user.id }
  })

  if (!order) return NextResponse.json({ success: false }, { status: 404 })

  // Only update if still PENDING (webhook may have already processed it)
  if (order.status === 'PENDING') {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        // Do NOT mark CONFIRMED here — wait for webhook for reliability
      }
    })
  }

  return NextResponse.json({ success: true, data: { orderId: order.id } })
}
```

### Signature Verification

```typescript
// src/lib/payment/verifySignature.ts
import crypto from 'crypto'

export function verifyRazorpaySignature(
  payload: string,       // "orderId|paymentId" for checkout, rawBody for webhook
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  )
}
```

---

## 7. Webhook Processing

```typescript
// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/payment/verifySignature'
import { handlePaymentCaptured, handlePaymentFailed, handleRefundCreated } from '@/lib/payment/webhookHandler'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!

  // Verify webhook authenticity
  const isValid = verifyRazorpaySignature(rawBody, signature, webhookSecret)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 422 })
  }

  const event = JSON.parse(rawBody)

  try {
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity)
        break
      default:
        // Unhandled event — log but return 200 to prevent Razorpay retry
        console.log('Unhandled Razorpay event:', event.event)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Return 500 so Razorpay retries
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
```

### Webhook Handler

```typescript
// src/lib/payment/webhookHandler.ts
import { prisma } from '@/lib/db/prisma'
import { decrementInventory } from '@/lib/inventory/decrementInventory'
import { sendOrderConfirmationEmail } from '@/lib/email/sendEmail'

export async function handlePaymentCaptured(payment: {
  id: string
  order_id: string
  amount: number
}) {
  // Idempotency — prevent double processing
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId: payment.order_id },
    include: { items: true, user: true }
  })

  if (!order) throw new Error(`Order not found for Razorpay order: ${payment.order_id}`)
  if (order.status === 'CONFIRMED') return  // Already processed

  // Update order
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      razorpayPaymentId: payment.id,
      paidAt: new Date(),
    }
  })

  // Decrement inventory
  await decrementInventory(
    order.items.map(item => ({
      productId: item.productId,
      variantId: item.variantId ?? '',
      quantity: item.quantity,
    }))
  )

  // Increment coupon usage if applied
  if (order.couponId) {
    await prisma.coupon.update({
      where: { id: order.couponId },
      data: { usageCount: { increment: 1 } }
    })
  }

  // Send confirmation email
  await sendOrderConfirmationEmail({
    to: order.user.email!,
    customerName: order.user.name ?? 'Valued Customer',
    orderNumber: order.orderNumber,
    items: order.items,
    total: order.total,
  })
}

export async function handlePaymentFailed(payment: { order_id: string }) {
  await prisma.order.updateMany({
    where: { razorpayOrderId: payment.order_id },
    data: { paymentStatus: 'FAILED' }
  })
  // Optional: send failure email
}

export async function handleRefundCreated(refund: {
  payment_id: string
  amount: number
}) {
  const order = await prisma.order.findFirst({
    where: { razorpayPaymentId: refund.payment_id }
  })
  if (!order) return

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'REFUNDED',
      paymentStatus: 'REFUNDED',
    }
  })
}
```

---

## 8. Invoice Generation

PDF invoices are generated and emailed on order confirmation.

```typescript
// Using @react-pdf/renderer for PDF generation
// Template: src/lib/pdf/InvoiceTemplate.tsx

interface InvoiceData {
  orderNumber: string
  orderDate: Date
  customerName: string
  shippingAddress: ShippingAddress
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  gstRate: 18
}

// Invoice attachment in confirmation email:
const pdfBuffer = await generateInvoicePDF(invoiceData)
await resend.emails.send({
  from: 'orders@maisonnoir.in',
  to: customerEmail,
  subject: `Your Order ${orderNumber} is confirmed`,
  react: <OrderConfirmationEmail ... />,
  attachments: [{
    filename: `Maison-Noir-Invoice-${orderNumber}.pdf`,
    content: pdfBuffer,
  }]
})
```

---

## 9. Refund Processing

```typescript
// src/lib/payment/processRefund.ts
import 'server-only'
import { razorpay } from './razorpay'
import { prisma } from '@/lib/db/prisma'

export async function processRefund(
  orderId: string,
  amount?: number   // Optional partial refund (in paise); null = full refund
): Promise<{ refundId: string }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  })

  if (!order || !order.razorpayPaymentId) {
    throw new Error('Order or payment not found for refund')
  }

  if (order.paymentStatus === 'REFUNDED') {
    throw new Error('Order already refunded')
  }

  const refundAmount = amount ?? order.total  // Default: full refund

  const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
    amount: refundAmount,
    notes: { orderId, reason: 'Customer return request' }
  })

  // Update DB — webhook will also fire and update
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: refundAmount === order.total ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
    }
  })

  return { refundId: refund.id }
}
```

---

## 10. Retry Logic

Razorpay retries webhook calls if the endpoint returns a non-200 response:

- **Retry schedule**: Immediately, then 5 min, 15 min, 30 min, 1 hour, 3 hours, 6 hours
- **Max retries**: 7 attempts

Our webhook always returns 200 for processed events, 500 only if processing genuinely failed (for retry). Idempotency check prevents double-processing on retries.

---

## 11. Security

### Critical Security Rules

1. **Never log** `razorpay_signature`, `RAZORPAY_KEY_SECRET`, or `RAZORPAY_WEBHOOK_SECRET`
2. **Never expose** `RAZORPAY_KEY_SECRET` to client — only `NEXT_PUBLIC_RAZORPAY_KEY_ID`
3. **Always verify** webhook signatures before processing — no exceptions
4. **Timing-safe comparison** for signatures (`crypto.timingSafeEqual`)
5. **Always recalculate** order total server-side — never use client-provided total
6. **HTTPS only** — Razorpay requires HTTPS for production webhook URLs
7. **Webhook secret** must be different from `key_secret`

### Environment Variable Guards

```typescript
// src/lib/payment/razorpay.ts
import 'server-only'  // Prevents this file from being imported client-side

const requiredEnvVars = [
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}
```
