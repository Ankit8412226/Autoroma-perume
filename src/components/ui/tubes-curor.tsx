'use client'

import React, { useEffect, useRef } from 'react'

interface TubesCursorProps {
  showHeroText?: boolean
  className?: string
}

export default function TubesCursor({ showHeroText = true, className }: TubesCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const appRef = useRef<any>(null)

  const randomColors = (count: number) => {
    return new Array(count)
      .fill(0)
      .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
  }

  useEffect(() => {
    const initTimer = setTimeout(() => {
      import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js' as any)
        .then((module: any) => {
          const TubesCursorImpl = module.default

          if (canvasRef.current) {
            const app = TubesCursorImpl(canvasRef.current, {
              tubes: {
                colors: ['#5e72e4', '#8965e0', '#f5365c'],
                lights: {
                  intensity: 200,
                  colors: ['#21d4fd', '#b721ff', '#f4d03f', '#11cdef'],
                },
              },
            })
            appRef.current = app
          }
        })
        .catch((err) => console.error('Failed to load TubesCursor module:', err))
    }, 100)

    return () => {
      clearTimeout(initTimer)
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        appRef.current.dispose()
      }
    }
  }, [])

  const handleClick = () => {
    if (appRef.current && appRef.current.tubes) {
      const newTubeColors = randomColors(3)
      const newLightColors = randomColors(4)

      appRef.current.tubes.setColors(newTubeColors)
      appRef.current.tubes.setLightsColors(newLightColors)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={
        className ||
        'h-screen w-screen bg-black font-sans overflow-hidden cursor-pointer relative'
      }
    >
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {showHeroText && (
        <div className="relative h-full flex flex-col items-center justify-center gap-2.5 z-10 pointer-events-none">
          <h1 className="m-0 p-0 text-white text-[60px] sm:text-[80px] font-bold uppercase leading-none select-none [text-shadow:0_0_20px_rgba(0,0,0,1)] font-sans">
            Tubes
          </h1>
          <h2 className="m-0 p-0 text-white text-[45px] sm:text-[60px] font-medium uppercase leading-none select-none [text-shadow:0_0_20px_rgba(0,0,0,1)] font-sans">
            Cursor
          </h2>
          <p className="m-0 p-0 text-white text-lg sm:text-xl leading-none select-none [text-shadow:0_0_20px_rgba(0,0,0,1)] font-inter">
            Click to change colors
          </p>
        </div>
      )}
    </div>
  )
}

export { TubesCursor }
