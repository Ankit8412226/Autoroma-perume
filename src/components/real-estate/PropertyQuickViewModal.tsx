'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/data/properties'
import { FavoriteButton } from './FavoriteButton'
import { PriceDisplay } from './PriceDisplay'
import { X, MapPin, ArrowUpRight } from 'lucide-react'

interface PropertyQuickViewModalProps {
  property: Property | null
  onClose: () => void
}

export function PropertyQuickViewModal({ property, onClose }: PropertyQuickViewModalProps) {
  if (!property) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-bg-surface border border-white/25 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-white bg-black/80 hover:bg-gold-300 hover:text-black rounded-full border border-white/30 z-10 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Large Photo */}
          <div className="md:col-span-6 space-y-3">
            <div className="relative aspect-[16/11] w-full border border-white/20 overflow-hidden">
              <Image
                src={property.images.hero}
                alt={property.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-[9px] uppercase tracking-widest text-gold-300 font-bold border border-white/20">
                  {property.propertyType}
                </span>
              </div>
            </div>

            {/* Thumbnail preview */}
            <div className="grid grid-cols-3 gap-2">
              {property.images.gallery.slice(0, 3).map((img, idx) => (
                <div key={idx} className="relative aspect-[16/10] border border-white/15 overflow-hidden">
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Details & Specs */}
          <div className="md:col-span-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gold-300 shrink-0" />
                <span>{property.location.area}, {property.location.city}</span>
              </div>
              <FavoriteButton propertyId={property.id} size="sm" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
              {property.title}
            </h3>

            <PriceDisplay
              formattedPrice={property.formattedPrice}
              formattedPricePerSqFt={property.formattedPricePerSqFt}
              size="lg"
            />

            <p className="text-xs text-white/80 font-light leading-relaxed line-clamp-3">
              {property.description}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/15 text-center font-mono">
              <div>
                <span className="block text-[10px] text-white/60 uppercase font-semibold">BEDROOMS</span>
                <span className="text-sm font-bold text-white">{property.specs.bedrooms}</span>
              </div>
              <div>
                <span className="block text-[10px] text-white/60 uppercase font-semibold">BATHROOMS</span>
                <span className="text-sm font-bold text-white">{property.specs.bathrooms}</span>
              </div>
              <div>
                <span className="block text-[10px] text-white/60 uppercase font-semibold">AREA</span>
                <span className="text-sm font-bold text-white">{property.specs.areaSqFt.toLocaleString()} sq ft</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/properties/${property.slug}`}
                onClick={onClose}
                className="flex-1 py-3.5 bg-gold-300 hover:bg-white text-black font-bold text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1.5 shadow-xl cursor-pointer"
              >
                <span>Full Property Page</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
