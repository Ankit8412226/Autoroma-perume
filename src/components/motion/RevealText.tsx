'use client'

import * as React from 'react'
import { gsap } from 'gsap'
import { getMotionPreference } from '@/utils/motion'
import { cn } from '@/utils/cn'

export interface RevealTextProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
}

export function RevealText({
  children,
  className,
  as: Component = 'h1',
  delay = 0,
}: RevealTextProps) {
  const containerRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (!containerRef.current) return
    if (getMotionPreference() === 'reduced') return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          delay,
          ease: 'power3.out',
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [delay])

  return (
    <Component ref={containerRef as any} className={cn('will-change-transform', className)}>
      {children}
    </Component>
  )
}
