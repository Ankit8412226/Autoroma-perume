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
import { RecentlyViewed } from '@/components/real-estate/RecentlyViewed'
import { CompareDrawer } from '@/components/real-estate/CompareDrawer'
import { ArrowUpRight, ShieldCheck, Award, Building2, TrendingUp, Sparkles, PhoneCall } from 'lucide-react'

export const metadata = {
  title: 'Aura Véloce Estates — Architecturally Curated Luxury Properties India',
  description: 'Discover ultra-prime sea-facing penthouses, modern villas, and private architectural estates across Mumbai, Goa, Delhi NCR, Bangalore, and Hyderabad.',
}

export default function HomePage() {
  const featuredProperties = PROPERTIES.filter((p) => p.isFeatured)
  const spotlightProperty = PROPERTIES.find((p) => p.isSpotlight) || PROPERTIES[0]

  const categories = [
    {
      title: 'Sea-Facing Penthouses',
      count: '14 Active Estates',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Penthouse',
    },
    {
      title: 'Architectural Villas',
      count: '18 Active Estates',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Villa',
    },
    {
      title: 'Waterfront Residences',
      count: '9 Active Estates',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Waterfront',
    },
    {
      title: 'Heritage & Country Estates',
      count: '6 Active Estates',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop',
      href: '/properties?type=Estate',
    },
  ]

  const stats = [
    { label: 'CURATED PORTFOLIO VALUE', value: '₹4,850 Cr+' },
    { label: 'ULTRA-PRIME CITIES', value: '6 Markets' },
    { label: 'AVERAGE ESTATE AREA', value: '5,500 sq ft' },
    { label: 'OFF-MARKET DISCRETION', value: '100% Guaranteed' },
  ]

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 relative">
      <CompareDrawer />

      {/* 1. HERO SECTION — EDITORIAL REAL ESTATE DISCOVERY */}
      <section className="relative min-h-[90vh] flex flex-col justify-between pt-8 pb-12 overflow-hidden">
        {/* Hero Immersive Background Imagery */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=90&auto=format&fit=crop"
            alt="Aura Véloce Flagship Estate"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-black/60" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 bg-gold-300 rounded-full animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                  CURATED REAL ESTATE ATELIER
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white font-normal leading-[1.05] tracking-tight">
                Properties selected for how they live, not just how they look.
              </h1>

              <p className="text-sm sm:text-base text-white/80 font-light max-w-xl leading-relaxed">
                Discover architecturally distinguished residences, trophy sea-facing penthouses, and private estates across India’s most desirable coastal and urban enclaves.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-white/70">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-300" />
                  100% Vetted Legal Titles
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-300" />
                  Off-Market Private Access
                </span>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 text-right space-y-3 pb-2">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold block">
                Flagship Highlight
              </span>
              <p className="font-serif text-2xl text-white">
                The Solitaire Sky Villa
              </p>
              <p className="text-xs font-mono text-white/70">
                Bandra West, Mumbai · ₹28.50 Cr
              </p>
            </div>
          </div>
        </div>

        {/* Hero Integrated Property Search Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 w-full">
          <PropertySearch variant="hero" />
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-bg-surface border border-white/10 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">
                {s.label}
              </span>
              <span className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trophy Portfolio"
          title="Featured Architectural Residences"
          subtitle="Explore handpicked luxury homes, sky duplexes, and private villas available for immediate acquisition."
          action={{ label: 'Explore All Properties', href: '/properties' }}
        />
        <PropertyGrid properties={featuredProperties} columns={3} variant="B" />
      </section>

      {/* 4. MARKET SNAPSHOT DATA INTELLIGENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketSnapshot />
      </section>

      {/* 5. FLAGSHIP DEVELOPMENT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DevelopmentFeature />
      </section>

      {/* 6. FLAGSHIP SPOTLIGHT (VARIANT D CARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Architectural Spotlight"
          title="Estate of the Month"
          subtitle="A deeper look inside our flagship residential acquisition."
        />
        <PropertyCard property={spotlightProperty} variant="D" />
      </section>

      {/* 7. EXPLORE BY LOCATION MOSAIC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Prime Destinations"
          title="Explore Prime Locations"
          subtitle="From Mumbai’s sea link promenades to Goa’s palm-shaded valleys and Gurgaon’s golf courses."
          action={{ label: 'View All Locations', href: '/locations' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </section>

      {/* 8. PROPERTY CATEGORY COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Curated Typologies"
          title="Browse by Property Category"
          subtitle="Architectural typologies designed to accommodate every lifestyle requirement."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative aspect-[4/5] bg-bg-surface border border-white/10 overflow-hidden block hover:border-white/30 transition-all duration-500"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85" />
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 z-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-300">
                  {cat.count}
                </span>
                <h3 className="font-serif text-2xl text-white font-normal group-hover:text-gold-200 transition-colors">
                  {cat.title}
                </h3>
                <div className="inline-flex items-center gap-1 text-xs text-white/80 font-semibold tracking-wider pt-1">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. EDITORIAL BRAND STORY / PHILOSOPHY */}
      <section className="bg-bg-secondary py-20 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full border border-white/20 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&auto=format&fit=crop"
                  alt="Aura Véloce Architectural Philosophy"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 sm:pl-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-300">
                OUR PHILOSOPHY & HERITAGE
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-[1.1]">
                We believe real estate is an expression of personal identity.
              </h2>

              <p className="text-sm text-white/70 font-light leading-relaxed">
                Founded to serve discerning families, tech pioneers, and institutional investors, Aura Véloce operates at the intersection of high architecture, confidential asset advisory, and frictionless transaction execution.
              </p>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-gold-200 transition-colors"
                >
                  <span>Discover Our Story</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. EDITORIAL NEIGHBOURHOOD PRECINCT MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyMap properties={PROPERTIES} />
      </section>

      {/* 11. RECENTLY VIEWED RESIDENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentlyViewed />
      </section>

      {/* 12. TRUSTED PRIVATE ADVISORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Private Advisory"
          title="Meet Our Senior Estate Partners"
          subtitle="Experienced industry veterans providing bespoke guidance across acquisition, disposal, and portfolio management."
          action={{ label: 'View All Advisors', href: '/agents' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* 13. PRIVATE ADVISORY CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-bg-surface via-bg-secondary to-bg-surface border border-white/20 p-8 sm:p-14 overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-300">
              PRIVATE CONSULTATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
              Ready to acquire or dispose of a trophy property?
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light">
              Speak directly with our senior partners for off-market listings, private viewings, and market valuation reports.
            </p>
          </div>

          <div className="shrink-0 z-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-gold-200 transition-all duration-300 shadow-2xl group"
            >
              <PhoneCall className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Book Private Consultation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
