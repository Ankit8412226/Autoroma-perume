'use client'

import * as React from 'react'
import Image from 'next/image'
import { Sparkles, Flame, Droplets, Volume2 } from 'lucide-react'

// Pure Web Audio API Synthesizer for Distillation Bubble Sound
function playLabBubbleSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch {
    // Ignore audio error
  }
}

export function AtelierLabVisualizer() {
  const [activeColumn, setActiveColumn] = React.useState(0)

  const columns = [
    {
      id: 0,
      title: 'Column 01 — Cold-Pressed Citrus Oils',
      origin: 'Calabria, Southern Italy',
      temp: '4°C Extraction',
      desc: 'Extracted using zero-heat mechanical pressing to preserve delicate top-note terpenes that awaken cabin senses upon starting your engine.',
      color: 'from-amber-400/30 via-gold-300/10 to-transparent',
      borderColor: 'border-gold-300',
      icon: Droplets,
    },
    {
      id: 1,
      title: 'Column 02 — Aged Cambodian Oud & Amber',
      origin: 'Phnom Penh & Grasse',
      temp: '60°C Heat Tested',
      desc: 'Steam-distilled resinous heart notes calibrated specifically for warm Nappa leather seats and AC climate control circulation.',
      color: 'from-amber-600/30 via-gold-500/15 to-transparent',
      borderColor: 'border-amber-500',
      icon: Flame,
    },
    {
      id: 2,
      title: 'Column 03 — Beechwood Porous Diffusion',
      origin: 'Kyoto & Black Forest',
      temp: '45-Day Sillage',
      desc: 'Porous wood cap diffusers soaked in 100% pure alcohol-free essential oil concentrate for gradual 60-day evaporation.',
      color: 'from-amber-800/30 via-gold-400/15 to-transparent',
      borderColor: 'border-gold-400',
      icon: Sparkles,
    },
  ]

  const handleSelectColumn = (index: number) => {
    playLabBubbleSound()
    setActiveColumn(index)
  }

  const currentCol = columns[activeColumn]

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Left: Distillation Column Selector */}
      <div className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
        <div>
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Interactive Distillation Lab
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100 mt-1">
            Master Perfumery & Heat Calibration
          </h2>
          <p className="text-xs sm:text-body-md text-white-200 font-light leading-relaxed mt-2 font-inter max-w-lg">
            Click any distillation column below to trigger audio bubble extraction & view process specs:
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4 font-inter text-xs pt-2 w-full text-left">
          {columns.map((col, idx) => {
            const isActive = activeColumn === idx
            const IconComp = col.icon

            return (
              <div
                key={col.id}
                onClick={() => handleSelectColumn(idx)}
                className={`p-5 sm:p-6 border transition-all duration-500 cursor-pointer select-none relative overflow-hidden group ${
                  isActive
                    ? 'bg-bg-surface border-gold-300 shadow-[0_0_30px_rgba(201,169,110,0.25)] scale-[1.01]'
                    : 'bg-bg-surface/60 border-white-500/15 hover:border-gold-300/50'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-gold-200 via-gold-400 to-gold-300" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-gold-300 text-bg-primary font-bold'
                          : 'bg-gold-300/10 text-gold-300 border border-gold-300/30'
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gold-300 text-xs tracking-wider">
                      {col.title}
                    </span>
                  </div>

                  <span className="text-[9px] sm:text-[10px] text-white-400 uppercase tracking-widest group-hover:text-gold-300 transition-colors flex items-center gap-1 shrink-0">
                    <Volume2 className="h-3 w-3 text-gold-300" />
                    <span>{isActive ? 'Active Column' : 'Tap Lab 🧪'}</span>
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-gold-200 uppercase font-semibold">
                    <span>Origin: {col.origin}</span>
                    <span>{col.temp}</span>
                  </div>
                  {isActive && (
                    <p className="text-white-300 font-light leading-relaxed text-xs animate-fadeIn pt-1">
                      {col.desc}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Dynamic Lab Visual with Liquid Bubble Animation */}
      <div className="lg:col-span-6 relative aspect-[4/3] w-full bg-bg-surface border border-gold-300/40 overflow-hidden group shadow-2xl">
        <Image
          src="/images/car-perfume-craft.png"
          alt="Aura Véloce Perfumery Craftsmanship"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Dynamic Aura Gradient overlay matching selected column */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${currentCol.color} transition-all duration-700 z-10 pointer-events-none`}
        />

        {/* Animated Rising Distillation Particles */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 animate-bounce duration-700 z-20 pointer-events-none">
          <span className="h-2.5 w-2.5 rounded-full bg-gold-300 animate-ping" />
          <span className="h-2 w-2 rounded-full bg-gold-100 animate-ping delay-150" />
          <span className="h-3 w-3 rounded-full bg-gold-400 blur-[1px] animate-ping delay-300" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent flex flex-col justify-end p-6 sm:p-8 space-y-2 z-30 pointer-events-none text-center lg:text-left">
          <span className="text-[9px] sm:text-[10px] text-gold-300 uppercase tracking-widest font-inter font-bold">
            Active Extraction: {currentCol.origin}
          </span>
          <h3 className="font-cormorant text-2xl sm:text-3xl text-white-100 font-light">
            {currentCol.title}
          </h3>
        </div>
      </div>
    </div>
  )
}
