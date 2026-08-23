import * as React from 'react'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { ShieldCheck, Building2, Key, FileCheck2, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Real Estate Advisory Services — House & Sky Architectural Real Estate',
  description: 'Bespoke real estate acquisition, off-market disposal, asset management, and legal title clearance advisory services.',
}

export default function ServicesPage() {
  const services = [
    {
      icon: Building2,
      title: 'Acquisition Advisory',
      desc: 'Dedicated representation for high-net-worth individuals and family offices seeking luxury sky villas, waterfront penthouses, and prime land plots with clean legal title lineage.',
    },
    {
      icon: ShieldCheck,
      title: 'Off-Market Disposals',
      desc: 'Discreet liquidations of trophy real estate assets conducted entirely under non-disclosure agreements (NDAs) to guarantee client privacy.',
    },
    {
      icon: Key,
      title: 'Private Estate Management',
      desc: 'Complete property management for overseas owners and multi-home investors, including concierge maintenance, tenant placement, and yield optimization.',
    },
    {
      icon: FileCheck2,
      title: 'Legal & Title Diligence',
      desc: 'Rigorous 30-year historical title verification, environmental micro-climate audits, structural engineering assessments, and municipal sanction clearance.',
    },
  ]

  const highlights = [
    '30-Year Historical Title Clearance Guarantee',
    'Confidential Non-Disclosure Protocol (NDA)',
    'Dedicated Senior Advisory Desk Representation',
    'MLM Sales Executive & Partner Ecosystem'
  ]

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-green/15 shadow-sm text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-soft border border-brand-green/20 rounded-full mx-auto">
            <Award className="w-3.5 h-3.5 text-brand-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
              PRIVATE ADVISORY DESK
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#171A18] font-normal max-w-3xl mx-auto leading-tight">
            Bespoke Architectural Real Estate Advisory
          </h1>

          <p className="text-xs sm:text-base text-[#171A18]/70 font-light max-w-2xl mx-auto leading-relaxed">
            End-to-end strategic guidance tailored to private wealth, family offices, land acquisitions, and institutional property investors across India.
          </p>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="bg-white border border-brand-green/15 rounded-3xl p-8 space-y-5 hover:border-brand-green/40 transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-soft border border-brand-green/20 text-[#0B4F3C] flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-[#0B4F3C]" />
                </div>
                <h3 className="font-serif text-2xl text-[#171A18] font-normal">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[#171A18]/70 font-light leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Curation Highlights */}
        <div className="bg-white rounded-3xl border border-brand-green/15 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#171A18]">Why House & Sky Private Advisory?</h2>
            <p className="text-xs text-[#171A18]/70 font-light">Every transaction operates under strict institutional compliance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {highlights.map((h, idx) => (
              <div key={idx} className="bg-[#FAF9F6] p-4 rounded-2xl border border-brand-green/15 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0B4F3C] shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-[#171A18] leading-snug">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#0B4F3C] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-[#0B4F3C]">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">Require Tailored Advisory & Valuation?</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-light leading-relaxed">
            Contact our senior advisory desk for bespoke property proposals, private viewing arrangements, and architectural valuations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0B4F3C] font-bold text-xs uppercase tracking-widest hover:bg-brand-soft rounded-xl transition-all shadow-md cursor-pointer border border-white"
          >
            <span>Contact Advisory Desk</span>
            <ArrowUpRight className="w-4 h-4 text-[#0B4F3C]" />
          </Link>
        </div>
      </div>
    </div>
  )
}
