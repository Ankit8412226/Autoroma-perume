'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/data/properties'
import { MapPin, Navigation, School, Utensils, Hospital, Plane, ArrowRight } from 'lucide-react'

interface PropertyMapProps {
  properties?: Property[]
  activeProperty?: Property
  className?: string
}

export function PropertyMap({
  properties = [],
  activeProperty,
  className = '',
}: PropertyMapProps) {
  const [selectedCity, setSelectedCity] = React.useState<string>('All')
  const [selectedProp, setSelectedProp] = React.useState<Property | null>(activeProperty || properties[0] || null)

  const cityTabs = ['All', 'Mumbai', 'Goa', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune']

  const filteredProperties = React.useMemo(() => {
    if (activeProperty) return [activeProperty]
    if (selectedCity === 'All') return properties
    return properties.filter((p) =>
      p.location.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      (selectedCity === 'Delhi NCR' && p.location.city.toLowerCase().includes('delhi'))
    )
  }, [properties, activeProperty, selectedCity])

  React.useEffect(() => {
    if (filteredProperties.length > 0 && (!selectedProp || !filteredProperties.find((p) => p.id === selectedProp.id))) {
      setSelectedProp(filteredProperties[0])
    }
  }, [filteredProperties, selectedProp])

  const proximityList = [
    { label: 'Airport Transit', dist: '18 min', icon: Plane },
    { label: 'Boutique Dining', dist: '5 min', icon: Utensils },
    { label: 'International School', dist: '8 min', icon: School },
    { label: 'Medical Center', dist: '12 min', icon: Hospital },
  ]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Editorial Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-300 block">
            EXPLORE THE NEIGHBOURHOOD
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
            Find a home in the right address.
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
            Explore properties alongside the neighbourhoods, landmarks, and connections that matter to you.
          </p>
        </div>

        {/* City Filter Tabs (Subtle dark tabs) */}
        {!activeProperty && (
          <div className="flex flex-wrap items-center gap-1.5 bg-bg-surface border border-white/15 p-1.5">
            {cityTabs.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  selectedCity === city
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Split Layout: Muted Quiet Map Canvas + Compact Preview Card */}
      <div className="bg-bg-surface border border-white/15 flex flex-col lg:flex-row overflow-hidden shadow-2xl">
        {/* Left Map Interactive Canvas */}
        <div className="relative w-full lg:w-2/3 h-[420px] sm:h-[500px] bg-[#090d12] flex items-center justify-center p-6 overflow-hidden">
          {/* Muted Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

          {/* Minimalist Coastline & Road Vector Pathways */}
          <svg className="absolute inset-0 w-full h-full opacity-20 stroke-white/40" fill="none">
            <path d="M-50 80 Q 250 450 650 180 T 1300 550" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M150 -50 Q 450 350 850 120 T 1450 450" strokeWidth="1.5" />
            <circle cx="50%" cy="50%" r="200" stroke="#C9A96E" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          {/* Floating Price Pill Markers */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {filteredProperties.map((prop, index) => {
              const isSelected = selectedProp?.id === prop.id
              const offsetX = (index % 3 - 1) * 120
              const offsetY = Math.floor(index / 3) * 90 - 40

              return (
                <div
                  key={prop.id}
                  style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
                  className="absolute transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProp(prop)}
                    className={`group relative flex items-center gap-1.5 px-3 py-1.5 border shadow-2xl transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-gold-300 border-gold-300 text-black font-bold scale-110 z-30'
                        : 'bg-black/90 border-white/30 text-white hover:border-gold-300 hover:scale-105 z-20'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-gold-300'}`} />
                    <span className="text-xs font-mono font-bold tracking-tight">{prop.formattedPrice}</span>

                    {/* Subtle Pulsing Ring */}
                    {isSelected && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold-300 rounded-full animate-ping opacity-75" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-[0.2em] font-semibold text-white flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-gold-300" />
            <span>Precinct Map View</span>
          </div>
        </div>

        {/* Right Compact Property Preview Card & Proximity Stats */}
        <div className="w-full lg:w-1/3 p-6 sm:p-8 bg-bg-secondary border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between space-y-6">
          {selectedProp ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold-300 font-bold">
                  Selected Precinct
                </span>
                <span className="text-xs font-mono text-white/50">{selectedProp.location.city}</span>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/15">
                <Image
                  src={selectedProp.images.hero}
                  alt={selectedProp.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xl font-extrabold text-white font-sans block">{selectedProp.formattedPrice}</span>
                <h4 className="font-serif text-lg text-white font-normal">{selectedProp.title}</h4>
                <p className="text-xs text-white/60 font-light">{selectedProp.location.address}</p>
              </div>

              <div className="flex items-center space-x-3 text-xs text-white/80 font-mono py-2 border-y border-white/10">
                <span>{selectedProp.specs.bedrooms} Beds</span>
                <span>·</span>
                <span>{selectedProp.specs.bathrooms} Baths</span>
                <span>·</span>
                <span>{selectedProp.specs.areaSqFt.toLocaleString()} sq ft</span>
              </div>

              <Link
                href={`/properties/${selectedProp.slug}`}
                className="w-full py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-gold-200 transition-colors"
              >
                <span>View Property</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="text-xs text-white/50">Select a property marker on map</div>
          )}

          {/* Proximity Context */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">
              Neighbourhood Connections
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
              {proximityList.map((item) => {
                const IconComponent = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-2 bg-white/5 p-2 border border-white/5">
                    <IconComponent className="w-3.5 h-3.5 text-gold-300 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/50">{item.label}</span>
                      <span className="font-mono text-xs font-semibold text-white">{item.dist}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
