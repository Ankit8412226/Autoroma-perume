'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-white-500/20 text-white-300 font-inter pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex flex-col">
            <span className="font-cormorant text-2xl tracking-[0.2em] text-white-100 uppercase font-light">
              Autoroma
            </span>
            <span className="text-[8px] font-inter uppercase tracking-[0.35em] text-gold-300">
              Parfum d&apos;Automobile
            </span>
          </div>

          <p className="text-xs text-white-300 font-light leading-relaxed max-w-sm">
            India&apos;s premier luxury automotive fragrance atelier. Formulated with heat-tested 60°C pure essential oils and anodized aluminum diffusers for BMW, Mercedes, Porsche, Audi, and Range Rover cabins.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <span className="text-label text-gold-300 uppercase tracking-widest block mb-4">
            Collection
          </span>
          <ul className="space-y-2 text-sm text-white-300 font-light">
            <li>
              <Link href="/products?type=VENT_CLIP" className="hover:text-gold-300 transition-colors">
                Vent Clip Fresheners
              </Link>
            </li>
            <li>
              <Link href="/products?type=SPRAY" className="hover:text-gold-300 transition-colors">
                Interior Spray Perfumes
              </Link>
            </li>
            <li>
              <Link href="/products?type=DASHBOARD_GEL" className="hover:text-gold-300 transition-colors">
                Dashboard Gel Jars
              </Link>
            </li>
            <li>
              <Link href="/products?type=HANGING" className="hover:text-gold-300 transition-colors">
                Hanging Diffusers
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Services & B2B */}
        <div className="space-y-3">
          <span className="text-label text-gold-300 uppercase tracking-widest block mb-4">
            Services & Corporate
          </span>
          <ul className="space-y-2 text-sm text-white-300 font-light">
            <li>
              <Link href="/b2b" className="hover:text-gold-300 transition-colors">
                B2B Bulk & Showroom Supply
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-gold-300 transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Craftsmanship & Oil Safety
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-300 transition-colors">
                Contact Concierge
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <span className="text-label text-gold-300 uppercase tracking-widest block mb-4">
            Join The Club
          </span>
          <p className="text-xs text-white-400 leading-relaxed font-light">
            Receive exclusive invitations to new fragrance drops and limited-edition car diffuser series.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-base text-xs py-2 px-3 bg-bg-surface flex-1 border-r-0"
            />
            <button
              type="submit"
              className="bg-gold-300 text-bg-primary text-xs uppercase tracking-wider px-4 hover:bg-gold-200 transition-colors font-medium"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white-500/10 flex flex-col md:flex-row items-center justify-between text-xs text-white-400 font-light gap-4">
        <span>© {new Date().getFullYear()} Autoroma Automotive Fragrances. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white-200">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white-200">Terms of Service</Link>
          <Link href="/shipping" className="hover:text-white-200">Shipping Policy</Link>
        </div>
      </div>
    </footer>
  )
}
