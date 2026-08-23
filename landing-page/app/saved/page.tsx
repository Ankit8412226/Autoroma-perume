'use client'

import * as React from 'react'
import Link from 'next/link'
import { PROPERTIES } from '@/data/properties'
import { PropertyGrid } from '@/components/real-estate/PropertyGrid'
import { useSavedStore } from '@/stores/saved.store'
import { Bookmark, Trash2, ArrowRight, ShieldCheck, Building2 } from 'lucide-react'

export default function SavedPropertiesPage() {
  const [mounted, setMounted] = React.useState(false)
  const propertyIds = useSavedStore((state) => state.propertyIds)
  const clearAll = useSavedStore((state) => state.clearAll)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const savedProperties = React.useMemo(() => {
    if (!mounted) return []
    return PROPERTIES.filter((p) => propertyIds.includes(p.id))
  }, [mounted, propertyIds])

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="bg-white p-8 rounded-3xl border border-brand-green/15 shadow-sm flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-soft border border-brand-green/20 rounded-full">
              <Bookmark className="w-3.5 h-3.5 text-brand-green fill-brand-green" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
                PRIVATE CLIENT VAULT
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171A18] font-normal">
              Bookmarked Estates & Saved Residences
            </h1>
            <p className="text-xs sm:text-sm text-[#171A18]/70 font-light">
              Your curated portfolio of bookmarked properties across Bandra, Assagao, and Gurgaon.
            </p>
          </div>

          {savedProperties.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-700 text-xs font-bold rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Saved Vault</span>
            </button>
          )}
        </div>

        {/* Saved Properties Grid or Empty State */}
        {savedProperties.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-brand-green/15 space-y-6 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-brand-soft border border-brand-green/20 text-brand-green flex items-center justify-center mx-auto shadow-md">
              <Bookmark className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#171A18] font-normal">Your Private Vault is Empty</h3>
              <p className="text-xs sm:text-sm text-[#171A18]/70 font-light max-w-md mx-auto leading-relaxed">
                Click the bookmark icon on any House & Sky residence card to save properties directly to your private dashboard.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer border border-[#0B4F3C]"
              >
                <span>Explore Property Catalog</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B4F3C] uppercase tracking-wider">
                Showing {savedProperties.length} Saved {savedProperties.length === 1 ? 'Residence' : 'Residences'}
              </span>
            </div>
            <PropertyGrid properties={savedProperties} columns={3} variant="B" />
          </div>
        )}
      </div>
    </div>
  )
}
