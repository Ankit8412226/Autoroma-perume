'use client'

import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (val: string) => void
  placeholder?: string
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  icon: Icon,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3 text-gold-300" />}
          {label}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-bg-surface border text-left text-xs px-3.5 py-3 flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'border-gold-300 shadow-lg shadow-gold-300/10 text-white'
            : 'border-white/15 hover:border-white/40 text-white/90'
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gold-300 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Options Panel Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-bg-surface border border-white/20 shadow-2xl backdrop-blur-xl max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left text-xs px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-gold-300/15 text-gold-300 font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-gold-300 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
