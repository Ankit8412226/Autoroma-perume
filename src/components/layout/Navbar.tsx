'use client'

import * as React from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { cn } from '@/utils/cn'
import { ShoppingBag, Heart, User, Menu, X, Sparkles, Car, ChevronRight } from 'lucide-react'
import { useCartStore, selectCartItemCount } from '@/stores/cart.store'
import { useWishlistStore } from '@/stores/wishlist.store'

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { items, openDrawer } = useCartStore()
  const { productIds } = useWishlistStore()
  const cartItemCount = selectCartItemCount(items)
  const wishlistCount = productIds.length

  const navRef = React.useRef<HTMLElement>(null)

  // GSAP Smooth Entrance Animation on Mount
  React.useEffect(() => {
    if (!navRef.current) return
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
    )
  }, [])

  // Scroll Morph Effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 w-full transition-all duration-300">
        {/* Main Floating Glass Navbar */}
        <header
          ref={navRef}
          className={cn(
            'w-full transition-all duration-500 px-4 sm:px-6 md:px-12 border-b border-white-500/15',
            isScrolled
              ? 'bg-black/95 backdrop-blur-xl py-3.5 shadow-2xl'
              : 'bg-black/80 backdrop-blur-md py-4'
          )}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
            {/* 1. LEFT: Mobile Menu Hamburger & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-white-100 hover:text-white bg-bg-surface border border-white-500/20 rounded-sm"
                aria-label="Open Navigation Slider"
              >
                <Menu className="h-5 w-5 text-white-100" />
              </button>

              <Link href="/" className="flex items-center gap-2 group select-none shrink-0">
                <div className="h-7 w-7 rounded-full bg-white/10 border border-white/30 flex items-center justify-center group-hover:border-white transition-all">
                  <span className="font-cormorant text-xs font-semibold text-white">AU</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-lg sm:text-xl tracking-[0.2em] text-white font-bold uppercase leading-none">
                    Autoroma
                  </span>
                  <span className="text-[7px] font-inter uppercase tracking-[0.25em] text-white-300 font-medium pt-0.5">
                    Parfum d&apos;Automobile
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. CENTER: Navigation Links (Bombay Musk Style) */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-inter uppercase tracking-widest text-white-200">
              <Link href="/products" className="hover:text-white transition-colors py-1 border-b border-transparent hover:border-white">
                Organic Car Perfumes
              </Link>

              <Link href="/products?type=DISCOVERY" className="hover:text-white transition-colors py-1 border-b border-transparent hover:border-white">
                Discovery Set
              </Link>

              <Link href="/collections" className="hover:text-white transition-colors py-1 border-b border-transparent hover:border-white">
                Combos
              </Link>

              <Link href="/products" className="hover:text-white transition-colors py-1 border-b border-transparent hover:border-white">
                Shop
              </Link>

              <Link href="/about" className="hover:text-white transition-colors py-1 border-b border-transparent hover:border-white">
                Our Story
              </Link>
            </nav>

            {/* 3. RIGHT: Action Utilities */}
            <div className="flex items-center gap-3 sm:gap-4 text-white-200 shrink-0">
              <Link
                href="/wishlist"
                className="relative hover:text-white transition-colors p-2 bg-bg-surface/80 border border-white-500/20 hover:border-white flex items-center justify-center rounded-sm"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4 stroke-[1.5] text-white" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-white text-black text-[9px] font-bold font-inter rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/login"
                className="p-2 hover:text-white transition-colors bg-bg-surface/80 border border-white-500/20 hover:border-white flex items-center justify-center rounded-sm"
                aria-label="Account"
              >
                <User className="h-4 w-4 stroke-[1.5] text-white" />
              </Link>

              <button
                onClick={openDrawer}
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-200 border border-white text-[11px] font-inter uppercase tracking-wider font-bold rounded-sm transition-all shadow-lg cursor-pointer"
              >
                <ShoppingBag className="h-3.5 w-3.5" style={{ color: '#000000' }} />
                <span style={{ color: '#000000' }} className="font-bold">BAG ({cartItemCount})</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* FULL-SCREEN MOBILE SLIDER DRAWER (LEFT-TO-RIGHT SLIDE) */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-500 lg:hidden overflow-hidden',
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {/* Backdrop Dark Overlay */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            'absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500',
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Full-Screen Drawer Slider sliding from Left to Right */}
        <aside
          className={cn(
            'absolute top-0 bottom-0 left-0 w-full sm:w-[380px] bg-bg-primary border-r border-gold-300/30 shadow-2xl transition-transform duration-500 ease-out flex flex-col justify-between p-8 overflow-y-auto z-10',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="space-y-8">
            {/* Header with Brand Logo & Close Icon */}
            <div className="flex items-center justify-between border-b border-gold-300/30 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gold-300/10 border border-gold-300/40 flex items-center justify-center">
                  <span className="font-cormorant text-sm font-semibold text-gold-300">AU</span>
                </div>
                <div>
                  <span className="font-cormorant text-xl text-white-100 tracking-widest uppercase block font-light">
                    Autoroma
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-gold-300 font-inter">
                    Parfum d&apos;Automobile
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gold-300 hover:text-white-100 bg-bg-surface border border-gold-300/30"
                aria-label="Close Slider Menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-4 font-inter text-xs uppercase tracking-widest">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-bg-surface border border-white-500/10 text-white-100 hover:border-gold-300 text-sm font-cormorant tracking-widest"
              >
                <span>Full Fragrance Catalog</span>
                <ChevronRight className="h-4 w-4 text-gold-300" />
              </Link>

              <Link
                href="/products?type=VENT_CLIP"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-bg-surface border border-white-500/10 text-white-100 hover:border-gold-300 text-sm font-cormorant tracking-widest"
              >
                <span>Vent Clip Fresheners</span>
                <ChevronRight className="h-4 w-4 text-gold-300" />
              </Link>

              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-bg-surface border border-white-500/10 text-white-100 hover:border-gold-300 text-sm font-cormorant tracking-widest"
              >
                <span>Collection Editions</span>
                <ChevronRight className="h-4 w-4 text-gold-300" />
              </Link>

              <Link
                href="/b2b"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-gold-300/10 border border-gold-300 text-gold-300 text-sm font-cormorant tracking-widest font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gold-300 animate-pulse" />
                  <span>B2B & Fleet Wholesale</span>
                </span>
                <ChevronRight className="h-4 w-4 text-gold-300" />
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-bg-surface border border-white-500/10 text-white-100 hover:border-gold-300 text-sm font-cormorant tracking-widest"
              >
                <span>About Atelier</span>
                <ChevronRight className="h-4 w-4 text-gold-300" />
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-bg-surface border border-white-500/10 text-white-100 hover:border-gold-300 text-sm font-cormorant tracking-widest"
              >
                <span>Contact Concierge</span>
                <ChevronRight className="h-4 w-4 text-gold-300" />
              </Link>
            </nav>
          </div>

          {/* Footer Info inside Slider */}
          <div className="border-t border-white-500/10 pt-6 text-center space-y-2 font-inter text-xs">
            <p className="text-white-300">Support: support@maisonnoir.in</p>
            <span className="text-[10px] text-gold-300 uppercase tracking-widest block font-medium">
              Free Express Shipping Across India
            </span>
          </div>
        </aside>
      </div>
    </>
  )
}
