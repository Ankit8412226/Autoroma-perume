'use client'

import * as React from 'react'
import Link from 'next/link'
import { PROPERTIES } from '@/data/properties'
import { PropertyGrid } from '@/components/real-estate/PropertyGrid'
import { useSavedStore } from '@/stores/saved.store'
import { Bookmark, Trash2, ArrowRight } from 'lucide-react'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/15">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-gold-300 fill-gold-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-300">
              PRIVATE VAULT
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Saved Bookmarked Estates ({savedProperties.length})
          </h1>
        </div>

        {savedProperties.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-rose-500 hover:text-white border border-white/25 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved Vault</span>
          </button>
        )}
      </div>

      {savedProperties.length === 0 ? (
        <div className="text-center py-20 px-4 bg-bg-surface border border-white/15 space-y-4 shadow-xl">
          <Bookmark className="w-10 h-10 text-gold-300 mx-auto" />
          <h3 className="font-serif text-2xl text-white">Your Saved Vault is Empty</h3>
          <p className="text-xs text-white/80 font-light max-w-md mx-auto">
            Click the bookmark icon on any luxury property card to save residences to your private dashboard.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gold-300 text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl cursor-pointer"
          >
            <span>Explore Property Directory</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>
      ) : (
        <PropertyGrid properties={savedProperties} columns={3} variant="B" />
      )}
    </div>
  )
}
