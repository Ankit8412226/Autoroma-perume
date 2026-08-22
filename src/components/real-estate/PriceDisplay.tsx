import * as React from 'react'

interface PriceDisplayProps {
  formattedPrice: string
  formattedPricePerSqFt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function PriceDisplay({
  formattedPrice,
  formattedPricePerSqFt,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-xl sm:text-2xl font-bold',
    lg: 'text-2xl sm:text-3xl font-bold',
    xl: 'text-3xl sm:text-4xl lg:text-5xl font-extrabold',
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`font-sans tracking-tight text-white ${sizeClasses[size]}`}>
        {formattedPrice}
      </span>
      {formattedPricePerSqFt && (
        <span className="text-[11px] text-white/50 font-mono tracking-wider pt-0.5">
          {formattedPricePerSqFt}
        </span>
      )}
    </div>
  )
}
