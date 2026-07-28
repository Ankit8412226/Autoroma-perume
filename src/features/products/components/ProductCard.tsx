'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Badge } from '@/components/ui'
import { WishlistButton } from '@/features/wishlist/components/WishlistButton'
import { formatCurrency } from '@/utils/formatCurrency'
import { Star } from 'lucide-react'

export interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    images: string[]
    productType: string
    scentFamily: string
    averageRating: number
    reviewCount: number
    isNew: boolean
    stock: number
  }
}

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)

  const formattedPrice = formatCurrency(product.price)
  const formattedComparePrice = product.compareAtPrice ? formatCurrency(product.compareAtPrice) : null

  const rawImage = product.images && product.images.length > 0 ? product.images[0] : ''
  const mainImage = rawImage && !rawImage.includes('v1700000000') && rawImage.startsWith('http')
    ? rawImage
    : 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'

  // GSAP 3D Tilt Effect on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
    })
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="will-change-transform"
    >
      <article className="group relative bg-bg-surface border border-white-500/20 hover:border-gold-300 transition-all duration-300 flex flex-col h-full rounded-none overflow-hidden hover:shadow-[0_10px_30px_rgba(201,169,110,0.15)]">
        {/* Aspect 4:5 Image Container */}
        <div className="relative aspect-[4/5] w-full bg-bg-secondary overflow-hidden">
          <Image
            src={mainImage}
            alt={`${product.name} — Car Fragrance`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNew && <Badge variant="gold">NEW</Badge>}
            {product.stock <= 0 && <Badge variant="outline">SOLD OUT</Badge>}
          </div>

          {/* Wishlist Button Overlay */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton productId={product.id} />
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-2">
            {/* Label: Product Type & Scent Family */}
            <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
              {product.productType.replace('_', ' ')} · {product.scentFamily}
            </span>

            {/* Product Name */}
            <h3 className="font-cormorant text-heading-md font-light text-white-100 group-hover:text-gold-200 transition-colors line-clamp-1">
              <Link href={`/products/${product.slug}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {product.name}
              </Link>
            </h3>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between pt-2 border-t border-white-500/10">
            <div className="flex items-baseline gap-2">
              <span className="text-body-md text-gold-200 font-medium tabular-nums font-inter">
                {formattedPrice}
              </span>
              {formattedComparePrice && (
                <span className="text-xs text-white-400 line-through tabular-nums font-inter">
                  {formattedComparePrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-white-300 font-inter">
              <Star className="h-3.5 w-3.5 fill-gold-300 text-gold-300" />
              <span className="tabular-nums font-medium text-white-200">
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="text-white-400">({product.reviewCount})</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
})
