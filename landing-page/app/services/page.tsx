import * as React from 'react'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { ShieldCheck, Building2, Key, FileCheck2, ArrowUpRight } from 'lucide-react'

export const metadata = {
  title: 'Real Estate Advisory Services — Aura Véloce Estates',
  description: 'Bespoke real estate acquisition, off-market disposal, asset management, and architectural valuation services.',
}

export default function ServicesPage() {
  const services = [
    {
      icon: Building2,
      title: 'Acquisition Advisory',
      desc: 'Dedicated search and representation for high-net-worth individuals and family offices seeking luxury penthouses, waterfront villas, and prime land parcels.',
    },
    {
      icon: ShieldCheck,
      title: 'Off-Market Disposals',
      desc: 'Discreet liquidations of trophy real estate assets conducted entirely under non-disclosure agreements to preserve client privacy.',
    },
    {
      icon: Key,
      title: 'Estate Management',
      desc: 'Complete property management for overseas owners and multi-home investors, including concierge maintenance and tenant placement.',
    },
    {
      icon: FileCheck2,
      title: 'Legal & Title Diligence',
      desc: 'Rigorous 30-year historical title verification, environmental micro-climate audits, and structural engineering assessments.',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <SectionHeading
        eyebrow="ATELIER SERVICES"
        title="Bespoke Real Estate Advisory"
        subtitle="End-to-end strategic guidance tailored to private wealth, family offices, and institutional property investors."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.title} className="bg-bg-surface border border-white/15 p-8 space-y-4 hover:border-white/35 transition-colors shadow-lg">
              <div className="p-3 bg-white/10 border border-white/20 text-gold-300 w-fit">
                <Icon className="w-6 h-6 text-gold-300" />
              </div>
              <h3 className="font-serif text-2xl text-white font-normal">{s.title}</h3>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">{s.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-bg-secondary border border-white/15 p-8 sm:p-12 text-center space-y-6 shadow-xl">
        <h2 className="font-serif text-3xl text-white font-normal">Require Tailored Advisory?</h2>
        <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-light">
          Contact our senior advisory desk for bespoke proposals and estate valuations.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold-300 text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl border border-gold-300 cursor-pointer"
        >
          <span>Contact Advisory Desk</span>
          <ArrowUpRight className="w-4 h-4 text-black" />
        </Link>
      </div>
    </div>
  )
}
