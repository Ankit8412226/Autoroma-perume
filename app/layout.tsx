import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
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
  metadataBase: new URL('https://auraveloce.in'),
  title: {
    default: 'AURA VÉLOCE — Premium Automotive Fragrance & Luxury Diffusers India',
    template: '%s | AURA VÉLOCE',
  },
  description:
    'Discover Aura Véloce — India\'s premier luxury automotive fragrance atelier. Shop anodized vent clips, heat-stable dashboard gels, artisanal hanging diffusers, and cabin mists. Free shipping above ₹499.',
  keywords: [
    'Aura Veloce car perfume India',
    'buy luxury car air freshener India',
    'car vent clip perfume',
    'car cabin freshener India',
    'premium automotive fragrance India',
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
