'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PROPERTIES, Property } from '@/data/properties'
import { PropertyCard } from '@/components/real-estate/PropertyCard'
import { PropertyFilters, FilterState } from '@/components/real-estate/PropertyFilters'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { PropertyMap } from '@/components/real-estate/PropertyMap'
import { CompareDrawer } from '@/components/real-estate/CompareDrawer'
import { RecentlyViewed } from '@/components/real-estate/RecentlyViewed'
import { CustomSelect } from '@/components/real-estate/CustomSelect'
import { Grid, List, MapPin, Search, ArrowUpDown } from 'lucide-react'

function PropertiesContent() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = React.useState<FilterState>({
    listingType: searchParams.get('listingType') || '',
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('type') || '',
    priceRange: searchParams.get('price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    amenities: [],
    sortBy: 'featured',
  })

  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list' | 'map'>('grid')

  const handleResetFilters = () => {
    setFilters({
      listingType: '',
      location: '',
      propertyType: '',
      priceRange: '',
      bedrooms: '',
      amenities: [],
      sortBy: 'featured',
    })
    setSearchQuery('')
  }

  // Filter Logic
  const filteredProperties = React.useMemo(() => {
    return PROPERTIES.filter((prop) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = prop.title.toLowerCase().includes(q)
        const matchArea = prop.location.area.toLowerCase().includes(q)
        const matchCity = prop.location.city.toLowerCase().includes(q)
        const matchType = prop.propertyType.toLowerCase().includes(q)
        if (!matchTitle && !matchArea && !matchCity && !matchType) return false
      }

      // Listing Type (Buy/Rent)
      if (filters.listingType && prop.listingType.toLowerCase() !== filters.listingType.toLowerCase()) {
        return false
      }

      // Location
      if (filters.location) {
        const cityMap: Record<string, string> = {
          mumbai: 'mumbai',
          goa: 'goa',
          'delhi-ncr': 'delhi ncr',
          bangalore: 'bangalore',
          hyderabad: 'hyderabad',
          pune: 'pune',
        }
        const targetCity = cityMap[filters.location] || filters.location
        if (!prop.location.city.toLowerCase().includes(targetCity.toLowerCase())) {
          return false
        }
      }

      // Property Type
      if (filters.propertyType && prop.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) {
        return false
      }

      // Price Range (in Cr)
      if (filters.priceRange) {
        const priceCr = prop.price / 10000000
        if (filters.priceRange === '0-15' && priceCr > 15) return false
        if (filters.priceRange === '15-30' && (priceCr < 15 || priceCr > 30)) return false
        if (filters.priceRange === '30-50' && (priceCr < 30 || priceCr > 50)) return false
        if (filters.priceRange === '50+' && priceCr < 50) return false
      }

      // Bedrooms
      if (filters.bedrooms) {
        const minBeds = parseInt(filters.bedrooms, 10)
        if (prop.specs.bedrooms < minBeds) return false
      }

      // Amenities
      if (filters.amenities.length > 0) {
        const propAmenityNames = prop.amenities.map((a) => a.name)
        const matchesAll = filters.amenities.every((req) => propAmenityNames.includes(req))
        if (!matchesAll) return false
      }

      return true
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price
      if (filters.sortBy === 'price-high') return b.price - a.price
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    })
  }, [filters, searchQuery])

  const sortOptions = [
    { value: 'featured', label: 'Sort: Featured First' },
    { value: 'price-low', label: 'Sort: Price Low to High' },
    { value: 'price-high', label: 'Sort: Price High to Low' },
    { value: 'newest', label: 'Sort: Newest Listed' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      <CompareDrawer />

      {/* Page Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-gold-300 rounded-full" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300">
            DISCOVERY ENGINE
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal">
          Luxury Property Directory
        </h1>
        <p className="text-xs sm:text-sm text-white/60 font-light max-w-2xl">
          Search and filter through architecturally vetted penthouses, modern villas, and luxury estates.
        </p>
      </div>

      {/* Top Controls Bar: Search Input, Sort, View Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-surface border border-white/10 p-4">
        {/* Keyword Search Field */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, street, city (e.g. Bandra, Assagao, Golf Course Road)..."
            className="w-full bg-bg-secondary border border-white/15 text-white text-xs pl-10 pr-4 py-2.5 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Right Controls: Sort & View Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="w-48">
            <CustomSelect
              options={sortOptions}
              value={filters.sortBy}
              onChange={(val) => setFilters({ ...filters, sortBy: val })}
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-bg-secondary border border-white/15 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 transition-colors ${
                viewMode === 'map' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="Map View"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3">
          <PropertyFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            totalCount={filteredProperties.length}
          />
        </div>

        {/* Right Results Grid / List / Map */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-xs text-white/60 font-mono pb-2 border-b border-white/10">
            <span>Showing {filteredProperties.length} of {PROPERTIES.length} Luxury Properties</span>
            {(filters.listingType || filters.location || filters.propertyType || filters.priceRange || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-gold-300 hover:text-white underline underline-offset-4"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {viewMode === 'map' ? (
            <PropertyMap properties={filteredProperties} />
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 px-4 bg-bg-surface border border-white/10 space-y-3">
              <h3 className="font-serif text-2xl text-white font-normal">No Properties Matched Your Criteria</h3>
              <p className="text-xs text-white/60 font-light max-w-md mx-auto">
                Try adjusting your price range, location filters, or search terms to find available residences.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-gold-200 mt-2"
              >
                Reset Search Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-6">
              {filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} variant="C" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} variant="B" />
              ))}
            </div>
          )}
        </div>
      </div>

      <RecentlyViewed />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white/60 text-xs font-mono">
          Loading Luxury Real Estate Directory...
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  )
}
