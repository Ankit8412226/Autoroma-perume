import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://auraveloce.com'),
  title: {
    default: 'AURA VÉLOCE — Estates & Residences | Luxury Real Estate Atelier',
    template: '%s | Aura Véloce Estates',
  },
  description:
    'Discover architecturally curated luxury properties, sea-facing penthouses, modern villas, and prime real estate across Mumbai, Goa, Delhi NCR, Bangalore, and Hyderabad.',
  keywords: [
    'Aura Veloce Estates',
    'luxury real estate India',
    'sea facing penthouses Mumbai',
    'assagao luxury villas Goa',
    'golf course road duplex Gurgaon',
    'jubilee hills mansions Hyderabad',
    'luxury homes India',
    'architectural residences',
  ],
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
  },
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
          <ToastProvider>
            <Navbar />
            <div className="min-h-screen pt-20 sm:pt-24">
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
