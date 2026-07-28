'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui'
import { WishlistButton } from '@/features/wishlist/components/WishlistButton'
import { useCartStore } from '@/stores/cart.store'
import { formatCurrency } from '@/utils/formatCurrency'
import { Star, BookOpen, ShoppingBag, X } from 'lucide-react'

export interface FlippingBookProductCardProps {
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
    topNotes?: string[]
    heartNotes?: string[]
    baseNotes?: string[]
  }
}

// Pure Web Audio API Synthesizer for Page-Flip Sound Effect
function playBookFlipSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const bufferSize = ctx.sampleRate * 0.12
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1200, ctx.currentTime)
    filter.Q.setValueAtTime(1.5, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
  } catch {
    // Ignore if audio context not allowed
  }
}

export function FlippingBookProductCard({ product }: FlippingBookProductCardProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const openDrawer = useCartStore((state) => state.openDrawer)

  const formattedPrice = formatCurrency(product.price)
  const formattedComparePrice = product.compareAtPrice ? formatCurrency(product.compareAtPrice) : null

  const rawImage = product.images && product.images.length > 0 ? product.images[0] : ''
  const mainImage = rawImage && !rawImage.includes('v1700000000') && rawImage.startsWith('http')
    ? rawImage
    : 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'

  const toggleBook = (e: React.MouseEvent) => {
    e.stopPropagation()
    playBookFlipSound()
    setIsOpen(!isOpen)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      variantId: product.id,
      name: product.name,
      image: mainImage,
      productType: product.productType,
      variantLabel: 'Standard Unit',
      price: product.price,
      quantity: 1,
    })
    openDrawer()
  }

  return (
    <div className="relative w-full h-[480px] [perspective:1400px]">
      {/* 3D Book Container */}
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isOpen ? '[transform:rotateY(-180deg)]' : ''
        }`}
      >
        {/* ========================================================== */}
        {/* 1. FRONT COVER (CLOSED BOOK) */}
        {/* ========================================================== */}
        <article
          onClick={toggleBook}
          className="absolute inset-0 w-full h-full bg-bg-surface border border-gold-300/40 hover:border-gold-300 p-6 flex flex-col justify-between cursor-pointer select-none [backface-visibility:hidden] shadow-2xl group overflow-hidden"
        >
          {/* Decorative Book Spine Gold Foil Line */}
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-400 border-r border-gold-300/60" />

          <div className="pl-4 space-y-4">
            {/* Top Bar Badges */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                {product.isNew && <Badge variant="gold">NEW EDITION</Badge>}
                <span className="text-[9px] font-inter uppercase tracking-widest text-gold-300">
                  {product.productType.replace('_', ' ')}
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <WishlistButton productId={product.id} />
              </div>
            </div>

            {/* Book Image */}
            <div className="relative aspect-[4/3] w-full bg-bg-secondary border border-white-500/10 overflow-hidden">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Book Title & Scent Family */}
            <div className="space-y-1">
              <span className="text-[10px] text-gold-300 uppercase tracking-widest block font-inter">
                {product.scentFamily}
              </span>
              <h3 className="font-cormorant text-2xl text-white-100 font-light group-hover:text-gold-200 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Bottom Flip Trigger */}
          <div className="pl-4 pt-4 border-t border-white-500/15 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gold-200 font-medium font-inter">{formattedPrice}</span>
              {formattedComparePrice && (
                <span className="text-xs text-white-400 line-through font-inter">{formattedComparePrice}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gold-300 font-inter font-medium group-hover:underline">
              <BookOpen className="h-4 w-4 text-gold-300 animate-pulse" />
              <span>Open Atelier Book 📖</span>
            </div>
          </div>
        </article>

        {/* ========================================================== */}
        {/* 2. INSIDE PAGES (OPENED BOOK - ROTATED 180 DEG) */}
        {/* ========================================================== */}
        <div
          className="absolute inset-0 w-full h-full bg-bg-secondary border border-gold-300 p-6 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl overflow-y-auto"
        >
          {/* Close Book Button */}
          <button
            onClick={toggleBook}
            className="absolute top-4 right-4 p-1.5 text-gold-300 hover:text-white-100 bg-bg-surface border border-gold-300/30 z-10"
            aria-label="Close Book"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-4">
            <div className="border-b border-gold-300/30 pb-3">
              <span className="text-[9px] font-inter uppercase tracking-widest text-gold-300 block">
                Atelier Formulation Book
              </span>
              <h4 className="font-cormorant text-2xl text-white-100 font-light">
                {product.name}
              </h4>
            </div>

            {/* Scent Notes Breakdown inside Book */}
            <div className="space-y-3 font-inter text-xs">
              <div className="p-2.5 bg-bg-surface border border-white-500/10 space-y-0.5">
                <span className="text-[10px] uppercase text-gold-300 font-medium block">TOP NOTES</span>
                <span className="text-white-200">
                  {product.topNotes?.join(', ') || 'Sicilian Bergamot, Sea Spray'}
                </span>
              </div>

              <div className="p-2.5 bg-bg-surface border border-white-500/10 space-y-0.5">
                <span className="text-[10px] uppercase text-gold-300 font-medium block">HEART NOTES</span>
                <span className="text-white-200">
                  {product.heartNotes?.join(', ') || 'Tuscan Leather, Smoked Cedar'}
                </span>
              </div>

              <div className="p-2.5 bg-bg-surface border border-white-500/10 space-y-0.5">
                <span className="text-[10px] uppercase text-gold-300 font-medium block">BASE NOTES</span>
                <span className="text-white-200">
                  {product.baseNotes?.join(', ') || 'Dark Ambergris, Madagascar Vanilla'}
                </span>
              </div>
            </div>

            {/* Rating & Stock */}
            <div className="flex items-center justify-between text-xs font-inter text-white-300 pt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-gold-300 text-gold-300" />
                <span className="font-medium text-white-100">{product.averageRating || 5.0}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
              <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-semibold">
                In Stock ({product.stock} units)
              </span>
            </div>
          </div>

          {/* Add to Bag CTA inside Book */}
          <div className="pt-4 border-t border-gold-300/30 flex items-center justify-between gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="text-xs font-inter text-gold-300 underline uppercase tracking-wider"
            >
              Full Details →
            </Link>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-400 to-gold-300 text-bg-primary font-inter text-xs uppercase tracking-widest font-semibold hover:brightness-110 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
