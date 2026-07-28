'use client'

import * as React from 'react'
import Image from 'next/image'
import { Sparkles, PhoneCall, Zap, Volume2, MessageSquare } from 'lucide-react'

// Pure Web Audio API Synthesizer for GenZ Cyber Call Chime
function playGenZConnectChime() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5 note
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15) // C6 note

    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.18)
  } catch {
    // Ignore audio error
  }
}

export function GenZLetsConnectVideo() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [activeCall, setActiveCall] = React.useState(false)

  // 60fps Equalizer Waveform Canvas Animation (Video-like Motion Loop)
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let phase = 0

    const render = () => {
      animId = requestAnimationFrame(render)
      phase += 0.05

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barCount = 32
      const barWidth = canvas.width / barCount

      for (let i = 0; i < barCount; i++) {
        const height = Math.sin(phase + i * 0.3) * 28 + Math.cos(phase * 1.5 + i * 0.2) * 20 + 35

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
        gradient.addColorStop(0, '#c9a96e')
        gradient.addColorStop(0.5, '#34d399')
        gradient.addColorStop(1, '#f7edd8')

        ctx.fillStyle = gradient
        ctx.fillRect(i * barWidth + 2, canvas.height - height, barWidth - 4, height)
      }
    }

    render()

    return () => cancelAnimationFrame(animId)
  }, [])

  const handleCallClick = () => {
    playGenZConnectChime()
    setActiveCall(true)
    setTimeout(() => setActiveCall(false), 2000)
  }

  return (
    <div className="relative min-h-[380px] sm:min-h-0 sm:aspect-[21/9] w-full bg-bg-surface border border-gold-300/50 overflow-hidden group shadow-2xl rounded-sm select-none">
      {/* Background Image Base */}
      <Image
        src="/images/contact-concierge.png"
        alt="Autoroma GenZ Cyber Concierge Video Loop"
        fill
        sizes="100vw"
        priority
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Dark Cyber Ambient Gradient Filter */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/95 via-bg-primary/75 to-bg-primary/40 z-10 pointer-events-none" />

      {/* 60fps Equalizer Waveform Video Overlay */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 w-32 sm:w-64 h-12 sm:h-20 z-20 pointer-events-none opacity-80">
        <canvas ref={canvasRef} width={256} height={80} className="w-full h-full" />
      </div>

      {/* Dynamic Animated Call Hotline Card */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center p-5 sm:p-12 space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gold-300/10 border border-gold-300/40 text-gold-300 text-[9px] sm:text-xs font-inter uppercase tracking-[0.2em] sm:tracking-[0.25em] w-fit">
          <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">INSTANT GEN-Z CONCIERGE HOTLINE · 24/7 LIVE</span>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <h2 className="font-cormorant text-2xl sm:text-5xl text-white-100 font-light tracking-wide">
            Let&apos;s Get Connected ⚡
          </h2>
          <p className="text-[11px] sm:text-sm text-white-300 font-inter font-light max-w-md leading-relaxed">
            Tap below to trigger direct 1-on-1 WhatsApp / Concierge Hotline signal for your vehicle cabin fragrance.
          </p>
        </div>

        {/* Interactive Call Button */}
        <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <button
            onClick={handleCallClick}
            className={`flex items-center justify-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 font-inter text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all shadow-xl active:scale-95 cursor-pointer w-full sm:w-auto ${
              activeCall
                ? 'bg-emerald-400 text-bg-primary scale-105'
                : 'bg-gradient-to-r from-gold-400 to-gold-300 text-bg-primary hover:brightness-110'
            }`}
          >
            <PhoneCall className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${activeCall ? 'animate-bounce' : 'animate-pulse'}`} />
            <span>{activeCall ? 'CONNECTING HOTLINE...' : 'TAP TO CONNECT NOW 📲'}</span>
          </button>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center sm:justify-start gap-2 text-xs font-inter text-emerald-400 hover:underline uppercase tracking-wider font-medium"
          >
            <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Chat on WhatsApp →</span>
          </a>
        </div>
      </div>

      {/* Floating Glowing Neon Particle Beam */}
      <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 hidden xs:flex items-center gap-2 z-20 text-[9px] sm:text-[10px] text-gold-300 uppercase tracking-widest font-inter font-medium pointer-events-none">
        <Sparkles className="h-3 w-3 text-emerald-400 animate-spin" />
        <span>LIVE SIGNAL 60FPS</span>
      </div>
    </div>
  )
}
