'use client'

import * as React from 'react'

interface OceanWavesProps {
  className?: string
  height?: number
  mode?: 'divider' | 'background' | 'interactive'
  opacity?: number
}

export function OceanWaves({
  className = '',
  height = 110,
  mode = 'divider',
  opacity = 1,
}: OceanWavesProps) {
  const [mouseOffset, setMouseOffset] = React.useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'interactive') {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      setMouseOffset(x * 0.08)
    }
  }

  const containerStyles =
    mode === 'background'
      ? 'absolute inset-0 pointer-events-none opacity-40 overflow-hidden'
      : `relative w-full overflow-hidden leading-none z-10 ${className}`

  return (
    <div
      onMouseMove={handleMouseMove}
      className={containerStyles}
      style={{ opacity: mode === 'background' ? opacity : undefined }}
    >
      <style jsx>{`
        .ocean-container {
          height: ${height}px;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: transparent;
        }

        .wave {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath fill='%231a1a1a' fill-opacity='0.6' d='M800 56.9c-155.5 0-204.9-50-405.5-50-199.7 0-250 50-394.5 50v31.8h800v-31.8z'/%3E%3C/svg%3E") repeat-x;
          position: absolute;
          top: -35px;
          width: 6400px;
          height: ${height + 40}px;
          animation: wave 16s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          transform: translate3d(${mouseOffset}px, 0, 0);
          transition: transform 0.2s ease-out;
          opacity: 0.7;
        }

        .wave:nth-of-type(2) {
          top: -25px;
          animation: wave 10s cubic-bezier(0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 10s ease -1.25s infinite;
          opacity: 0.85;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath fill='%23262626' fill-opacity='0.8' d='M800 56.9c-155.5 0-204.9-50-405.5-50-199.7 0-250 50-394.5 50v31.8h800v-31.8z'/%3E%3C/svg%3E") repeat-x;
        }

        .wave:nth-of-type(3) {
          top: -15px;
          animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -2s infinite, swell 7s ease -2s infinite;
          opacity: 0.95;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath fill='%230d0d0d' fill-opacity='1' d='M800 56.9c-155.5 0-204.9-50-405.5-50-199.7 0-250 50-394.5 50v31.8h800v-31.8z'/%3E%3C/svg%3E") repeat-x;
        }

        @keyframes wave {
          0% {
            margin-left: 0;
          }
          100% {
            margin-left: -1600px;
          }
        }

        @keyframes swell {
          0%, 100% {
            transform: translate3d(0, -2px, 0);
          }
          50% {
            transform: translate3d(0, 5px, 0);
          }
        }
      `}</style>

      <div className="ocean-container">
        <div className="wave" />
        <div className="wave" />
        <div className="wave" />
      </div>
    </div>
  )
}
