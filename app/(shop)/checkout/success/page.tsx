import Link from 'next/link'
import { Button } from '@/components/ui'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { Suspense } from 'react'

interface SuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string
  }>
}

export const metadata = {
  title: 'Order Confirmed | Maison Noir',
  description: 'Thank you for your order.',
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = await searchParams

  return (
    <main className="py-24 px-6 max-w-2xl mx-auto text-center space-y-6">
      <Suspense fallback={<div>Loading order confirmation...</div>}>
        <div className="bg-bg-surface border border-gold-300/40 p-10 space-y-6">
          <CheckCircle2 className="h-16 w-16 text-gold-300 mx-auto stroke-[1.5]" />

          <div className="space-y-2">
            <span className="text-label text-gold-300 uppercase tracking-widest block">
              Order Confirmed
            </span>
            <h1 className="font-cormorant text-display-lg text-white-100 font-light">
              Thank You For Your Order
            </h1>
            {orderNumber && (
              <p className="text-sm text-white-200 font-inter">
                Order Reference Number: <strong className="text-gold-200">{orderNumber}</strong>
              </p>
            )}
          </div>

          <p className="text-xs text-white-300 font-light leading-relaxed max-w-md mx-auto">
            Your car fragrance order is being prepared by our atelier. A confirmation email with tracking details has been sent to your address.
          </p>

          <div className="pt-4 border-t border-white-500/20 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="secondary">
              <Link href="/account/orders">View Order History</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-white-400 font-light">
          <ShieldCheck className="h-4 w-4 text-gold-300" />
          <span>Need assistance? Contact our concierge at support@maisonnoir.in</span>
        </div>
      </Suspense>
    </main>
  )
}
