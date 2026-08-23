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

  // Variant A: Large Editorial Feature Card
  if (variant === 'A') {
    return (
      <>
        <div className={`group relative bg-white border border-brand-green/15 rounded-md overflow-hidden hover:border-brand-green/30 transition-all duration-300 shadow-md ${className}`}>
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
            <Image
              src={property.images.hero}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority={property.isFeatured}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-85" />

            {/* Badges & Actions */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="px-3 py-1 bg-white/95 text-brand-green border border-brand-green/20 text-[10px] uppercase tracking-[0.18em] font-bold rounded-md shadow-sm">
                {property.listingType === 'Rent' ? 'Private Lease' : 'Featured Collection'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickViewClick}
                  className="px-3 py-1 bg-white/95 text-brand-charcoal text-[10px] font-semibold uppercase tracking-wider rounded-md border border-brand-green/20 flex items-center gap-1.5 shadow-sm hover:bg-brand-green hover:text-white transition-all cursor-pointer"
                  title="Quick View"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-green group-hover:text-white" />
                  <span>Quick View</span>
                </button>

                <FavoriteButton propertyId={property.id} size="sm" />
              </div>
            </div>

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3 z-10 text-white">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <MapPin className="w-3.5 h-3.5 text-brand-sky shrink-0" />
                <span>{property.location.area}, {property.location.city}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-brand-soft transition-colors">
                {property.title}
              </h3>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/20">
                <PriceDisplay formattedPrice={property.formattedPrice} size="md" />

                <div className="flex items-center space-x-3 text-xs text-white/90 font-mono">
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

  // Variant C: Horizontal Search Card
  if (variant === 'C') {
    return (
      <>
        <div className={`group relative bg-white border border-brand-green/15 rounded-md flex flex-col md:flex-row overflow-hidden hover:border-brand-green/30 transition-all duration-300 shadow-sm ${className}`}>
          <div className="relative md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden">
            <Image
              src={property.images.hero}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 bg-white/95 text-brand-green text-[9px] uppercase tracking-widest font-bold border border-brand-green/20 rounded-md">
                {property.propertyType}
              </span>
            </div>
          </div>

          <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-brand-charcoal/70">
                  <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span>{property.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCompareClick}
                    className={`px-2.5 py-1 text-[10px] font-mono border rounded-md transition-colors cursor-pointer ${
                      isComparing ? 'bg-brand-green text-white border-brand-green font-bold' : 'bg-brand-soft text-brand-charcoal border-brand-green/20 hover:border-brand-green'
                    }`}
                  >
                    {isComparing ? 'Comparing ✓' : '+ Compare'}
                  </button>
                  <FavoriteButton propertyId={property.id} size="sm" />
                </div>
              </div>

              <Link href={`/properties/${property.slug}`}>
                <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal font-normal group-hover:text-brand-green transition-colors">
                  {property.title}
                </h3>
              </Link>
              <p className="text-xs text-brand-charcoal/70 font-light line-clamp-2">{property.tagline}</p>
            </div>

            <div className="pt-4 border-t border-brand-green/10 flex flex-wrap items-center justify-between gap-4">
              <PriceDisplay
                formattedPrice={property.formattedPrice}
                formattedPricePerSqFt={property.formattedPricePerSqFt}
                size="sm"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleQuickViewClick}
                  className="px-3 py-1.5 bg-brand-soft hover:bg-brand-green hover:text-white border border-brand-green/20 text-brand-green text-xs font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                >
                  Quick View
                </button>
                <Link
                  href={`/properties/${property.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-brand-dark transition-colors"
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
      <div className={`group relative bg-white border border-brand-green/15 rounded-md flex flex-col overflow-hidden hover:border-brand-green/30 transition-all duration-300 shadow-sm ${className}`}>
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={property.images.hero}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* Badges & Actions */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="px-2.5 py-1 bg-white/95 text-brand-green text-[9px] uppercase tracking-widest font-bold border border-brand-green/20 rounded-md shadow-sm">
              {property.propertyType}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleQuickViewClick}
                className="px-2.5 py-1 bg-white/95 hover:bg-brand-green hover:text-white text-brand-charcoal text-[10px] font-semibold uppercase tracking-wider rounded-md border border-brand-green/20 flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                title="Quick View"
              >
                <Eye className="w-3 h-3 text-brand-green" />
                <span className="hidden sm:inline">Quick View</span>
              </button>
              <FavoriteButton propertyId={property.id} size="sm" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Price is Primary */}
            <div className="flex items-baseline justify-between border-b border-brand-green/10 pb-3">
              <span className="text-2xl font-bold text-brand-green tracking-tight font-sans">
                {property.formattedPrice}
              </span>
              <button
                type="button"
                onClick={handleCompareClick}
                className={`text-[10px] font-mono px-2 py-0.5 border rounded-md transition-colors cursor-pointer ${
                  isComparing ? 'bg-brand-green text-white border-brand-green font-bold' : 'bg-brand-soft text-brand-charcoal border-brand-green/20 hover:border-brand-green'
                }`}
              >
                {isComparing ? 'Comparing ✓' : '+ Compare'}
              </button>
            </div>

            <Link href={`/properties/${property.slug}`}>
              <h3 className="font-serif text-xl text-brand-charcoal font-normal group-hover:text-brand-green transition-colors line-clamp-1">
                {property.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1 text-[11px] text-brand-charcoal/70 font-medium">
              <MapPin className="w-3 h-3 text-brand-green shrink-0" />
              <span>{property.location.area}, {property.location.city}</span>
            </div>
          </div>

          {/* Specs & Always-Visible View Property Link */}
          <div className="pt-3 border-t border-brand-green/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[11px] text-brand-charcoal/80 font-mono">
              <span>{property.specs.bedrooms} Beds</span>
              <span>·</span>
              <span>{property.specs.bathrooms} Baths</span>
              <span>·</span>
              <span>{property.specs.areaSqFt.toLocaleString()} sq ft</span>
            </div>

            <Link
              href={`/properties/${property.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-green hover:text-brand-dark transition-colors shrink-0"
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
