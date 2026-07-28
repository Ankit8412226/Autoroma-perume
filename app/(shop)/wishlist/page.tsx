'use client'

import * as React from 'react'
import Link from 'next/link'
import { useWishlistStore } from '@/stores/wishlist.store'
import { Button } from '@/components/ui'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const { productIds } = useWishlistStore()

  return (
    <main className="py-12 px-6 md:px-12 max-w-7xl mx-auto space-y-8 min-h-[60vh]">
      <div className="space-y-2">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Saved Selection
        </span>
        <h1 className="font-cormorant text-display-xl font-light text-white-100">
          Your Wishlist
        </h1>
      </div>

      {productIds.length === 0 ? (
        <div className="py-24 text-center bg-bg-surface border border-white-500/20 space-y-4 max-w-lg mx-auto">
          <Heart className="h-12 w-12 text-gold-300/40 mx-auto" />
          <h3 className="font-cormorant text-2xl text-white-100 font-light">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-white-400 font-light max-w-xs mx-auto">
            Save your favorite car fragrances to revisit or order anytime.
          </p>
          <Button variant="secondary" size="sm">
            <Link href="/products">Explore Fragrances</Link>
          </Button>
        </div>
      ) : (
        <div className="p-8 bg-bg-surface border border-white-500/20 text-center space-y-4">
          <p className="text-sm text-white-200">
            You have <strong className="text-gold-200">{productIds.length}</strong> saved fragrance item(s).
          </p>
          <Button variant="primary">
            <Link href="/products">Browse Catalog</Link>
          </Button>
        </div>
      )}
    </main>
  )
}
