import * as React from 'react'

interface HouseAndSkyLogoProps {
  className?: string
  variant?: 'dark' | 'light'
  showTagline?: boolean
}

export function HouseAndSkyLogo({
  className = '',
  variant = 'dark',
  showTagline = false,
}: HouseAndSkyLogoProps) {
  const isDark = variant === 'dark' // Dark text/icon for light backgrounds
  const mainColor = isDark ? '#0B4F3C' : '#FFFFFF'
  const textColor = isDark ? '#171A18' : '#FFFFFF'
  const skyColor = '#0EA5E9'

  return (
    <div className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}>
      {/* Architectural Roof & Sky Monogram SVG */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Sky Arc Detail */}
        <path
          d="M 6 18 A 12 12 0 0 1 30 18"
          stroke={skyColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* House Architectural Roof Lines */}
        <path
          d="M 8 24 L 18 13 L 28 24"
          stroke={mainColor}
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Inner Apex Architectural Pillar */}
        <path
          d="M 18 13 V 27"
          stroke={mainColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Horizontal Foundation Line */}
        <line
          x1="6"
          y1="27"
          x2="30"
          y2="27"
          stroke={mainColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span
            className="font-serif text-xl sm:text-2xl font-semibold tracking-tight"
            style={{ color: textColor }}
          >
            House
          </span>
          <span
            className="font-serif text-xl sm:text-2xl font-light italic"
            style={{ color: '#0B4F3C' }}
          >
            &
          </span>
          <span
            className="font-serif text-xl sm:text-2xl font-semibold tracking-tight"
            style={{ color: textColor }}
          >
            Sky
          </span>
        </div>
        {showTagline && (
          <span
            className="text-[9px] uppercase tracking-[0.25em] font-medium -mt-1"
            style={{ color: isDark ? '#6D746F' : 'rgba(255,255,255,0.7)' }}
          >
            Estates & Residences
          </span>
        )}
      </div>
    </div>
  )
}
