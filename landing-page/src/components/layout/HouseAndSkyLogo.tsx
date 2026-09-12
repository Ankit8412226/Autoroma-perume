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
  showTagline = false,
  size = 'md',
}: HouseAndSkyLogoProps) {
  const isDark = variant === 'dark'
  const textColor = isDark ? '#171A18' : '#FFFFFF'

  const logoDimension = size === 'sm' ? 44 : size === 'lg' ? 64 : 52

  return (
    <div className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}>
      {/* Luxury Medallion Image Emblem */}
      <div
        className="relative shrink-0 rounded-full overflow-hidden shadow-md border-2 border-[#C9A96E]/60 bg-[#0B241C]"
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
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className="font-serif text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: textColor }}
          >
            House
          </span>
          <span className="font-serif text-2xl sm:text-3xl italic font-bold text-[#C9A96E]">
            &
          </span>
          <span
            className="font-serif text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: textColor }}
          >
            Sky
          </span>
        </div>
        {showTagline && (
          <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#C9A96E] mt-1 block">
            Building Trust. Delivering Value.
          </span>
        )}
      </div>
    </div>
  )
}
