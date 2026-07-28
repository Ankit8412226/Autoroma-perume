import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { CartDrawer } from '@/features/cart/components/CartDrawer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://autoroma.in'),
  title: {
    default: 'Autoroma — Premium Car Fragrance & Air Fresheners India',
    template: '%s | Autoroma',
  },
  description:
    'Discover Autoroma — India\'s premier luxury car fragrance brand. Shop vent clip fresheners, dashboard gels, hanging fresheners, interior sprays and reed diffusers. Free shipping above ₹499.',
  keywords: [
    'car perfume India',
    'buy car air freshener India',
    'car vent clip perfume',
    'car cabin freshener India',
    'premium car fragrance India',
    'best car perfume online India',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-bg-primary text-white-100 font-inter antialiased selection:bg-gold-300 selection:text-bg-primary">
        <QueryProvider>
          <LenisProvider>
            <ToastProvider>
              <LoadingScreen />
              <CustomCursor />
              <Navbar />
              <CartDrawer />
              <div className="min-h-screen">
                {children}
              </div>
              <Footer />
            </ToastProvider>
          </LenisProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
