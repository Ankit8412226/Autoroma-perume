'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const GLSLHills = dynamic(() => import('@/components/ui/glsl-hills'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[320px] bg-black/60 backdrop-blur-md rounded-sm border border-white-500/20 flex items-center justify-center text-xs text-white-400 font-inter">
      Loading 3D Shader...
    </div>
  ),
})

export function GLSLHillsHeroCard() {
  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-sm border border-white-500/30 bg-black/60 backdrop-blur-md overflow-hidden shadow-2xl group hover:border-white/60 transition-all duration-500 flex flex-col justify-between p-6">
      {/* 3D GLSL Terrain Canvas */}
      <div className="absolute inset-0 z-10 opacity-90">
        <GLSLHills width="100%" height="100%" cameraZ={120} speed={0.4} />
      </div>

      {/* Floating Card Header Overlay */}
      <div className="relative z-20 space-y-1">
        <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-white-300 font-semibold block">
          AURA VÉLOCE ATELIER
        </span>
        <h3 className="font-sans text-lg sm:text-xl font-bold text-white uppercase tracking-wider drop-shadow">
          DESIGNS THAT SPEAK LOUDER
        </h3>
        <p className="text-[11px] text-white-300 font-inter font-light max-w-xs leading-relaxed">
          Crafting stunning visuals & luxury automotive fragrance experiences.
        </p>
      </div>

      {/* Floating Card Footer Overlay */}
      <div className="relative z-20 pt-3 border-t border-white/20 flex items-center justify-between text-[10px] font-inter text-white-300 uppercase tracking-widest">
        <span>✨ 3D GLSL TERRAIN</span>
        <span className="text-white font-semibold">ATMOSPHERIC SHADER</span>
      </div>
    </div>
  )
}
