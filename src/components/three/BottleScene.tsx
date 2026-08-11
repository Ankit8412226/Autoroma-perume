'use client'

import '@/lib/react-polyfill'
import * as React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { BottleModel } from './BottleModel'
import { ParticleField } from './ParticleField'

export function BottleScene() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-radial from-bg-surface to-bg-primary p-8">
        <div className="relative aspect-[4/5] w-full max-w-xs border border-gold-300/30 p-6 flex flex-col items-center justify-center text-center">
          <span className="font-cormorant text-2xl text-gold-200 tracking-widest uppercase">
            Maison Noir
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white-400 mt-2">
            Automotive Fragrance Edition
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#F7EDD8" />
        <directionalLight position={[-5, -2, -2]} intensity={0.8} color="#4A6FA5" />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#C9A96E" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <BottleModel />
        </Float>

        <ParticleField />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  )
}
