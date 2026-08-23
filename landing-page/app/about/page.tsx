import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { ArrowUpRight, CheckCircle2, Building2, ShieldCheck, Award } from 'lucide-react'

export const metadata = {
  title: 'Brand Story — House & Sky Architectural Real Estate',
  description: 'Learn about House & Sky — India’s premier real estate platform connecting architectural homes and open skies.',
}

export default function AboutPage() {
  const milestones = [
    { year: '2014', title: 'Platform Founded', desc: 'Established to connect buyers with architecturally significant properties and open sky plots.' },
    { year: '2018', title: 'Pan-India Footprint', desc: 'Extended advisory desks across Mumbai, Goa, Delhi NCR, Bangalore, and Hyderabad.' },
    { year: '2022', title: '₹3,000 Cr Milestone', desc: 'Surpassed ₹3,000 Cr in residential property and land plot transaction volume.' },
    { year: '2026', title: 'Hippo MLM & Naksa Engine', desc: 'Pioneered AI Government Naksa OCR canvas maps and 7-rank sales tier networks.' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Header */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-brand-green/15 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-soft border border-brand-green/20 rounded-full">
            <Award className="w-3.5 h-3.5 text-brand-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
              BRAND PHILOSOPHY
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#171A18] font-normal max-w-4xl leading-tight">
            House & Sky was built on architectural clarity and human trust.
          </h1>

          <p className="text-xs sm:text-base text-[#171A18]/70 font-light max-w-2xl leading-relaxed">
            We treat real estate not as mere commercial commodities, but as enduring architectural spaces designed to elevate everyday living.
          </p>
        </section>

        {/* Curation Philosophy Section */}
        <section className="bg-white rounded-3xl border border-brand-green/15 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-brand-green/15 shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&auto=format&fit=crop"
                alt="House & Sky Architectural Diligence"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B4F3C]">CURATION STANDARDS</span>
                <h2 className="font-serif text-3xl text-[#171A18]">Only 1 in 20 Residences Passes Our Vetting</h2>
              </div>

              <p className="text-xs sm:text-sm text-[#171A18]/80 font-light leading-relaxed">
                Our architectural diligence team evaluates every prospective listing against four mandatory criteria: micro-location stability, acoustic privacy, structural integrity, and clean legal title lineage.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#171A18] font-semibold">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0B4F3C] shrink-0 mt-0.5" />
                  <span>100% Legal Title Lineage & Title Clearance Certificates</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0B4F3C] shrink-0 mt-0.5" />
                  <span>Acoustic Isolation & Environmental Micro-Climate Audits</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0B4F3C] shrink-0 mt-0.5" />
                  <span>Architectural Heritage & Structural Load Vetting</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B4F3C]">MILESTONES</span>
            <h2 className="font-serif text-3xl text-[#171A18]">A Decade of Execution</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m) => (
              <div key={m.year} className="bg-white border border-brand-green/15 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all">
                <span className="font-mono text-3xl font-bold text-[#0B4F3C] block">{m.year}</span>
                <h4 className="font-serif text-xl text-[#171A18] font-normal">{m.title}</h4>
                <p className="text-xs text-[#171A18]/70 font-light leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section>
          <div className="bg-[#0B4F3C] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-[#0B4F3C]">
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">Experience Confidential Representation</h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-light leading-relaxed">
              Connect with our senior partners for private portfolio reviews, off-market viewing access, and land plot developments.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0B4F3C] font-bold text-xs uppercase tracking-widest hover:bg-brand-soft rounded-xl transition-all shadow-md cursor-pointer border border-white"
            >
              <span>Schedule Private Consultation</span>
              <ArrowUpRight className="w-4 h-4 text-[#0B4F3C]" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
