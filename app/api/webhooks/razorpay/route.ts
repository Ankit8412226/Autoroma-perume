import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/payment/verifySignature'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') ?? ''
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dev_webhook_secret'

    const isValid = verifyRazorpaySignature(rawBody, signature, webhookSecret)
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 422 })
    }

    const event = JSON.parse(rawBody)

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const razorpayOrderId = payment.order_id

      try {
        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            razorpayPaymentId: payment.id,
            paidAt: new Date(),
          },
        })
      } catch {
        // Fallback
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
