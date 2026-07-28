'use client'

import dynamic from 'next/dynamic'

const LuxuryBottleCanvas = dynamic(
  () => import('./LuxuryBottleCanvas').then((mod) => mod.LuxuryBottleCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-bg-surface border border-gold-300/20 flex items-center justify-center">
        <span className="text-xs text-gold-300 uppercase tracking-widest animate-pulse font-inter">
          Loading 3D Atelier...
        </span>
      </div>
    ),
  }
)

export function HeroSceneWrapper() {
  return <LuxuryBottleCanvas />
}
