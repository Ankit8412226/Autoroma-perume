import { BulkInquiryForm } from '@/features/b2b/components/BulkInquiryForm'

export const metadata = {
  title: 'B2B Wholesale & Fleet Supply | Maison Noir',
  description: 'Custom car fragrance solutions for dealerships, car wash studios, cab fleets, and luxury automotive retailers across India.',
}

export default function B2BPage() {
  return (
    <main className="py-16 px-4 md:px-12 max-w-7xl mx-auto space-y-16">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Corporate & B2B Solutions
        </span>
        <h1 className="font-cormorant text-display-xl font-light text-white-100">
          Elevate Your Automotive Business
        </h1>
        <p className="text-body-lg text-white-200 font-light leading-relaxed">
          From handover gift boxes for luxury car dealerships to custom-branded air fresheners for detailing studios and fleet operators.
        </p>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-bg-surface border border-white-500/20 p-8 space-y-3">
          <span className="text-label text-gold-300 uppercase tracking-widest block">01 · Dealership Handover</span>
          <h3 className="font-cormorant text-heading-md text-white-100 font-light">New Car Welcome Kits</h3>
          <p className="text-xs text-white-400 font-light leading-relaxed">
            Delight new vehicle buyers with a branded luxury fragrance vent clip presented in custom unboxing packaging.
          </p>
        </div>

        <div className="bg-bg-surface border border-white-500/20 p-8 space-y-3">
          <span className="text-label text-gold-300 uppercase tracking-widest block">02 · Detailing & Car Wash</span>
          <h3 className="font-cormorant text-heading-md text-white-100 font-light">Signature Studio Mist</h3>
          <p className="text-xs text-white-400 font-light leading-relaxed">
            Distinguish your detailing garage with a signature post-cleaning interior fragrance spray that customers remember.
          </p>
        </div>

        <div className="bg-bg-surface border border-white-500/20 p-8 space-y-3">
          <span className="text-label text-gold-300 uppercase tracking-widest block">03 · Executive Fleet</span>
          <h3 className="font-cormorant text-heading-md text-white-100 font-light">5-Star Passenger Odor Control</h3>
          <p className="text-xs text-white-400 font-light leading-relaxed">
            Long-lasting heat-resistant diffuser jars for cab fleets, car rentals, and luxury airport transfer fleets.
          </p>
        </div>
      </div>

      {/* Inquiry Form Component */}
      <BulkInquiryForm />
    </main>
  )
}
