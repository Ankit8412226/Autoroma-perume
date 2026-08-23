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
      <div className={`bg-white border border-brand-green/20 rounded-lg p-8 text-center space-y-4 shadow-md ${className}`}>
        <div className="w-12 h-12 rounded-full bg-brand-soft text-brand-green mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-brand-green" />
        </div>
        <h4 className="font-serif text-2xl text-brand-charcoal font-normal">Private Tour Requested</h4>
        <p className="text-xs text-brand-charcoal/70 font-light leading-relaxed max-w-md mx-auto">
          Thank you, <strong className="text-brand-charcoal font-bold">{formData.fullName}</strong>. Our advisor for {agentName} will contact you shortly to confirm your viewing details.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 bg-brand-green text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark rounded-md transition-all cursor-pointer shadow-sm"
        >
          Submit Another Inquiry
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-brand-green/15 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm ${className}`}>
      <div className="space-y-1 pb-4 border-b border-brand-green/10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green block">
          INQUIRY & ADVISORY
        </span>
        <h4 className="font-serif text-2xl text-brand-charcoal font-normal">
          Schedule a Private Tour
        </h4>
        {propertyTitle && (
          <p className="text-xs text-brand-charcoal/70 font-light">
            Residence: <span className="text-brand-charcoal font-semibold">{propertyTitle}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Vikramaditya Singhania"
            className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-md focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="v.singhania@domain.com"
              className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-md focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98200 00000"
              className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-md focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>
        </div>

        {/* Preferred Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
              Preferred Date
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal text-xs px-3.5 py-3 rounded-md focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
              Preferred Window
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal text-xs px-3.5 py-3 rounded-md focus:outline-none focus:border-brand-green transition-colors"
            >
              <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
              <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
              <option value="Sunset Hour (4 PM - 7 PM)">Sunset Hour (4 PM - 7 PM)</option>
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
            Specific Requirements / Notes
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Mention any specific timing preferences or questions..."
            className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-md focus:outline-none focus:border-brand-green transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-brand-green text-white text-xs font-bold uppercase tracking-[0.18em] rounded-md hover:bg-brand-dark transition-all duration-200 shadow-md cursor-pointer"
        >
          Confirm Viewing Request
        </button>

        <p className="text-[10px] text-brand-charcoal/60 text-center font-light flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
          Client Privacy Protocol Guaranteed
        </p>
      </form>
    </div>
  )
}
