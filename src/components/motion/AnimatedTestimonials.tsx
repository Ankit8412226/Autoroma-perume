'use client'

import * as React from 'react'
import { Star, ShieldCheck, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Karan Malhotra',
    location: 'BMW 5-Series · Mumbai',
    quote: 'Finally a car perfume that doesn\'t smell like cheap synthetic bubblegum. The Tuscan Leather gel jar in my BMW 5-Series feels like a luxury hotel lobby.',
    rating: 5,
    vehicle: 'BMW 5-SERIES',
  },
  {
    name: 'Rohan Verma',
    location: 'Mercedes AMG · New Delhi',
    quote: 'The Ocean Drive vent clip clip-on metal housing fits the round turbine AC vents of my Mercedes A35 AMG perfectly. Smells fresh even after standing in Delhi heat.',
    rating: 5,
    vehicle: 'MERCEDES AMG',
  },
  {
    name: 'Speedline Auto Detailing',
    location: 'B2B Client · Bengaluru',
    quote: 'We ordered 200 custom units for our detailing studio client handover gifts. The presentation box and scent quality exceeded all expectations.',
    rating: 5,
    vehicle: 'B2B FLEET PARTNER',
  },
]

export function AnimatedTestimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reviews.map((rev, idx) => (
        <div
          key={idx}
          className="group relative bg-bg-surface border border-white-500/20 hover:border-gold-300 p-8 space-y-6 transition-all duration-500 shadow-xl hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(201,169,110,0.2)] select-none flex flex-col justify-between"
        >
          {/* Ambient Glow Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-300/10 rounded-full blur-xl group-hover:bg-gold-300/20 transition-all pointer-events-none" />

          <div className="space-y-4 relative z-10">
            {/* Top Bar: Vehicle Badge & Quote Icon */}
            <div className="flex justify-between items-center border-b border-white-500/15 pb-4">
              <span className="text-[10px] font-inter uppercase tracking-widest text-gold-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-300" />
                <span>{rev.vehicle}</span>
              </span>
              <Quote className="h-5 w-5 text-gold-300/40 group-hover:text-gold-300 transition-colors" />
            </div>

            {/* Glowing 5-Star Rating */}
            <div className="flex text-gold-300 gap-1 group-hover:scale-105 transition-transform origin-left">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold-300 drop-shadow-[0_0_8px_rgba(201,169,110,0.6)]" />
              ))}
            </div>

            <p className="text-xs text-white-200 font-light font-inter leading-relaxed italic">
              &quot;{rev.quote}&quot;
            </p>
          </div>

          <div className="pt-4 border-t border-white-500/15 relative z-10">
            <strong className="text-white-100 text-xs block font-inter font-semibold group-hover:text-gold-200 transition-colors">
              {rev.name}
            </strong>
            <span className="text-[10px] text-gold-300 uppercase tracking-wider font-inter block mt-0.5">
              {rev.location}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
