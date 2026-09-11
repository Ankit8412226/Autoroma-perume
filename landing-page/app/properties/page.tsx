'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Property } from '@/data/properties'
import { PropertyCard } from '@/components/real-estate/PropertyCard'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { getApiBaseUrl } from '@/utils/api'
import { mapBackendProperty } from '@/utils/mapListing'
import { Search } from 'lucide-react'

function PropertiesContent() {
  const searchParams = useSearchParams()
  const typeFilter = searchParams.get('type') || ''
  const [searchQuery, setSearchQuery] = React.useState('')
  const [allProperties, setAllProperties] = React.useState<Property[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      try {
        const baseUrl = getApiBaseUrl()
        const res = await fetch(`${baseUrl}/public/properties`).catch(() => null)
        if (res && res.ok) {
          const data = await res.json().catch(() => [])
          setAllProperties(Array.isArray(data) ? data.map(mapBackendProperty) : [])
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filteredProperties = React.useMemo(() => {
    return allProperties.filter((prop) => {
      if (typeFilter && prop.propertyType.toLowerCase() !== typeFilter.toLowerCase()) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        prop.title.toLowerCase().includes(q) ||
        prop.location.area.toLowerCase().includes(q) ||
        prop.location.city.toLowerCase().includes(q) ||
        prop.propertyType.toLowerCase().includes(q)
      )
    })
  }, [allProperties, searchQuery, typeFilter])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-bg-primary">
      <SectionHeading
        eyebrow="PROPERTY LISTINGS"
        title="Properties directory."
        subtitle="Independent listings — not township plot inventory. Residential, commercial, villa and showroom stock from the admin panel."
      />

      <div className="relative">
        <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, city or type"
          className="w-full bg-white border border-brand-green/20 text-brand-charcoal text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
        />
      </div>

      {isLoading ? (
        <p className="text-xs text-brand-charcoal/60 font-mono">Loading properties…</p>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-white border border-brand-green/15 rounded-2xl">
          <h3 className="font-serif text-2xl text-brand-charcoal">No properties published yet</h3>
          <p className="text-xs text-brand-charcoal/60 mt-2">Admin can add listings from Property Listings. Projects stay separate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} variant="B" />
          ))}
        </div>
      )}
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs font-mono">Loading properties…</div>}>
      <PropertiesContent />
    </Suspense>
  )
}
