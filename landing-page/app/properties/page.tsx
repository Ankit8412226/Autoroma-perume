'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Property } from '@/data/properties'
import { PropertyCard } from '@/components/real-estate/PropertyCard'
import { getApiBaseUrl } from '@/utils/api'
import { mapBackendProperty } from '@/utils/mapListing'
import { BulkBuyModal } from '@/components/real-estate/BulkBuyModal'
import {
  Search,
  Building2,
  MapPin,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  X,
  Grid,
  List,
  ChevronDown,
  Award,
  Flame,
  Home,
  Layers,
  Phone
} from 'lucide-react'

// Location Hub Definitions (99acres Featured Corridors)
const FEATURED_LOCATIONS = [
  {
    city: 'Dholera SIR',
    state: 'Gujarat',
    tagline: 'India’s 1st Greenfield Smart City',
    highlight: 'NA Ready Plots · 0% Brokerage',
    bgGradient: 'from-[#061913] via-[#0A2E23] to-[#0B4F3C]'
  },
  {
    city: 'Noida',
    state: 'Uttar Pradesh',
    tagline: 'Jewar International Airport Hub',
    highlight: 'RERA Approved · High ROI Townships',
    bgGradient: 'from-[#171A18] via-[#2A3B34] to-[#0B4F3C]'
  },
  {
    city: 'Goa',
    state: 'North Goa',
    tagline: 'Assagao & Coastal Villa Estates',
    highlight: 'Private Plunge Pools · Title Clear',
    bgGradient: 'from-[#122A22] via-[#0F4735] to-[#166E53]'
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Bandra West Seaface Skyline',
    highlight: 'Trophy Penthouses · Private Lifts',
    bgGradient: 'from-[#0A1D16] via-[#143B2E] to-[#0B4F3C]'
  }
]

const PROPERTY_TYPE_OPTIONS = [
  { label: 'All Types', value: 'ALL' },
  { label: 'Residential Plot', value: 'RESIDENTIAL_PLOT' },
  { label: 'Commercial', value: 'COMMERCIAL' },
  { label: 'Luxury Villa', value: 'VILLA' },
  { label: 'Showroom', value: 'SHOWROOM' },
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'Land', value: 'LAND' }
]

const BUDGET_OPTIONS = [
  { label: 'All Budgets', value: 'ALL', min: 0, max: Infinity },
  { label: 'Under ₹50 Lakhs', value: 'UNDER_50L', min: 0, max: 5000000 },
  { label: '₹50L - ₹1 Crore', value: '50L_1CR', min: 5000000, max: 10000000 },
  { label: '₹1 Cr - ₹3 Crores', value: '1CR_3CR', min: 10000000, max: 30000000 },
  { label: '₹3 Cr - ₹5 Crores', value: '3CR_5CR', min: 30000000, max: 50000000 },
  { label: 'Above ₹5 Crores', value: 'ABOVE_5CR', min: 50000000, max: Infinity }
]

const POPULAR_CITIES = ['All Cities', 'Dholera SIR', 'Noida', 'Mumbai', 'Goa', 'Gurgaon', 'Ahmedabad']

