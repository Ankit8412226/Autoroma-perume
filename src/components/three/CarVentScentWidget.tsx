'use client'

import * as React from 'react'
import Image from 'next/image'
import { Wind, Sparkles, Flame, Gauge } from 'lucide-react'

export function CarVentScentWidget() {
  const [airflowSpeed, setAirflowSpeed] = React.useState<'low' | 'med' | 'turbo'>('med')

  const getParticleSpeed = () => {
    switch (airflowSpeed) {
      case 'low':
        return 'animate-pulse duration-1000 opacity-50'
      case 'med':
        return 'animate-pulse duration-500 opacity-85'
      case 'turbo':
        return 'animate-ping duration-300 opacity-100'
    }
  }

  return (
    <div className="relative w-full h-full min-h-[380px] bg-bg-surface border border-gold-300/30 overflow-hidden flex flex-col justify-between p-6 group">
      {/* Background High-Res AC Vent Photo */}
      <Image
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80"
        alt="Luxury Car Interior Vent Louver"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />

      {/* Top Header Label */}
      <div className="relative z-10 flex justify-between items-center border-b border-white-500/15 pb-3 font-inter text-xs">
        <div className="flex items-center gap-2 text-gold-300 uppercase tracking-widest font-medium">
          <Wind className="h-4 w-4" />
          <span>Active AC Airflow Diffusion</span>
        </div>
        <span className="text-[10px] text-white-400 uppercase tracking-widest">
          Turbine AC Louver Fit
        </span>
      </div>

      {/* Center Interactive Scent Particle Airflow Stream Overlay */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-4 py-8">
        <div className="relative flex items-center justify-center">
          {/* Pulsing Glowing Anodized Vent Clip Circle */}
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-gold-500 via-gold-300 to-gold-100 p-0.5 shadow-[0_0_40px_rgba(201,169,110,0.5)]">
            <div className="h-full w-full rounded-full bg-bg-primary flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[9px] font-inter uppercase tracking-widest text-gold-300 font-bold">
                MAISON NOIR
              </span>
              <span className="text-[7px] font-inter uppercase tracking-wider text-white-300">
                CLIP-ON
              </span>
            </div>
          </div>

          {/* Wafting Scent Waves Left & Right */}
          <div className={`absolute -right-24 flex items-center gap-1.5 ${getParticleSpeed()}`}>
            <Sparkles className="h-5 w-5 text-gold-300" />
            <span className="h-1 w-16 bg-gradient-to-r from-gold-300 to-transparent rounded-full" />
          </div>

          <div className={`absolute -left-24 flex items-center gap-1.5 ${getParticleSpeed()}`}>
            <span className="h-1 w-16 bg-gradient-to-l from-gold-300 to-transparent rounded-full" />
            <Sparkles className="h-5 w-5 text-gold-300" />
          </div>
        </div>

        <p className="text-xs text-white-200 font-light text-center max-w-xs font-inter pt-2">
          Airflow from climate control louvers passes through pure perfume oil matrix, releasing continuous sillage.
        </p>
      </div>

      {/* Bottom Interactive Controls */}
      <div className="relative z-10 pt-3 border-t border-white-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 font-inter text-[11px]">
        <div className="flex items-center gap-1 text-white-300">
          <Gauge className="h-3.5 w-3.5 text-gold-300" />
          <span>Simulate AC Speed:</span>
        </div>

        <div className="flex items-center gap-2">
          {(['low', 'med', 'turbo'] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => setAirflowSpeed(speed)}
              className={`px-3 py-1 uppercase tracking-wider font-medium border transition-all ${
                airflowSpeed === speed
                  ? 'bg-gold-300 text-bg-primary border-gold-300 font-semibold'
                  : 'bg-bg-surface text-white-300 border-white-500/20 hover:border-gold-300'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
