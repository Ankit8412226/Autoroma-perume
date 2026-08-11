'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Input, Textarea, Button, useToast } from '@/components/ui'

const HeroFuturisticDemo = dynamic(
  () => import('./hero-futuristic-demo').then((mod) => mod.HeroFuturisticDemo),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] sm:h-[550px] lg:h-[620px] w-full bg-black flex items-center justify-center text-white-300 font-inter text-sm rounded-sm border border-white-500/20">
        Loading 3D Atelier Experience...
      </div>
    ),
  }
)

export function HeroFuturisticSection() {
  const { toast } = useToast()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [vehicle, setVehicle] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      toast('Thank you for contacting Aura Véloce Atelier. Our fragrance concierge will respond within 24 hours.', 'success')
      setName('')
      setEmail('')
      setVehicle('')
      setMessage('')
    }, 1000)
  }

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-8 my-8">
      {/* Header Eyebrow */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-inter uppercase tracking-[0.3em] text-white-300 font-semibold block">
          ATELIER & BESPOKE SCENTING
        </span>
        <h2 className="font-sans text-3xl sm:text-5xl font-light text-white tracking-tight">
          Private Fragrance Consultation
        </h2>
        <p className="text-xs sm:text-sm text-white-300 font-inter font-light">
          Engineered for luxury car collectors, dealership fleets, and bespoke gift commissions.
        </p>
      </div>

      {/* Side by Side Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Interactive 3D Canvas */}
        <div className="lg:col-span-7 min-h-[450px] sm:min-h-[550px] lg:min-h-[620px] flex">
          <HeroFuturisticDemo />
        </div>

        {/* Right Column: Luxury Contact Form */}
        <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900/90 to-black border border-white-500/20 p-6 sm:p-8 rounded-sm space-y-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-2">
            <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-white-300 font-semibold block">
              AURA VÉLOCE CONCIERGE
            </span>
            <h3 className="font-sans text-2xl font-bold text-white uppercase tracking-wider">
              Inquire With Our Master Perfumer
            </h3>
            <p className="text-xs text-white-300 font-inter font-light leading-relaxed">
              Submit your vehicle specifications or custom bulk fragrance inquiry below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center pt-2">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Arjun Mehta"
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="driver@auraveloce.com"
            />

            <Input
              label="Vehicle Model / Fleet"
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="Porsche 911 / BMW M5"
            />

            <Textarea
              label="Custom Requirements / Notes"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              placeholder="Specify preferred scent families (Oud, Leather, Fresh Aquatic) or laser-engraving text..."
            />

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              className="w-full py-3.5 px-4 font-inter text-xs font-bold uppercase tracking-wider rounded-sm transition-all hover:bg-neutral-200 cursor-pointer border border-white disabled:opacity-50 mt-2"
            >
              {loading ? 'SUBMITTING INQUIRY...' : 'SUBMIT INQUIRY'}
            </button>
          </form>

          <div className="pt-4 border-t border-white-500/15 flex items-center justify-between text-[10px] font-inter text-white-400 uppercase tracking-wider">
            <span>🔒 256-BIT ENCRYPTED</span>
            <span>⚡ 24-HOUR RESPONSE</span>
          </div>
        </div>
      </div>
    </section>
  )
}
