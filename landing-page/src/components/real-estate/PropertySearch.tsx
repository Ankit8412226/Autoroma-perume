'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Navigation, Crosshair, ChevronDown, Mic } from 'lucide-react'

interface PropertySearchProps {
  initialLocation?: string
  initialType?: string
  initialPriceRange?: string
  initialBedrooms?: string
  className?: string
  variant?: 'hero' | 'compact'
}

const TABS = ['Buy', 'Rent', 'New Launch', 'Commercial', 'Plots/Land', 'Projects']

export function PropertySearch({
  initialLocation = '',
  className = '',
  variant = 'hero',
}: PropertySearchProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('Buy')
  const [searchQuery, setSearchQuery] = React.useState(initialLocation)
  const [propertyType, setPropertyType] = React.useState('All Residential')
  const [isLocating, setIsLocating] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
      submitSearch(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      if (event.error !== 'no-speech') {
        alert('Error with voice search. Please try again.')
      }
    }

    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  const handleNearbyClick = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported in this browser.')
      return
    }
    
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false)
        const { latitude, longitude } = position.coords
        
        const params = new URLSearchParams()
        params.set('intent', activeTab.toLowerCase())
        if (propertyType !== 'All Residential') {
          params.set('type', propertyType)
        }
        params.set('lat', latitude.toString())
        params.set('lng', longitude.toString())
        params.set('nearby', 'true')
        
        router.push(`/properties?${params.toString()}`)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setIsLocating(false)
        alert('Could not get your location. Please check your permissions.')
      }
    )
  }

  const submitSearch = (query: string = searchQuery) => {
    const params = new URLSearchParams()
    if (query) params.set('location', query)
    params.set('intent', activeTab.toLowerCase())
    if (propertyType !== 'All Residential') {
      params.set('type', propertyType)
    }
    router.push(`/properties?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    submitSearch()
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl w-full ${
        variant === 'hero' ? 'max-w-5xl mx-auto' : ''
      } ${className}`}
    >
      {/* ── Tabs Row ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-4 sm:px-6 pt-3">
        <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab
            const isNewLaunch = tab === 'New Launch'
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 sm:py-0 sm:pb-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 min-h-[44px] sm:min-h-0 ${
                  isActive ? 'text-brand-charcoal' : 'text-gray-500 hover:text-brand-charcoal'
                }`}
              >
                {tab}
                {isNewLaunch && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute -top-0.5 -right-2" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
        <div className="hidden md:block pb-3">
          <button type="button" className="text-sm font-semibold text-gray-700 hover:text-brand-charcoal flex items-center gap-1 cursor-pointer py-3 sm:py-0 min-h-[44px] sm:min-h-0">
            Post Property
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ml-1">
              Free
            </span>
          </button>
        </div>
      </div>

      {/* ── Search Bar Row ─────────────────────────────────────────────────── */}
      <div className="p-3 sm:p-4">
        <form
          onSubmit={handleSearch}
          noValidate
          className="flex flex-col sm:flex-row items-center bg-gray-50/80 border border-gray-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-brand-green/20 focus-within:border-brand-green transition-all"
        >
          {/* Dropdown */}
          <div className="relative flex items-center gap-1 px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-300 w-full sm:w-auto shrink-0">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="appearance-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none pr-5 w-full cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <option>All Residential</option>
              <option>Apartments</option>
              <option>Villas</option>
              <option>Plots</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
          </div>

          {/* Search Input */}
          <div className="flex-grow flex items-center gap-2 px-4 py-2 w-full">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder='Search "Hyderabad"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-brand-charcoal focus:outline-none font-medium placeholder-gray-400 min-h-[44px] sm:min-h-0"
            />
          </div>

          {/* Action Icons & Button */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 px-2 py-1 w-full sm:w-auto shrink-0 mt-2 sm:mt-0 border-t sm:border-t-0 border-gray-100 sm:border-none pt-2 sm:pt-0">
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-3 sm:p-2 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center border ${
                isListening 
                  ? 'text-red-500 bg-red-100 animate-pulse border-red-500' 
                  : 'text-brand-green bg-brand-soft hover:bg-brand-green hover:text-white border-brand-green/30 shadow-sm'
              }`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={handleNearbyClick}
              className={`p-3 sm:p-2 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center border ${
                isLocating 
                  ? 'text-brand-green bg-brand-green/20 animate-pulse border-brand-green' 
                  : 'text-brand-green bg-brand-soft hover:bg-brand-green hover:text-white border-brand-green/30 shadow-sm'
              }`}
              title="Detect Current Location"
            >
              <Navigation className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button
              type="submit"
              className="hs-btn-primary ml-1 px-6 min-h-[44px] sm:min-h-0 flex-1 sm:flex-none"
            >
              Search
            </button>
          </div>
        </form>

        {/* ── Recent Searches (Optional) ─────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-4 px-2 mt-4 text-[11px] text-gray-500 font-medium">
          <span>Recent searches:</span>
          <button type="button" className="flex items-center gap-1 hover:text-brand-charcoal cursor-pointer">
            <MapPin className="w-3 h-3" />
            Buy in Delhi , Farm House
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" className="flex items-center gap-1 hover:text-brand-charcoal cursor-pointer">
            <Search className="w-3 h-3" />
            View all searches
          </button>
        </div>
      </div>
    </div>
  )
}
