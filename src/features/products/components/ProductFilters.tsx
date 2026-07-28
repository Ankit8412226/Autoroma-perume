'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, RotateCcw, Wind, Sparkles, ShieldCheck, Award } from 'lucide-react'

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentType = searchParams.get('type') || ''
  const currentFamily = searchParams.get('family') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const handleResetFilters = () => {
    router.push('/products')
  }

  const quickTypePills = [
    { label: 'All Fragrances', value: '' },
    { label: 'Vent Clips', value: 'VENT_CLIP', icon: Wind },
    { label: 'Interior Sprays', value: 'SPRAY', icon: Sparkles },
    { label: 'Dashboard Gels', value: 'DASHBOARD_GEL', icon: ShieldCheck },
    { label: 'Hanging Vials', value: 'HANGING', icon: Award },
  ]

  const familyOptions = [
    { value: '', label: 'All Scent Families' },
    { value: 'Fresh Aquatic', label: 'Fresh Aquatic' },
    { value: 'Oriental Woody', label: 'Oriental Woody' },
    { value: 'Leather Woody', label: 'Leather Woody' },
    { value: 'Woody Earthy', label: 'Woody Earthy' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest Additions' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ]

  const hasActiveFilters = currentType || currentFamily || currentSort !== 'newest'

  return (
    <div className="space-y-6">
      {/* 1-Tap Quick Category Pills Bar */}
      <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-2 scrollbar-none font-inter text-xs">
        {quickTypePills.map((pill) => {
          const Icon = pill.icon
          const isActive = currentType === pill.value
          return (
            <button
              key={pill.label}
              onClick={() => handleFilterChange('type', pill.value)}
              className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-300 border uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-gold-400 to-gold-300 text-bg-primary font-semibold border-gold-300 shadow-[0_0_15px_rgba(201,169,110,0.3)]'
                  : 'bg-bg-surface text-white-200 border-white-500/20 hover:border-gold-300/60 hover:text-gold-200'
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{pill.label}</span>
            </button>
          )
        })}
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-bg-surface border border-gold-300/30 p-3.5 md:p-5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 font-inter text-xs">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gold-300 uppercase tracking-wider font-medium shrink-0 text-[11px] sm:text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Refine:</span>
          </div>

          {/* Scent Family Dropdown */}
          <select
            value={currentFamily}
            onChange={(e) => handleFilterChange('family', e.target.value)}
            className="bg-bg-primary border border-white-500/20 px-2.5 py-2 text-[11px] sm:text-xs text-white-100 focus:border-gold-300 outline-none uppercase tracking-wider cursor-pointer flex-1 sm:flex-initial w-full sm:w-auto"
          >
            {familyOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bg-primary text-white-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Sort & Reset Controls */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <span className="text-white-400 uppercase tracking-wider shrink-0 text-[11px] sm:text-xs">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-bg-primary border border-white-500/20 px-2.5 py-2 text-[11px] sm:text-xs text-white-100 focus:border-gold-300 outline-none uppercase tracking-wider cursor-pointer w-full sm:w-auto"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-bg-primary text-white-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-2 bg-transparent text-gold-300 hover:text-white-100 border border-gold-300/30 hover:border-gold-300 uppercase tracking-wider transition-colors cursor-pointer shrink-0 text-[11px] sm:text-xs"
            >
              <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
