'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Wind, Sparkles, ShieldCheck, Award } from 'lucide-react'

interface GlowingCategoryCardProps {
  iconName: 'wind' | 'sparkles' | 'shield' | 'award'
  badge: string
  title: string
  desc: string
  href: string
  ctaText: string
  imageSrc?: string
}

// Audio Airflow Sound Synthesizer
function playACAirflowSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const bufferSize = ctx.sampleRate * 0.18
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5))
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.17)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
  } catch {
    // Ignore audio error
  }
}

export function GlowingCategoryCard({
  iconName,
  badge,
  title,
  desc,
  href,
  ctaText,
  imageSrc,
}: GlowingCategoryCardProps) {
  const handleClick = () => {
    playACAirflowSound()
  }

  const renderIcon = () => {
    switch (iconName) {
      case 'wind':
        return <Wind className="h-7 w-7" />
      case 'sparkles':
        return <Sparkles className="h-7 w-7" />
      case 'shield':
        return <ShieldCheck className="h-7 w-7" />
      case 'award':
        return <Award className="h-7 w-7" />
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group relative bg-bg-surface border border-white-500/20 hover:border-white p-6 space-y-5 transition-all duration-500 shadow-xl overflow-hidden hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] block select-none rounded-sm"
    >
      {/* Animated Glowing Ambient Pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/15 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

      {imageSrc ? (
        <div className="relative aspect-square w-full bg-black/60 border border-white-500/15 overflow-hidden rounded-xs">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="300px"
            className="object-cover group-hover:scale-108 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-14 w-14 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300 font-bold">
          {renderIcon()}
        </div>
      )}

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-white-300 font-inter font-bold block">
          {badge}
        </span>
        <h3 className="font-cormorant text-2xl text-white-100 font-light group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-xs text-white-400 font-light leading-relaxed font-inter">
          {desc}
        </p>
      </div>

      <span className="text-xs font-inter text-white group-hover:underline block font-medium tracking-wider uppercase pt-2 border-t border-white-500/15">
        {ctaText}
      </span>
    </Link>
  )
}
