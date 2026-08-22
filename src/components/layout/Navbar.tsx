'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuraVeloceLogo } from './AuraVeloceLogo'
import { useSavedStore } from '@/stores/saved.store'
import { Bookmark, Menu, X, PhoneCall, ChevronRight } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const savedIds = useSavedStore((state) => state.propertyIds)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const savedCount = mounted ? savedIds.length : 0

  const navLinks = [
    { label: 'Properties', href: '/properties' },
    { label: 'Locations', href: '/locations' },
    { label: 'Agents', href: '/agents' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-bg-primary/95 backdrop-blur-xl border-b border-white/15 py-3 sm:py-3.5 shadow-2xl'
            : 'bg-gradient-to-b from-black/95 via-black/70 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="focus:outline-none shrink-0">
              <AuraVeloceLogo variant="full" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 py-1 ${
                      isActive
                        ? 'text-gold-300 font-bold border-b-2 border-gold-300'
                        : 'text-white/90 hover:text-gold-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right Action Tools */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Saved Properties Pill Button */}
              <Link
                href="/saved"
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full flex items-center gap-2 text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer"
                title="View Saved Properties"
              >
                <Bookmark className="w-3.5 h-3.5 text-gold-300 fill-gold-300" />
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[9px] font-bold text-black bg-gold-300 rounded-full tabular-nums">
                    {savedCount}
                  </span>
                )}
              </Link>

              {/* High-Contrast Consultation CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-black bg-gold-300 hover:bg-white hover:text-black border border-gold-300 transition-all duration-200 shadow-lg group cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-black group-hover:rotate-12 transition-transform duration-300" />
                <span>Book Consultation</span>
              </Link>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex items-center space-x-3 lg:hidden">
              <Link
                href="/saved"
                className="relative p-2.5 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center"
                aria-label="Saved properties"
              >
                <Bookmark className="w-4 h-4 text-gold-300 fill-gold-300" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-black bg-gold-300 rounded-full">
                    {savedCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-bg-surface border-l border-white/20 p-6 flex flex-col justify-between z-50 overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/15">
                <AuraVeloceLogo variant="compact" iconSize={28} />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white/10 text-white border border-white/20 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between text-xs uppercase tracking-[0.2em] font-semibold text-white hover:text-gold-300 py-3 border-b border-white/10"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gold-300" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/15 space-y-3">
              <Link
                href="/saved"
                className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white/20"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-gold-300 fill-gold-300" />
                  Saved Properties
                </span>
                <span className="bg-gold-300 text-black px-2 py-0.5 text-[10px] font-bold rounded-full">
                  {savedCount}
                </span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-gold-300 text-black font-bold text-xs uppercase tracking-[0.18em] hover:bg-white"
              >
                <PhoneCall className="w-4 h-4" />
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
