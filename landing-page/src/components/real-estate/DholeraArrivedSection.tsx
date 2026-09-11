'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Zap,
  Plane,
  TrendingUp,
  Cpu
} from 'lucide-react'

export function DholeraArrivedSection() {
  const highlights = [
    {
      icon: Cpu,
      title: 'Tata Semiconductor Giga Fab Hub',
      desc: 'Located adjacent to India’s flagship ₹91,000 Cr Tata-Powerchip Semiconductor Fab plant, triggering exponential land demand.',
      badge: 'High Value Zone',
    },
    {
      icon: Plane,
      title: 'Dholera International Airport',
      desc: 'Minutes away from the upcoming 4-runway greenfield international airport & dedicated air cargo logistics park.',
      badge: 'Connectivity',
    },
    {
      icon: Zap,
      title: 'Ahmedabad-Dholera Expressway',
      desc: 'Seamless travel via the 109 km 6-lane access-controlled expressway connecting Ahmedabad to Dholera SIR in 45 mins.',
      badge: '45-Min Transit',
    },
    {
      icon: ShieldCheck,
      title: '100% Title Clear & Demarcated Plots',
      desc: 'Every House & Sky Dholera plot features vector boundary survey, NA/NOC approvals, and direct Registry transfer.',
      badge: 'Zero Legal Risk',
    },
  ]

  const stats = [
    { value: '520 Sq. Km', label: 'Dholera SIR Total Greenfield Area' },
    { value: '₹91,000 Cr+', label: 'Anchor Semiconductor Investments' },
    { value: '45 Mins', label: 'Ahmedabad Expressway Distance' },
    { value: '35%+ P.A.', label: 'Targeted Land Appreciation Rate' },
  ]

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C1E18] via-[#142C23] to-[#0A1612] text-white p-6 sm:p-10 lg:p-14 border border-[#C9A96E]/30 shadow-2xl">
      {/* Background Subtle Lighting & Elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Header & Badge */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#C9A96E]/15 border border-[#C9A96E]/40 rounded-full backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A96E]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.22em] text-[#E5D5B5]">
              HISTORIC ANNOUNCEMENT • GUJARAT SMART CITY
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Dholera SIR, Gujarat, India</span>
          </div>
        </div>

        {/* Main Title & Hero Copy */}
        <div className="max-w-3xl space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-white">
            House & Sky Has Arrived in <span className="italic font-light text-[#E5D5B5] underline decoration-[#C9A96E]/50 underline-offset-8">Dholera Smart City.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
            India&apos;s first Greenfield Smart City meets House & Sky&apos;s benchmark land plot demarcation standards. Acquire premium residential, commercial, and industrial plots in the heart of India&apos;s largest economic corridor.
          </p>
        </div>

        {/* Centerpiece Image & Highlights Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-stretch">
          {/* Main Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden border border-[#C9A96E]/30 group shadow-xl bg-black/40">
            <Image
              src="/images/dholera-smart-city.png"
              alt="House & Sky Dholera Smart City Masterplan"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-[#C9A96E]/40 text-[10px] font-bold uppercase tracking-wider text-[#E5D5B5] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#C9A96E]" />
                <span>Premier Greenfield Township</span>
              </div>
              <div className="px-3 py-1 bg-[#10B981]/20 border border-[#10B981]/40 backdrop-blur-md rounded-lg text-[10px] font-bold text-[#6EE7B7] uppercase tracking-wider">
                Plots Starting ₹1,850 / sqft
              </div>
            </div>

            {/* Bottom Card Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-5 bg-black/75 backdrop-blur-md rounded-xl border border-white/15 space-y-2 z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A96E]">
                  Masterplan Demarcation Enclave
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#C9A96E]/20 text-[#E5D5B5] rounded font-mono font-semibold">
                  RERA Registered
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Dholera Smart Enclave Phase 1 & 2
              </h3>
              <p className="text-xs text-white/75 line-clamp-2">
                100 ft wide arterial road access, subterranean utility conduits, 24/7 smart security fencing, and direct clear title deed transfer.
              </p>
            </div>
          </div>

          {/* Key Advantages Grid (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={idx}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C9A96E]/40 rounded-xl p-3.5 sm:p-4 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-[#C9A96E]/15 border border-[#C9A96E]/30 rounded-lg text-[#E5D5B5] group-hover:bg-[#C9A96E] group-hover:text-black transition-colors shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-white group-hover:text-[#E5D5B5] transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/10 text-white/80 rounded shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 font-light leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Row Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {stats.map((st, i) => (
            <div
              key={i}
              className="bg-black/30 border border-white/10 hover:border-[#C9A96E]/30 p-4 rounded-xl text-center space-y-1 backdrop-blur-md"
            >
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#E5D5B5]">
                {st.value}
              </div>
              <div className="text-[10px] sm:text-xs text-white/70 font-medium uppercase tracking-wider">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Exclusive Priority Allotment Now Open for Early Investors</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              href="/projects"
              className="flex-1 sm:flex-initial px-6 py-3.5 bg-[#C9A96E] hover:bg-[#b5955a] text-black font-extrabold text-xs uppercase tracking-[0.16em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Dholera Plots</span>
              <ArrowUpRight className="w-4 h-4 text-black" />
            </Link>

            <Link
              href="/contact?subject=Dholera+Plot+Inquiry"
              className="flex-1 sm:flex-initial px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all shadow-sm text-center cursor-pointer"
            >
              Book Dholera Site Tour
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
