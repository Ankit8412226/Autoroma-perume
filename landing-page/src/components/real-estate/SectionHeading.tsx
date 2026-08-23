import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: {
    label: string
    href: string
  }
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 ${
        align === 'center' ? 'text-center md:text-center items-center md:items-center' : ''
      } ${className}`}
    >
      <div className="space-y-2 max-w-2xl">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-brand-soft border border-brand-green/15 rounded-md">
            <span className="w-2 h-2 bg-brand-green rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-charcoal font-normal leading-[1.1] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-green hover:underline shrink-0 pb-1"
        >
          <span>{action.label}</span>
          <ArrowUpRight className="w-4 h-4 text-brand-green" />
        </Link>
      )}
    </div>
  )
}
