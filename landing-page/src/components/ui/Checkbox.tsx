import * as React from 'react'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, checked, id, onChange, ...props }, ref) => {
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={checkboxId} className="inline-flex items-center gap-3 cursor-pointer group select-none">
          <div className="relative">
            <input
              id={checkboxId}
              type="checkbox"
              ref={ref}
              checked={checked}
              onChange={onChange}
              className="sr-only peer"
              {...props}
            />
            <div
              className={cn(
                'h-5 w-5 border border-white-500 bg-transparent rounded-none transition-colors duration-150',
                'peer-checked:bg-gold-300 peer-checked:border-gold-300',
                'peer-focus:ring-1 peer-focus:ring-gold-300 peer-focus:ring-offset-1 peer-focus:ring-offset-bg-primary',
                'group-hover:border-gold-300/70',
                className
              )}
            >
              {checked && <Check className="h-3.5 w-3.5 text-bg-primary absolute inset-0 m-auto stroke-[3]" />}
            </div>
          </div>
          {label && <span className="text-sm font-inter text-white-200 group-hover:text-white-100">{label}</span>}
        </label>
        {error && <span className="text-xs text-error font-inter pl-8">{error}</span>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
