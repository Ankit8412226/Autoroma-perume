import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PROPERTIES } from '@/data/properties'
import { LOCATIONS } from '@/data/locations'
import { AGENTS } from '@/data/agents'
import { PropertySearch } from '@/components/real-estate/PropertySearch'
import { PropertyCard } from '@/components/real-estate/PropertyCard'
import { PropertyGrid } from '@/components/real-estate/PropertyGrid'
import { LocationCard } from '@/components/real-estate/LocationCard'
import { AgentCard } from '@/components/real-estate/AgentCard'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { PropertyMap } from '@/components/real-estate/PropertyMap'
import { MarketSnapshot } from '@/components/real-estate/MarketSnapshot'
import { DevelopmentFeature } from '@/components/real-estate/DevelopmentFeature'
import { CompareDrawer } from '@/components/real-estate/CompareDrawer'
import { ArrowRight, CheckCircle2, ArrowUpRight } from 'lucide-react'

export const metadata = {
  title: 'House & Sky — Exceptional Homes. Under Open Skies.',
  description: 'Explore exceptional architectural homes, luxury penthouses, modern villas, and prime real estate across Mumbai, Goa, Delhi NCR, Bangalore, and Hyderabad.',
}

export default function HomePage() {
  const featuredProperties = PROPERTIES.filter((p) => p.isFeatured)

  const categories = [
    {
      title: 'Penthouses & Sky Villas',
      count: '14 Properties',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Penthouse',
    },
    {
      title: 'Architectural Villas',
      count: '18 Properties',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Villa',
    },
    {
      title: 'Coastal & Waterfront',
      count: '9 Properties',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Waterfront',
    },
    {
      title: 'Commercial Assets',
      count: '6 Properties',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Commercial',
    },
  ]

  const stats = [
    { label: 'CURATED PROPERTIES', value: '10K+' },
    { label: 'HAPPY CLIENTS', value: '25K+' },
    { label: 'CLIENT RATING', value: '4.9 ⭐' },
    { label: 'EXPERIENCE', value: '15+ Years' },
  ]

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 relative bg-bg-primary">
      <CompareDrawer />

      {/* 1. HERO SECTION — HOUSE & SKY ASYMMETRIC EDITORIAL */}
      <section className="relative min-h-[85vh] flex flex-col justify-between pt-6 pb-12 overflow-hidden bg-white border-b border-brand-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy & Search */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-soft border border-brand-green/20 rounded-md">
                <span className="w-2 h-2 bg-brand-green rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
                  HOUSE & SKY REAL ESTATE
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-normal leading-[1.08] tracking-tight">
                Exceptional homes. <br />
                <span className="italic font-serif text-brand-green">Under open skies.</span>
              </h1>

              <p className="text-sm sm:text-base text-brand-charcoal/70 font-light max-w-lg leading-relaxed">
                Explore exceptional properties in locations that make everyday living better.
              </p>

              {/* Integrated Property Search */}
              <div className="pt-2">
                <PropertySearch variant="hero" />
              </div>
            </div>

            {/* Right Architectural Image & High-Contrast Featured Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-brand-green/15 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=90&auto=format&fit=crop"
                  alt="House & Sky Featured Architecture"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Floating Featured Card */}
              <div className="absolute -bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-88 bg-white border border-brand-green/30 p-5 rounded-lg shadow-2xl space-y-2.5 z-20">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-brand-soft border border-brand-green/20 text-brand-green text-[9px] uppercase tracking-[0.18em] font-bold rounded">
                    FEATURED RESIDENCE
                  </span>
                  <span className="text-[10px] font-mono text-brand-charcoal/60 font-semibold">Bandra West</span>
                </div>
                <h3 className="font-serif text-xl text-brand-charcoal font-semibold">The Imperial Residences</h3>
                <p className="text-xs text-brand-charcoal/70 font-medium">Bandra West, Mumbai</p>
                <div className="pt-2 border-t border-brand-green/15 flex items-center justify-between">
                  <span className="font-bold text-brand-green text-base">₹4.85 Cr onwards</span>
                  <Link
                    href="/properties/the-solitaire-sky-villa-bandra"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-brand-dark transition-all shadow-sm"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white border border-brand-green/15 rounded-lg text-center shadow-sm">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
                {s.label}
              </span>
              <span className="font-sans text-2xl sm:text-3xl font-bold text-brand-charcoal tracking-tight">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FEATURED PROPERTIES"
          title="Homes worth seeing."
          subtitle="A considered selection of properties in exceptional locations."
          action={{ label: 'View all properties →', href: '/properties' }}
        />
        <PropertyGrid properties={featuredProperties} columns={3} variant="B" />
      </section>

      {/* 4. EXPLORE THE NEIGHBOURHOOD (MAP SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyMap properties={PROPERTIES} />
      </section>

      {/* 5. LOCATION DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="LOCATION DISCOVERY"
          title="Explore prime destinations."
          subtitle="Find exceptional residences across India's most sought-after coastal and urban enclaves."
          action={{ label: 'View all locations →', href: '/locations' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </section>

      {/* 6. PROPERTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="PROPERTY CATEGORIES"
          title="Find the way you want to live."
          subtitle="Curated architectural typologies tailored for your lifestyle."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative aspect-[4/5] bg-white border border-brand-green/15 rounded-lg overflow-hidden block shadow-sm hover:border-brand-green/40 transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-85" />
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 z-10 text-white">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-sky font-bold">
                  {cat.count}
                </span>
                <h3 className="font-serif text-2xl text-white font-normal group-hover:text-brand-soft transition-colors">
                  {cat.title}
                </h3>
                <div className="inline-flex items-center gap-1 text-xs text-white/90 font-semibold tracking-wider pt-1">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-sky" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. FEATURED DEVELOPMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DevelopmentFeature />
      </section>

      {/* 8. WHY HOUSE & SKY */}
      <section className="bg-white py-16 border-y border-brand-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-brand-green/15 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&auto=format&fit=crop"
                alt="House & Sky Architectural Diligence"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green block">
                WHY HOUSE & SKY
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal leading-tight">
                Property decisions deserve better information.
              </h2>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Curated</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Properties selected with architectural intent and verified legal title lineage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Clear</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Information without unnecessary noise or inflated marketing claims.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Human</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Real advisors for important financial and lifestyle decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. MARKET SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketSnapshot />
      </section>

      {/* 10. MEET THE PEOPLE BEHIND THE PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="OUR TEAM"
          title="Meet the people behind the properties."
          subtitle="Experienced advisors dedicated to confidential real estate representation."
          action={{ label: 'View all advisors →', href: '/agents' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark text-white rounded-lg p-8 sm:p-14 text-center space-y-6 shadow-xl border border-brand-green/20">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Your next address starts here.
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-light">
            Connect with our team for confidential advisory and private property viewings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/properties"
              className="px-6 py-3.5 bg-white text-brand-dark font-bold text-xs uppercase tracking-widest hover:bg-brand-soft rounded-md transition-all cursor-pointer shadow-md"
            >
              Explore Properties
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-brand-green text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-brand-dark rounded-md transition-all cursor-pointer shadow-md border border-brand-green"
            >
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
