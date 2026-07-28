'use client'

import * as React from 'react'
import Link from 'next/link'
import { Car, ShieldCheck, Zap, Award } from 'lucide-react'

interface HolographicCabinCardProps {
  iconName: 'car' | 'shield' | 'zap' | 'award'
  title: string
  subtitle: string
  desc: string
  href: string
  ctaText: string
}

export function HolographicCabinCard({
  iconName,
  title,
  subtitle,
  desc,
  href,
  ctaText,
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
      className="relative bg-bg-surface border border-gold-300/40 p-8 space-y-4 transition-transform duration-200 ease-out flex flex-col justify-between select-none shadow-2xl overflow-hidden group cursor-pointer"
    >
      {/* Holographic Gold Foil Glare Sweep */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(247,237,216,0.3) 0%, rgba(201,169,110,0.1) 40%, transparent 80%)`,
          opacity: glarePosition.opacity,
        }}
      />

      <div className="space-y-4 relative z-10">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-gold-400/20 to-gold-200/10 border border-gold-300/40 flex items-center justify-center text-gold-300 group-hover:scale-110 group-hover:border-gold-300 transition-all">
          {renderIcon()}
        </div>

        <div className="space-y-1">
          <h3 className="font-cormorant text-2xl text-white-100 font-light group-hover:text-gold-200 transition-colors">
            {title}
          </h3>
          <span className="text-[10px] text-gold-300 uppercase tracking-widest block font-inter font-semibold">
            {subtitle}
          </span>
        </div>

        <p className="text-xs text-white-400 font-light leading-relaxed font-inter">
          {desc}
        </p>
      </div>

      <Link
        href={href}
        className="text-xs text-gold-300 font-inter font-medium tracking-wider uppercase group-hover:underline pt-4 block border-t border-white-500/15 relative z-10"
      >
        {ctaText}
      </Link>
    </div>
  )
}
