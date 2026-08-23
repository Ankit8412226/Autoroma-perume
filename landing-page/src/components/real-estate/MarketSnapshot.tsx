import * as React from 'react'
import { TrendingUp, BarChart3 } from 'lucide-react'

export function MarketSnapshot() {
  const marketData = [
    { city: 'Mumbai Seafront', avgPrice: '₹68,500 / sq ft', growth: '+12.4% YoY', listings: '42 Active Properties' },
    { city: 'Goa Coastal Valleys', avgPrice: '₹28,000 / sq ft', growth: '+18.2% YoY', listings: '28 Active Properties' },
    { city: 'Delhi NCR Golf Course', avgPrice: '₹42,000 / sq ft', growth: '+14.1% YoY', listings: '35 Active Properties' },
    { city: 'Bangalore Sadashivnagar', avgPrice: '₹24,500 / sq ft', growth: '+11.8% YoY', listings: '31 Active Properties' },
  ]

  return (
    <div className="bg-white border border-brand-green/15 rounded-lg p-8 sm:p-10 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-brand-green/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-soft border border-brand-green/15 rounded-md">
            <BarChart3 className="w-4 h-4 text-brand-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
              REAL ESTATE INTELLIGENCE
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-normal">
            Market Snapshot & Growth Yields
          </h3>
        </div>

        <span className="text-xs font-mono text-brand-charcoal/60">
          Source: House & Sky Analytics · Updated 2026
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketData.map((data) => (
          <div key={data.city} className="bg-brand-soft/40 border border-brand-green/15 rounded-md p-6 space-y-3">
            <span className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
              {data.city}
            </span>
            <div className="space-y-1">
              <span className="text-lg font-bold font-sans text-brand-charcoal block">{data.avgPrice}</span>
              <span className="text-xs text-brand-green font-mono font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {data.growth}
              </span>
            </div>
            <span className="text-[11px] text-brand-charcoal/60 font-mono block pt-2 border-t border-brand-green/10">
              {data.listings}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
