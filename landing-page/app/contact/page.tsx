import * as React from 'react'
import { InquiryForm } from '@/components/real-estate/InquiryForm'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Contact Us & Advisory — House & Sky Real Estate',
  description: 'Connect with House & Sky real estate advisors for private viewings, property listings, and valuation reports.',
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-bg-primary">
      <SectionHeading
        eyebrow="ADVISORY & INQUIRIES"
        title="Schedule a Private Consultation"
        subtitle="Speak directly with our team for property listings, private viewings, and valuation reports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-brand-green/15 rounded-lg p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green">
              OFFICES & DESKS
            </span>
            <h3 className="font-serif text-2xl text-brand-charcoal font-normal">Contact Information</h3>
          </div>

          <div className="space-y-4 text-xs text-brand-charcoal/80 font-light">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-charcoal block font-medium">Mumbai Executive Office</strong>
                <span>Level 14, Bandra Promenade Tower, Carter Road, Mumbai 400050</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-charcoal block font-medium">Delhi NCR Office</strong>
                <span>DLF Horizon Center, Golf Course Road, Gurgaon 122002</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-charcoal block font-medium">Direct Advisory Line</strong>
                <span>+91 (022) 8800 9900</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-charcoal block font-medium">Email Inquiry</strong>
                <span>advisory@houseandsky.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-charcoal block font-medium">Confidential Representation</strong>
                <span>All client communications and viewings are handled with utmost discretion.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Module (7 cols) */}
        <div className="lg:col-span-7">
          <InquiryForm />
        </div>
      </div>
    </div>
  )
}
