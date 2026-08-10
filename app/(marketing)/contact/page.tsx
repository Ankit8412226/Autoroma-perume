import { Button, Input, Textarea } from '@/components/ui'
import { GenZLetsConnectVideo } from '@/components/motion/GenZLetsConnectVideo'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Concierge & Client Support — AURA VÉLOCE',
  description: 'Contact Aura Véloce concierge for order tracking, B2B wholesale inquiries, or fragrance assistance.',
}

export default function ContactPage() {
  return (
    <main className="py-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12 min-h-[70vh]">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
          Aura Véloce Direct Hotline
        </span>
        <h1 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
          Let&apos;s Get Connected
        </h1>
        <p className="text-xs sm:text-body-md text-white-300 font-light font-inter">
          Have questions regarding order status, vehicle cabin compatibility, or bulk fleet orders? Our concierge team is live 24/7.
        </p>
      </div>

      {/* 60FPS GEN-Z VIDEO EQUALIZER MOTION LOOP SHOWCASE */}
      <GenZLetsConnectVideo />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-bg-surface border border-gold-300/30 p-6 sm:p-8 space-y-6">
          <span className="text-xs uppercase tracking-widest text-gold-300 font-inter block font-bold">
            Atelier Direct Channels
          </span>

          <div className="space-y-4 font-inter text-xs text-white-200">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gold-300 shrink-0" />
              <div>
                <strong className="text-white-100 block">Email Support</strong>
                <span>support@auraveloce.in</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gold-300 shrink-0" />
              <div>
                <strong className="text-white-100 block">Concierge Phone Hotline</strong>
                <span>+91 (022) 4987-2020 (Mon - Sat, 10 AM - 7 PM IST)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gold-300 shrink-0" />
              <div>
                <strong className="text-white-100 block">Atelier Location</strong>
                <span>Aura Véloce Fragrances Pvt Ltd, BKC Commercial Complex, Mumbai, Maharashtra 400051</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gold-300 shrink-0" />
              <div>
                <strong className="text-white-100 block">Response Guarantee</strong>
                <span>Within 12 business hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-bg-surface border border-white-500/20 p-6 sm:p-8 space-y-6">
          <h3 className="font-cormorant text-2xl text-white-100 font-light">Send a Direct Message</h3>
          <form className="space-y-4 font-inter text-xs">
            <Input label="Full Name" placeholder="Vikram Malhotra" required />
            <Input label="Email Address" type="email" placeholder="vikram@example.com" required />
            <Input label="Phone Number" type="tel" placeholder="9876543210" />
            <Textarea label="Message" placeholder="How can our concierge assist your drive?" rows={5} required />
            <Button type="submit" variant="primary" size="lg" className="w-full font-inter text-xs uppercase tracking-widest justify-center">
              Submit Message →
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
