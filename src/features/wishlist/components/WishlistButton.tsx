'use client'

import * as React from 'react'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/stores/wishlist.store'
import { cn } from '@/utils/cn'

export function WishlistButton({
  productId,
  className,
}: {
  productId: string
  className?: string
}) {
  const { productIds, toggle } = useWishlistStore()
  const isWishlisted = productIds.includes(productId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(productId)
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'p-2 bg-bg-surface/80 backdrop-blur-sm border border-white-500/20 text-white-200 hover:text-gold-300 transition-all duration-150 rounded-none',
        isWishlisted && 'text-gold-300 border-gold-300/40 bg-gold-300/10',
        className
      )}
    >
      <Heart className={cn('h-4 w-4 transition-transform duration-150', isWishlisted && 'fill-gold-300')} />
    </button>
  )
}
