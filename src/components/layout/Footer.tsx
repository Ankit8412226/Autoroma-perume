'use client'

import Link from 'next/link'
import { AuraVeloceLogo } from './AuraVeloceLogo'

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-white-500/20 text-white-300 font-inter pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Link href="/">
            <AuraVeloceLogo variant="full" gold iconSize={32} />
          </Link>

          <p className="text-xs text-white-300 font-light leading-relaxed max-w-sm pt-2">
            India&apos;s premier luxury automotive fragrance atelier. Formulated with heat-tested 60°C pure essential oils and anodized aluminum diffusers for BMW, Mercedes, Porsche, Audi, and Range Rover cabins.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <span className="text-label text-white uppercase tracking-widest block mb-3 sm:mb-4 font-bold text-xs sm:text-sm">
            Collection
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-white-300 font-light">
            <li>
              <Link href="/products?type=VENT_CLIP" className="hover:text-white transition-colors">
                Vent Clip Fresheners
              </Link>
            </li>
            <li>
              <Link href="/products?type=SPRAY" className="hover:text-white transition-colors">
                Interior Spray Perfumes
              </Link>
            </li>
            <li>
              <Link href="/products?type=DASHBOARD_GEL" className="hover:text-white transition-colors">
                Dashboard Gel Jars
              </Link>
            </li>
            <li>
              <Link href="/products?type=HANGING" className="hover:text-white transition-colors">
                Hanging Diffusers
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Services & B2B */}
        <div className="space-y-3">
          <span className="text-label text-white uppercase tracking-widest block mb-3 sm:mb-4 font-bold text-xs sm:text-sm">
            Services & Corporate
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-white-300 font-light">
            <li>
              <Link href="/b2b" className="hover:text-white transition-colors">
                B2B Bulk & Showroom Supply
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                Craftsmanship & Oil Safety
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Concierge
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <span className="text-label text-white uppercase tracking-widest block mb-3 sm:mb-4 font-bold text-xs sm:text-sm">
            Join The Club
          </span>
          <p className="text-xs text-white-400 leading-relaxed font-light">
            Receive exclusive invitations to new fragrance drops and limited-edition car diffuser series.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-base text-xs py-2.5 px-3 bg-bg-surface flex-1 border sm:border-r-0 border-white-500/20 text-white placeholder:text-white-400 focus:outline-none rounded-sm sm:rounded-r-none"
            />
            <button
              type="submit"
              className="bg-white text-black text-xs uppercase tracking-wider py-2.5 px-5 hover:bg-neutral-200 transition-colors font-bold rounded-sm sm:rounded-l-none"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-t border-white-500/10 flex flex-col md:flex-row items-center justify-between text-center md:text-left text-[11px] sm:text-xs text-white-400 font-light gap-4">
        <span>© {new Date().getFullYear()} Aura Véloce Automotive Fragrances. All rights reserved.</span>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/shipping" className="hover:text-white">Shipping Policy</Link>
        </div>
      </div>
    </footer>
  )
}
