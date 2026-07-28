'use client'

import * as React from 'react'
import { Button, Input, Select, Textarea, useToast } from '@/components/ui'
import { submitBulkInquiry } from '../actions/submitBulkInquiry'

export function BulkInquiryForm() {
  const { toast } = useToast()

  const [businessType, setBusinessType] = React.useState('Dealership')
  const [companyName, setCompanyName] = React.useState('')
  const [contactName, setContactName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [requirements, setRequirements] = React.useState('')
  const [estimatedQty, setEstimatedQty] = React.useState('50')
  const [targetBudget, setTargetBudget] = React.useState('')

  const [loading, setLoading] = React.useState(false)
  const [successRef, setSuccessRef] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const businessOptions = [
    { value: 'Dealership', label: 'Car Dealership & Showroom' },
    { value: 'Car Wash / Detailing', label: 'Car Wash & Detailing Studio' },
    { value: 'Fleet Operator', label: 'Fleet / Cab Operator (Ola, Uber, Corporate)' },
    { value: 'Auto Accessories', label: 'Auto Accessories Retailer' },
    { value: 'Corporate Gifting', label: 'Corporate Gifting' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await submitBulkInquiry({
        businessType,
        companyName,
        contactName,
        email,
        phone,
        requirements,
        estimatedQty: parseInt(estimatedQty, 10) || 50,
        targetBudget,
      })

      if (!res.success) {
        const msg = typeof res.error === 'string' ? res.error : res.error.message
        setError(msg)
        toast(msg, 'error')
      } else {
        setSuccessRef(res.data.referenceNumber)
        toast(`Inquiry submitted! Ref: ${res.data.referenceNumber}`, 'success')
      }
    } catch {
      setError('An unexpected error occurred.')
      toast('Failed to submit inquiry.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (successRef) {
    return (
      <div className="bg-bg-surface border border-gold-300/40 p-8 text-center space-y-4 max-w-lg mx-auto">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Inquiry Received
        </span>
        <h2 className="font-cormorant text-heading-lg text-white-100 font-light">
          Thank you for reaching out
        </h2>
        <p className="text-sm text-white-200 font-light leading-relaxed">
          Your inquiry <strong className="text-gold-200">{successRef}</strong> has been logged. Our B2B Concierge team will prepare a custom quotation within 24 business hours.
        </p>
        <Button variant="secondary" onClick={() => setSuccessRef(null)}>
          Submit Another Inquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-surface border border-white-500/20 p-8 md:p-10 space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2 text-center">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          B2B Wholesale & Fleet
        </span>
        <h2 className="font-cormorant text-heading-xl text-white-100 font-light">
          Bulk Order Inquiry
        </h2>
        <p className="text-xs text-white-300 font-light max-w-md mx-auto">
          Custom branding, custom fragrance formulas, and tiered wholesale pricing for automotive businesses.
        </p>
      </div>

      {error && (
        <div className="p-3 border border-error/50 bg-error/10 text-error text-xs font-inter text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Business Category"
          options={businessOptions}
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
        />

        <Input
          label="Company / Studio Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          placeholder="e.g. Speedline Detailing Studio"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Contact Person Name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
          placeholder="e.g. Vikram Sharma"
        />

        <Input
          label="Business Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="vikram@speedline.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number (10 digits)"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="9876543210"
        />

        <Input
          label="Estimated Monthly Quantity"
          type="number"
          value={estimatedQty}
          onChange={(e) => setEstimatedQty(e.target.value)}
          required
          min={10}
          placeholder="50"
        />
      </div>

      <Textarea
        label="Specific Requirements & Fragrance Preferences"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        required
        placeholder="e.g. Looking for 100 units of Ocean Drive vent clips with custom co-branded wooden boxes for new car deliveries."
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
        Submit Inquiry
      </Button>
    </form>
  )
}
