'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Mic, Crosshair, ChevronDown } from 'lucide-react'

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
  const [isListening, setIsListening] = React.useState(false)

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('location', searchQuery)
    params.set('intent', activeTab.toLowerCase())
    if (propertyType !== 'All Residential') {
      params.set('type', propertyType)
    }

    router.push(`/properties?${params.toString()}`)
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
                className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
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
          <button type="button" className="text-sm font-semibold text-gray-700 hover:text-brand-charcoal flex items-center gap-1 cursor-pointer">
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
          className="flex flex-col sm:flex-row items-center bg-gray-50/80 border border-gray-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-brand-green/20 focus-within:border-brand-green transition-all"
        >
          {/* Dropdown */}
          <div className="relative flex items-center gap-1 px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-300 w-full sm:w-auto shrink-0">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="appearance-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none pr-5 w-full cursor-pointer"
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
              className="w-full bg-transparent text-sm text-brand-charcoal focus:outline-none font-medium placeholder-gray-400"
            />
          </div>

          {/* Action Icons & Button */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 w-full sm:w-auto shrink-0 justify-end sm:justify-start">
            <button
              type="button"
              className="p-2 text-brand-green hover:bg-brand-green/10 rounded-full transition-colors cursor-pointer"
              title="Use current location"
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2 rounded-full transition-colors cursor-pointer ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-brand-green hover:bg-brand-green/10'}`}
              title="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-green text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors cursor-pointer ml-1 shadow-sm"
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
