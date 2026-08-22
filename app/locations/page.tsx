import * as React from 'react'
import { LOCATIONS } from '@/data/locations'
import { LocationCard } from '@/components/real-estate/LocationCard'
import { SectionHeading } from '@/components/real-estate/SectionHeading'

export const metadata = {
  title: 'Prime Destinations — Mumbai, Goa, Delhi NCR, Bangalore, Hyderabad',
  description: 'Explore ultra-prime luxury real estate destinations across India’s leading metropolitan and coastal hubs.',
}

export default function LocationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeading
        eyebrow="GEOGRAPHIC ATELIER"
        title="Prime Luxury Destinations"
        subtitle="Discover real estate market dynamics, price trends, and curated properties across India's most sought-after cities."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LOCATIONS.map((loc) => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </div>
    </div>
  )
}
