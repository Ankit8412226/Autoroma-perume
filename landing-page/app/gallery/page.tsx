'use client'

import * as React from 'react'
import Image from 'next/image'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { getApiBaseUrl } from '@/utils/api'
import { FALLBACK_IMAGE } from '@/utils/siteConfig'

interface GalleryItem {
  url: string
  caption?: string
  sourceType?: string
  sourceName?: string
}

export default function GalleryPage() {
  const [items, setItems] = React.useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      try {
        const baseUrl = getApiBaseUrl()
        const res = await fetch(`${baseUrl}/public/gallery`).catch(() => null)
        if (res && res.ok) {
          const data = await res.json().catch(() => [])
          setItems(Array.isArray(data) ? data : [])
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SectionHeading
        eyebrow="GALLERY"
        title="Project and property gallery."
        subtitle="Images uploaded from the admin panel via S3 — township photos, naksha layouts and property listings."
      />

      {isLoading ? (
        <p className="text-xs font-mono text-brand-charcoal/60">Loading gallery…</p>
      ) : items.length === 0 ? (
        <div className="bg-white border border-brand-green/15 rounded-2xl p-12 text-center text-sm text-brand-charcoal/60">
          No gallery images yet. Upload photos while creating a project or property in admin.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <figure key={`${item.url}-${index}`} className="relative aspect-square rounded-2xl overflow-hidden bg-brand-charcoal group">
              <Image src={item.url || FALLBACK_IMAGE} alt={item.caption || 'Gallery'} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-[11px] font-semibold">
                {item.caption || item.sourceName}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
