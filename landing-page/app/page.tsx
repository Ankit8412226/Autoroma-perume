'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { DevelopmentFeature } from '@/components/real-estate/DevelopmentFeature'
import { MarketSnapshot } from '@/components/real-estate/MarketSnapshot'
import { AgentCard } from '@/components/real-estate/AgentCard'
import { PropertyCardSkeleton } from '@/components/common/Skeleton'
import { formatCurrency } from '@/utils/formatters'
import { AGENTS } from '@/data/agents'
import {
  Sparkles,
  CheckCircle2,
  UserPlus,
  ArrowUpRight,
  MapPin,
  RefreshCw
} from 'lucide-react'

export default function HomePage() {
  const [projects, setProjects] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchLiveProjects()
  }, [])

  const fetchLiveProjects = async () => {
    try {
      setIsLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      const res = await fetch(`${baseUrl}/public/projects`)
      if (res.ok) {
        const data = await res.json()
        setProjects(data || [])
      }
    } catch (e) {
      console.error('Failed to fetch live projects', e)
    } flex: {
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
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-charcoal text-white pt-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1920&q=85&auto=format&fit=crop"
            alt="House & Sky Township Land Development"
            fill
            priority
            className="object-cover opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-brand-sky" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white">
                  EXCEPTIONAL TOWNSHIPS. DEMARCATED LAND PLOTS.
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

            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/95 backdrop-blur-md border border-brand-green/30 rounded-2xl p-6 shadow-2xl text-brand-charcoal space-y-4">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-brand-green/15 bg-brand-charcoal">
                  <Image
                    src="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&q=80"
                    alt="Featured Plot Project"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-brand-green text-white text-[10px] uppercase font-bold tracking-widest rounded shadow-sm">
                    FEATURED TOWNSHIP
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xl font-serif font-bold text-brand-green block">
                    Green Valley Enclave Phase 1
                  </span>
                  <h3 className="font-serif text-base text-brand-charcoal font-bold">
                    Sector 82, Gurgaon
                  </h3>
                  <p className="text-xs text-brand-charcoal/70 font-light">
                    Demarcated 1800 Sq Ft Plots · Base Rate ₹4,500/sqft
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-green/15 flex items-center justify-between text-xs">
                  <span className="font-mono text-brand-green font-bold">
                    18 / 30 Plots Available
                  </span>
                  <Link
                    href="/projects"
                    className="px-3.5 py-2 bg-brand-green hover:bg-brand-dark text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all shadow-sm"
                  >
                    View Project Plots
                  </Link>
                </div>
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

      {/* 3. LIVE PROJECTS SECTION (CONNECTS TO BACKEND) */}
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
              <div
                key={proj._id}
                className="bg-white border border-brand-green/15 rounded-2xl p-6 space-y-5 shadow-sm hover:border-brand-green/40 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-brand-green/15 bg-brand-charcoal">
                    <Image
                      src={proj.bannerImage || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&q=80'}
                      alt={proj.name || 'Project'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-brand-green text-white text-[10px] uppercase font-bold tracking-wider rounded-md">
                      {proj.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-green uppercase tracking-wider block">
                      Base Rate: {formatCurrency(proj.basePricePerSqft, { fallback: 'Rate on Request' })} / sqft
                    </span>
                    <h3 className="font-serif text-xl font-bold text-brand-charcoal group-hover:text-brand-green transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-brand-charcoal/70 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-green" /> {proj.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-brand-green/15 text-xs">
                    <div className="bg-[#EAF3EF] p-2.5 rounded-xl border border-brand-green/20">
                      <span className="text-[10px] text-brand-charcoal/70 font-semibold block uppercase">Total Plots</span>
                      <span className="font-extrabold text-brand-charcoal text-base mt-0.5 block">{proj.totalPlots || 0}</span>
                    </div>
                    <div className="bg-[#EAF3EF] p-2.5 rounded-xl border border-brand-green/20">
                      <span className="text-[10px] text-brand-green font-bold block uppercase">Available Plots</span>
                      <span className="font-extrabold text-brand-green text-base mt-0.5 block">
                        {proj.availableCount !== undefined ? proj.availableCount : (proj.totalPlots || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/projects/${proj._id}`}
                  className="mt-4 w-full py-3 bg-[#EAF3EF] hover:bg-brand-green hover:text-white text-brand-green font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-brand-green/20 cursor-pointer shadow-sm"
                >
                  <span>Explore Project Plots</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. FLAGSHIP TOWNSHIP SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DevelopmentFeature />
      </section>

      {/* 5. PHILOSOPHY / TRUST */}
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

      {/* 6. MARKET SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketSnapshot />
      </section>

      {/* 7. WORK WITH US / BECOME AN AGENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-soft border border-brand-green/20 rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-brand-green/15 rounded-md">
              <UserPlus className="w-4 h-4 text-brand-green" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
                CAREERS & PARTNERSHIPS
              </span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal">
              Work with Us — Join House & Sky Advisory
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light leading-relaxed">
              We empower top-tier real estate agents, estate managers, and plot sales advisors with full multi-level network backing, transparent differential commissions, and pre-qualified leads.
            </p>
          </div>

          <Link
            href="/contact?role=agent"
            className="px-6 py-3.5 bg-brand-green hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-[0.18em] rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <span>Apply as an Agent</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </section>

      {/* 8. MEET THE ADVISORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="OUR TEAM"
          title="Meet our plot advisors."
          subtitle="Experienced advisors dedicated to confidential land plot representation."
          action={{ label: 'View all advisors →', href: '/agents' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  )
}
