import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Brand Story — House & Sky Architectural Real Estate',
  description: 'Learn about House & Sky — India’s premier real estate platform connecting architectural homes and open skies.',
}

export default function AboutPage() {
  const milestones = [
    { year: '2014', title: 'Founded', desc: 'Established to connect buyers with architecturally significant properties.' },
    { year: '2018', title: 'Expansion', desc: 'Extended advisory desks to Goa, Delhi NCR, Bangalore, and Hyderabad.' },
    { year: '2022', title: '₹3,000 Cr Milestone', desc: 'Surpassed ₹3,000 Cr in residential property transaction volume.' },
    { year: '2026', title: 'Neighbourhood Engine', desc: 'Pioneered digital precinct maps and confidential client vaults.' },
  ]

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 bg-bg-primary">
      {/* Hero Header */}
      <section className="relative pt-12 pb-16 border-b border-brand-green/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-soft border border-brand-green/20 rounded-md">
            <span className="w-2 h-2 bg-brand-green rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
              BRAND PHILOSOPHY
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal font-normal max-w-4xl leading-tight">
            House & Sky was built on architectural clarity and human trust.
          </h1>

          <p className="text-sm sm:text-base text-brand-charcoal/70 font-light max-w-2xl leading-relaxed">
            We treat luxury real estate not as commercial commodities, but as enduring architectural spaces designed to elevate everyday living.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <SectionHeading
              eyebrow="CURATION STANDARDS"
              title="Only 1 in 20 Residences Passes Our Vetting"
            />

            <p className="text-xs sm:text-sm text-brand-charcoal/80 font-light leading-relaxed">
              Our architectural diligence team evaluates every prospective listing against four mandatory criteria: micro-location stability, acoustic privacy, structural integrity, and clean legal title lineage.
            </p>

            <div className="space-y-3 pt-2 text-xs text-brand-charcoal font-medium">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <span>100% Legal Title Lineage & Title Clearance Certificates</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <span>Acoustic Isolation & Environmental Micro-Climate Audits</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <span>Architectural Heritage & Structural Load Vetting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="MILESTONES"
          title="A Decade of Execution"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="bg-white border border-brand-green/15 p-6 rounded-lg space-y-3 shadow-sm">
              <span className="font-mono text-3xl font-bold text-brand-green block">{m.year}</span>
              <h4 className="font-serif text-xl text-brand-charcoal font-normal">{m.title}</h4>
              <p className="text-xs text-brand-charcoal/70 font-light leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark text-white rounded-lg p-8 sm:p-12 text-center space-y-6 shadow-xl border border-brand-green/20">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">Experience Confidential Representation</h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-light">
            Connect with our team for private portfolio reviews and off-market viewing access.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-brand-dark rounded-md transition-all shadow-md cursor-pointer"
          >
            <span>Schedule Private Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </section>
    </div>
  )
}
