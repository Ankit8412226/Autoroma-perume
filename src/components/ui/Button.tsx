import * as React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-inter uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-300 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden group cursor-pointer'

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 text-bg-primary font-semibold hover:brightness-110 shadow-[0_0_20px_rgba(201,169,110,0.25)] hover:shadow-[0_0_35px_rgba(201,169,110,0.5)] border border-gold-200/50 before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700',
      secondary:
        'bg-bg-surface text-white-100 border border-gold-300/40 hover:border-gold-300 hover:text-gold-200 hover:bg-gold-300/10 hover:shadow-[0_0_20px_rgba(201,169,110,0.15)] before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-gold-300/20 before:to-transparent before:transition-transform before:duration-700',
      tertiary: 'bg-transparent text-gold-300 hover:text-white-100 hover:bg-white-500/10',
      ghost: 'bg-transparent text-white-200 hover:text-gold-300 hover:bg-white-500/5',
      destructive: 'bg-red-900/80 text-white-100 hover:bg-red-800 border border-red-500/30',
      icon: 'p-2 bg-bg-surface border border-white-500/20 hover:border-gold-300 text-white-200 hover:text-gold-300 rounded-none',
    }

    const sizeStyles = {
      sm: 'h-9 px-4 py-2 text-[10px]',
      md: 'h-11 px-6 py-3 text-xs',
      lg: 'h-13 px-8 py-4 text-xs tracking-[0.2em]',
      xl: 'h-14 px-10 py-4 text-xs font-semibold tracking-[0.25em]',
      icon: 'h-10 w-10 p-0',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
