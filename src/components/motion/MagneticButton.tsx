'use client'

import * as React from 'react'
import { gsap } from 'gsap'
import { getMotionPreference } from '@/utils/motion'
import { cn } from '@/utils/cn'

export function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const buttonRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = buttonRef.current
    if (!el || getMotionPreference() === 'reduced') return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY

      gsap.to(el, {
        x: distanceX * 0.25,
        y: distanceY * 0.25,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={buttonRef} className={cn('inline-block will-change-transform', className)}>
      {children}
    </div>
  )
}
