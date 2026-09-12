'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { DevelopmentFeature } from '@/components/real-estate/DevelopmentFeature'
import { MarketSnapshot } from '@/components/real-estate/MarketSnapshot'
import { DholeraArrivedSection } from '@/components/real-estate/DholeraArrivedSection'
import { IndiaIsRunningBanner } from '@/components/real-estate/IndiaIsRunningBanner'
import { PlotBuyingProcess } from '@/components/real-estate/PlotBuyingProcess'
import { HomepageContactSection } from '@/components/real-estate/HomepageContactSection'
import { LandInvestmentCalculator } from '@/components/real-estate/LandInvestmentCalculator'
import { InteractiveNakshaPreview } from '@/components/real-estate/InteractiveNakshaPreview'
import { LandPlotFAQ } from '@/components/real-estate/LandPlotFAQ'
import { BrandValuesSection } from '@/components/real-estate/BrandValuesSection'
import { TestimonialsCommunityInsights } from '@/components/real-estate/TestimonialsCommunityInsights'
import { PropertyCardSkeleton } from '@/components/common/Skeleton'
import { formatCurrency } from '@/utils/formatters'
import { PropertyCard } from '@/components/real-estate/PropertyCard'
import { mapBackendProperty } from '@/utils/mapListing'
import {
  CheckCircle2,
  ArrowUpRight,
  MapPin,
  RefreshCw
} from 'lucide-react'

