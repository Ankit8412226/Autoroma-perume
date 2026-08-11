'use client'

import * as React from 'react'
import Image from 'next/image'
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react'

// Web Audio API & Speech Synthesis Engine for Romantic Voiceover & Soundscape
class RomanticVoiceEngine {
  private ctx: AudioContext | null = null
  private isPlaying = false
  private timer: NodeJS.Timeout | null = null
  private synthGain: GainNode | null = null

  start(onStateChange?: (playing: boolean) => void) {
    if (this.isPlaying) {
      this.stop(onStateChange)
      return
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.isPlaying = true

      // 1. Play Soft Romantic Ambient Chord Pad (Cmaj7 Warm Harmony)
      const frequencies = [261.63, 329.63, 392.00, 493.88] // C4, E4, G4, B4
      const masterGain = this.ctx.createGain()
      masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime)
      masterGain.connect(this.ctx.destination)
      this.synthGain = masterGain

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const lfo = this.ctx.createOscillator()
        const lfoGain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

        // Slow tremolo pulse
        lfo.frequency.setValueAtTime(0.3 + idx * 0.1, this.ctx.currentTime)
        lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime)

        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)

        osc.connect(masterGain)
        osc.start()
        lfo.start()
      })

      // 2. Romantic Speech Synthesis Voiceover Narration
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel() // Reset any previous speech
        const speech = new SpeechSynthesisUtterance(
          'Aura Véloce. Designed for moments shared together. Every drive becomes a romantic memory, wrapped in the timeless scent of luxury.'
        )
        speech.rate = 0.82 // Slow romantic speed
        speech.pitch = 0.95 // Deep warm tone
        speech.volume = 0.9

        // Select best available voice (English female/male luxury voice)
        const voices = window.speechSynthesis.getVoices()
        const luxuryVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Serena'))
        ) || voices.find((v) => v.lang.startsWith('en'))
        if (luxuryVoice) speech.voice = luxuryVoice

        speech.onend = () => {
          if (this.isPlaying) {
            // Loop narration after 4 seconds pause
            this.timer = setTimeout(() => {
              if (this.isPlaying && 'speechSynthesis' in window) {
                window.speechSynthesis.speak(speech)
              }
            }, 4000)
          }
        }

        window.speechSynthesis.speak(speech)
      }

      onStateChange?.(true)
    } catch {
      this.isPlaying = false
      onStateChange?.(false)
    }
  }

  stop(onStateChange?: (playing: boolean) => void) {
    this.isPlaying = false
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
    onStateChange?.(false)
  }

  getStatus() {
    return this.isPlaying
  }
}

const voiceEngine = new RomanticVoiceEngine()

import { GLSLHills } from '@/components/ui/glsl-hills'

export function RomanticPerfumeHeroVideo() {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false)

  const toggleAudio = () => {
    voiceEngine.start((playing) => setIsPlayingAudio(playing))
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none bg-black">
      {/* LAYER 1: Pure HD Crystal Clear Luxury Romantic Couple Image Background */}
      <div className="absolute inset-0 z-[1] opacity-100">
        <Image
          src="/images/aura-veloce-romantic-couple.png"
          alt="Aura Véloce Romantic Couple Car Perfume"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_top] sm:object-[center_center] brightness-105 contrast-105"
        />
      </div>

      {/* LAYER 2: 3D GLSL Wireframe Hills Terrain Shader Layer directly ON TOP of Image */}
      <div className="absolute inset-0 z-[2] w-full h-full opacity-75 mix-blend-screen pointer-events-none">
        <GLSLHills width="100%" height="100%" cameraZ={115} speed={0.4} />
      </div>

      {/* LAYER 3: Lightweight Edge Vignette for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-[3] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[3] pointer-events-none" />

      {/* Floating Romantic Audio Control & Voiceover Button */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-30">
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-xl border transition-all duration-500 shadow-2xl rounded-full cursor-pointer group active:scale-95 ${
            isPlayingAudio
              ? 'bg-amber-400/20 border-amber-300 text-amber-200 shadow-[0_0_25px_rgba(201,169,110,0.5)]'
              : 'bg-black/70 border-white/30 hover:border-white text-white hover:bg-black/90'
          }`}
          aria-label="Toggle Romantic Voiceover & Music"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="h-4 w-4 text-amber-300 animate-pulse" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-xs font-inter font-bold tracking-widest uppercase text-amber-200">
                  ROMANTIC VOICE ON
                </span>
                {/* Audio Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3 ml-1">
                  <span className="w-0.5 h-full bg-amber-300 animate-bounce" />
                  <span className="w-0.5 h-2/3 bg-amber-200 animate-bounce delay-100" />
                  <span className="w-0.5 h-4/5 bg-amber-400 animate-bounce delay-200" />
                </div>
              </div>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4 text-white-300 group-hover:text-amber-300 transition-colors" />
              <span className="text-[10px] sm:text-xs font-inter font-medium tracking-widest uppercase group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>TAP FOR ROMANTIC VOICEOVER 🎙️</span>
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
