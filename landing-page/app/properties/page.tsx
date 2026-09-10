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
import { Grid, List, MapPin, Search } from 'lucide-react'

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

  const [allProperties, setAllProperties] = React.useState<Property[]>(PROPERTIES)

  React.useEffect(() => {
    fetchLivePlots()
  }, [])

  const fetchLivePlots = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      const res = await fetch(`${baseUrl}/public/plots`)
      if (res.ok) {
        const plots = await res.json()
        if (Array.isArray(plots) && plots.length > 0) {
          const liveProps: Property[] = plots.map((plot: any) => ({
            id: plot._id,
            slug: `plot-${(plot.plotNo || '001').toLowerCase()}`,
            title: `Plot ${plot.plotNo} (${plot.projectId?.name || 'Executive Township'})`,
            tagline: `Demarcated land plot in ${plot.projectId?.location || 'Noida Township'}`,
            description: `Demarcated plot unit ${plot.plotNo} in ${plot.projectId?.name || 'Township'}. Total Area: ${plot.sizeSqft || (plot.sellableSqYrd ? plot.sellableSqYrd * 9 : 1800)} sq ft.`,
            price: plot.totalCost || plot.price || 1500000,
            formattedPrice: `₹${((plot.totalCost || plot.price || 1500000) / 100000).toFixed(2)} Lakh`,
            pricePerSqFt: plot.projectId?.basePricePerSqft || 4500,
            formattedPricePerSqFt: `₹${plot.projectId?.basePricePerSqft || 4500} / sq ft`,
            propertyType: 'Estate',
            listingType: 'Buy',
            location: {
              city: plot.projectId?.location ? plot.projectId.location.split(',')[1]?.trim() || plot.projectId.location : 'Noida',
              area: plot.block ? `Block ${plot.block}` : 'Main Sector',
              address: `${plot.block ? `Block ${plot.block}` : 'Block E5'}, ${plot.projectId?.location || 'Sector 150, Noida'}`,
              coordinates: { lat: 28.5355, lng: 77.3910 },
            },
            specs: {
              bedrooms: 0,
              bathrooms: 0,
              areaSqFt: plot.sizeSqft || (plot.sellableSqYrd ? plot.sellableSqYrd * 9 : 1800),
              parkingSpaces: 2,
              yearBuilt: 2026,
            },
            amenities: [
              { icon: 'ShieldCheck', name: 'Demarcated Boundary' },
              { icon: 'Zap', name: 'Smart Infrastructure' }
            ],
            features: [
              '20m Wide Road Access',
              'Demarcated surveyed boundary',
              'Instant legal title conveyance',
            ],
            images: {
              hero: plot.projectId?.bannerImage || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1600&q=85&auto=format&fit=crop',
              gallery: [
                plot.projectId?.bannerImage || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1600&q=85&auto=format&fit=crop'
              ],
            },
            floorPlanUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&q=80&auto=format&fit=crop',
            agentId: 'agent-1',
            isFeatured: true,
            isSpotlight: true,
            isNew: true,
            status: plot.status === 'AVAILABLE' ? 'Available' : 'Sold',
            createdAt: plot.createdAt || '2026-09-10',
          }))
          setAllProperties([...liveProps, ...PROPERTIES])
        }
      }
    } catch (e) {
      console.error('Failed to fetch live plots for properties directory:', e)
    }
  }

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
    return allProperties.filter((prop) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = prop.title.toLowerCase().includes(q)
        const matchArea = prop.location.area.toLowerCase().includes(q)
        const matchCity = prop.location.city.toLowerCase().includes(q)
        const matchType = prop.propertyType.toLowerCase().includes(q)
        if (!matchTitle && !matchArea && !matchCity && !matchType) return false
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative bg-bg-primary">
      <CompareDrawer />

      {/* Page Header */}
      <div className="space-y-3 border-b border-brand-green/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-soft rounded-md border border-brand-green/15">
          <span className="w-2 h-2 bg-brand-green rounded-full" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
            PROPERTY DIRECTORY
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-normal">
          Architectural Properties Directory
        </h1>
        <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light max-w-2xl">
          Search and filter through vetted penthouses, modern villas, and luxury estates under open skies.
        </p>
      </div>

      {/* Top Controls Bar: Search Input, Sort, View Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-brand-green/15 rounded-lg p-4 shadow-sm">
        {/* Keyword Search Field */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, street, city (e.g. Bandra, Assagao, Golf Course Road)..."
            className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs pl-10 pr-4 py-2.5 rounded-md focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>

        {/* Right Controls: Sort & View Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="w-52">
            <CustomSelect
              options={sortOptions}
              value={filters.sortBy}
              onChange={(val) => setFilters({ ...filters, sortBy: val })}
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-brand-soft border border-brand-green/20 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-brand-green text-white font-bold' : 'text-brand-charcoal/70 hover:text-brand-green'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-brand-green text-white font-bold' : 'text-brand-charcoal/70 hover:text-brand-green'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'map' ? 'bg-brand-green text-white font-bold' : 'text-brand-charcoal/70 hover:text-brand-green'
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
          <div className="flex items-center justify-between text-xs text-brand-charcoal/70 font-mono pb-2 border-b border-brand-green/10">
            <span>Showing {filteredProperties.length} of {allProperties.length} Properties</span>
            {(filters.listingType || filters.location || filters.propertyType || filters.priceRange || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-brand-green font-bold hover:underline underline-offset-4"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {viewMode === 'map' ? (
            <PropertyMap properties={filteredProperties} />
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white border border-brand-green/15 rounded-lg space-y-3 shadow-sm">
              <h3 className="font-serif text-2xl text-brand-charcoal font-normal">No Properties Matched Your Search</h3>
              <p className="text-xs text-brand-charcoal/60 font-light max-w-md mx-auto">
                Try adjusting your budget, location filters, or search terms to view available residences.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-green text-white text-xs uppercase tracking-widest font-bold rounded-md hover:bg-brand-dark transition-all mt-2"
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
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-brand-charcoal/60 text-xs font-mono">
          Loading Property Directory...
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  )
}
