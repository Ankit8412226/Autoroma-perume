'use server'

import { prisma } from '@/lib/db/prisma'
import type { ActionResult } from '@/types/action.types'

export async function applyCoupon(input: {
  code: string
  subtotal: number
}): Promise<ActionResult<{ code: string; discount: number }>> {
  try {
    const { code, subtotal } = input
    if (!code) return { success: false, error: 'Please enter a coupon code.' }

    const coupon = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), isActive: true },
    })

    if (!coupon) {
      return { success: false, error: 'Invalid or expired coupon code.' }
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { success: false, error: 'This coupon offer has ended.' }
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return {
        success: false,
        error: `Minimum order value of ₹${(coupon.minOrderValue / 100).toFixed(0)} required for this offer.`,
      }
    }

    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.round((subtotal * coupon.value) / 100)
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
    } else if (coupon.type === 'FIXED') {
      discount = Math.min(coupon.value, subtotal)
    }

    return {
      success: true,
      data: {
        code: coupon.code,
        discount,
      },
    }
  } catch (error) {
    console.error('Coupon validation error:', error)
    return { success: false, error: 'Failed to validate coupon code.' }
  }
}
