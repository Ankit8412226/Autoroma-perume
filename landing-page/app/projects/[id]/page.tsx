'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { InquiryForm } from '@/components/real-estate/InquiryForm'
import { formatCurrency, formatArea } from '@/utils/formatters'
import {
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowLeft,
  X,
  PhoneCall
} from 'lucide-react'

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params?.id as string

  const [projectData, setProjectData] = React.useState<any | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [selectedPlotForInquiry, setSelectedPlotForInquiry] = React.useState<any | null>(null)

  React.useEffect(() => {
    if (projectId) {
      fetchProjectDetails()
    }
  }, [projectId])

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      const res = await fetch(`${baseUrl}/public/projects/${projectId}`)
      if (res.ok) {
        const data = await res.json()
        setProjectData(data)
      }
    } catch (e) {
      console.error('Fetch project details error', e)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-brand-charcoal/70 mt-3 font-semibold">Loading Project Masterplan & Plot Inventory...</p>
      </div>
    )
  }

  if (!projectData || !projectData.project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-brand-green mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-brand-charcoal">Project Not Found</h2>
        <p className="text-xs text-brand-charcoal/70">The project details you requested could not be located.</p>
        <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-green text-white text-xs font-bold rounded-xl shadow-md">
          <ArrowLeft className="w-4 h-4 text-white" /> Return to All Projects
        </Link>
      </div>
    )
  }

  const { project, stats, plots } = projectData

  const filteredPlots = (plots || []).filter((p: any) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
    const matchesSearch =
      p.plotNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.block.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-bg-primary">
      {/* Back Link */}
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to All Township Projects
      </Link>

      {/* Hero Project Banner Header */}
      <div className="bg-white border border-brand-green/15 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand-soft text-brand-green text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-brand-green/20">
                {project.status || 'ACTIVE TOWNSHIP'}
              </span>
              <span className="font-mono text-xs text-brand-charcoal/60">Project Code: {project.code}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-charcoal leading-tight">
              {project.name}
            </h1>

            <p className="text-xs sm:text-sm text-brand-charcoal/70 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-brand-green shrink-0" /> {project.location}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
              <div className="px-4 py-2 bg-[#FAF9F6] border border-brand-green/20 rounded-xl">
                <span className="text-brand-charcoal/60 text-[10px] block uppercase font-sans font-bold">Total Development Area</span>
                <span className="font-extrabold text-brand-charcoal text-sm">{(project.totalAreaSqft || 0).toLocaleString()} Sq Ft</span>
              </div>
              <div className="px-4 py-2 bg-[#FAF9F6] border border-brand-green/20 rounded-xl">
                <span className="text-brand-green text-[10px] block uppercase font-sans font-bold">Base Price Rate</span>
                <span className="font-extrabold text-brand-green text-sm">₹{project.basePricePerSqft} / Sq Ft</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-brand-green/15 shadow-md">
              <Image
                src={project.bannerImage || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1000&q=80'}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 2 REAL PROJECT-WISE STATISTICS BADGE BAR */}
      <div className="bg-white border border-brand-green/15 rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="font-serif text-lg font-bold text-brand-charcoal flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-green" /> Database Plot Availability & Status Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="p-4 bg-[#FAF9F6] border border-brand-green/20 rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-brand-charcoal/70 font-bold block">TOTAL PLOTS</span>
            <span className="text-2xl font-serif font-bold text-brand-charcoal block">{project.totalPlots || 0}</span>
            <span className="text-[10px] text-brand-charcoal/60 font-mono">Masterplan Layout</span>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block">AVAILABLE</span>
            <span className="text-2xl font-serif font-bold text-emerald-800 block">{stats.AVAILABLE || 0}</span>
            <span className="text-[10px] text-emerald-700 font-mono">Ready for Booking</span>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block">PENDING</span>
            <span className="text-2xl font-serif font-bold text-amber-800 block">{stats.PENDING || 0}</span>
            <span className="text-[10px] text-amber-700 font-mono">Under Review</span>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-sky-800 font-bold block">BOOKED / RESERVED</span>
            <span className="text-2xl font-serif font-bold text-sky-800 block">{stats.BOOKED || 0}</span>
            <span className="text-[10px] text-sky-700 font-mono">Advance Settled</span>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase tracking-wider text-red-800 font-bold block">SOLD</span>
            <span className="text-2xl font-serif font-bold text-red-800 block">{stats.SOLD || 0}</span>
            <span className="text-[10px] text-red-700 font-mono">Title Conveyed</span>
          </div>
        </div>
      </div>

      {/* PLOT INVENTORY DISCOVERY & FILTERING */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-charcoal">Plot Inventory Explorer</h2>
            <p className="text-xs text-brand-charcoal/70">Select any plot card below to view dimensions, PLC charges & request site viewing</p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-green absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Plot No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white border border-brand-green/20 rounded-xl text-xs text-brand-charcoal font-bold focus:outline-none focus:border-brand-green w-48 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-1 bg-white border border-brand-green/20 p-1 rounded-xl shadow-sm">
              {['ALL', 'AVAILABLE', 'PENDING', 'BOOKED', 'SOLD'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'text-brand-charcoal/70 hover:text-brand-charcoal'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plots Grid */}
        {filteredPlots.length === 0 ? (
          <div className="bg-white border border-brand-green/15 rounded-2xl p-10 text-center space-y-2 shadow-sm">
            <p className="text-xs text-brand-charcoal/70 font-semibold">No plots found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPlots.map((plot: any) => {
              const sellable = plot.sellableSqYrd || (plot.sizeSqft ? (plot.sizeSqft / 9).toFixed(1) : '—');
              const totalCost = plot.totalCost || plot.price || 0;
              const formattedCost = formatCurrency(totalCost);
              const formattedArea = formatArea(plot.sizeSqft, plot.sellableSqYrd);

              return (
                <div
                  key={plot._id}
                  className="bg-white border border-brand-green/15 rounded-2xl p-5 space-y-3 shadow-sm hover:border-brand-green/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#0B4F3C] font-mono text-sm">
                        Plot {plot.plotNo}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          plot.status === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30'
                            : plot.status === 'BOOKED'
                            ? 'bg-sky-500/20 text-sky-800 border-sky-500/30'
                            : plot.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                            : 'bg-red-500/20 text-red-800 border-red-500/30'
                        }`}
                      >
                        {plot.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="text-brand-charcoal font-semibold">Block / Sector: {plot.block || 'Main Sector'}</p>
                      <p className="text-brand-charcoal/70 font-mono">{formattedArea}</p>
                    </div>

                    <div className="pt-2 border-t border-brand-green/10">
                      <span className="text-[10px] text-brand-charcoal/60 uppercase font-bold block">Total Plot Cost</span>
                      <span className="text-lg font-serif font-bold text-brand-green block">{formattedCost}</span>
                    </div>
                  </div>

                  {plot.status === 'AVAILABLE' ? (
                    <button
                      onClick={() => setSelectedPlotForInquiry(plot)}
                      className="w-full mt-3 py-2 bg-brand-green hover:bg-brand-dark text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Inquire & Schedule Tour
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full mt-3 py-2 bg-gray-100 text-gray-500 font-bold text-xs rounded-xl cursor-not-allowed border border-gray-200"
                    >
                      {plot.status === 'SOLD' ? 'Plot Sold' : 'Under Booking Process'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* PLOT INQUIRY MODAL */}
      {selectedPlotForInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-brand-green/20 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-brand-green/15 pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-brand-charcoal">
                  Inquire about Plot {selectedPlotForInquiry.plotNo}
                </h3>
                <p className="text-xs text-brand-charcoal/70">
                  {project.name} · Block {selectedPlotForInquiry.block}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlotForInquiry(null)}
                className="p-1.5 text-brand-charcoal/60 hover:text-brand-charcoal rounded-lg bg-brand-soft"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <InquiryForm
              propertyTitle={`Plot ${selectedPlotForInquiry.plotNo} (${project.name})`}
              agentName="Senior Advisory Desk"
            />
          </div>
        </div>
      )}
    </div>
  )
}
