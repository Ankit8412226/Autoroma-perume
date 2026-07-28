'use client'

import * as React from 'react'
import Link from 'next/link'
import { Car, ShieldCheck, Zap, Award } from 'lucide-react'

import Image from 'next/image'

interface HolographicCabinCardProps {
  iconName: 'car' | 'shield' | 'zap' | 'award'
  title: string
  subtitle: string
  desc: string
  href: string
  ctaText: string
  imageSrc?: string
}

export function HolographicCabinCard({
  iconName,
  title,
  subtitle,
  desc,
  href,
  ctaText,
  imageSrc,
}: HolographicCabinCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [transform, setTransform] = React.useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  const [glarePosition, setGlarePosition] = React.useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`)
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }))
  }

  const renderIcon = () => {
    switch (iconName) {
      case 'car':
        return <Car className="h-6 w-6" />
      case 'shield':
        return <ShieldCheck className="h-6 w-6" />
      case 'zap':
        return <Zap className="h-6 w-6" />
      case 'award':
        return <Award className="h-6 w-6" />
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className="relative bg-bg-surface border border-white-500/20 hover:border-white p-6 space-y-4 transition-transform duration-200 ease-out flex flex-col justify-between select-none shadow-2xl overflow-hidden group cursor-pointer rounded-sm"
    >
      {/* Holographic White Foil Glare Sweep */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, transparent 80%)`,
          opacity: glarePosition.opacity,
        }}
      />

      <div className="space-y-4 relative z-10">
        {imageSrc ? (
          <div className="relative aspect-[16/10] w-full bg-black/60 border border-white-500/15 overflow-hidden rounded-xs">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="300px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white transition-all">
            {renderIcon()}
          </div>
        )}

        <div className="space-y-1">
          <h3 className="font-cormorant text-2xl text-white-100 font-light group-hover:text-white transition-colors">
            {title}
          </h3>
          <span className="text-[10px] text-white-300 uppercase tracking-widest block font-inter font-semibold">
            {subtitle}
          </span>
        </div>

        <p className="text-xs text-white-400 font-light leading-relaxed font-inter">
          {desc}
        </p>
      </div>

      <Link
        href={href}
        className="text-xs text-white font-inter font-medium tracking-wider uppercase group-hover:underline pt-3 block border-t border-white-500/15 relative z-10"
      >
        {ctaText}
      </Link>
    </div>
  )
}
