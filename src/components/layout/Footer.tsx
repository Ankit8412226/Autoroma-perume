'use client'

import * as React from 'react'
import Link from 'next/link'
import { AuraVeloceLogo } from './AuraVeloceLogo'
import { useToast } from '@/components/ui'
import {
  Sparkles,
  Car,
  Zap,
  PhoneCall,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Mail,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Compass,
} from 'lucide-react'

// Synthesize pleasant luxury audio chime for newsletter signup
function playSubscribeChime() {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.22) // C6

    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  } catch {
    // Ignore audio
  }
}

export function Footer() {
  const { toast } = useToast()

  // Interactive Newsletter Subscription State
  const [email, setEmail] = React.useState('')
  const [subscribed, setSubscribed] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState(false)

  // Interactive Scent Notes Explorer State
  const [activeScent, setActiveScent] = React.useState<'oud' | 'leather' | 'ocean' | 'cedar'>('oud')

  // Interactive Car Brand Fitment State
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null)

  // Mobile Accordion Open States
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    collections: false,
    fitment: false,
    services: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    playSubscribeChime()
    setSubscribed(true)
    toast('🎉 Welcome to Aura Véloce Atelier! Use code AURA10VIP for 10% off.', 'success')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('AURA10VIP')
    setCopiedCode(true)
    toast('Discount code AURA10VIP copied to clipboard!', 'success')
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const scentData = {
    oud: {
      name: 'Cambodian Oud Royal',
      family: 'Oriental Oud & Smoked Wood',
      top: 'Cambodian Oud, Calabrian Bergamot',
      heart: 'Smoked Amber, Guatemalan Cardamom',
      base: 'White Musk, Atlas Cedarwood',
      bestFor: 'Executive Sedans & Luxury SUVs',
      href: '/products?family=Oud',
    },
    leather: {
      name: 'Tuscan Leather Gel Jar',
      family: 'Leather & Smoked Cedar',
      top: 'Tuscan Saffron, Wild Leather',
      heart: 'Smoked Birch Tar, Thyme',
      base: 'Amber Resins, Rich Woods',
      bestFor: 'Nappa Leather & Sports Car Cabins',
      href: '/products?family=Leather',
    },
    ocean: {
      name: 'Ocean Drive Marine Vent',
      family: 'Fresh Oceanic Aquatic',
      top: 'Sea Spray, Calabrian Bergamot',
      heart: 'Oceanic Ozone, French Clary Sage',
      base: 'Oakmoss, Smoked Driftwood',
      bestFor: 'Daily Commutes & Hot Summer Drive',
      href: '/products?family=Aquatic',
    },
    cedar: {
      name: 'Kyoto Cedar Hanging Vial',
      family: 'Japanese Cedar & Cypress',
      top: 'Japanese Cedarwood, Hinoki',
      heart: 'Kyoto Cypress, Bourbon Vetiver',
      base: 'Golden Ambergris, Mysore Sandalwood',
      bestFor: 'Rearview Mirror Suspension',
      href: '/products?family=Woody',
    },
  }

  const carBrands = [
    { name: 'Porsche 911 / Macan', recommend: 'Cambodian Oud Royal Spray' },
    { name: 'BMW M-Series', recommend: 'Tuscan Leather Gel Jar' },
    { name: 'Mercedes-AMG', recommend: 'Ocean Drive Marine Vent' },
    { name: 'Audi RS / Quattro', recommend: 'Kyoto Cedar Hanging Vial' },
    { name: 'Range Rover / Defender', recommend: 'Cambodian Oud Royal' },
  ]

  const handleBrandSelect = (brandName: string, recommend: string) => {
    setSelectedBrand(brandName)
    toast(`Recommendation for ${brandName}: ${recommend}`, 'info')
  }

  return (
    <footer className="bg-bg-secondary border-t border-white-500/20 text-white-300 font-inter pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden">
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold-300/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP INTERACTIVE BAR: INTERACTIVE SCENT FAMILY EXPLORER */}
      <div className="max-w-7xl mx-auto mb-16 sm:mb-20 p-6 sm:p-10 lg:p-12 bg-gradient-to-r from-bg-surface via-neutral-900 to-bg-surface border border-gold-300/40 rounded-sm space-y-6 sm:space-y-8 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 border-b border-white-500/15 pb-6">
          <div className="space-y-1.5">
            <span className="text-[10px] sm:text-xs font-inter uppercase tracking-[0.25em] text-gold-300 font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-300 animate-spin" />
              INTERACTIVE OLFACTORY EXPLORER
            </span>
            <h3 className="font-cormorant text-2xl sm:text-4xl text-white-100 font-light">
              Explore Fragrance Notes Before You Drive
            </h3>
          </div>

          {/* Interactive Scent Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 lg:pt-0">
            {(['oud', 'leather', 'ocean', 'cedar'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveScent(key)}
                className={`px-4 py-2 text-xs font-inter uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  activeScent === key
                    ? 'bg-gradient-to-r from-gold-400 to-gold-300 text-bg-primary font-bold border-gold-300 shadow-lg scale-105'
                    : 'bg-bg-primary/80 text-white-300 border-white-500/20 hover:border-gold-300/50 hover:text-white'
                }`}
              >
                {key === 'oud' && '✨ Cambodian Oud'}
                {key === 'leather' && '🏎️ Tuscan Leather'}
                {key === 'ocean' && '🌊 Ocean Drive'}
                {key === 'cedar' && '🪵 Kyoto Cedar'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Active Scent Details Display Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-base sm:text-lg font-semibold text-white font-sans uppercase tracking-wider">
                {scentData[activeScent].name}
              </span>
              <span className="text-[10px] px-2.5 py-1 bg-gold-300/10 border border-gold-300/30 text-gold-300 font-inter uppercase tracking-widest font-medium">
                {scentData[activeScent].family}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-inter pt-1">
              <div className="p-3 bg-bg-primary border border-white-500/10 rounded-xs space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-gold-300 block font-semibold">
                  TOP NOTES
                </span>
                <span className="text-white-200 text-xs">{scentData[activeScent].top}</span>
              </div>
              <div className="p-3 bg-bg-primary border border-white-500/10 rounded-xs space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-gold-300 block font-semibold">
                  HEART NOTES
                </span>
                <span className="text-white-200 text-xs">{scentData[activeScent].heart}</span>
              </div>
              <div className="p-3 bg-bg-primary border border-white-500/10 rounded-xs space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-gold-300 block font-semibold">
                  BASE TRAIL
                </span>
                <span className="text-white-200 text-xs">{scentData[activeScent].base}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end space-y-3 border-t lg:border-t-0 lg:border-l border-white-500/15 pt-5 lg:pt-0 lg:pl-8">
            <span className="text-[11px] text-white-400 font-inter uppercase tracking-widest">
              Ideal Fitment: <strong className="text-white-200 block sm:inline mt-0.5 sm:mt-0">{scentData[activeScent].bestFor}</strong>
            </span>
            <Link href={scentData[activeScent].href} className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-black font-inter text-xs uppercase tracking-wider font-bold rounded-xs hover:bg-neutral-200 transition-all cursor-pointer shadow-xl w-full sm:w-auto">
                <span>View {scentData[activeScent].name}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER GRID COLUMNS WITH INCREASED SPACING */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-14 lg:gap-16 mb-16 sm:mb-20">
        {/* Brand Column */}
        <div className="space-y-6 sm:col-span-2 lg:col-span-1">
          <Link href="/">
            <AuraVeloceLogo variant="full" gold iconSize={36} />
          </Link>

          <p className="text-xs sm:text-sm text-white-300 font-light leading-relaxed max-w-sm pt-1">
            India&apos;s premier luxury automotive fragrance atelier. Formulated with heat-tested 60°C pure essential oils and anodized aluminum diffusers for BMW, Mercedes, Porsche, Audi, and Range Rover cabins.
          </p>

          {/* Social Links Bar */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] sm:text-xs font-inter uppercase tracking-widest text-gold-300 font-semibold block">
              Connect With Atelier
            </span>
            <div className="flex items-center gap-3.5 text-white-300">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-bg-surface border border-white-500/20 hover:border-gold-300 hover:text-white transition-all rounded-xs cursor-pointer shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-bg-surface border border-white-500/20 hover:border-gold-300 hover:text-white transition-all rounded-xs cursor-pointer shadow-md"
                aria-label="YouTube"
              >
                <Youtube className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-bg-surface border border-white-500/20 hover:border-gold-300 hover:text-white transition-all rounded-xs cursor-pointer shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-bg-surface border border-white-500/20 hover:border-gold-300 hover:text-white transition-all rounded-xs cursor-pointer shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links Column (Collapsible on Mobile) */}
        <div className="space-y-4 border-t sm:border-t-0 border-white-500/15 pt-4 sm:pt-0">
          <button
            onClick={() => toggleSection('collections')}
            className="w-full flex items-center justify-between sm:pointer-events-none text-left cursor-pointer"
          >
            <span className="text-label text-white uppercase tracking-widest block font-bold text-xs sm:text-sm">
              Collection Format
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gold-300 sm:hidden transition-transform duration-300 ${
                openSections.collections ? 'rotate-180' : ''
              }`}
            />
          </button>

          <ul
            className={`space-y-3 text-xs sm:text-sm text-white-300 font-light sm:block ${
              openSections.collections ? 'block' : 'hidden'
            }`}
          >
            <li>
              <Link href="/products?type=VENT_CLIP" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="text-gold-300">•</span>
                <span>Vent Clip Fresheners</span>
              </Link>
            </li>
            <li>
              <Link href="/products?type=SPRAY" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="text-gold-300">•</span>
                <span>Interior Spray Perfumes</span>
              </Link>
            </li>
            <li>
              <Link href="/products?type=DASHBOARD_GEL" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="text-gold-300">•</span>
                <span>Dashboard Gel Jars</span>
              </Link>
            </li>
            <li>
              <Link href="/products?type=HANGING" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="text-gold-300">•</span>
                <span>Hanging Glass Vials</span>
              </Link>
            </li>
            <li className="pt-1">
              <Link href="/products?type=DISCOVERY" className="hover:text-gold-300 transition-colors flex items-center gap-2 font-medium text-gold-300">
                <span>✨ Discovery Sample Set</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Vehicle Brand Fitment Interactive Column */}
        <div className="space-y-4 border-t sm:border-t-0 border-white-500/15 pt-4 sm:pt-0">
          <button
            onClick={() => toggleSection('fitment')}
            className="w-full flex items-center justify-between sm:pointer-events-none text-left cursor-pointer"
          >
            <span className="text-label text-white uppercase tracking-widest block font-bold text-xs sm:text-sm">
              Vehicle Fitment Selector
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gold-300 sm:hidden transition-transform duration-300 ${
                openSections.fitment ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`space-y-3 text-xs sm:block ${
              openSections.fitment ? 'block' : 'hidden'
            }`}
          >
            <p className="text-[11px] sm:text-xs text-white-400 font-light leading-relaxed">
              Click your vehicle marque to trigger instant scent recommendation:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {carBrands.map((b) => (
                <button
                  key={b.name}
                  onClick={() => handleBrandSelect(b.name, b.recommend)}
                  className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-inter uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                    selectedBrand === b.name
                      ? 'bg-gold-300 text-black font-bold border-gold-300 shadow-md scale-105'
                      : 'bg-bg-surface text-white-300 border-white-500/20 hover:border-gold-300 hover:text-white'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter & Interactive Discount Code Column */}
        <div className="space-y-5 sm:col-span-2 lg:col-span-1 border-t sm:border-t-0 border-white-500/15 pt-4 sm:pt-0">
          <span className="text-label text-white uppercase tracking-widest block font-bold text-xs sm:text-sm">
            Join Atelier Club
          </span>

          <p className="text-xs sm:text-sm text-white-400 leading-relaxed font-light">
            Receive exclusive invitations to new fragrance drops and 10% off your first drive.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-base text-xs py-3 px-3.5 bg-bg-surface flex-1 border sm:border-r-0 border-white-500/20 text-white placeholder:text-white-400 focus:outline-none rounded-sm sm:rounded-r-none"
              />
              <button
                type="submit"
                className="bg-white text-black text-xs uppercase tracking-wider py-3 px-6 hover:bg-neutral-200 transition-colors font-bold rounded-sm sm:rounded-l-none cursor-pointer shrink-0"
              >
                Join
              </button>
            </form>
          ) : (
            <div className="p-4 bg-gradient-to-r from-emerald-950/80 to-bg-surface border border-emerald-500/40 rounded-xs space-y-2.5 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Subscription Confirmed!</span>
              </div>
              <p className="text-xs text-white-300 font-light">
                Use your private 10% discount code at checkout:
              </p>
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-bg-primary border border-gold-300/40 text-gold-200 text-xs font-mono font-bold hover:bg-gold-300/10 transition-colors cursor-pointer"
              >
                <span>AURA10VIP</span>
                <span className="flex items-center gap-1.5 text-[10px] text-white uppercase font-sans">
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
                </span>
              </button>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3 text-xs text-white-400 font-light">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Zero Spam · Unsubscribe Anytime</span>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR WITH LIVE HOTLINE & ENCRYPTED BADGES */}
      <div className="max-w-7xl mx-auto pt-8 sm:pt-12 border-t border-white-500/15 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left text-xs text-white-400 font-light gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <span>© {new Date().getFullYear()} Aura Véloce Automotive Fragrances. All rights reserved.</span>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-inter uppercase tracking-widest rounded-full">
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-ping" />
            <span>LIVE CONCIERGE HOTLINE · MUMBAI, IST</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/shipping" className="hover:text-white transition-colors">
            Shipping Policy
          </Link>
          <Link href="/b2b" className="hover:text-white transition-colors text-gold-300 font-medium">
            B2B Wholesale Supply
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
