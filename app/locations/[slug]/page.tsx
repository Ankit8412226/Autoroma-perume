import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LOCATIONS } from '@/data/locations'
import { PROPERTIES } from '@/data/properties'
import { PropertyGrid } from '@/components/real-estate/PropertyGrid'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { TrendingUp, MapPin, Building, Sparkles, ChevronRight } from 'lucide-react'

interface LocationPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return LOCATIONS.map((l) => ({
    slug: l.slug,
  }))
}

export async function generateMetadata({ params }: LocationPageProps) {
  const resolvedParams = await params
  const location = LOCATIONS.find((l) => l.slug === resolvedParams.slug)
  if (!location) return { title: 'Location Not Found' }

  return {
    title: `${location.name} Luxury Real Estate — Aura Véloce`,
    description: location.description,
  }
}

export default async function LocationDetailPage({ params }: LocationPageProps) {
  const resolvedParams = await params
  const location = LOCATIONS.find((l) => l.slug === resolvedParams.slug)

  if (!location) {
    notFound()
  }

  // Filter properties in this city
  const cityProperties = PROPERTIES.filter((p) =>
    p.location.city.toLowerCase().includes(location.name.toLowerCase()) ||
    (location.slug === 'delhi-ncr' && p.location.city.toLowerCase().includes('delhi'))
  )

  return (
    <div className="space-y-16 pb-16">
      {/* City Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-12 overflow-hidden border-b border-white/10">
        <Image
          src={location.heroImage}
          alt={location.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-black/60 to-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
          <nav className="flex items-center space-x-2 text-xs text-white/60 font-mono mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <Link href="/locations" className="hover:text-white">Locations</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white">{location.name}</span>
          </nav>

          <span className="px-3 py-1 bg-gold-300 text-black text-[10px] uppercase tracking-[0.25em] font-bold">
            {location.state} Market Intelligence
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal">
            {location.name} Luxury Real Estate
          </h1>

          <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
            {location.description}
          </p>
        </div>
      </section>

      {/* Market Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-bg-surface border border-white/10 text-center">
          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
              AVG PRICE / SQ FT
            </span>
            <span className="text-xl font-bold text-white font-sans">{location.avgPriceSqFt}</span>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
              YOY CAPITAL GROWTH
            </span>
            <span className="text-xl font-bold text-emerald-400 font-sans">{location.yoyGrowth}</span>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
              ACTIVE ESTATES
            </span>
            <span className="text-xl font-bold text-white font-sans">{location.activeListingsCount} Available</span>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
              PRIMARY PRECINCTS
            </span>
            <span className="text-xl font-bold text-white font-sans">{location.topNeighborhoods.length} Neighborhoods</span>
          </div>
        </div>
      </section>

      {/* Neighborhood Highlights & City Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-bg-secondary border border-white/10 p-8">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl text-white font-normal">Top Neighborhood Precincts</h3>
            <div className="flex flex-wrap gap-2">
              {location.topNeighborhoods.map((n) => (
                <span
                  key={n}
                  className="px-3.5 py-1.5 bg-white/5 border border-white/15 text-xs text-white/90 font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl text-white font-normal">Precinct Highlights</h3>
            <ul className="space-y-2 text-xs text-white/70 font-light">
              {location.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Available Properties in this Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={`${location.name} Portfolio`}
          title={`Featured Residences in ${location.name}`}
          subtitle={`Explore available luxury penthouses and estates in ${location.name}.`}
        />
        <PropertyGrid properties={cityProperties} columns={3} variant="B" />
      </section>
    </div>
  )
}
