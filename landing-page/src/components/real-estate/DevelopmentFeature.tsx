import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function DevelopmentFeature() {
  return (
    <div className="relative bg-white border border-brand-green/15 rounded-lg overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Image */}
        <div className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85&auto=format&fit=crop"
            alt="The Horizon Reserve Development"
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-brand-green text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded">
              Flagship New Development
            </span>
          </div>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-green block">
              THE NEW STANDARD OF CITY LIVING
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal leading-tight">
              The Horizon Reserve — Worli Sea Face
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light leading-relaxed">
              A private enclave of 18 limited-edition triplex sky mansions with private infinity decks and dedicated concierge lobbies.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-green/10 text-xs font-mono text-brand-charcoal/80">
            <div>
              <span className="block text-[10px] text-brand-charcoal/60 uppercase">STARTING FROM</span>
              <span className="text-sm font-bold text-brand-charcoal font-sans">₹38.00 Cr</span>
            </div>
            <div>
              <span className="block text-[10px] text-brand-charcoal/60 uppercase">POSSESSION</span>
              <span className="text-sm font-bold text-brand-charcoal font-sans">Q4 2027</span>
            </div>
          </div>

          <Link
            href="/properties/the-solitaire-sky-villa-bandra"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-green text-white font-bold text-xs uppercase tracking-[0.18em] rounded-md hover:bg-brand-dark transition-all shadow-md"
          >
            <span className="text-white">Explore Development</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </div>
  )
}
