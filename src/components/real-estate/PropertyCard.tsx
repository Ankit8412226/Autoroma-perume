'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/data/properties'
import { FavoriteButton } from './FavoriteButton'
import { PriceDisplay } from './PriceDisplay'
import { useCompareStore } from '@/stores/compare.store'
import { PropertyQuickViewModal } from './PropertyQuickViewModal'
import { Bed, Bath, Maximize2, MapPin, ArrowRight, Eye, Scale } from 'lucide-react'

interface PropertyCardProps {
  property: Property
  variant?: 'A' | 'B' | 'C' | 'D'
  className?: string
}

export function PropertyCard({
  property,
  variant = 'B',
  className = '',
}: PropertyCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const isComparingStore = useCompareStore((state) => state.isComparing(property.id))
  const toggleCompare = useCompareStore((state) => state.toggleCompare)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isComparing = mounted ? isComparingStore : false

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(property.id)
  }

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsQuickViewOpen(true)
  }

  // Variant A: Large Feature Hero Card
  if (variant === 'A') {
    return (
      <>
        <div className={`group relative bg-bg-surface border border-white/15 overflow-hidden hover:border-white/40 transition-all duration-300 shadow-xl ${className}`}>
          {/* Image Container */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
            <Image
              src={property.images.hero}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority={property.isFeatured}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Top Badges & Always-Visible Action Buttons */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-[0.2em] font-bold text-gold-300">
                {property.listingType === 'Rent' ? 'Private Lease' : 'Featured Collection'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickViewClick}
                  className="px-2.5 py-1 bg-black/80 hover:bg-white hover:text-black text-white text-[10px] font-semibold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Quick View"
                >
                  <Eye className="w-3.5 h-3.5 text-gold-300 group-hover:text-black" />
                  <span>Quick View</span>
                </button>

                <FavoriteButton propertyId={property.id} size="sm" />
              </div>
            </div>

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3 z-10">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <MapPin className="w-3.5 h-3.5 text-gold-300 shrink-0" />
                <span>{property.location.area}, {property.location.city}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-gold-200 transition-colors">
                {property.title}
              </h3>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/15">
                <PriceDisplay formattedPrice={property.formattedPrice} size="md" />

                <div className="flex items-center space-x-3 text-xs text-white/80 font-mono">
                  <span>{property.specs.bedrooms} Beds</span>
                  <span>·</span>
                  <span>{property.specs.bathrooms} Baths</span>
                  <span>·</span>
                  <span>{property.specs.areaSqFt.toLocaleString()} sq ft</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/properties/${property.slug}`}
            className="absolute inset-0 z-0"
            aria-label={`View details for ${property.title}`}
          />
        </div>

        <PropertyQuickViewModal
          property={isQuickViewOpen ? property : null}
          onClose={() => setIsQuickViewOpen(false)}
        />
      </>
    )
  }

  // Variant C: Horizontal Search List Card
  if (variant === 'C') {
    return (
      <>
        <div className={`group relative bg-bg-surface border border-white/15 flex flex-col md:flex-row overflow-hidden hover:border-white/40 transition-all duration-300 ${className}`}>
          <div className="relative md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden">
            <Image
              src={property.images.hero}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[9px] uppercase tracking-widest text-gold-300 font-bold border border-white/10">
                {property.propertyType}
              </span>
            </div>
          </div>

          <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <MapPin className="w-3.5 h-3.5 text-gold-300 shrink-0" />
                  <span>{property.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCompareClick}
                    className={`px-2.5 py-1 text-[10px] font-mono border transition-colors cursor-pointer ${
                      isComparing ? 'bg-gold-300 text-black border-gold-300 font-bold' : 'bg-black/80 text-white/80 border-white/30 hover:border-white/60'
                    }`}
                  >
                    {isComparing ? 'Comparing ✓' : '+ Compare'}
                  </button>
                  <FavoriteButton propertyId={property.id} size="sm" />
                </div>
              </div>

              <Link href={`/properties/${property.slug}`}>
                <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-gold-200 transition-colors">
                  {property.title}
                </h3>
              </Link>
              <p className="text-xs text-white/60 font-light line-clamp-2">{property.tagline}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <PriceDisplay
                formattedPrice={property.formattedPrice}
                formattedPricePerSqFt={property.formattedPricePerSqFt}
                size="sm"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleQuickViewClick}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Quick View
                </button>
                <Link
                  href={`/properties/${property.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-gold-200 transition-colors"
                >
                  <span>View Property</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <PropertyQuickViewModal
          property={isQuickViewOpen ? property : null}
          onClose={() => setIsQuickViewOpen(false)}
        />
      </>
    )
  }

  // Variant B: Standard Property Card (Default)
  return (
    <>
      <div className={`group relative bg-bg-surface border border-white/15 flex flex-col overflow-hidden hover:border-white/40 transition-all duration-300 shadow-lg ${className}`}>
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={property.images.hero}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

          {/* Top Always-Visible Action Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[9px] uppercase tracking-widest text-gold-300 font-bold border border-white/20">
              {property.propertyType}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleQuickViewClick}
                className="px-2.5 py-1 bg-black/80 hover:bg-white hover:text-black text-white text-[10px] font-semibold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/30 flex items-center gap-1 transition-all cursor-pointer"
                title="Quick View"
              >
                <Eye className="w-3 h-3 text-gold-300" />
                <span className="hidden sm:inline">Quick View</span>
              </button>
              <FavoriteButton propertyId={property.id} size="sm" />
            </div>
          </div>
        </div>

        {/* Card Body - Strong Visual Hierarchy */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Price is the Strongest Element */}
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans">
                {property.formattedPrice}
              </span>
              <button
                type="button"
                onClick={handleCompareClick}
                className={`text-[10px] font-mono px-2 py-0.5 border transition-colors cursor-pointer ${
                  isComparing ? 'bg-gold-300 text-black border-gold-300 font-bold' : 'bg-white/5 text-white/70 border-white/20 hover:border-white/50'
                }`}
              >
                {isComparing ? 'Comparing ✓' : '+ Compare'}
              </button>
            </div>

            <Link href={`/properties/${property.slug}`}>
              <h3 className="font-serif text-xl text-white font-normal group-hover:text-gold-200 transition-colors line-clamp-1">
                {property.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1 text-[11px] text-white/70 font-medium uppercase">
              <MapPin className="w-3 h-3 text-gold-300 shrink-0" />
              <span>{property.location.area}, {property.location.city}</span>
            </div>
          </div>

          {/* Specs & Always-Visible View Property Link */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[11px] text-white/80 font-mono">
              <span>{property.specs.bedrooms} Beds</span>
              <span>·</span>
              <span>{property.specs.bathrooms} Baths</span>
              <span>·</span>
              <span>{property.specs.areaSqFt.toLocaleString()} sq ft</span>
            </div>

            <Link
              href={`/properties/${property.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-300 hover:text-white transition-colors shrink-0"
            >
              <span>View Property</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <PropertyQuickViewModal
        property={isQuickViewOpen ? property : null}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  )
}
