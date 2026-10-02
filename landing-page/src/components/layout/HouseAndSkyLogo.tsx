import * as React from 'react'
import Image from 'next/image'

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

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none max-w-full ${className}`}>
      {/* Luxury Medallion Image Emblem */}
      <div
        className={`relative shrink-0 rounded-full overflow-hidden shadow-md border-2 border-[#C9A96E] bg-[#0B241C] ${
          size === 'sm'
            ? 'w-9 h-9 sm:w-10 sm:h-10 xl:w-12 xl:h-12'
            : size === 'lg'
            ? 'w-16 h-16 sm:w-18 sm:h-18 xl:w-20 xl:h-20'
            : 'w-11 h-11 sm:w-12 sm:h-12 xl:w-14 xl:h-14'
        }`}
      >
        <Image
          src="/logo.png"
          alt="House & Sky Logo"
          fill
          sizes="(max-width: 640px) 40px, 64px"
          className="object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1 leading-none">
          <span
            className={`font-serif font-bold tracking-tight ${
              size === 'sm'
                ? 'text-lg sm:text-xl xl:text-2xl'
                : size === 'lg'
                ? 'text-2xl sm:text-2xl xl:text-3xl'
                : 'text-xl sm:text-xl xl:text-2xl'
            }`}
            style={{ color: textColor }}
          >
            House
          </span>
          <span
            className={`font-serif italic font-bold text-[#C9A96E] ${
              size === 'sm'
                ? 'text-lg sm:text-xl xl:text-2xl'
                : size === 'lg'
                ? 'text-2xl sm:text-2xl xl:text-3xl'
                : 'text-xl sm:text-xl xl:text-2xl'
            }`}
          >
            &
          </span>
          <span
            className={`font-serif font-bold tracking-tight ${
              size === 'sm'
                ? 'text-lg sm:text-xl xl:text-2xl'
                : size === 'lg'
                ? 'text-2xl sm:text-2xl xl:text-3xl'
                : 'text-xl sm:text-xl xl:text-2xl'
            }`}
            style={{ color: textColor }}
          >
            Sky
          </span>
        </div>
        {showTagline && (
          <span className="text-[7.5px] min-[380px]:text-[8.5px] sm:text-[9px] xl:text-[10px] uppercase tracking-[0.08em] min-[380px]:tracking-[0.12em] sm:tracking-[0.16em] xl:tracking-[0.2em] font-extrabold text-[#C9A96E] mt-0.5 sm:mt-1 block truncate max-w-[180px] min-[380px]:max-w-none">
            BUILDING TRUST. DELIVERING VALUE.
          </span>
        )}
      </div>
    </div>
  )
}
