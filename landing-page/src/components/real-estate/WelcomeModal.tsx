'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Sparkles, PhoneCall, ArrowUpRight } from 'lucide-react'
import { SITE } from '@/utils/siteConfig'

export function WelcomeModal() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Automatically open on website load after a slight smooth delay
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content Box */}
      <div className="relative z-10 w-full max-w-2xl bg-[#092219] border border-[#C9A96E]/50 rounded-3xl shadow-2xl overflow-hidden my-auto transform transition-all duration-300 scale-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/90 text-white hover:text-[#C9A96E] rounded-full border border-white/20 transition-all duration-200 cursor-pointer shadow-lg group"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Header Tag */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white py-2 px-6 text-center text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-100 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Exclusive Launch • House & Sky Presentation</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-100 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/10] bg-black/40 overflow-hidden">
          <Image
            src="/images/krishna-lok-modal.png"
            alt="Krishna Lok Studio Apartment By House & Sky"
            fill
            priority
            className="object-contain p-2 sm:p-4 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#092219] via-transparent to-transparent opacity-90" />
        </div>

        {/* Modal Body Info */}
        <div className="p-6 sm:p-8 space-y-5 text-center -mt-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 bg-[#C9A96E]/15 border border-[#C9A96E]/30 rounded-full text-[11px] font-bold text-[#C9A96E] uppercase tracking-widest">
              Flagship Development
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal leading-tight">
              Krishna Lok Studio Apartment
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 font-light max-w-lg mx-auto">
              Luxury studio apartments & prime township inventory designed for exceptional living and high-yield appreciation by <span className="text-white font-semibold">House & Sky</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-emerald-400/30 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span>Book Site Visit / Enquire</span>
            </Link>

            <Link
              href="/projects"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore All Projects</span>
              <ArrowUpRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
