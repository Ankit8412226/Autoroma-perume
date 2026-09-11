import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HouseAndSkyChatbot } from '@/components/real-estate/HouseAndSkyChatbot'
import { WhatsAppButton } from '@/components/real-estate/WhatsAppButton'

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
  metadataBase: new URL('https://houseandsky.com'),
  title: {
    default: 'House & Sky — Exceptional Homes. Under Open Skies.',
    template: '%s | House & Sky',
  },
  description:
    'Discover exceptional architectural homes, luxury penthouses, modern villas, and prime real estate across Mumbai, Goa, Delhi NCR, Bangalore, and Hyderabad.',
  keywords: [
    'House & Sky',
    'House and Sky real estate',
    'architectural homes India',
    'sea facing penthouses Mumbai',
    'luxury villas Goa',
    'golf course road duplex Gurgaon',
    'jubilee hills mansions Hyderabad',
    'luxury homes India',
  ],
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-bg-primary text-brand-charcoal font-inter antialiased selection:bg-brand-soft selection:text-brand-green">
        <QueryProvider>
          <ToastProvider>
            <Navbar />
            <div className="min-h-screen pt-20 sm:pt-24">
              {children}
            </div>
            <Footer />
            <WhatsAppButton />
            <HouseAndSkyChatbot />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

