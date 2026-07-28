'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Wind, ShieldCheck, Award } from 'lucide-react'

interface Hotspot {
  id: string
  title: string
  subtitle: string
  type: string
  top: string // percentage e.g. "35%"
  left: string // percentage e.g. "45%"
  description: string
  link: string
  icon: typeof Wind
}

export function CabinScentHotspots() {
  const [activeHotspot, setActiveHotspot] = React.useState<string>('h1')

  const hotspots: Hotspot[] = [
    {
      id: 'h1',
      title: 'Ocean Drive Vent Clip',
      subtitle: 'Attaches Securely to AC Louvers',
      type: 'VENT CLIP',
      top: '38%',
      left: '42%',
      description: 'Anodized matte metal casing. Diffuses marine aquatic & bergamot notes as AC runs.',
      link: '/products?type=VENT_CLIP',
      icon: Wind,
    },
    {
      id: 'h2',
      title: 'Tuscan Leather Gel Jar',
      subtitle: 'Cup Holder & Dashboard Mount',
      type: 'DASHBOARD GEL',
      top: '62%',
      left: '52%',
      description: 'Slow-evaporating solid gel jar. Releases rich Tuscan leather and saffron for 60 days.',
      link: '/products?type=DASHBOARD_GEL',
      icon: ShieldCheck,
    },
    {
      id: 'h3',
      title: 'Kyoto Cedar Glass Vial',
      subtitle: 'Rearview Mirror Suspension',
      type: 'HANGING VIAL',
      top: '20%',
      left: '50%',
      description: 'Porous beechwood cap absorbs and diffuses Japanese cedarwood into cabin air.',
      link: '/products?type=HANGING',
      icon: Award,
    },
    {
      id: 'h4',
      title: 'Royal Oud Interior Mist',
      subtitle: 'Spritz on Mats & Fabric Headliner',
      type: 'CABIN SPRAY',
      top: '75%',
      left: '30%',
      description: 'Concentrated 100ml spray. Instant Cambodian oud atmosphere without staining.',
      link: '/products?type=SPRAY',
      icon: Sparkles,
    },
  ]

  const active = hotspots.find((h) => h.id === activeHotspot) || hotspots[0]

  return (
    <div className="relative w-full h-full min-h-[420px] bg-bg-surface border border-gold-300/30 overflow-hidden flex flex-col justify-between p-6">
      {/* Background High-Res Luxury Cockpit Interior Photography */}
      <Image
        src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1400&auto=format&fit=crop&q=80"
        alt="Luxury Automobile Cockpit Interior"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover opacity-60"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />

      {/* Top Title Bar */}
      <div className="relative z-10 flex justify-between items-center border-b border-white-500/15 pb-3 font-inter text-xs">
        <span className="text-gold-300 uppercase tracking-widest font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Interactive Cabin Placement Map
        </span>
        <span className="text-[10px] text-white-400 uppercase tracking-widest hidden sm:inline">
          Click Pins to Explore Formulations
        </span>
      </div>

      {/* Interactive Pulsing Hotspot Pins on the Car Interior */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {hotspots.map((spot) => {
          const isSelected = spot.id === activeHotspot
          return (
            <button
              key={spot.id}
              onClick={() => setActiveHotspot(spot.id)}
              style={{ top: spot.top, left: spot.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none cursor-pointer"
              aria-label={spot.title}
            >
              {/* Outer Pulsing Ring */}
              <span className={`absolute -inset-2 rounded-full border border-gold-300 animate-ping opacity-75 ${isSelected ? 'scale-125 border-gold-200' : ''}`} />

              {/* Center Pin Button */}
              <span className={`relative h-6 w-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                isSelected
                  ? 'bg-gold-300 text-bg-primary border-white-100 shadow-[0_0_20px_rgba(201,169,110,0.8)] scale-110'
                  : 'bg-bg-primary/90 text-gold-300 border-gold-300/60 hover:scale-110'
              }`}>
                <spot.icon className="h-3 w-3" />
              </span>
            </button>
          )
        })}
      </div>

      {/* Bottom Floating Glass Card revealing selected hotspot details */}
      <div className="relative z-30 mt-auto pt-4">
        <div className="p-5 bg-bg-primary/90 backdrop-blur-md border border-gold-300/40 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest text-gold-300 bg-gold-300/10 px-2 py-0.5 border border-gold-300/30 font-inter font-bold">
                {active.type}
              </span>
              <span className="text-[10px] text-white-400 font-inter uppercase tracking-wider">
                {active.subtitle}
              </span>
            </div>
            <h4 className="font-cormorant text-2xl text-white-100 font-light">
              {active.title}
            </h4>
            <p className="text-xs text-white-300 font-light font-inter max-w-md">
              {active.description}
            </p>
          </div>

          <Link
            href={active.link}
            className="px-5 py-2.5 bg-gold-300 text-bg-primary font-inter text-xs uppercase tracking-widest font-semibold hover:bg-gold-200 transition-colors shrink-0 shadow-md"
          >
            Explore {active.type} →
          </Link>
        </div>
      </div>
    </div>
  )
}
