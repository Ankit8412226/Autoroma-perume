import * as React from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-label uppercase tracking-widest text-white-300 font-inter"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          ref={ref}
          className={cn(
            'input-base w-full resize-y min-h-[100px]',
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

Textarea.displayName = 'Textarea'
