'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, Wind, ShieldCheck, Flame, ArrowRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HorizontalScentScroll() {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      // Calculate total horizontal scroll width
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 96)

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scentStages = [
    {
      step: 'STAGE 01',
      title: 'Top Notes — Bright Opening',
      duration: 'First 15 Minutes of Driving',
      family: 'Fresh Citrus & Pink Pepper',
      notes: ['Calabrian Bergamot', 'Grapefruit Zest', 'Pink Pepper'],
      desc: 'Invigorating citrus burst upon starting your engine. Wakes up the senses during morning commutes.',
      icon: Sparkles,
      color: 'from-amber-500/20 to-gold-300/10',
    },
    {
      step: 'STAGE 02',
      title: 'Heart Notes — Warm Cabin Body',
      duration: '15 to 90 Minutes of Drive',
      family: 'Tuscan Leather & Cedarwood',
      notes: ['Full-Grain Leather', 'Smoked Cedar', 'Night Jasmin'],
      desc: 'Rich, opulent accord that harmonizes with Nappa leather seats and cabin climate control warmth.',
      icon: Wind,
      color: 'from-gold-400/20 to-amber-700/10',
    },
    {
      step: 'STAGE 03',
      title: 'Base Notes — Lingering Sillage',
      duration: 'Long-Term Evaporation (60 Days)',
      family: 'Dark Amber & Madagascar Vanilla',
      notes: ['Dark Ambergris', 'Vanilla Pod', 'Sandalwood'],
      desc: 'Grounding, sophisticated luxury aroma that stays in your car cabin long after you park.',
      icon: Flame,
      color: 'from-amber-600/20 to-gold-500/10',
    },
  ]

  return (
    <div ref={sectionRef} className="relative bg-bg-secondary py-20 border-y border-gold-300/20 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Header Info */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto w-full mb-8">
        <div className="flex items-center gap-3 text-gold-300 text-xs font-inter uppercase tracking-widest font-medium">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>GSAP Pinning Horizontal Scroll Experience</span>
        </div>
        <h2 className="font-cormorant text-4xl sm:text-6xl text-white-100 font-light mt-2">
          The 3-Tier Olfactory Journey
        </h2>
        <p className="text-xs text-white-300 font-inter font-light mt-1">
          Scroll down to watch fragrance notes evolve across your driving journey →
        </p>
      </div>

      {/* Horizontal Track Container */}
      <div ref={trackRef} className="flex gap-8 px-6 md:px-12 w-max items-center">
        {scentStages.map((stage, idx) => (
          <div
            key={idx}
            className={`w-[85vw] sm:w-[480px] h-[460px] bg-gradient-to-b ${stage.color} bg-bg-surface border border-gold-300/40 p-8 flex flex-col justify-between shrink-0 shadow-2xl relative group hover:border-gold-300 transition-colors`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white-500/15 pb-4">
                <span className="text-xs font-inter uppercase tracking-widest text-gold-300 font-bold">
                  {stage.step}
                </span>
                <span className="text-[10px] font-inter uppercase tracking-wider text-white-400">
                  {stage.duration}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gold-200 font-inter block">
                  {stage.family}
                </span>
                <h3 className="font-cormorant text-3xl text-white-100 font-light">
                  {stage.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {stage.notes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 bg-bg-primary/80 border border-gold-300/30 text-gold-200 text-xs font-inter font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>

              <p className="text-xs text-white-300 font-inter font-light leading-relaxed pt-2">
                {stage.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-white-500/15 flex justify-between items-center">
              <Link
                href="/products"
                className="text-xs font-inter text-gold-300 uppercase tracking-widest flex items-center gap-2 group-hover:underline"
              >
                <span>Shop Formulation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <stage.icon className="h-6 w-6 text-gold-300/60" />
            </div>
          </div>
        ))}

        {/* Final Feature Card: Anodized Gold Car Vent Perfume Visual */}
        <div className="w-[85vw] sm:w-[520px] h-[460px] relative bg-bg-surface border border-gold-300/40 overflow-hidden shrink-0 group">
          <Image
            src="/images/car-vent-perfume-clip.png"
            alt="Anodized Gold Car Vent Clip Diffuser"
            fill
            sizes="520px"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent flex flex-col justify-end p-8 space-y-3 z-10">
            <span className="text-[10px] text-gold-300 uppercase tracking-widest font-inter font-bold">
              Continuous AC Airflow Matrix
            </span>
            <h3 className="font-cormorant text-3xl text-white-100 font-light">
              Anodized Gold Vent Diffuser
            </h3>
            <p className="text-xs text-white-300 font-inter font-light max-w-sm">
              Heat-tested up to 60°C. Diffusion rates adjust automatically with cabin climate control speed.
            </p>
            <div>
              <Link
                href="/products?type=VENT_CLIP"
                className="inline-block px-6 py-2.5 bg-gold-300 text-bg-primary font-inter text-xs uppercase tracking-widest font-semibold hover:bg-gold-200 transition-colors shadow-lg"
              >
                Explore Vent Clips →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
