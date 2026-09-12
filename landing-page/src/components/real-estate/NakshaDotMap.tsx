'use client'

import * as React from 'react'
import Image from 'next/image'

export const DOT_GREEN = '#22C55E'
export const DOT_YELLOW = '#EAB308'
export const DOT_RED = '#EF4444'

export function statusDotColor(status: string): string {
  if (status === 'SOLD') return DOT_RED
  if (status === 'AVAILABLE') return DOT_GREEN
  return DOT_YELLOW
}

export function hasPinnedMarker(plot: any): boolean {
  const rawX = plot?.marker?.xPercent
  const rawY = plot?.marker?.yPercent
  if (rawX === null || rawX === undefined || rawY === null || rawY === undefined) return false
  const x = Number(rawX)
  const y = Number(rawY)
  return Number.isFinite(x) && Number.isFinite(y)
}

export function deriveFacing(plot: any): string {
  if (plot?.facing) return plot.facing
  if (Number(plot?.plcParkFacing) > 0) return 'Park / Garden Facing'
  if (Number(plot?.plcCorner) > 0) return 'Corner Plot'
  if (Number(plot?.plc12mtr) > 0) return '12m Road Facing'
  if (Number(plot?.plc9mtr) > 0) return '9m Road Facing'
  return 'Standard'
}

export function derivePlotType(plot: any): string {
  if (plot?.plotType && plot.plotType !== 'SIMPLE') return String(plot.plotType).replace(/_/g, ' ')
  const facing = deriveFacing(plot)
  if (facing !== 'Standard') return facing
  return 'Simple'
}

interface NakshaDotMapProps {
  imageUrl: string
  imageAlt: string
  plots: any[]
  onSelectPlot?: (plot: any) => void
}

export function NakshaDotMap({ imageUrl, imageAlt, plots, onSelectPlot }: NakshaDotMapProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const pinned = (plots || []).filter(hasPinnedMarker)
  const hovered = pinned.find((plot) => plot._id === hoveredId)
  const hoverX = Number(hovered?.marker?.xPercent) || 0
  const hoverY = Number(hovered?.marker?.yPercent) || 0
  const cardBelow = hoverY < 48
  const cardRight = hoverX > 58

  return (
    <div className="relative w-full isolate">
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={1400}
        height={900}
        className="w-full h-auto block select-none"
        unoptimized
      />

      {pinned.length === 0 && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-brand-charcoal/50 bg-white/80 px-3 py-1 rounded-full">
          Plot pins appear after admin places them on this naksha
        </p>
      )}

      {pinned.map((plot) => {
        const color = statusDotColor(plot.status)
        const isAvailable = plot.status === 'AVAILABLE'
        const isHovered = hoveredId === plot._id
        return (
          <button
            key={plot._id}
            type="button"
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${isHovered ? 'z-30' : 'z-10'}`}
            style={{
              left: `${plot.marker.xPercent}%`,
              top: `${plot.marker.yPercent}%`
            }}
            onMouseEnter={() => setHoveredId(plot._id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectPlot?.(plot)}
            aria-label={`Plot ${plot.plotNo}`}
          >
            <span className="relative flex h-4 w-4 items-center justify-center pointer-events-none">
              {isAvailable && (
                <span className="absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping" style={{ backgroundColor: color }} />
              )}
              <span
                className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
              />
            </span>
          </button>
        )
      })}

      {hovered && (
        <div
          className="absolute z-40 w-56 pointer-events-none bg-white text-left rounded-xl shadow-2xl border border-brand-green/20 p-3"
          style={{
            left: `${hoverX}%`,
            top: cardBelow ? `${hoverY}%` : undefined,
            bottom: cardBelow ? undefined : `${100 - hoverY}%`,
            transform: cardRight ? 'translate(calc(-100% - 12px), 0)' : 'translate(12px, 0)',
            marginTop: cardBelow ? '12px' : undefined,
            marginBottom: cardBelow ? undefined : '12px'
          }}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-green mb-2">Plot details</p>
          <dl className="space-y-1 text-[11px] text-brand-charcoal">
            <Row label="Plot Number" value={hovered.plotNo} />
            <Row label="Plot Type" value={derivePlotType(hovered)} />
            <Row label="Facing" value={deriveFacing(hovered)} />
            <Row label="Area Sq Ft" value={hovered.sizeSqft || '—'} />
            <Row label="Super Built Up" value={hovered.superBuiltUpSqft || hovered.sizeSqft || '—'} />
            <Row label="Dimension" value={hovered.dimensions || '—'} />
            <Row label="PLC" value={hovered.totalPlc ? `${hovered.totalPlc}` : '0'} />
            <Row label="Status" value={hovered.status} />
          </dl>
          {hovered.status === 'AVAILABLE' && (
            <p className="mt-2 text-[10px] font-bold text-brand-green">Inquiry / Book now</p>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-brand-charcoal/50">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  )
}
