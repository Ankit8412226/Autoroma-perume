'use client'

import * as React from 'react'
import { CustomSelect } from './CustomSelect'
import { Filter, RotateCcw, X, Check } from 'lucide-react'

export interface FilterState {
  listingType: string
  location: string
  propertyType: string
  priceRange: string
  bedrooms: string
  amenities: string[]
  sortBy: string
}

interface PropertyFiltersProps {
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  onReset: () => void
  totalCount: number
  className?: string
}

export function PropertyFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  className = '',
}: PropertyFiltersProps) {
  const [isOpenMobile, setIsOpenMobile] = React.useState(false)

  const amenityOptions = [
    'Private Plunge Pool',
    '24/7 Security',
    'Smart Home Automation',
    'Wine Cellar',
    'Private Elevator Landing',
    'Golf Course Views',
    'Staff Quarters',
    'Indoor Heated Swimming Pool',
    'Private Clay Tennis Court',
  ]

  const locationOptions = [
    { value: '', label: 'All Destinations' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'goa', label: 'Goa' },
    { value: 'delhi-ncr', label: 'Delhi NCR' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'pune', label: 'Pune' },
  ]

  const typeOptions = [
    { value: '', label: 'All Property Types' },
    { value: 'Penthouse', label: 'Sea-facing Penthouse' },
    { value: 'Villa', label: 'Architectural Villa' },
    { value: 'Apartment', label: 'Luxury Apartment' },
    { value: 'Estate', label: 'Heritage Estate' },
    { value: 'Commercial', label: 'Commercial Assets' },
  ]

  const priceOptions = [
    { value: '', label: 'Any Price' },
    { value: '0-15', label: 'Up to ₹15 Cr' },
    { value: '15-30', label: '₹15 Cr – ₹30 Cr' },
    { value: '30-50', label: '₹30 Cr – ₹50 Cr' },
    { value: '50+', label: '₹50 Cr+' },
  ]

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.amenities || []
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]

    onFilterChange({ ...filters, amenities: updated })
  }

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/15">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-300" />
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-white">
            Refine Search
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="px-2.5 py-1 bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white text-[11px] font-semibold tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-gold-300 group-hover:text-black" />
          <span>Reset</span>
        </button>
      </div>

      {/* Listing Type */}
      <div className="space-y-3">
        <label className="text-[11px] uppercase tracking-widest text-white/80 font-bold block">
          Transaction Type
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {['', 'Buy', 'Rent'].map((type) => {
            const label = type === '' ? 'All' : type === 'Buy' ? 'Buy' : 'Lease'
            const isSelected = filters.listingType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => onFilterChange({ ...filters, listingType: type })}
                className={`py-2 px-2 text-[11px] uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-gold-300 text-black border-gold-300 shadow-md'
                    : 'bg-white/10 text-white border-white/20 hover:border-white/50'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Destination / Location CustomSelect */}
      <CustomSelect
        label="Destination"
        options={locationOptions}
        value={filters.location}
        onChange={(val) => onFilterChange({ ...filters, location: val })}
      />

      {/* Property Type CustomSelect */}
      <CustomSelect
        label="Property Type"
        options={typeOptions}
        value={filters.propertyType}
        onChange={(val) => onFilterChange({ ...filters, propertyType: val })}
      />

      {/* Price Budget CustomSelect */}
      <CustomSelect
        label="Price Range"
        options={priceOptions}
        value={filters.priceRange}
        onChange={(val) => onFilterChange({ ...filters, priceRange: val })}
      />

      {/* Bedrooms */}
      <div className="space-y-3">
        <label className="text-[11px] uppercase tracking-widest text-white/80 font-bold block">
          Min Bedrooms
        </label>
        <div className="flex items-center gap-2">
          {['', '3', '4', '5'].map((bed) => (
            <button
              key={bed}
              type="button"
              onClick={() => onFilterChange({ ...filters, bedrooms: bed })}
              className={`flex-1 py-2 text-xs font-mono font-bold border transition-all cursor-pointer ${
                filters.bedrooms === bed
                  ? 'bg-gold-300 text-black border-gold-300 shadow-md'
                  : 'bg-white/10 text-white border-white/20 hover:border-white/50'
              }`}
            >
              {bed === '' ? 'Any' : `${bed}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Amenities */}
      <div className="space-y-3 pt-4 border-t border-white/15">
        <label className="text-[11px] uppercase tracking-widest text-white/80 font-bold block">
          Curated Amenities
        </label>
        <div className="space-y-2">
          {amenityOptions.map((amenity) => {
            const isChecked = filters.amenities.includes(amenity)
            return (
              <label
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className="flex items-center gap-2.5 text-xs text-white/90 hover:text-white cursor-pointer select-none py-1"
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-gold-300 border-gold-300 text-black font-bold'
                      : 'border-white/40 bg-white/10'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{amenity}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className={`hidden lg:block bg-bg-secondary border border-white/15 p-6 ${className}`}>
        <FilterContent />
      </div>

      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold-300 text-black border border-gold-300 text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer"
        >
          <Filter className="w-4 h-4 text-black" />
          <span>Filters & Refine</span>
        </button>

        <span className="text-xs text-white/80 font-mono font-semibold">
          {totalCount} Properties
        </span>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-bg-secondary border-l border-white/20 p-6 overflow-y-auto z-50">
            <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
              <span className="text-sm font-serif text-white font-normal">Filters</span>
              <button
                type="button"
                onClick={() => setIsOpenMobile(false)}
                className="p-1.5 bg-white/10 border border-white/20 text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterContent />

            <button
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="mt-8 w-full py-3.5 bg-gold-300 text-black font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg"
            >
              Show {totalCount} Properties
            </button>
          </div>
        </div>
      )}
    </>
  )
}
