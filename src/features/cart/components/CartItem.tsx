'use client'

import * as React from 'react'
import Image from 'next/image'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore, type CartItem as CartItemType } from '@/stores/cart.store'
import { formatCurrency } from '@/utils/formatCurrency'

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 py-4 border-b border-white-500/20 items-center">
      {/* Product Image */}
      <div className="relative aspect-square h-20 bg-bg-surface border border-white-500/20 shrink-0 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-[10px] text-gold-300 uppercase tracking-widest block font-inter">
          {item.productType.replace('_', ' ')}
        </span>
        <h4 className="font-cormorant text-base text-white-100 font-light truncate">
          {item.name}
        </h4>
        <span className="text-xs text-white-400 font-inter block">
          Variant: {item.variantLabel}
        </span>
        <span className="text-sm font-medium text-gold-200 tabular-nums block">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>

      {/* Quantity Controls & Remove */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          className="text-white-400 hover:text-error transition-colors p-1"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="flex items-center border border-white-500/30 text-white-200">
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
            className="p-1 hover:text-gold-300 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="px-2.5 text-xs tabular-nums font-inter">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
            className="p-1 hover:text-gold-300 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
