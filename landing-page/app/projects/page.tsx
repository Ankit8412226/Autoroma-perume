'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  ArrowUpRight,
  RefreshCw,
  Search,
  Home,
  CheckCircle,
  Phone
} from 'lucide-react'
import { getApiBaseUrl } from '@/utils/api'

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-500 text-white',
  UPCOMING: 'bg-amber-400 text-amber-900',
  COMPLETED: 'bg-sky-500 text-white',
}

export default function PublicProjectsPage() {
  const [projects, setProjects] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [statusFilter, setStatusFilter] = React.useState('ALL')
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/public/projects`, { cache: 'no-store' }).catch(() => null)
      if (res && res.ok) {
        const data = await res.json().catch(() => null)
        setProjects(Array.isArray(data) ? data : (data?.data || []))
      }
    } catch (e) {
      console.error('Projects fetch error', e)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = projects.filter((p) => {
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* ── PAGE HERO ── */}
      <div className="relative bg-brand-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #0B4F3C 0%, transparent 60%), radial-gradient(circle at 80% 20%, #C9A96E 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A96E]">
              Real Estate Investments
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-white leading-[1.1] max-w-3xl">
            Township Projects &amp; <br />
            <span className="text-[#C9A96E]">Masterplan Developments</span>
          </h1>
          <p className="mt-4 text-sm text-white/70 max-w-xl font-light">
            Explore prime demarcated land plots, active township developments, and high-yield real estate investment opportunities.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search by project name, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C9A96E]/60 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* ── FILTER TABS & CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Status filter + refresh */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-1 bg-white border border-brand-green/20 p-1 rounded-xl shadow-sm">
            {['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'text-brand-charcoal/70 hover:text-brand-charcoal'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-charcoal/60 font-semibold">
              {filtered.length} {filtered.length === 1 ? 'Project' : 'Projects'}
            </span>
            <button
              onClick={fetchProjects}
              className="p-2 bg-white border border-brand-green/20 text-brand-green rounded-xl hover:bg-brand-green hover:text-white transition-all cursor-pointer shadow-sm"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-green/10 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-brand-green/15 rounded-3xl p-16 text-center space-y-4 shadow-sm">
            <Building2 className="w-14 h-14 text-brand-green/40 mx-auto" />
            <h3 className="font-serif text-xl text-brand-charcoal font-bold">No Projects Found</h3>
            <p className="text-xs text-brand-charcoal/60">
              {search ? 'No projects match your search. Try a different keyword.' : 'Check back soon for new township launches and land plot releases.'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-xs font-bold text-brand-green underline cursor-pointer">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((proj) => (
              <ProjectCard key={proj._id} proj={proj} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ proj }: { proj: any }) {
  const statusColor = STATUS_COLORS[proj.status] || 'bg-gray-500 text-white'
  const availPct = proj.totalPlots
    ? Math.round(((proj.availableCount ?? 0) / proj.totalPlots) * 100)
    : 0

  return (
    <Link
      href={`/projects/${proj._id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-green/10 hover:shadow-xl hover:border-brand-green/30 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-charcoal">
        {proj.bannerImage && proj.bannerImage !== proj.mapImageUrl ? (
          <Image
            src={proj.bannerImage}
            alt={proj.name || 'Project'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-green/80" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${statusColor}`}>
            {proj.status || 'ACTIVE'}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] rounded-lg">
            {proj.code}
          </span>
        </div>

        {/* Bottom info on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#C9A96E] shrink-0" />
            <span className="font-medium">{proj.location}</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white leading-tight group-hover:text-[#C9A96E] transition-colors">
            {proj.name}
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#EAF3EF] rounded-xl p-2.5 border border-brand-green/15">
            <span className="text-[10px] text-brand-charcoal/60 font-bold uppercase block">Total</span>
            <span className="text-base font-extrabold text-brand-charcoal">{proj.totalPlots || 0}</span>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Available</span>
            <span className="text-base font-extrabold text-emerald-700">{proj.availableCount ?? 0}</span>
          </div>
          <div className="bg-red-50 rounded-xl p-2.5 border border-red-200">
            <span className="text-[10px] text-red-700 font-bold uppercase block">Sold</span>
            <span className="text-base font-extrabold text-red-700">{proj.soldCount ?? 0}</span>
          </div>
        </div>

        {/* Availability bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-brand-charcoal/60 font-bold uppercase">Availability</span>
            <span className="text-[10px] font-extrabold text-brand-green">{availPct}% Available</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${availPct}%` }}
            />
          </div>
        </div>

        {/* Price */}
        {(proj.priceRange || proj.basePricePerSqft) && (
          <div className="text-xs font-bold text-brand-green bg-[#EAF3EF] px-3 py-1.5 rounded-lg border border-brand-green/15 text-center">
            {proj.priceRange || `₹${proj.basePricePerSqft?.toLocaleString('en-IN')} / sq ft`}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-xs text-brand-charcoal/50 font-medium">
            {proj.area || `${((proj.totalAreaSqft || 0) / 43560).toFixed(1)} Acres`}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green group-hover:gap-2 transition-all">
            View Project <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
