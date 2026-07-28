'use client'

import * as React from 'react'

export function OceanWaves({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden leading-none z-10 ${className}`}>
      <style jsx>{`
        .ocean-container {
          height: 80px;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: transparent;
        }

        .wave {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath fill='%23111111' fill-opacity='0.6' d='M800 56.9c-155.5 0-204.9-50-405.5-50-199.7 0-250 50-394.5 50v31.8h800v-31.8z'/%3E%3C/svg%3E") repeat-x;
          position: absolute;
          top: -35px;
          width: 6400px;
          height: 120px;
          animation: wave 18s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          transform: translate3d(0, 0, 0);
          opacity: 0.5;
        }

        .wave:nth-of-type(2) {
          top: -25px;
          animation: wave 12s cubic-bezier(0.36, 0.45, 0.63, 0.53) -.125s infinite, swell 12s ease -1.25s infinite;
          opacity: 0.7;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath fill='%231a1a1a' fill-opacity='0.8' d='M800 56.9c-155.5 0-204.9-50-405.5-50-199.7 0-250 50-394.5 50v31.8h800v-31.8z'/%3E%3C/svg%3E") repeat-x;
        }

        .wave:nth-of-type(3) {
          top: -15px;
          animation: wave 9s cubic-bezier(0.36, 0.45, 0.63, 0.53) -2s infinite, swell 9s ease -2s infinite;
          opacity: 0.9;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath fill='%23050505' fill-opacity='1' d='M800 56.9c-155.5 0-204.9-50-405.5-50-199.7 0-250 50-394.5 50v31.8h800v-31.8z'/%3E%3C/svg%3E") repeat-x;
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