function PropertiesContent() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') || 'ALL'
  const initialCity = searchParams.get('city') || 'All Cities'

  // Filter & Search States
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCity, setSelectedCity] = React.useState(initialCity)
  const [selectedType, setSelectedType] = React.useState(initialType)
  const [selectedListingType, setSelectedListingType] = React.useState('ALL')
  const [selectedBudget, setSelectedBudget] = React.useState('ALL')
  const [onlyVerified, setOnlyVerified] = React.useState(false)
  const [sortBy, setSortBy] = React.useState('FEATURED')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  const [allProperties, setAllProperties] = React.useState<Property[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isBulkBuyOpen, setIsBulkBuyOpen] = React.useState(false)

  // Fetch properties from backend API
  React.useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true)
        const baseUrl = getApiBaseUrl()
        const res = await fetch(`${baseUrl}/public/properties`).catch(() => null)
        if (res && res.ok) {
          const data = await res.json().catch(() => [])
          if (Array.isArray(data)) {
            setAllProperties(data.map(mapBackendProperty))
          }
        }
      } catch (err) {
        console.error('Failed to load properties:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadProperties()
  }, [])

  // Filtered Properties Computation
  const filteredProperties = React.useMemo(() => {
    return allProperties.filter((prop) => {
      // 1. City Filter
      if (selectedCity !== 'All Cities') {
        const propCity = (prop.location.city || '').toLowerCase()
        const targetCity = selectedCity.toLowerCase()
        if (!propCity.includes(targetCity) && !targetCity.includes(propCity)) return false
      }

      // 2. Property Type Filter
      if (selectedType !== 'ALL') {
        if (prop.propertyType.toUpperCase() !== selectedType.toUpperCase()) return false
      }

      // 3. Listing Type Filter (Sale / Rent / Lease)
      if (selectedListingType !== 'ALL') {
        if ((prop.listingType || 'SALE').toUpperCase() !== selectedListingType.toUpperCase()) return false
      }

      // 4. Budget Range Filter
      if (selectedBudget !== 'ALL') {
        const budgetConfig = BUDGET_OPTIONS.find((b) => b.value === selectedBudget)
        if (budgetConfig) {
          if (prop.price < budgetConfig.min || prop.price > budgetConfig.max) return false
        }
      }

      // 5. Verified / RERA Only Filter
      if (onlyVerified) {
        const rera = prop.legalInfo?.reraNumber
        const titleType = prop.legalInfo?.titleType
        if (!rera && !titleType) return false
      }

      // 6. Keyword Search Filter (Title, Locality, City, Code, Survey No)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = prop.title.toLowerCase().includes(q)
        const matchArea = prop.location.area.toLowerCase().includes(q)
        const matchCity = prop.location.city.toLowerCase().includes(q)
        const matchType = prop.propertyType.toLowerCase().includes(q)
        const matchDesc = (prop.description || '').toLowerCase().includes(q)
        if (!matchTitle && !matchArea && !matchCity && !matchType && !matchDesc) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price
      if (sortBy === 'PRICE_HIGH') return b.price - a.price
      if (sortBy === 'NEWEST') return b.id.localeCompare(a.id)
      // FEATURED Default
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    })
  }, [allProperties, selectedCity, selectedType, selectedListingType, selectedBudget, onlyVerified, searchQuery, sortBy])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCity('All Cities')
    setSelectedType('ALL')
    setSelectedListingType('ALL')
    setSelectedBudget('ALL')
    setOnlyVerified(false)
    setSortBy('FEATURED')
  }

  return (
    <div className="min-h-screen bg-bg-primary space-y-8 pb-16">
      {/* 99acres-Style Hero Search Header Banner */}
      <div className="bg-gradient-to-r from-[#051711] via-[#0A2E23] to-[#0B4F3C] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-extrabold uppercase tracking-widest border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> 99acres Style Real Estate Finder
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Location-Wise Property Directory
            </h1>
            <p className="text-white/70 text-xs sm:text-sm max-w-2xl mx-auto font-normal">
              Find verified residential plots, commercial spaces, villas, and showrooms across Dholera SIR, Noida Smart City, Mumbai, Goa, and Gurgaon.
            </p>
          </div>

          {/* 99acres-Style Multi-Option Search Bar */}
          <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-emerald-500/20 max-w-5xl mx-auto text-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Keyword Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Locality, landmark, project..."
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                />
              </div>

              {/* City Picker */}
              <div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c}>{c === 'All Cities' ? '📍 All Cities' : `📍 ${c}`}</option>
                  ))}
                </select>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {PROPERTY_TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Budget Filter */}
              <div>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Action Filter Pills */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Quick Filters:</span>
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified / RERA Only
                </label>

                {['ALL', 'SALE', 'RENT', 'LEASE'].map((lType) => (
                  <button
                    key={lType}
                    type="button"
                    onClick={() => setSelectedListingType(lType)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedListingType === lType
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lType === 'ALL' ? 'All Listings' : lType}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {filteredProperties.length} Properties Found
                </span>
                {(searchQuery || selectedCity !== 'All Cities' || selectedType !== 'ALL' || selectedBudget !== 'ALL' || onlyVerified) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline px-2 py-1 cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Popular Cities Horizontal Selector (99acres Location Bar) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> Popular City Hubs
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Click to filter properties</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {POPULAR_CITIES.map((city) => {
              const isSelected = selectedCity === city
              const count = city === 'All Cities'
                ? allProperties.length
                : allProperties.filter((p) => p.location.city.toLowerCase().includes(city.toLowerCase())).length

              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{city === 'All Cities' ? '🌐' : '📍'} {city}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured Location Corridors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_LOCATIONS.map((loc) => (
            <div
              key={loc.city}
              onClick={() => setSelectedCity(loc.city)}
              className={`bg-gradient-to-br ${loc.bgGradient} p-4 rounded-3xl text-white border border-white/10 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between h-36`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {loc.state}
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white mt-2">{loc.city} Corridor</h4>
                <p className="text-[11px] text-white/70 line-clamp-1">{loc.tagline}</p>
              </div>

              <div className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 border-t border-white/10 pt-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {loc.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* Callout Action Banners (Bulk Buy & List Property) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-5 text-white border border-emerald-500/20 shadow-md flex items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-md text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                HOT INVESTOR DEAL
              </span>
              <h4 className="font-serif text-base font-bold text-white mt-1">Bulk Buy Property Deals</h4>
              <p className="text-xs text-white/70 mt-0.5 max-w-sm">
                Looking for multiple plots or high-ticket investor syndicates? Submit your bulk quota requirement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsBulkBuyOpen(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl shrink-0 shadow-lg cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-4 h-4" /> Bulk Buy
            </button>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200">
                FREE SELLER LISTING
              </span>
              <h4 className="font-serif text-base font-bold text-slate-900 mt-1">Own Property? List For Free</h4>
              <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
                Reach thousands of verified buyers & investors. Admin reviewed before going live.
              </p>
            </div>
            <Link
              href="/list-your-property"
              className="px-4 py-2.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-xs uppercase tracking-wider rounded-2xl shrink-0 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-4 h-4" /> List Free
            </Link>
          </div>
        </div>

        {/* Directory Controls & Sorting Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              {selectedCity === 'All Cities' ? 'All Verified Properties' : `Properties in ${selectedCity}`}
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {filteredProperties.length} Available
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="FEATURED">Featured First</option>
                <option value="NEWEST">Newest Listed</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Directory Grid / List View */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-4 h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">No Properties Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No properties match your current search parameters in <span className="font-bold text-slate-800">{selectedCity}</span>. Try broadening your filter or resetting criteria.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} variant={viewMode === 'grid' ? 'B' : 'A'} />
            ))}
          </div>
        )}
      </div>

      <BulkBuyModal isOpen={isBulkBuyOpen} onClose={() => setIsBulkBuyOpen(false)} />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs font-mono">Loading property finder…</div>}>
      <PropertiesContent />
    </Suspense>
  )
}
