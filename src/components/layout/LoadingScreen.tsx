'use client'

import * as React from 'react'

export function LoadingScreen() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Only show loading screen on first visit per session
    const hasVisited = sessionStorage.getItem('maison_visited')
    if (hasVisited) {
      setLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('maison_visited', 'true')
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col items-center justify-center animate-out fade-out duration-500">
      <div className="flex flex-col items-center gap-3">
        <span className="font-cormorant text-3xl tracking-widest text-white-100 uppercase animate-pulse">
          Autoroma
        </span>
        <div className="w-16 h-[1px] bg-gold-300/40" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold-300 font-inter">
          Preparing Drive Experience
        </span>
      </div>
    </div>
  )
}
