import * as React from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5 relative">
        {label && (
          <label
            htmlFor={selectId}
            className="text-label uppercase tracking-widest text-white-300 font-inter"
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'input-base w-full appearance-none pr-10 cursor-pointer bg-bg-surface text-white-100',
              error && 'border-error focus:border-error',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bg-elevated text-white-100 py-2">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-300 pointer-events-none" />
        </div>
        {error && <span className="text-xs text-error font-inter mt-0.5">{error}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'
