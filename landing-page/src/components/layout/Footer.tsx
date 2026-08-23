'use client'

import * as React from 'react'
import Link from 'next/link'
import { HouseAndSkyLogo } from './HouseAndSkyLogo'
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

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
    <footer className="bg-brand-dark text-white border-t border-brand-green/20 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Highlight Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-white/10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-sky font-bold block">
              HOUSE & SKY INTELLIGENCE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
              Exceptional homes. Under open skies.
            </h3>
            <p className="text-xs text-white/70 max-w-md font-light leading-relaxed">
              Curated property digests delivered directly to private wealth clients and architectural enthusiasts.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for private listings"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs px-4 py-3.5 rounded-md focus:outline-none focus:border-brand-sky transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-green hover:bg-white hover:text-brand-dark text-white text-xs uppercase tracking-[0.18em] font-bold rounded-md transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Thank you for subscribing to House & Sky Private Access.
              </p>
            )}
          </div>
        </div>

        {/* Main Footer Links Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <HouseAndSkyLogo variant="light" showTagline={true} />
            <p className="text-xs text-white/70 font-light leading-relaxed max-w-sm">
              House & Sky is a premium real-estate platform connecting architectural homes, luxury penthouses, and landmark residences with discerning buyers worldwide.
            </p>

            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-sky shrink-0" />
                <span>Bandra West Executive Office, Mumbai 400050</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-sky shrink-0" />
                <span>+91 (022) 8800 9900 · Advisory Desk</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-sky shrink-0" />
                <span>advisory@houseandsky.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Properties */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Properties
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <Link href="/properties?type=Penthouse" className="hover:text-brand-sky transition-colors">
                  Penthouses & Sky Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Villa" className="hover:text-brand-sky transition-colors">
                  Architectural Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Apartment" className="hover:text-brand-sky transition-colors">
                  Modern Residences
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Waterfront" className="hover:text-brand-sky transition-colors">
                  Coastal Homes
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Commercial" className="hover:text-brand-sky transition-colors">
                  Commercial Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <Link href="/locations/mumbai" className="hover:text-brand-sky transition-colors">
                  Mumbai (Bandra & Worli)
                </Link>
              </li>
              <li>
                <Link href="/locations/goa" className="hover:text-brand-sky transition-colors">
                  Goa (Assagao & Anjuna)
                </Link>
              </li>
              <li>
                <Link href="/locations/delhi-ncr" className="hover:text-brand-sky transition-colors">
                  Delhi NCR & Gurgaon
                </Link>
              </li>
              <li>
                <Link href="/locations/bangalore" className="hover:text-brand-sky transition-colors">
                  Bangalore (Sadashivnagar)
                </Link>
              </li>
              <li>
                <Link href="/locations/hyderabad" className="hover:text-brand-sky transition-colors">
                  Hyderabad (Jubilee Hills)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Firm & Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              House & Sky
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <Link href="/about" className="hover:text-brand-sky transition-colors">
                  Brand Story
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-brand-sky transition-colors">
                  Advisors & Team
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-sky transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-brand-sky transition-colors">
                  Saved Vault
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-sky transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50 font-light">
          <p>© {new Date().getFullYear()} House & Sky Estates Ltd. All rights reserved.</p>
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
