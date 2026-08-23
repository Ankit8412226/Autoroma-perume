'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CustomSelect } from './CustomSelect'
import { Search, MapPin, Home, IndianRupee, SlidersHorizontal, ArrowRight } from 'lucide-react'

interface PropertySearchProps {
  initialLocation?: string
  initialType?: string
  initialPriceRange?: string
  initialBedrooms?: string
  className?: string
  variant?: 'hero' | 'compact'
}

export function PropertySearch({
  initialLocation = '',
  initialType = '',
  initialPriceRange = '',
  initialBedrooms = '',
  className = '',
  variant = 'hero',
}: PropertySearchProps) {
  const router = useRouter()
  const [location, setLocation] = React.useState(initialLocation)
  const [propertyType, setPropertyType] = React.useState(initialType)
  const [priceRange, setPriceRange] = React.useState(initialPriceRange)
  const [bedrooms, setBedrooms] = React.useState(initialBedrooms)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (propertyType) params.set('type', propertyType)
    if (priceRange) params.set('price', priceRange)
    if (bedrooms) params.set('bedrooms', bedrooms)

    router.push(`/properties?${params.toString()}`)
  }

  const locationOptions = [
    { value: '', label: 'All Destinations' },
    { value: 'mumbai', label: 'Mumbai (Bandra / Worli / Juhu)' },
    { value: 'goa', label: 'Goa (Assagao / Anjuna)' },
    { value: 'delhi-ncr', label: 'Delhi NCR & Gurgaon' },
    { value: 'bangalore', label: 'Bangalore (Sadashivnagar)' },
    { value: 'hyderabad', label: 'Hyderabad (Jubilee Hills)' },
    { value: 'pune', label: 'Pune (Koregaon Park)' },
  ]

  const typeOptions = [
    { value: '', label: 'All Property Types' },
    { value: 'Penthouse', label: 'Penthouse & Sky Villa' },
    { value: 'Villa', label: 'Architectural Villa' },
    { value: 'Apartment', label: 'Luxury Apartment' },
    { value: 'Estate', label: 'Heritage Estate' },
    { value: 'Commercial', label: 'Commercial Assets' },
  ]

  const priceOptions = [
    { value: '', label: 'Any Budget' },
    { value: '0-15', label: 'Up to ₹15 Cr' },
    { value: '15-30', label: '₹15 Cr – ₹30 Cr' },
    { value: '30-50', label: '₹30 Cr – ₹50 Cr' },
    { value: '50+', label: '₹50 Cr+' },
  ]

  const bedroomOptions = [
    { value: '', label: 'Any Bedrooms' },
    { value: '3', label: '3+ Bedrooms' },
    { value: '4', label: '4+ Bedrooms' },
    { value: '5', label: '5+ Bedrooms' },
  ]

  return (
    <div
      className={`bg-white border border-brand-green/20 rounded-lg shadow-xl p-5 sm:p-6 lg:p-7 ${
        variant === 'hero' ? 'max-w-5xl mx-auto' : 'w-full'
      } ${className}`}
    >
      {/* Search Header Badge */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-brand-green/10">
        <span className="w-2 h-2 bg-brand-green rounded-full" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
          PROPERTY DISCOVERY ENGINE
        </span>
      </div>

      {/* Main Search Controls */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomSelect
          label="Location"
          icon={MapPin}
          options={locationOptions}
          value={location}
          onChange={setLocation}
        />

        <CustomSelect
          label="Property Type"
          icon={Home}
          options={typeOptions}
          value={propertyType}
          onChange={setPropertyType}
        />

        <CustomSelect
          label="Budget"
          icon={IndianRupee}
          options={priceOptions}
          value={priceRange}
          onChange={setPriceRange}
        />

        <CustomSelect
          label="Bedrooms"
          icon={SlidersHorizontal}
          options={bedroomOptions}
          value={bedrooms}
          onChange={setBedrooms}
        />

        {/* Search Action Button */}
        <div className="sm:col-span-2 lg:col-span-4 pt-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-brand-green text-white font-bold text-xs uppercase tracking-[0.18em] rounded-md hover:bg-brand-dark transition-all duration-200 flex items-center justify-center gap-2 group shadow-md cursor-pointer"
          >
            <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold">Search Properties</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  )
}
