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
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14 ${
        align === 'center' ? 'text-center md:text-center items-center md:items-center' : ''
      } ${className}`}
    >
      <div className="space-y-3 max-w-2xl">
        {eyebrow && (
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-gold-300 rounded-full animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.1] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 hover:text-white transition-colors group shrink-0 border-b border-gold-300/40 pb-1"
        >
          <span>{action.label}</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      )}
    </div>
  )
}
