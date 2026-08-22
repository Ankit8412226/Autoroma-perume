'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CustomSelect } from './CustomSelect'
import { Search, MapPin, Home, IndianRupee, SlidersHorizontal, ArrowRight } from 'lucide-react'

interface PropertySearchProps {
  initialListingType?: 'Buy' | 'Rent'
  initialLocation?: string
  initialType?: string
  initialPriceRange?: string
  initialBedrooms?: string
  className?: string
  variant?: 'hero' | 'compact'
}

export function PropertySearch({
  initialListingType = 'Buy',
  initialLocation = '',
  initialType = '',
  initialPriceRange = '',
  initialBedrooms = '',
  className = '',
  variant = 'hero',
}: PropertySearchProps) {
  const router = useRouter()
  const [listingType, setListingType] = React.useState<'Buy' | 'Rent'>(initialListingType)
  const [location, setLocation] = React.useState(initialLocation)
  const [propertyType, setPropertyType] = React.useState(initialType)
  const [priceRange, setPriceRange] = React.useState(initialPriceRange)
  const [bedrooms, setBedrooms] = React.useState(initialBedrooms)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (listingType) params.set('listingType', listingType)
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
    { value: '', label: 'All Residences' },
    { value: 'Penthouse', label: 'Sea-facing Penthouse' },
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
      className={`bg-bg-surface border border-white/20 shadow-2xl p-4 sm:p-6 lg:p-8 ${
        variant === 'hero' ? 'max-w-5xl mx-auto' : 'w-full'
      } ${className}`}
    >
      {/* Buy / Rent Switcher Bar */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/15">
        <button
          type="button"
          onClick={() => setListingType('Buy')}
          className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-bold transition-all duration-200 cursor-pointer ${
            listingType === 'Buy'
              ? 'bg-gold-300 text-black border border-gold-300 shadow-lg'
              : 'text-white bg-white/10 hover:bg-white/20 border border-white/25'
          }`}
        >
          Buy Portfolio
        </button>
        <button
          type="button"
          onClick={() => setListingType('Rent')}
          className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-bold transition-all duration-200 cursor-pointer ${
            listingType === 'Rent'
              ? 'bg-gold-300 text-black border border-gold-300 shadow-lg'
              : 'text-white bg-white/10 hover:bg-white/20 border border-white/25'
          }`}
        >
          Private Lease
        </button>
      </div>

      {/* Main Search Controls with Custom Select Dropdowns */}
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
          label="Price Budget"
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

        {/* Submit Search Button */}
        <div className="sm:col-span-2 lg:col-span-4 pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-gold-300 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
          >
            <Search className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span>Explore Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  )
}
