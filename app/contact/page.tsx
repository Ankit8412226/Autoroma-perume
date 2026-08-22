import * as React from 'react'
import { InquiryForm } from '@/components/real-estate/InquiryForm'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Private Advisory & Consultation — Aura Véloce Estates',
  description: 'Connect with Aura Véloce Estates senior partners for private viewings, off-market listings, and asset valuations.',
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeading
        eyebrow="PRIVATE ADVISORY"
        title="Schedule a Private Consultation"
        subtitle="Speak directly with our senior partners for off-market listings, private viewings, and market valuation reports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-bg-surface border border-white/15 p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-300">
              DIRECT DESKS
            </span>
            <h3 className="font-serif text-2xl text-white font-normal">Private Offices</h3>
          </div>

          <div className="space-y-4 text-xs text-white/80 font-light">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Mumbai Executive Suite</strong>
                <span>Level 14, Bandra Promenade Tower, Carter Road, Mumbai 400050</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Delhi NCR Advisory Desk</strong>
                <span>DLF Horizon Center, Golf Course Road, Gurgaon 122002</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gold-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Private Line</strong>
                <span>+91 (022) 8800 9900 (24/7 Concierge)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gold-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Encrypted Email</strong>
                <span>private.advisory@auraveloce.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <ShieldCheck className="w-5 h-5 text-gold-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">NDA Policy</strong>
                <span>Strict non-disclosure agreement protection for all inquiry details.</span>
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
