'use client'

import * as React from 'react'
import Link from 'next/link'
import { Drawer, Button } from '@/components/ui'
import { useCartStore, selectCartSubtotal } from '@/stores/cart.store'
import { CartItem } from './CartItem'
import { formatCurrency } from '@/utils/formatCurrency'
import { ShoppingBag } from 'lucide-react'

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer } = useCartStore()
  const subtotal = selectCartSubtotal(items)
  const isFreeShipping = subtotal >= 49900

  return (
    <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} title="Your Collection">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-16 text-center space-y-4">
          <ShoppingBag className="h-12 w-12 text-gold-300/40" />
          <h3 className="font-cormorant text-2xl text-white-100 font-light">
            Your garage is empty
          </h3>
          <p className="text-xs text-white-400 max-w-xs font-light">
            Explore our curated automotive fragrances to scent your cabin.
          </p>
          <Button variant="secondary" size="sm" onClick={closeDrawer} className="mt-4">
            <Link href="/products">Explore Fragrances</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Free Shipping Indicator */}
          <div className="bg-bg-surface p-3 border border-white-500/20 mb-4 text-center">
            <span className="text-xs font-inter text-gold-200">
              {isFreeShipping
                ? '✓ You have unlocked Complimentary Shipping'
                : `Add ${formatCurrency(49900 - subtotal)} more for Complimentary Shipping`}
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
            ))}
          </div>

          {/* Footer Checkout Summary */}
          <div className="pt-6 border-t border-white-500/20 space-y-4 mt-auto">
            <div className="flex justify-between items-baseline text-sm font-inter">
              <span className="text-white-300 uppercase tracking-widest text-xs">Subtotal</span>
              <span className="text-lg font-medium text-gold-200 tabular-nums">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-white-400 leading-tight">
              Taxes calculated at checkout. Shipping is free on orders above ₹499.
            </p>

            <Link href="/checkout" onClick={closeDrawer} className="block w-full">
              <Button variant="primary" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  )
}
