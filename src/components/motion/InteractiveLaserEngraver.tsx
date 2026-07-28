'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Building2, Zap, Sparkles } from 'lucide-react'

export function InteractiveLaserEngraver() {
  const [engravedText, setEngravedText] = React.useState('AUTOROMA')

  return (
    <div className="bg-gradient-to-r from-bg-secondary via-bg-surface to-bg-secondary border border-gold-300/40 p-4 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
      {/* On Mobile: Laser Engraver Image rendered FIRST on top */}
      <div className="order-1 lg:order-2 lg:col-span-5 relative aspect-[4/3] w-full bg-bg-surface border border-gold-300/40 overflow-hidden group shadow-2xl">
        <Image
          src="/images/car-perfume-engraving.png"
          alt="Laser Etching Gold Car Perfume Vent Clip"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Animated Laser Scanning Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 bg-emerald-300 rounded-full blur-md animate-ping pointer-events-none" />

        {/* Real-time Engraved Text Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center w-full px-2 sm:px-4">
          <span className="font-cormorant text-lg sm:text-2xl md:text-3xl text-gold-100 font-bold tracking-[0.2em] sm:tracking-[0.25em] drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] border-b-2 border-emerald-400/60 pb-0.5 sm:pb-1 inline-block bg-gradient-to-r from-gold-100 via-gold-300 to-gold-400 bg-clip-text text-transparent max-w-full truncate">
            {engravedText || 'YOUR LOGO'}
          </span>
          <span className="text-[7px] sm:text-[8px] font-inter uppercase tracking-widest text-emerald-300 block mt-1">
            • LIVE LASER ETCHING •
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 z-10 pointer-events-none text-center sm:text-left">
          <span className="text-[9px] text-gold-300 uppercase tracking-widest font-inter font-bold flex items-center justify-center sm:justify-start gap-1">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>Custom Laser Etched Casing</span>
          </span>
        </div>
      </div>

      {/* On Mobile: Text & Input in middle, Centered Button at bottom */}
      <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-gold-300 font-inter">
          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span>B2B, Dealership & Detailing Fleet Supply</span>
        </div>

        <h2 className="font-cormorant text-2xl sm:text-display-lg lg:text-display-xl text-white-100 font-light leading-tight">
          Elevate Customer Vehicle Delivery Experiences
        </h2>

        <p className="text-xs sm:text-body-md text-white-300 font-light max-w-2xl font-inter leading-relaxed">
          Type your brand or dealership name below to test real-time 3D laser engraving preview on anodized gold vent clips:
        </p>

        {/* Live Engraving Input */}
        <div className="space-y-2 max-w-md w-full pt-1 sm:pt-2 text-center lg:text-left">
          <label className="text-[9px] sm:text-[10px] text-gold-300 uppercase tracking-widest font-inter font-semibold flex items-center justify-center lg:justify-start gap-1.5">
            <Zap className="h-3.5 w-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span>Type Custom Logo Engraving Text:</span>
          </label>
          <input
            type="text"
            maxLength={18}
            value={engravedText}
            onChange={(e) => setEngravedText(e.target.value.toUpperCase())}
            className="w-full bg-bg-primary border border-gold-300/60 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-gold-200 font-cormorant tracking-widest uppercase focus:outline-none focus:border-emerald-400 shadow-inner text-center lg:text-left"
            placeholder="ENTER YOUR BRAND NAME"
          />
        </div>

        {/* Centered Button on Mobile */}
        <div className="pt-2 w-full sm:w-auto">
          <Link href="/b2b" className="w-full sm:w-auto block">
            <Button variant="primary" size="lg" className="font-inter text-xs uppercase tracking-widest w-full sm:w-auto justify-center">
              Request B2B Wholesale Pricing →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
