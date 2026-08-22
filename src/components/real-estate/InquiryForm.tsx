'use client'

import * as React from 'react'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

interface InquiryFormProps {
  propertyTitle?: string
  agentName?: string
  className?: string
}

export function InquiryForm({
  propertyTitle,
  agentName = 'Senior Advisory Desk',
  className = '',
}: InquiryFormProps) {
  const [submitted, setSubmitted] = React.useState(false)
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'Morning (10 AM - 1 PM)',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={`bg-bg-surface border border-white/20 p-8 text-center space-y-4 shadow-xl ${className}`}>
        <div className="w-12 h-12 rounded-full bg-gold-300/20 text-gold-300 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-gold-300" />
        </div>
        <h4 className="font-serif text-2xl text-white font-normal">Private Viewing Scheduled</h4>
        <p className="text-xs text-white/80 font-light leading-relaxed max-w-md mx-auto">
          Thank you, <strong className="text-white font-bold">{formData.fullName}</strong>. Our lead estate partner for {agentName} will contact you within 2 business hours to confirm your private tour details.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 bg-gold-300 text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-all cursor-pointer shadow-md"
        >
          Submit Another Inquiry
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-bg-surface border border-white/15 p-6 sm:p-8 space-y-6 shadow-xl ${className}`}>
      <div className="space-y-1.5 pb-4 border-b border-white/15">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold-300 block">
          Confidential Advisory
        </span>
        <h4 className="font-serif text-2xl text-white font-normal">
          Schedule a Private Tour
        </h4>
        {propertyTitle && (
          <p className="text-xs text-white/80 font-light">
            Inquiring about: <span className="text-white font-semibold">{propertyTitle}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-white/80 font-bold block">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Vikramaditya Singhania"
            className="w-full bg-bg-secondary border border-white/25 text-white placeholder-white/50 text-xs px-3.5 py-3 focus:outline-none focus:border-gold-300 transition-colors"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-white/80 font-bold block">
              Confidential Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="v.singhania@domain.com"
              className="w-full bg-bg-secondary border border-white/25 text-white placeholder-white/50 text-xs px-3.5 py-3 focus:outline-none focus:border-gold-300 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-white/80 font-bold block">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98200 00000"
              className="w-full bg-bg-secondary border border-white/25 text-white placeholder-white/50 text-xs px-3.5 py-3 focus:outline-none focus:border-gold-300 transition-colors"
            />
          </div>
        </div>

        {/* Preferred Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-white/80 font-bold block">
              Preferred Date
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full bg-bg-secondary border border-white/25 text-white text-xs px-3.5 py-3 focus:outline-none focus:border-gold-300 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-white/80 font-bold block">
              Preferred Window
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full bg-bg-secondary border border-white/25 text-white text-xs px-3.5 py-3 focus:outline-none focus:border-gold-300 transition-colors"
            >
              <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
              <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
              <option value="Sunset Hour (4 PM - 7 PM)">Sunset Hour (4 PM - 7 PM)</option>
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-white/80 font-bold block">
            Specific Requirements / Notes
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Mention any specific timing preferences, security detail needs, or questions..."
            className="w-full bg-bg-secondary border border-white/25 text-white placeholder-white/50 text-xs px-3.5 py-3 focus:outline-none focus:border-gold-300 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gold-300 text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-xl cursor-pointer border border-gold-300"
        >
          Confirm Viewing Request
        </button>

        <p className="text-[10px] text-white/60 text-center font-light flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-300" />
          Strict NDA & Client Privacy Protocol Guaranteed
        </p>
      </form>
    </div>
  )
}
