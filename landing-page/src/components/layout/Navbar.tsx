'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HouseAndSkyLogo } from './HouseAndSkyLogo'
import { useSavedStore } from '@/stores/saved.store'
import { Bookmark, Menu, X, PhoneCall, ChevronRight, LogIn } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const savedIds = useSavedStore((state) => state.propertyIds)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const savedCount = mounted ? savedIds.length : 0

  const navLinks = [
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
            ? 'bg-white/95 backdrop-blur-md border-b border-brand-green/10 py-3.5 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm py-4 border-b border-brand-green/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="focus:outline-none shrink-0">
              <HouseAndSkyLogo variant="dark" showTagline={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs uppercase tracking-[0.14em] font-semibold transition-colors duration-200 py-1 ${
                      isActive
                        ? 'text-brand-green font-bold border-b-2 border-brand-green'
                        : 'text-brand-charcoal/80 hover:text-brand-green'
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
                className="px-4 py-2.5 bg-brand-soft hover:bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-md flex items-center gap-2 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                title="View Saved Properties"
              >
                <Bookmark className="w-3.5 h-3.5 text-brand-green fill-brand-green/20" />
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-brand-green rounded-full tabular-nums">
                    {savedCount}
                  </span>
                )}
              </Link>

              {/* Login Link */}
              <a
                href="http://localhost:3003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.14em] font-bold text-brand-charcoal hover:text-brand-green transition-colors px-2.5 py-1.5 inline-flex items-center gap-1.5 cursor-pointer"
                title="User Login / Client Private Vault"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-green" />
                <span>Login</span>
              </a>

              {/* Primary Contact CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white bg-brand-green hover:bg-brand-dark rounded-md transition-all duration-200 shadow-md group cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold">Contact Us</span>
              </Link>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex items-center space-x-2.5 lg:hidden">
              <Link
                href="/saved"
                className="relative p-2.5 bg-brand-soft border border-brand-green/20 text-brand-green rounded-md flex items-center justify-center"
                aria-label="Saved properties"
              >
                <Bookmark className="w-4 h-4 text-brand-green fill-brand-green" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-brand-green rounded-full">
                    {savedCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 bg-brand-soft border border-brand-green/20 text-brand-green rounded-md flex items-center justify-center focus:outline-none cursor-pointer"
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
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white border-l border-brand-green/15 p-6 flex flex-col justify-between z-50 overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-brand-green/15">
                <HouseAndSkyLogo variant="dark" />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-brand-soft text-brand-green border border-brand-green/20 rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between text-xs uppercase tracking-[0.16em] font-semibold text-brand-charcoal hover:text-brand-green py-3 border-b border-brand-green/10"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-brand-green" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-brand-green/15 space-y-3">
              <Link
                href="/saved"
                className="flex items-center justify-between w-full px-4 py-3 bg-brand-soft border border-brand-green/20 text-xs font-semibold uppercase tracking-wider text-brand-green rounded-md"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-brand-green fill-brand-green" />
                  Saved Properties
                </span>
                <span className="bg-brand-green text-white px-2 py-0.5 text-[10px] font-bold rounded-full">
                  {savedCount}
                </span>
              </Link>

              <a
                href="http://localhost:3003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-brand-charcoal font-bold text-xs uppercase tracking-wider rounded-md hover:text-brand-green bg-brand-soft"
              >
                <LogIn className="w-4 h-4 text-brand-green" />
                Login
              </a>

              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-brand-green text-white font-bold text-xs uppercase tracking-[0.15em] rounded-md hover:bg-brand-dark shadow-md"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span className="text-white font-bold">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
