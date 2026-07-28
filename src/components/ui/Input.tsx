import * as React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label uppercase tracking-widest text-white-300 font-inter"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'input-base w-full',
            error && 'border-error focus:border-error',
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-error font-inter mt-0.5">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-white-400 font-inter mt-0.5">{helperText}</span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
