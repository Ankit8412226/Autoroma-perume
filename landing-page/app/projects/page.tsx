'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { Building2, MapPin, ArrowUpRight, CheckCircle2, RefreshCw } from 'lucide-react'

export default function PublicProjectsPage() {
  const [projects, setProjects] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      const res = await fetch(`${baseUrl}/public/projects`)
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (e) {
      console.error('Projects fetch error', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-bg-primary">
      <div className="flex items-center justify-between">
        <SectionHeading
          eyebrow="TOWNSHIPS & LAND DEVELOPMENTS"
          title="Masterplan Real Estate Projects"
          subtitle="Explore prime demarcated land plots, active township developments, and investment opportunities."
        />
        <button
          onClick={fetchProjects}
          className="p-2.5 bg-brand-soft border border-brand-green/20 text-brand-green rounded-xl hover:bg-brand-green hover:text-white transition-all cursor-pointer shadow-sm"
          title="Refresh live project data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-16">
          <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-brand-green/15 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Building2 className="w-12 h-12 text-brand-green mx-auto" />
          <h3 className="font-serif text-xl text-brand-charcoal font-bold">No Projects Currently Active</h3>
          <p className="text-xs text-brand-charcoal/70">Check back soon for new township launches and land plot releases.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white border border-brand-green/15 rounded-2xl p-6 space-y-5 shadow-sm hover:border-brand-green/40 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-brand-green/15 bg-brand-charcoal">
                  <Image
                    src={proj.bannerImage || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&q=80'}
                    alt={proj.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-brand-green text-white text-[10px] uppercase font-bold tracking-wider rounded-md shadow-sm">
                    {proj.status || 'ACTIVE TOWNSHIP'}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white font-mono text-[11px] rounded">
                    {proj.code}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-brand-green uppercase tracking-wider block">
                    Base Rate: ₹{proj.basePricePerSqft} / sqft
                  </span>
                  <h3 className="font-serif text-xl font-bold text-brand-charcoal group-hover:text-brand-green transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-brand-charcoal/70 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-green" /> {proj.location}
                  </p>
                </div>

                {/* Plot Availability Counters Bar */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-brand-green/15 text-xs">
                  <div className="bg-[#EAF3EF] p-2.5 rounded-xl border border-brand-green/20">
                    <span className="text-[10px] text-brand-charcoal/70 font-semibold block uppercase">Total Plots</span>
                    <span className="font-extrabold text-brand-charcoal text-base mt-0.5 block">{proj.totalPlots || 0} Plots</span>
                  </div>
                  <div className="bg-[#EAF3EF] p-2.5 rounded-xl border border-brand-green/20">
                    <span className="text-[10px] text-brand-green font-bold block uppercase">Available Plots</span>
                    <span className="font-extrabold text-brand-green text-base mt-0.5 block">
                      {proj.availableCount !== undefined ? proj.availableCount : (proj.totalPlots || 0)} Available
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/projects/${proj._id}`}
                className="mt-4 w-full py-3 bg-[#EAF3EF] hover:bg-brand-green hover:text-white text-brand-green font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-brand-green/20 shadow-sm cursor-pointer"
              >
                <span>Explore Project & Available Plots</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
