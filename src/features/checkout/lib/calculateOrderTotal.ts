import { prisma } from '@/lib/db/prisma'

export interface OrderTotals {
  subtotal: number       // in paise
  discount: number       // in paise
  shippingCharge: number // in paise (0 if subtotal >= ₹499)
  tax: number            // 18% GST (in paise)
  total: number          // final total (in paise)
}

interface ProductSelectResult {
  id: string
  price: number
  variants: Array<{ id: string; price: number; stock: number }>
  stock: number
}

export async function calculateOrderTotal(
  cartItems: { productId: string; variantId: string; quantity: number }[],
  couponCode?: string
): Promise<OrderTotals> {
  const productIds = cartItems.map((i) => i.productId)

  let products: ProductSelectResult[] = []
  try {
    products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, variants: true, stock: true },
    })
  } catch {
    products = []
  }

  let subtotal = 0

  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId)
    let unitPrice = product ? product.price : 49900

    if (product && item.variantId) {
      const variant = product.variants.find((v: { id: string }) => v.id === item.variantId)
      if (variant) unitPrice = variant.price
    }

    subtotal += unitPrice * item.quantity
  }

  // Coupon discount
  let discount = 0
  if (couponCode) {
    try {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode.toUpperCase(), isActive: true },
      })

      if (coupon) {
        if (coupon.type === 'PERCENTAGE') {
          discount = Math.round((subtotal * coupon.value) / 100)
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
        } else if (coupon.type === 'FIXED') {
          discount = Math.min(coupon.value, subtotal)
        }
      }
    } catch {
      discount = 0
    }
  }

  const afterDiscount = Math.max(0, subtotal - discount)
  const shippingCharge = afterDiscount >= 49900 ? 0 : 6000 // ₹60 shipping under ₹499
  const taxableAmount = afterDiscount + shippingCharge
  const tax = Math.round(taxableAmount * 0.18) // 18% GST
  const total = taxableAmount + tax

  return {
    subtotal,
    discount,
    shippingCharge,
    tax,
    total,
  }
}
