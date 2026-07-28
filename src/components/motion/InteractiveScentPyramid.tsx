'use client'

import * as React from 'react'
import Image from 'next/image'
import { Sparkles, Wind, Flame, Volume2 } from 'lucide-react'

// Pure Web Audio API Synthesizer for Perfume Spray Mist Sound
function playPerfumeMistSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const bufferSize = ctx.sampleRate * 0.25
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4))
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(2500, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
  } catch {
    // Ignore audio error
  }
}

export function InteractiveScentPyramid() {
  const [activeTier, setActiveTier] = React.useState<number>(0)

  const tiers = [
    {
      id: 0,
      stage: 'TOP NOTES (First 15 Minutes)',
      ingredients: 'Calabrian Bergamot, Pink Pepper & Sea Spray',
      desc: 'Bright, invigorating citrus opening upon starting your engine. Wakes up the senses during morning commutes.',
      image: '/images/scent-top-notes.png',
      alt: 'Fresh Bergamot Spray Mist inside Car Cabin',
      aura: 'from-amber-400/20 via-gold-300/10 to-transparent',
      icon: Sparkles,
    },
    {
      id: 1,
      stage: 'HEART NOTES (15 - 90 Minutes)',
      ingredients: 'Tuscan Leather, Smoked Cedar & Night Jasmine',
      desc: 'Rich, warm body that blends seamlessly with leather seats and cabin climate control warmth.',
      image: '/images/scent-heart-notes.png',
      alt: 'Tuscan Leather & Cedarwood Solid Fragrance Gel Jar',
      aura: 'from-gold-500/30 via-amber-600/15 to-transparent',
      icon: Wind,
    },
    {
      id: 2,
      stage: 'BASE NOTES (Long-Term Diffusion)',
      ingredients: 'Dark Ambergris, Madagascar Vanilla & Sandalwood',
      desc: 'Subtle, sophisticated sillage that lingers in your car cabin long after you park.',
      image: '/images/car-perfume-craft.png',
      alt: 'Dark Amber Wooden Cap Hanging Fragrance Bottle',
      aura: 'from-amber-800/30 via-gold-400/15 to-transparent',
      icon: Flame,
    },
  ]

  const handleSelectTier = (index: number) => {
    playPerfumeMistSound()
    setActiveTier(index)
  }

  const currentTier = tiers[activeTier]

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* On Mobile: Image Container rendered FIRST on top */}
      <div className="order-1 lg:order-2 lg:col-span-6 relative aspect-[4/3] w-full bg-bg-surface border border-gold-300/40 overflow-hidden group shadow-2xl">
        {tiers.map((tier, idx) => (
          <div
            key={tier.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              activeTier === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={tier.image}
              alt={tier.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        ))}

        {/* Dynamic Animated Aura Light Filter */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${currentTier.aura} transition-all duration-700 z-20 pointer-events-none`}
        />

        {/* Floating Mist Particle Burst */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 animate-bounce duration-500 z-20 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-gold-300 animate-ping" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold-100 animate-ping delay-150" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold-400 blur-[1px] animate-ping delay-300" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent flex flex-col justify-end p-6 sm:p-8 space-y-1 sm:space-y-2 z-30 pointer-events-none text-center lg:text-left">
          <span className="text-[9px] sm:text-[10px] text-gold-300 uppercase tracking-widest font-inter font-bold">
            Formulation Image: {currentTier.stage.split('(')[0]}
          </span>
          <h3 className="font-cormorant text-2xl sm:text-3xl text-white-100 font-light">
            {currentTier.ingredients}
          </h3>
        </div>
      </div>

      {/* On Mobile: Content & Interactive Accordion in middle */}
      <div className="order-2 lg:order-1 lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
        <div>
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Interactive Olfactory Architecture
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100 mt-1">
            The 3-Tier Scent Pyramid
          </h2>
          <p className="text-xs sm:text-body-md text-white-200 font-light leading-relaxed mt-2 font-inter max-w-lg">
            Tap any note line below to trigger audio spray & watch the visual formulation image change dynamically!
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4 font-inter text-xs pt-2 w-full text-left">
          {tiers.map((tier, idx) => {
            const isActive = activeTier === idx
            const IconComponent = tier.icon

            return (
              <div
                key={tier.id}
                onClick={() => handleSelectTier(idx)}
                className={`p-4 sm:p-6 border transition-all duration-500 cursor-pointer select-none relative overflow-hidden group ${
                  isActive
                    ? 'bg-bg-surface border-gold-300 shadow-[0_0_30px_rgba(201,169,110,0.25)] scale-[1.01]'
                    : 'bg-bg-surface/60 border-white-500/15 hover:border-gold-300/50'
                }`}
              >
                {/* Active Gold Line Indicator */}
                {isActive && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 sm:w-1.5 bg-gradient-to-b from-gold-200 via-gold-400 to-gold-300" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-gold-300 text-bg-primary font-bold'
                          : 'bg-gold-300/10 text-gold-300 border border-gold-300/30'
                      }`}
                    >
                      <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <span className="font-medium text-gold-300 text-[10px] sm:text-xs tracking-wider truncate">
                      {tier.stage}
                    </span>
                  </div>

                  <span className="text-[9px] sm:text-[10px] text-white-400 uppercase tracking-wider group-hover:text-gold-300 transition-colors flex items-center gap-1 shrink-0">
                    <Volume2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gold-300" />
                    <span>{isActive ? 'Active' : 'Tap Spray 💨'}</span>
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <strong className="text-white-100 text-xs sm:text-sm font-cormorant font-normal block leading-tight">
                    {tier.ingredients}
                  </strong>
                  {isActive && (
                    <p className="text-white-300 font-light leading-relaxed text-[11px] sm:text-xs animate-fadeIn pt-1">
                      {tier.desc}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
