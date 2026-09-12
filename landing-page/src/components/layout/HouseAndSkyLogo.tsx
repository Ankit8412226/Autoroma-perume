import * as React from 'react'

interface HouseAndSkyLogoProps {
  className?: string
  variant?: 'dark' | 'light'
  showTagline?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function HouseAndSkyLogo({
  className = '',
  variant = 'dark',
  showTagline = true,
  size = 'md',
}: HouseAndSkyLogoProps) {
  const isDark = variant === 'dark'
  const textColor = isDark ? '#171A18' : '#FFFFFF'

  const logoDimension = size === 'sm' ? 48 : size === 'lg' ? 68 : 56

  return (
    <div className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}>
      {/* Luxury Medallion Image Emblem */}
      <div
        className="relative shrink-0 rounded-full overflow-hidden shadow-md border-2 border-[#C9A96E] bg-[#0B241C]"
        style={{ width: logoDimension, height: logoDimension }}
      >
        <img
          src="/logo.png"
          alt="House & Sky Logo"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span
            className="font-serif text-xl sm:text-2xl font-bold tracking-tight"
            style={{ color: textColor }}
          >
            House
          </span>
          <span className="font-serif text-xl sm:text-2xl italic font-bold text-[#C9A96E]">
            &
          </span>
          <span
            className="font-serif text-xl sm:text-2xl font-bold tracking-tight"
            style={{ color: textColor }}
          >
            Sky
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-extrabold text-[#C9A96E] mt-1 block whitespace-nowrap">
            BUILDING TRUST. DELIVERING VALUE.
          </span>
        )}
      </div>
    </div>
  )
}
