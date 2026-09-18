'use client'

import * as React from 'react'
import Image from 'next/image'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { getApiBaseUrl } from '@/utils/api'
import { FALLBACK_IMAGE, SITE } from '@/utils/siteConfig'
import {
  Flame,
  Percent,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  X,
  ArrowRight,
  Sparkles,
  Send,
  Building2,
  Layers,
  Award
} from 'lucide-react'

interface PublicBulkDeal {
  _id: string
  title: string
  slug: string
  dealType: 'PROJECT' | 'PROPERTY' | 'PACKAGE'
  location: string
  city: string
  state: string
  originalPriceDisplay: string
  bulkPriceDisplay: string
  discountPercentage: number
  minQuantity: string
  totalPackageUnits: string
  perks: string[]
  bannerImage: string
  description: string
  isAvailable: boolean
  isFeatured: boolean
  projectId?: {
    _id: string
    name: string
    code: string
    bannerImage?: string
  }
}

export default function BulkDealsPage() {
  const [deals, setDeals] = React.useState<PublicBulkDeal[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedFilter, setSelectedFilter] = React.useState('ALL')

  // Modal Quote Request State
  const [selectedDeal, setSelectedDeal] = React.useState<PublicBulkDeal | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const [requestForm, setRequestForm] = React.useState({
    name: '',
    phone: '',
    email: '',
    unitCount: '5',
    budgetRange: '₹50 Lakhs - ₹1 Crore',
    message: ''
  })

  React.useEffect(() => {
    const loadDeals = async () => {
      try {
        const baseUrl = getApiBaseUrl()
        const res = await fetch(`${baseUrl}/public/bulk-deals`).catch(() => null)
        if (res && res.ok) {
          const data = await res.json().catch(() => [])
          setDeals(Array.isArray(data) ? data : [])
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadDeals()
  }, [])

  const filteredDeals = React.useMemo(() => {
    if (selectedFilter === 'ALL') return deals
    return deals.filter((d) => d.dealType === selectedFilter)
  }, [deals, selectedFilter])

  const handleOpenModal = (deal: PublicBulkDeal) => {
    setSelectedDeal(deal)
    setIsSubmitted(false)
    setRequestForm({
      name: '',
      phone: '',
      email: '',
      unitCount: deal.minQuantity ? deal.minQuantity.split(' ')[0] : '5',
      budgetRange: '₹50 Lakhs - ₹1 Crore',
      message: ''
    })
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestForm.name || !requestForm.phone) {
      alert('Please enter your name and phone number')
      return
    }

    try {
      setIsSubmitting(true)
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/public/bulk-deals/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestForm,
          bulkDealId: selectedDeal?._id,
          dealTitle: selectedDeal?.title,
          city: selectedDeal?.city
        })
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        alert('Failed to submit request. Please try again or call our bulk deal desk directly.')
      }
    } catch (err) {
      console.error(err)
      alert('Error submitting request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappLink = selectedDeal
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
        `Hi House & Sky Desk, I am interested in the Bulk Deal Package: "${selectedDeal.title}" (${selectedDeal.minQuantity}). Please share inventory chart and wholesale quote.`
      )}`
    : `https://wa.me/${SITE.whatsapp}`

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-20 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950/40 via-neutral-950 to-neutral-950 border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-400" /> Exclusive Wholesale & Syndicate Deals
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Institutional & Bulk Investor Packages
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Lock wholesale land rates, group syndicate packages, and direct builder pricing for high-yielding Dholera SIR & Gujarat growth corridors.
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <Percent className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">15% - 35% OFF</span>
                  <span className="text-[10px] text-neutral-400">Below Retail Rates</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">NA Clear Title</span>
                  <span className="text-[10px] text-neutral-400">100% Legal Verified</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">0% Brokerage</span>
                  <span className="text-[10px] text-neutral-400">Direct Developer Deal</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Free Site Visit</span>
                  <span className="text-[10px] text-neutral-400">Flight / Cab VIP Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Category Filter Tabs */}
        {!isLoading && deals.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { label: 'All Deals', value: 'ALL' },
              { label: 'Project Bundles', value: 'PROJECT' },
              { label: 'Property Deals', value: 'PROPERTY' },
              { label: 'Custom Syndicates', value: 'PACKAGE' }
            ].map((tab) => {
              const isActive = selectedFilter === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedFilter(tab.value)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-neutral-900 border border-white/10 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-neutral-900 animate-pulse rounded-3xl border border-white/10" />
            ))}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-16 text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Bulk Deals Available</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
              There are currently no active bulk deal packages under this category. Contact our bulk deals desk directly to build a custom investor package.
            </p>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> Call Bulk Deals Desk
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const bgImg =
                deal.bannerImage ||
                deal.projectId?.bannerImage ||
                FALLBACK_IMAGE

              return (
                <div
                  key={deal._id}
                  className="group relative bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden">
                      <Image
                        src={bgImg}
                        alt={deal.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-slate-950" /> {deal.discountPercentage}% OFF
                        </span>
                        <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20 uppercase tracking-wider">
                          {deal.dealType}
                        </span>
                      </div>

                      {/* Location Pill */}
                      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-neutral-200 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {deal.city || 'Dholera'}, {deal.state || 'Gujarat'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                          {deal.title}
                        </h3>
                        {deal.description && (
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                            {deal.description}
                          </p>
                        )}
                      </div>

                      {/* Pricing Comparison */}
                      <div className="bg-neutral-950 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 font-semibold uppercase block">Original Price</span>
                          <span className="text-xs text-neutral-400 line-through font-bold">
                            {deal.originalPriceDisplay || 'N/A'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-amber-400 font-bold uppercase block">🔥 Special Bulk Rate</span>
                          <span className="text-base text-amber-400 font-extrabold">
                            {deal.bulkPriceDisplay || 'Special Quote'}
                          </span>
                        </div>
                      </div>

                      {/* Quantities */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-neutral-400 font-semibold uppercase block">Min Order</span>
                          <span className="font-bold text-white">{deal.minQuantity || '5 Plots'}</span>
                        </div>
                        <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-neutral-400 font-semibold uppercase block">Deal Stock</span>
                          <span className="font-bold text-white">{deal.totalPackageUnits || 'Limited'}</span>
                        </div>
                      </div>

                      {/* Perks */}
                      {deal.perks && deal.perks.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Package Benefits</span>
                          <div className="space-y-1">
                            {deal.perks.slice(0, 3).map((perk, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">{perk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleOpenModal(deal)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                    >
                      <span>Request Bulk Deal Quote</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* REQUEST QUOTE MODAL */}
      {selectedDeal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedDeal(null)}
        >
          <div
            className="relative max-w-xl w-full bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    BULK INVESTOR INQUIRY
                  </span>
                  <h3 className="text-white text-base font-bold truncate max-w-xs">{selectedDeal.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Quote Request Received!</h3>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{requestForm.name}</strong>. Our Head of Bulk Deal Acquisitions will reach out to you within 2 business hours with official inventory charts and pricing breakdown.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat on WhatsApp Now
                    </a>
                    <button
                      onClick={() => setSelectedDeal(null)}
                      className="w-full sm:w-auto px-5 py-3 bg-neutral-800 text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-700 transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  {/* Deal summary mini pill */}
                  <div className="bg-neutral-950 p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Target Rate</span>
                      <span className="font-bold text-amber-400">{selectedDeal.bulkPriceDisplay || 'Wholesale'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block">Min Package</span>
                      <span className="font-bold text-white">{selectedDeal.minQuantity}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={requestForm.name}
                      onChange={(e) => setRequestForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={requestForm.phone}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="investor@domain.com"
                        value={requestForm.email}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                        Target Quantity / Plots
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Plots / 2500 SQYD"
                        value={requestForm.unitCount}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, unitCount: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                        Investment Budget Range
                      </label>
                      <select
                        value={requestForm.budgetRange}
                        onChange={(e) => setRequestForm((prev) => ({ ...prev, budgetRange: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                      >
                        <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                        <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                        <option value="₹1 Crore - ₹3 Crores">₹1 Crore - ₹3 Crores</option>
                        <option value="₹3 Crores+">₹3 Crores+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                      Custom Remarks / Requirements
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Looking for contiguous corner plots with immediate registry..."
                      value={requestForm.message}
                      onChange={(e) => setRequestForm((prev) => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDeal(null)}
                      className="px-4 py-2.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
