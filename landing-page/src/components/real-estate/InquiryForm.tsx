'use client'

import * as React from 'react'
import { ShieldCheck, CheckCircle2, UserCheck, Clock } from 'lucide-react'

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
  const [isAgentApplication, setIsAgentApplication] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState('')

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    inquiryType: 'CUSTOMER_VIEWING',
    preferredDate: '',
    preferredTime: 'Morning (10 AM - 1 PM)',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('')

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    if (isAgentApplication) {
      try {
        const res = await fetch(`${baseUrl}/public/agent-application`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password || 'Password123!',
            message: formData.message
          })
        })

        const data = await res.json()

        if (!res.ok) {
          alert(data.message || 'Failed to submit agent application.')
          setIsSubmitting(false)
          return
        }

        setStatusMessage(data.message || '🎉 Agent application submitted successfully! Pending Admin/Manager approval.')
        setSubmitted(true)
      } catch (err) {
        console.error(err)
        alert('Failed to connect to backend server. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      try {
        const res = await fetch(`${baseUrl}/public/inquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            inquiryType: 'SITE_VISIT',
            plotNo: propertyTitle || '',
            message: `Preferred Window: ${formData.preferredTime} | Date: ${formData.preferredDate || 'Anytime'} | Notes: ${formData.message}`
          })
        })

        const data = await res.json()

        if (!res.ok) {
          alert(data.message || 'Failed to submit viewing inquiry.')
          setIsSubmitting(false)
          return
        }

        setStatusMessage(data.message || '🎉 Viewing request submitted! Our senior advisor will contact you shortly.')
        setSubmitted(true)
      } catch (err) {
        console.error(err)
        alert('Failed to connect to backend server. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (submitted) {
    return (
      <div className={`bg-white border border-brand-green/20 rounded-2xl p-8 text-center space-y-4 shadow-md ${className}`}>
        <div className="w-12 h-12 rounded-full bg-brand-soft text-brand-green mx-auto flex items-center justify-center shadow-sm">
          {isAgentApplication ? <Clock className="w-7 h-7 text-amber-700" /> : <CheckCircle2 className="w-7 h-7 text-brand-green" />}
        </div>
        <h4 className="font-serif text-2xl text-brand-charcoal font-normal">
          {isAgentApplication ? 'Agent Application Under Review' : 'Private Tour Requested'}
        </h4>
        <p className="text-xs text-brand-charcoal/70 font-light leading-relaxed max-w-md mx-auto">
          {isAgentApplication ? (
            statusMessage || `Thank you, ${formData.fullName}. Your agent partner application has been submitted to Admin/Manager for approval.`
          ) : (
            `Thank you, ${formData.fullName}. Our advisor for ${agentName} will contact you shortly to confirm your viewing details.`
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setIsAgentApplication(false)
          }}
          className="mt-4 px-6 py-2.5 bg-brand-green text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-brand-green/15 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm ${className}`}>
      <div className="space-y-1 pb-4 border-b border-brand-green/10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green block">
          INQUIRY & PARTNER APPLICATION
        </span>
        <h4 className="font-serif text-2xl text-brand-charcoal font-normal">
          {isAgentApplication ? 'Apply as Partner / Sales Agent' : 'Schedule a Private Tour'}
        </h4>
        {propertyTitle && !isAgentApplication && (
          <p className="text-xs text-brand-charcoal/70 font-light">
            Residence: <span className="text-brand-charcoal font-semibold">{propertyTitle}</span>
          </p>
        )}
      </div>

      {/* Toggle Application Type */}
      <div className="p-1 bg-[#FAF9F6] border border-brand-green/20 rounded-xl flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => {
            setIsAgentApplication(false)
            setFormData({ ...formData, inquiryType: 'CUSTOMER_VIEWING' })
          }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            !isAgentApplication ? 'bg-[#0B4F3C] text-white shadow-sm' : 'text-brand-charcoal/70 hover:text-brand-charcoal'
          }`}
        >
          Schedule Property Tour
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAgentApplication(true)
            setFormData({ ...formData, inquiryType: 'AGENT_APPLICATION' })
          }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            isAgentApplication ? 'bg-[#0B4F3C] text-white shadow-sm' : 'text-brand-charcoal/70 hover:text-brand-charcoal'
          }`}
        >
          Apply as Sales Executive / Agent
        </button>
      </div>

      {isAgentApplication && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium">
          ℹ️ <strong>Admin Approval Required:</strong> Public agent applications require Admin/Manager approval before your agent portal login gets activated.
        </div>
      )}

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
            className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors font-bold"
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
              className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors font-bold"
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
              className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors font-bold"
            />
          </div>
        </div>

        {isAgentApplication && (
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
              Create Initial Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors font-bold"
            />
          </div>
        )}

        {!isAgentApplication && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
                Preferred Date
              </label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
                Preferred Window
              </label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors font-bold"
              >
                <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                <option value="Sunset Hour (4 PM - 7 PM)">Sunset Hour (4 PM - 7 PM)</option>
              </select>
            </div>
          </div>
        )}

        {/* Additional Notes */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-brand-charcoal/80 font-bold block">
            {isAgentApplication ? 'Sales Experience / Notes' : 'Specific Requirements / Notes'}
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={isAgentApplication ? "Tell us about your sales background and target territory..." : "Mention any specific timing preferences or questions..."}
            className="w-full bg-brand-soft border border-brand-green/20 text-brand-charcoal placeholder-brand-charcoal/50 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-green transition-colors resize-none font-bold"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-brand-green text-white text-xs font-bold uppercase tracking-[0.18em] rounded-xl hover:bg-brand-dark transition-all duration-200 shadow-md cursor-pointer border border-brand-green flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting Application...
            </>
          ) : isAgentApplication ? (
            'Submit Agent Partner Application'
          ) : (
            'Confirm Viewing Request'
          )}
        </button>

        <p className="text-[10px] text-brand-charcoal/60 text-center font-light flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
          Client Privacy Protocol Guaranteed
        </p>
      </form>
    </div>
  )
}
