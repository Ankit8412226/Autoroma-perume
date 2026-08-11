import { CheckoutForm } from '@/features/checkout/components/CheckoutForm'

export const metadata = {
  title: 'Checkout | Maison Noir',
  description: 'Complete your order for luxury automotive fragrances with Razorpay secure checkout.',
}

export default function CheckoutPage() {
  return (
    <main className="py-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-label text-gold-300 uppercase tracking-widest block">
          Secure Checkout
        </span>
        <h1 className="font-cormorant text-3xl sm:text-5xl lg:text-display-xl font-light text-white-100">
          Complete Your Order
        </h1>
      </div>

      <CheckoutForm />
    </main>
  )
}
