'use client'

import * as React from 'react'
import { Bookmark } from 'lucide-react'
import { useSavedStore } from '@/stores/saved.store'

interface FavoriteButtonProps {
  propertyId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({
  propertyId,
  className = '',
  size = 'md',
}: FavoriteButtonProps) {
  const [mounted, setMounted] = React.useState(false)
  const isSavedStore = useSavedStore((state) => state.isSaved(propertyId))
  const toggleProperty = useSavedStore((state) => state.toggleProperty)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Only reflect localStorage state AFTER client hydration to prevent SSR mismatch
  const isSaved = mounted ? isSavedStore : false

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2.5',
    lg: 'w-12 h-12 p-3',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleProperty(propertyId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? 'Remove from saved' : 'Save property'}
      title={isSaved ? 'Remove from saved' : 'Save property'}
      className={`rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border shadow-md cursor-pointer ${
        isSaved
          ? 'bg-gold-300 border-gold-300 text-black shadow-gold-300/30'
          : 'bg-black/80 border-white/30 text-white hover:bg-black hover:border-gold-300 hover:scale-105'
      } ${sizeClasses[size]} ${className}`}
    >
      <Bookmark
        className={`${iconSizes[size]} transition-transform duration-200 ${
          isSaved ? 'fill-black text-black' : 'fill-none text-white'
        }`}
      />
    </button>
  )
}
