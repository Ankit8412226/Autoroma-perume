'use client'

import * as React from 'react'
import { X, Building2 } from 'lucide-react'
import { getApiBaseUrl } from '@/utils/api'

const MIN_BULK_UNITS = 2
const DEFAULT_UNIT_COUNT = 2
const PROPERTY_TYPE_OPTIONS = [
  { value: '', label: 'Any type' },
  { value: 'RESIDENTIAL_PLOT', label: 'Residential plot' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'SHOWROOM', label: 'Showroom' },
  { value: 'LAND', label: 'Land' },
]
const BUDGET_OPTIONS = [
  { value: '', label: 'Discuss on call' },
  { value: 'UNDER_50L', label: 'Under ₹50 Lakh' },
  { value: '50L_1CR', label: '₹50 Lakh – ₹1 Cr' },
  { value: '1CR_3CR', label: '₹1 Cr – ₹3 Cr' },
  { value: '3CR_PLUS', label: '₹3 Cr+' },
]

export interface BulkBuyContext {
  propertyId?: string
  propertyTitle?: string
  city?: string
  propertyType?: string
}

interface BulkBuyModalProps {
  isOpen: boolean
  onClose: () => void
  context?: BulkBuyContext | null
}

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  unitCount: String(DEFAULT_UNIT_COUNT),
  budgetRange: '',
  propertyType: '',
  city: '',
  message: '',
}

export function BulkBuyModal({ isOpen, onClose, context }: BulkBuyModalProps) {
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  React.useEffect(() => {
    if (!isOpen) return
    setStatus('idle')
    setErrorMessage('')
    setForm({
      ...EMPTY_FORM,
      city: context?.city || '',
      propertyType: context?.propertyType || '',
      message: context?.propertyTitle
        ? `Interested in bulk purchase related to ${context.propertyTitle}.`
        : '',
    })
  }, [isOpen, context?.city, context?.propertyType, context?.propertyTitle])

  if (!isOpen) return null

  const patch = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/public/bulk-buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          unitCount: Number(form.unitCount) || DEFAULT_UNIT_COUNT,
          budgetRange: form.budgetRange,
          propertyType: form.propertyType,
          city: form.city.trim(),
          propertyId: context?.propertyId || '',
          propertyTitle: context?.propertyTitle || '',
          message: form.message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMessage(data.message || 'Could not send your request. Try again.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close bulk buy form"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-buy-title"
        className="relative w-full max-w-lg bg-white rounded-3xl border border-brand-green/15 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-green">Bulk purchase</p>
            <h2 id="bulk-buy-title" className="font-serif text-2xl font-bold text-brand-charcoal mt-1">
              Talk to us for a bulk buy
            </h2>
            <p className="text-xs text-brand-charcoal/60 mt-1">
              {context?.propertyTitle
                ? `Request for ${context.propertyTitle}`
                : 'Share your requirement. An advisor will call you.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#EAF3EF] text-brand-green hover:bg-brand-green hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
            <p className="font-bold">Request received.</p>
            <p className="mt-1 text-xs">Our desk will contact you on the number you shared.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-bold text-brand-charcoal/70">Full name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => patch('name', e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-bold text-brand-charcoal/70">Phone</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => patch('phone', e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green"
                />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="font-bold text-brand-charcoal/70">Email (optional)</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => patch('email', e.target.value)}
                className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-bold text-brand-charcoal/70">Units to buy</span>
                <input
                  required
                  type="number"
                  min={MIN_BULK_UNITS}
                  value={form.unitCount}
                  onChange={(e) => patch('unitCount', e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-bold text-brand-charcoal/70">Budget</span>
                <select
                  value={form.budgetRange}
                  onChange={(e) => patch('budgetRange', e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green"
                >
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option.value || 'any'} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-bold text-brand-charcoal/70">Property type</span>
                <select
                  value={form.propertyType}
                  onChange={(e) => patch('propertyType', e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green"
                >
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <option key={option.value || 'any'} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="font-bold text-brand-charcoal/70">Preferred city</span>
                <input
                  value={form.city}
                  onChange={(e) => patch('city', e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green"
                />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="font-bold text-brand-charcoal/70">Message</span>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => patch('message', e.target.value)}
                className="w-full bg-[#FAF9F6] border border-brand-green/20 rounded-xl px-3 py-2 font-semibold text-brand-charcoal focus:outline-none focus:border-brand-green resize-none"
              />
            </label>
            {status === 'error' && errorMessage ? (
              <p className="text-red-600 font-semibold">{errorMessage}</p>
            ) : null}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 rounded-xl bg-brand-green text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Building2 className="w-4 h-4" />
              {status === 'submitting' ? 'Sending…' : 'Request a callback'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
