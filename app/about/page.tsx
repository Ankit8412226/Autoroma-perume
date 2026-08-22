import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'About the Atelier — Heritage & Architectural Real Estate Philosophy',
  description: 'Learn about Aura Véloce Estates — India’s premier luxury real estate atelier serving private wealth, family offices, and architectural connoisseurs.',
}

export default function AboutPage() {
  const milestones = [
    { year: '2014', title: 'Atelier Establishment', desc: 'Founded in South Mumbai to address off-market demand for architecturally significant properties.' },
    { year: '2018', title: 'National Expansion', desc: 'Extended private advisory desks to Goa, Delhi NCR, Bangalore, and Hyderabad.' },
    { year: '2022', title: '₹3,000 Cr Milestone', desc: 'Crossed over ₹3,000 Cr in cumulative luxury residential transaction volume.' },
    { year: '2026', title: 'Digital Architectural Engine', desc: 'Pioneered custom precision precinct maps and digital off-market client vaults.' },
  ]

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero Header */}
      <section className="relative pt-12 pb-16 border-b border-white/15 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20">
            <span className="w-2 h-2 bg-gold-300 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-300">
              OUR BRAND HERITAGE
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal max-w-4xl leading-tight">
            An Architectural Atelier Built on Discretion and Structural Integrity.
          </h1>

          <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
            Aura Véloce was established with a singular vision: to treat luxury real estate not as commercial commodities, but as enduring architectural works of art.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] w-full border border-white/20 overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&auto=format&fit=crop"
              alt="Aura Véloce Heritage"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              eyebrow="CURATION STANDARDS"
              title="Only 1 in 20 Residences Passes Our Atelier Vetting"
            />

            <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              Our architectural diligence team evaluates every prospective listing against four mandatory criteria: micro-location stability, acoustic privacy, structural integrity, and clean legal title lineage.
            </p>

            <div className="space-y-3 pt-2 text-xs text-white/90 font-medium">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-300 shrink-0 mt-0.5" />
                <span>100% Legal Title Lineage & Title Clearance Certificates</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-300 shrink-0 mt-0.5" />
                <span>Acoustic Isolation & Environmental Micro-Climate Audits</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-300 shrink-0 mt-0.5" />
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
          title="A Decade of Ultra-Prime Execution"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="bg-bg-surface border border-white/15 p-6 space-y-3 shadow-lg">
              <span className="font-mono text-3xl font-bold text-gold-300 block">{m.year}</span>
              <h4 className="font-serif text-xl text-white font-normal">{m.title}</h4>
              <p className="text-xs text-white/80 font-light leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bg-surface border border-white/20 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">Experience Confidential Advisory</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto font-light">
            Connect with our lead partners for private portfolio reviews and off-market viewing access.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-300 text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl border border-gold-300 cursor-pointer"
          >
            <span>Schedule Private Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-black" />
          </Link>
        </div>
      </section>
    </div>
  )
}
