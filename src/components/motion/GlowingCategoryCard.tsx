'use client'

import * as React from 'react'
import Link from 'next/link'
import { Wind, Sparkles, ShieldCheck, Award } from 'lucide-react'

interface GlowingCategoryCardProps {
  iconName: 'wind' | 'sparkles' | 'shield' | 'award'
  badge: string
  title: string
  desc: string
  href: string
  ctaText: string
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
      className="group relative bg-bg-surface border border-white-500/20 hover:border-gold-300 p-8 space-y-6 transition-all duration-500 shadow-xl overflow-hidden hover:shadow-[0_0_35px_rgba(201,169,110,0.25)] block select-none"
    >
      {/* Animated Glowing Ambient Pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-300/10 rounded-full blur-2xl group-hover:bg-gold-300/25 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

      <div className="h-14 w-14 rounded-full bg-gold-300/10 border border-gold-300/30 flex items-center justify-center text-gold-300 group-hover:scale-110 group-hover:bg-gold-300 group-hover:text-bg-primary transition-all duration-300">
        {renderIcon()}
      </div>

      <div className="space-y-2 relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-gold-300 font-inter font-bold block">
          {badge}
        </span>
        <h3 className="font-cormorant text-2xl text-white-100 font-light group-hover:text-gold-200 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-white-400 font-light leading-relaxed font-inter">
          {desc}
        </p>
      </div>

      <span className="text-xs font-inter text-gold-300 group-hover:underline block font-medium tracking-wider uppercase pt-2 border-t border-white-500/15">
        {ctaText}
      </span>
    </Link>
  )
}