export default function HomePage() {
  const [projects, setProjects] = React.useState<any[]>([])
  const [listings, setListings] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchLiveProjects()
  }, [])

  const fetchLiveProjects = async () => {
    try {
      setIsLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      const [projectRes, propertyRes] = await Promise.all([
        fetch(`${baseUrl}/public/projects`).catch(() => null),
        fetch(`${baseUrl}/public/properties`).catch(() => null)
      ])
      if (projectRes && projectRes.ok) {
        const data = await projectRes.json().catch(() => null)
        setProjects(data || [])
      }
      if (propertyRes && propertyRes.ok) {
        const data = await propertyRes.json().catch(() => null)
        setListings(Array.isArray(data) ? data : [])
      }
    } catch (e) {
      console.error('Failed to fetch live inventory', e)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    { label: 'TOWNSHIP DEVELOPMENTS', value: `${projects.length || 6} Projects` },
    { label: 'COMMUNITY ADVISORS', value: '45+ Team' },
    { label: 'PRIME LOCATIONS', value: '6 Enclaves' },
    { label: 'DEMARCATED LAND MANIFEST', value: '₹1,200 Cr+' },
  ]

  return (
    <div className="space-y-20 sm:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-charcoal text-white pt-4">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-top opacity-70"
          >
            <source src="/videos/hero-banner-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                <img src="/logo.png" alt="House & Sky Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-[#C9A96E]/70" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C9A96E]">
                  BUILDING TRUST. DELIVERING VALUE.
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.1] text-white tracking-tight">
                  Prime Real Estate Land Plots & Townships
                </h1>
                <p className="text-xs sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
                  Representing India&apos;s premier masterplan township projects, demarcated plot layouts, and high-yield real estate land acquisitions.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="px-6 py-3.5 bg-brand-green hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>Explore All Plot Projects</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </Link>

                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all shadow-sm"
                >
                  Schedule Site Tour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-brand-green/15 rounded-2xl p-6 sm:p-8 shadow-sm">
          {stats.map((s) => (
            <div key={s.label} className="text-center space-y-1">
              <span className="block text-[10px] font-bold tracking-[0.2em] text-brand-green uppercase">
                {s.label}
              </span>
              <span className="text-2xl sm:text-3xl font-serif text-brand-charcoal font-bold block">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PLOT PROJECTS (PRIMARY DB PROJECTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading
            eyebrow="TOWNSHIPS & MASTERPLANS"
            title="Featured Plot Projects."
            subtitle="Real-time availability of demarcated plots across active townships."
            action={{ label: 'View all projects →', href: '/projects' }}
          />
          <button
            onClick={fetchLiveProjects}
            className="p-2.5 bg-brand-soft border border-brand-green/20 text-brand-green rounded-xl hover:bg-brand-green hover:text-white transition-all cursor-pointer"
            title="Refresh database plot counts"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading ? (
          <PropertyCardSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((proj) => (
              <Link
                key={proj._id}
                href={`/projects/${proj._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-green/10 hover:shadow-xl hover:border-brand-green/30 transition-all duration-300 flex flex-col"
              >
                {/* Image with gradient */}
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-charcoal">
                  <Image
                    src={proj.bannerImage || 'https://images.unsplash.com/photo-1582407947304-fd86f28f3fdc?w=800&q=80'}
                    alt={proj.name || 'Project'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      proj.status === 'ACTIVE' ? 'bg-emerald-500 text-white' :
                      proj.status === 'UPCOMING' ? 'bg-amber-400 text-amber-900' :
                      'bg-sky-500 text-white'
                    }`}>
                      {proj.status || 'ACTIVE'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] rounded-lg">{proj.code}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white/70 text-xs flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A96E] shrink-0" /> {proj.location}
                    </p>
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#C9A96E] transition-colors leading-tight">
                      {proj.name}
                    </h3>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#EAF3EF] rounded-xl p-2 border border-brand-green/15">
                      <span className="text-[9px] text-brand-charcoal/60 font-bold uppercase block">Total</span>
                      <span className="text-sm font-extrabold text-brand-charcoal">{proj.totalPlots || 0}</span>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-200">
                      <span className="text-[9px] text-emerald-700 font-bold uppercase block">Available</span>
                      <span className="text-sm font-extrabold text-emerald-700">{proj.availableCount ?? 0}</span>
                    </div>
                    <div className="bg-red-50 rounded-xl p-2 border border-red-200">
                      <span className="text-[9px] text-red-700 font-bold uppercase block">Sold</span>
                      <span className="text-sm font-extrabold text-red-700">{(proj.bookedCount ?? 0) + (proj.soldCount ?? 0)}</span>
                    </div>
                  </div>

                  {(proj.priceRange || proj.basePricePerSqft) && (
                    <div className="text-xs font-bold text-brand-green bg-[#EAF3EF] px-3 py-1.5 rounded-lg border border-brand-green/15 text-center">
                      {proj.priceRange || `₹${proj.basePricePerSqft?.toLocaleString('en-IN')} / sq ft`}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-xs text-brand-charcoal/50 font-medium">
                      {proj.area || `${((proj.totalAreaSqft || 0) / 43560).toFixed(1)} Acres`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green group-hover:gap-2 transition-all">
                      Explore Plots <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {listings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="PREMIUM PROPERTIES"
            title="Premium properties, separate from townships."
            subtitle="Residential plots, commercial units, villas and showrooms listed independently of project plot inventory."
            action={{ label: 'View all properties →', href: '/properties' }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((item) => (
              <PropertyCard key={item._id} property={mapBackendProperty(item)} variant="B" />
            ))}
          </div>
        </section>
      )}

      {/* 4. DHOLERA SMART CITY ARRIVAL ANNOUNCEMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DholeraArrivedSection />
      </section>

      {/* 5. INTERACTIVE NAKSHA & VECTOR MAP DEMARCATION PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveNakshaPreview />
      </section>

      {/* 6. TRANSPARENT 4-STEP PLOT ACQUISITION JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PlotBuyingProcess />
      </section>

      {/* 7. LAND INVESTMENT & ROI APPRECIATION CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandInvestmentCalculator />
      </section>

      {/* 8. INDIA IS RUNNING - INFRASTRUCTURE GROWTH SUPERCYCLE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IndiaIsRunningBanner />
      </section>

      {/* 9. FLAGSHIP TOWNSHIP SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DevelopmentFeature />
      </section>

      {/* 10. PHILOSOPHY / TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-brand-green/15 rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1000&q=80"
                alt="House & Sky Land Plot Demarcation"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-green block">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal leading-tight">
                Plot decisions deserve total title clarity.
              </h2>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Demarcated</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Every plot is surveyed with exact vector coordinates and boundary markers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Transparent PLC</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Clear breakdown of 12m road, corner, and park-facing preferential location charges.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Legal Conveyance</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Full registry scheduling and title deed transfer upon milestone completion.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. MARKET SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketSnapshot />
      </section>

      {/* 12. FREQUENTLY ASKED QUESTIONS & LEGAL TITLE ACCORDION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandPlotFAQ />
      </section>

      {/* 13. FAITH • ETHICS • VALUES (GUIDING DECISIONS & LASTING TRUST) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandValuesSection />
      </section>

      {/* 14. OUR TESTIMONIALS & COMMUNITY INSIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialsCommunityInsights />
      </section>



      {/* 16. DIRECT CONTACT US & VIP SITE TOUR FORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomepageContactSection />
      </section>

    </div>
  )
}
