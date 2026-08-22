'use client'

import * as React from 'react'
import Link from 'next/link'
import { AuraVeloceLogo } from './AuraVeloceLogo'
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = React.useState('')
  const [subscribed, setSubscribed] = React.useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <footer className="bg-bg-secondary text-white border-t border-white/15 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Highlight Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-white/15 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-300 font-bold block">
              Private Real Estate Intelligence
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
              Receive off-market listings & ultra-prime market insights.
            </h3>
            <p className="text-xs text-white/80 max-w-md font-light leading-relaxed">
              Curated architectural digests delivered monthly to private wealth clients and family offices.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your confidential email address"
                  required
                  className="w-full bg-bg-surface border border-white/30 text-white placeholder-white/50 text-xs px-4 py-3.5 focus:outline-none focus:border-gold-300 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gold-300 text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Thank you for subscribing to Aura Véloce Private Access.
              </p>
            )}
          </div>
        </div>

        {/* Main Footer Links Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/15">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <AuraVeloceLogo variant="full" />
            <p className="text-xs text-white/80 font-light leading-relaxed max-w-sm">
              Aura Véloce Estates is India’s premier luxury real-estate atelier. We represent architecturally distinguished residences, trophy penthouses, and private estates for high-net-worth clients worldwide.
            </p>

            <div className="space-y-2.5 text-xs text-white/90">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold-300 shrink-0" />
                <span>Bandra Seaface Executive Suite, Mumbai 400050</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-300 shrink-0" />
                <span>+91 (022) 8800 9900 · Advisory Desk</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-300 shrink-0" />
                <span>private.advisory@auraveloce.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Properties */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Portfolio
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              <li>
                <Link href="/properties?type=Penthouse" className="hover:text-gold-300 transition-colors">
                  Sea-facing Penthouses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Villa" className="hover:text-gold-300 transition-colors">
                  Architectural Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Estate" className="hover:text-gold-300 transition-colors">
                  Heritage & Country Estates
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Waterfront" className="hover:text-gold-300 transition-colors">
                  Waterfront Residences
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Commercial" className="hover:text-gold-300 transition-colors">
                  Prime Commercial Spaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Prime Locations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Key Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              <li>
                <Link href="/locations/mumbai" className="hover:text-gold-300 transition-colors">
                  Mumbai (Bandra & Worli)
                </Link>
              </li>
              <li>
                <Link href="/locations/goa" className="hover:text-gold-300 transition-colors">
                  Goa (Assagao & Anjuna)
                </Link>
              </li>
              <li>
                <Link href="/locations/delhi-ncr" className="hover:text-gold-300 transition-colors">
                  Delhi NCR & Gurgaon
                </Link>
              </li>
              <li>
                <Link href="/locations/bangalore" className="hover:text-gold-300 transition-colors">
                  Bangalore (Sadashivnagar)
                </Link>
              </li>
              <li>
                <Link href="/locations/hyderabad" className="hover:text-gold-300 transition-colors">
                  Hyderabad (Jubilee Hills)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Firm & Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              The Firm
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-gold-300 transition-colors">
                  Private Advisors
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold-300 transition-colors">
                  Real Estate Services
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-gold-300 transition-colors">
                  Bookmarked Properties
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Schedule Private Viewing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/60 font-light">
          <p>© {new Date().getFullYear()} Aura Véloce Estates & Residences Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">RERA Compliance</span>
            <span className="hover:text-white transition-colors cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
