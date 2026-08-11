'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, useToast } from '@/components/ui'
import { useCartStore, selectCartSubtotal } from '@/stores/cart.store'
import { formatCurrency } from '@/utils/formatCurrency'
import { applyCoupon } from '../actions/applyCoupon'

export function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { toast } = useToast()

  const subtotal = selectCartSubtotal(items)
  const [couponInput, setCouponInput] = React.useState('')
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null)
  const [discount, setDiscount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  // Address fields
  const [fullName, setFullName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [address1, setAddress1] = React.useState('')
  const [city, setCity] = React.useState('')
  const [stateName, setStateName] = React.useState('')
  const [pincode, setPincode] = React.useState('')

  const shippingCharge = subtotal - discount >= 49900 ? 0 : 6000
  const taxableAmount = Math.max(0, subtotal - discount) + shippingCharge
  const tax = Math.round(taxableAmount * 0.18)
  const total = taxableAmount + tax

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput) return

    const res = await applyCoupon({ code: couponInput, subtotal })
    if (res.success) {
      setAppliedCoupon(res.data.code)
      setDiscount(res.data.discount)
      toast(`Coupon ${res.data.code} applied! Saved ${formatCurrency(res.data.discount)}`, 'success')
    } else {
      const msg = typeof res.error === 'string' ? res.error : res.error.message
      toast(msg, 'error')
    }
  }

  const handleConfirmAndPay = async () => {
    if (!fullName || !phone || !address1 || !city || !pincode) {
      toast('Please fill in all shipping address fields.', 'error')
      return
    }

    setLoading(true)

    try {
      // 1. Create order API call
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: { fullName, phone, address1, city, state: stateName, pincode },
          couponCode: appliedCoupon,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        toast('Failed to create payment order. Please try again.', 'error')
        setLoading(false)
        return
      }

      // 2. Open Razorpay or mock test completion
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: data.data.razorpayOrderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'test_signature',
          orderId: data.data.orderId,
        }),
      })

      const verifyData = await verifyRes.json()

      if (verifyData.success) {
        clearCart()
        toast('Payment successful! Order confirmed.', 'success')
        router.push(`/checkout/success?orderNumber=${data.data.orderNumber}`)
      } else {
        toast('Payment verification failed.', 'error')
      }
    } catch {
      toast('Checkout failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="font-cormorant text-heading-lg text-white-100 font-light">
          Your cart is empty
        </h2>
        <Button variant="secondary" onClick={() => router.push('/products')}>
          Explore Fragrances
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left: Shipping Form (7 cols) */}
      <div className="lg:col-span-7 bg-bg-surface border border-white-500/20 p-4 sm:p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-label text-gold-300 uppercase tracking-widest block">
            Step 1 of 2
          </span>
          <h2 className="font-cormorant text-2xl sm:text-heading-lg text-white-100 font-light">
            Shipping Details
          </h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Priya Mehta"
          />

          <Input
            label="Phone Number (10 digits)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="9876543210"
          />

          <Input
            label="Address Line 1"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            required
            placeholder="Flat 4B, Marine Heights, Marine Drive"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Mumbai"
            />
            <Input
              label="State"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              required
              placeholder="Maharashtra"
            />
          </div>

          <Input
            label="PIN Code (6 digits)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
            placeholder="400001"
          />
        </div>
      </div>

      {/* Right: Order Review & Total (5 cols) */}
      <div className="lg:col-span-5 bg-bg-surface border border-gold-300/30 p-4 sm:p-6 md:p-8 space-y-6">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Order Summary
        </span>

        {/* Cart Items Snapshot */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border-b border-white-500/20 pb-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-xs text-white-200">
              <span className="truncate flex-1 font-light">
                {item.name} ({item.variantLabel}) × {item.quantity}
              </span>
              <span className="tabular-nums font-medium text-gold-200 ml-4">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Coupon Input */}
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <Input
            placeholder="Enter NOIR20"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="text-xs uppercase py-2"
          />
          <Button type="submit" variant="secondary" size="sm" className="shrink-0">
            Apply
          </Button>
        </form>

        {/* Breakdown */}
        <div className="space-y-2 text-xs font-inter border-t border-white-500/20 pt-4 text-white-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums text-white-100">{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-gold-200">
              <span>Coupon Discount ({appliedCoupon})</span>
              <span className="tabular-nums">-{formatCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="tabular-nums text-white-100">
              {shippingCharge === 0 ? 'FREE' : formatCurrency(shippingCharge)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span className="tabular-nums text-white-100">{formatCurrency(tax)}</span>
          </div>

          <div className="flex justify-between text-body-md font-medium text-gold-200 pt-3 border-t border-white-500/20">
            <span>Total Payable</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button
          onClick={handleConfirmAndPay}
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loading}
        >
          Confirm & Pay {formatCurrency(total)}
        </Button>
      </div>
    </div>
  )
}
