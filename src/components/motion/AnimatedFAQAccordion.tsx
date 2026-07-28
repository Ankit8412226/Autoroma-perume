'use client'

import * as React from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

// Pure Web Audio API Synthesizer for Accordion Click Sound
function playAccordionClickSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } catch {
    // Ignore audio error
  }
}

const faqs = [
  {
    q: 'How long does a Maison Noir vent clip last in Indian summer heat?',
    a: 'Our formulations are heat-tested up to 60°C. Under daily AC usage, each refill diffuser lasts between 35 to 45 days.',
  },
  {
    q: 'Will the interior spray mist stain leather or Alcantara seats?',
    a: 'No. Our fine atomizer sprays micro-droplets designed for floor mats, carpet under-seat areas, and fabric headliners without leaving oily residue.',
  },
  {
    q: 'What is the free shipping threshold across India?',
    a: 'We offer complimentary Express Courier shipping across India for all orders above ₹499. Orders below ₹499 have a nominal flat shipping fee of ₹60.',
  },
  {
    q: 'Do you offer custom B2B corporate branding for car dealerships?',
    a: 'Yes. We provide laser-engraved aluminum casings and custom branded foil gift boxes for automotive showrooms and fleet operators.',
  },
]

export function AnimatedFAQAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  const toggleIndex = (idx: number) => {
    playAccordionClickSound()
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <div className="space-y-4 font-inter text-xs">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx

        return (
          <div
            key={idx}
            onClick={() => toggleIndex(idx)}
            className={`border transition-all duration-300 cursor-pointer select-none relative overflow-hidden ${
              isOpen
                ? 'bg-bg-surface border-gold-300 shadow-[0_0_25px_rgba(201,169,110,0.2)]'
                : 'bg-bg-surface/70 border-white-500/20 hover:border-gold-300/50'
            }`}
          >
            {/* Active Gold Indicator Strip */}
            {isOpen && (
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-gold-200 to-gold-400" />
            )}

            <div className="p-6 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <HelpCircle className={`h-4 w-4 shrink-0 transition-colors ${isOpen ? 'text-gold-300' : 'text-white-400'}`} />
                <span className={`font-medium text-sm transition-colors ${isOpen ? 'text-gold-200 font-semibold' : 'text-white-100'}`}>
                  {faq.q}
                </span>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-gold-300 shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-gold-200' : ''
                }`}
              />
            </div>

            {isOpen && (
              <div className="px-6 pb-6 pt-0 text-white-300 font-light leading-relaxed border-t border-white-500/10 animate-fadeIn">
                <p className="pt-4">{faq.a}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
