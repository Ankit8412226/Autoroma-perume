'use client'

import * as React from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const cursorRef = React.useRef<HTMLDivElement>(null)
  const dotRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    // Hide default cursor on desktop
    document.body.style.cursor = 'default'

    const moveCursor = (e: MouseEvent) => {
      // Follow cursor with smooth GSAP lag for trailing luxury feel
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power2.out',
      })

      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power1.out',
      })
    }

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.7, duration: 0.15 })
    }

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1.0, duration: 0.2 })
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <>
      {/* Outer Golden Trailing Ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold-300/60 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block shadow-[0_0_15px_rgba(201,169,110,0.3)] transition-transform duration-100"
      />
      {/* Inner Precision Point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-gold-300 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
    </>
  )
}
