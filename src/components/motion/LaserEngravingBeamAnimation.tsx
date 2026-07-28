'use client'

import * as React from 'react'

export function LaserEngravingBeamAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Horizontal Laser Scanning Line */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-pulse" />

      {/* Laser Spark Point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-emerald-300 rounded-full blur-sm animate-ping" />

      {/* Glowing Shimmer Scan */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-pulse" />
    </div>
  )
}
