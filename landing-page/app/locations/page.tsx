'use client'

import * as React from 'react'
import { LocationCard } from '@/components/real-estate/LocationCard'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { RefreshCw, MapPin } from 'lucide-react'

export default function LocationsPage() {
  const [locations, setLocations] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      const res = await fetch(`${baseUrl}/public/locations`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setLocations(data)
          return
        }
      }
      setLocations([])
    } catch (e) {
      console.error('Failed to fetch locations:', e)
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow="GEOGRAPHIC ATELIER"
          title="Prime Real Estate Destinations"
          subtitle="Discover real estate market dynamics, plot inventory, and project layouts across our active location hubs."
        />
        <button
          onClick={fetchLocations}
          className="p-2.5 bg-brand-soft border border-brand-green/20 text-brand-green rounded-xl hover:bg-brand-green hover:text-white transition-all cursor-pointer shadow-sm"
          title="Refresh live locations"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-16">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-white border border-brand-green/15 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <MapPin className="w-12 h-12 text-brand-green mx-auto" />
          <h3 className="font-serif text-xl text-brand-charcoal font-bold">No Active Locations Found</h3>
          <p className="text-xs text-brand-charcoal/70">Create a real estate project in Admin Portal to populate live location hubs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc) => (
            <LocationCard key={loc.id || loc.slug} location={loc} />
          ))}
        </div>
      )}
    </div>
  )
}

