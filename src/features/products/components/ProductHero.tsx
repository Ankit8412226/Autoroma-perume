'use client'

import * as React from 'react'
import Image from 'next/image'
import { Button, Badge, useToast } from '@/components/ui'
import { WishlistButton } from '@/features/wishlist/components/WishlistButton'
import { useCartStore } from '@/stores/cart.store'
import { formatCurrency } from '@/utils/formatCurrency'
import { ShieldCheck, Truck, Sparkles, Star } from 'lucide-react'

export interface ProductHeroProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    description: string
    shortDescription: string
    images: string[]
    productType: string
    scentFamily: string
    intensity: string
    longevity: string
    compatible: string[]
    mountType: string[]
    averageRating: number
    reviewCount: number
    variants: Array<{ id: string; label: string; sku: string; price: number; stock: number }>
    stock: number
  }
}

export function ProductHero({ product }: ProductHeroProps) {
  const [selectedImage, setSelectedImage] = React.useState(product.images[0] || '')
  const [selectedVariant, setSelectedVariant] = React.useState(product.variants[0] || null)
  const { addItem } = useCartStore()
  const { toast } = useToast()

  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const formattedPrice = formatCurrency(currentPrice)
  const formattedCompare = product.compareAtPrice ? formatCurrency(product.compareAtPrice) : null

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || 'default',
      name: product.name,
      image: selectedImage || product.images[0] || '',
      productType: product.productType,
      variantLabel: selectedVariant?.label || 'Standard',
      price: currentPrice,
      quantity: 1,
    })
    toast(`Added ${product.name} to your garage.`, 'success')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left: Gallery (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="relative aspect-[4/5] w-full bg-bg-surface border border-white-500/20 overflow-hidden">
          <Image
            src={selectedImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute top-4 right-4 z-10">
            <WishlistButton productId={product.id} />
          </div>
        </div>

        {/* Thumbnail Row */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square w-20 bg-bg-surface border transition-colors ${
                  selectedImage === img ? 'border-gold-300' : 'border-white-500/30 hover:border-white-500'
                }`}
              >
                <Image src={img} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Details (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="gold">{product.productType.replace('_', ' ')}</Badge>
            <Badge variant="outline">{product.scentFamily}</Badge>
          </div>
          <h1 className="font-cormorant text-2xl sm:text-4xl lg:text-display-lg text-white-100 font-light leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Price & Star Rating */}
        <div className="flex flex-wrap items-center justify-between border-y border-white-500/20 py-4 gap-3">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-heading-lg font-medium text-gold-200 tabular-nums font-inter">
              {formattedPrice}
            </span>
            {formattedCompare && (
              <span className="text-xs text-white-400 line-through tabular-nums font-inter">
                {formattedCompare}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white-200">
            <Star className="h-4 w-4 fill-gold-300 text-gold-300" />
            <span className="tabular-nums font-medium">
              {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
            </span>
            <span className="text-white-400">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-body-md text-white-200 font-light leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 sm:p-4 bg-bg-surface border border-white-500/20 text-xs text-white-300">
          <div>
            <span className="text-white-400 block uppercase tracking-wider text-[10px]">Longevity</span>
            <span className="text-white-100 font-medium">{product.longevity}</span>
          </div>
          <div>
            <span className="text-white-400 block uppercase tracking-wider text-[10px]">Scent Intensity</span>
            <span className="text-white-100 font-medium">{product.intensity}</span>
          </div>
          <div>
            <span className="text-white-400 block uppercase tracking-wider text-[10px]">Fitment</span>
            <span className="text-white-100 font-medium">{product.compatible.join(', ')}</span>
          </div>
          <div>
            <span className="text-white-400 block uppercase tracking-wider text-[10px]">Mounting</span>
            <span className="text-white-100 font-medium">{product.mountType.join(', ')}</span>
          </div>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 0 && (
          <div className="space-y-2">
            <span className="text-label text-gold-300 uppercase tracking-widest block">
              Select Option
            </span>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 text-xs font-inter uppercase tracking-wider border transition-colors ${
                    selectedVariant?.id === v.id
                      ? 'border-gold-300 bg-gold-300/15 text-gold-200'
                      : 'border-white-500/40 text-white-300 hover:border-white-500'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="xl"
          className="w-full mt-2"
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Garage' : 'Out of Stock'}
        </Button>

        {/* Trust Value Props */}
        <div className="space-y-2 pt-4 border-t border-white-500/20 text-xs text-white-300 font-light">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gold-300" />
            <span>Complimentary shipping on orders above ₹499</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold-300" />
            <span>Formulated with heat-resistant IFRA certified fragrance oils</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-300" />
            <span>Zero harsh chemical headaches or alcohol fumes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
