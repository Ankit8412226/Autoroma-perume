import * as React from 'react'
import { TrendingUp, BarChart3, Building, ShieldCheck } from 'lucide-react'

export function MarketSnapshot() {
  const marketData = [
    { city: 'Mumbai Seafront', avgPrice: '₹68,500 / sq ft', growth: '+12.4% YoY', listings: '42 Active Estates' },
    { city: 'Goa Coastal Valleys', avgPrice: '₹28,000 / sq ft', growth: '+18.2% YoY', listings: '28 Active Estates' },
    { city: 'Delhi NCR Golf Course', avgPrice: '₹42,000 / sq ft', growth: '+14.1% YoY', listings: '35 Active Estates' },
    { city: 'Bangalore Sadashivnagar', avgPrice: '₹24,500 / sq ft', growth: '+11.8% YoY', listings: '31 Active Estates' },
  ]

  return (
    <div className="bg-bg-secondary border border-white/15 p-8 sm:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gold-300" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">
              REAL ESTATE INTELLIGENCE
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Q3 Market Snapshot & Capital Yields
          </h3>
        </div>

        <span className="text-xs font-mono text-white/50">
          Source: Aura Analytics · Updated August 2026
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketData.map((data) => (
          <div key={data.city} className="bg-bg-surface border border-white/10 p-6 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              {data.city}
            </span>
            <div className="space-y-1">
              <span className="text-lg font-bold font-sans text-white block">{data.avgPrice}</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {data.growth}
              </span>
            </div>
            <span className="text-[11px] text-white/50 font-mono block pt-2 border-t border-white/5">
              {data.listings}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
