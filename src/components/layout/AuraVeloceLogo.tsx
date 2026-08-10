'use client'

import * as React from 'react'

interface AuraVeloceLogoProps {
  variant?: 'full' | 'icon' | 'compact'
  className?: string
  iconSize?: number
  gold?: boolean
}

export function AuraVeloceLogo({
  variant = 'full',
  className = '',
  iconSize = 32,
  gold = false,
}: AuraVeloceLogoProps) {
  const primaryColor = gold ? '#C9A96E' : 'currentColor'
  const accentColor = gold ? '#E8C98A' : 'currentColor'

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek AV Monogram Crest Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={primaryColor}
          strokeWidth="2"
          strokeDasharray="4 2"
          className="opacity-40"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke={accentColor}
          strokeWidth="1.5"
          className="opacity-80"
        />
        {/* AV Intertwined Monogram Paths */}
        {/* 'A' Left Stroke */}
        <path
          d="M32 72L50 28L58 46"
          stroke={primaryColor}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 'A' Crossbar */}
        <path
          d="M40 58H57"
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* 'V' Stroke overlapping 'A' */}
        <path
          d="M48 28L66 72L76 46"
          stroke={accentColor}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Apex Diamond Sparkle Accent */}
        <path
          d="M50 18L52.5 23L50 28L47.5 23Z"
          fill={primaryColor}
        />
      </svg>

      {variant !== 'icon' && (
        <div className="flex flex-col shrink-0 leading-none">
          <span className="font-sans text-sm sm:text-xl tracking-[0.22em] text-white font-bold uppercase leading-none">
            Aura Véloce
          </span>
          {variant === 'full' && (
            <span className="text-[6.5px] sm:text-[7.5px] font-inter uppercase tracking-[0.32em] text-gold-300 font-medium pt-1">
              Parfum d&apos;Automobile
            </span>
          )}
        </div>
      )}
    </div>
  )
}
