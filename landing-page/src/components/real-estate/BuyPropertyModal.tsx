'use client'

import * as React from 'react'
import { X, ShoppingCart, Phone, Mail, User, DollarSign, MessageCircle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { getApiBaseUrl } from '@/utils/api'

interface BuyPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  propertyTitle: string
  propertyCity?: string
  propertyPrice?: string
}

const BUDGET_OPTIONS = [
  'Under ₹25 Lakhs',
  '₹25L – ₹50L',
  '₹50L – ₹1 Crore',
  '₹1 Cr – ₹3 Crores',
  '₹3 Cr – ₹5 Crores',
  'Above ₹5 Crores',
  'Flexible / Negotiable',
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function BuyPropertyModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  propertyCity,
  propertyPrice,
}: BuyPropertyModalProps) {
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [budget, setBudget] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [formState, setFormState] = React.useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = React.useState('')

  React.useEffect(() => {
    if (!isOpen) {
      setFormState('idle')
      setErrorMsg('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setFormState('loading')
    setErrorMsg('')

    try {
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/public/properties/${propertyId}/buy-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          budget: budget || undefined,
          message: message.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message || 'Submission failed. Please try again.')
      }
      setFormState('success')
    } catch (err: any) {
      setFormState('error')
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-emerald-500/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#051711] via-[#0A2E23] to-[#0B4F3C] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Interested to Buy?</h2>
              <p className="text-[11px] text-white/60">Submit your buy inquiry — free, no brokerage</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/15">
            <p className="text-xs font-bold text-white truncate">{propertyTitle}</p>
            {(propertyCity || propertyPrice) && (
              <p className="text-[11px] text-emerald-300 mt-0.5 flex items-center gap-2">
                {propertyCity && <span>📍 {propertyCity}</span>}
                {propertyPrice && <span>💰 {propertyPrice}</span>}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {formState === 'success' ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-slate-900">Inquiry Submitted!</h3>
                <p className="text-sm text-slate-500">
                  Our senior advisory team will reach out to <span className="font-bold text-slate-700">{phone}</span> within 24 hours.
                </p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                ✅ Zero brokerage · Admin-verified listing · RERA compliant
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#0B4F3C] text-white font-bold text-sm hover:bg-[#0a4434] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formState === 'error' && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {/* Name */}
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number * (for callback)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Budget */}
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">Select Your Budget (optional)</option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={3}
                    placeholder="Any specific requirements or questions? (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formState === 'loading' || !name.trim() || !phone.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#0B4F3C] hover:bg-[#0a4434] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-900/20"
              >
                {formState === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Inquiry…
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Submit Buy Inquiry — Free
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 font-medium">
                🔒 Zero brokerage · No spam · Your data is secure
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
