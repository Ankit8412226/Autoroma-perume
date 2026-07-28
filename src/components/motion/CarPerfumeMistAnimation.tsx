'use client'

import * as React from 'react'

export function CarPerfumeMistAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Animated Floating Mist Stream 1 */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-40 bg-gradient-to-t from-gold-300/30 via-gold-100/10 to-transparent blur-xl animate-pulse duration-1000" />
      
      {/* Animated Rising Scent Particles */}
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 animate-bounce duration-700">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-300 animate-ping" />
        <span className="h-1 w-1 rounded-full bg-gold-100 animate-ping delay-200" />
        <span className="h-2 w-2 rounded-full bg-gold-400/80 blur-[1px] animate-ping delay-500" />
      </div>

      {/* Gentle Gold Sheen Sweep */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-300/15 to-transparent -translate-x-full animate-shimmer" />
    </div>
  )
}
