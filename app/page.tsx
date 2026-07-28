import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { HolographicCabinCard } from '@/components/motion/HolographicCabinCard'
import { GlowingCategoryCard } from '@/components/motion/GlowingCategoryCard'
import { InteractiveScentPyramid } from '@/components/motion/InteractiveScentPyramid'
import { InteractiveLaserEngraver } from '@/components/motion/InteractiveLaserEngraver'
import { AnimatedTestimonials } from '@/components/motion/AnimatedTestimonials'
import { AnimatedFAQAccordion } from '@/components/motion/AnimatedFAQAccordion'
import { InteractiveScentQuiz } from '@/components/motion/InteractiveScentQuiz'
import { FlippingBookProductCard, type FlippingBookProductCardProps } from '@/features/products/components/FlippingBookProductCard'
import { prisma } from '@/lib/db/prisma'
import {
  ArrowRight,
  CheckCircle2,
  Car,
} from 'lucide-react'

export const revalidate = 300 // ISR 5 minutes

export default async function HomePage() {
  let featuredProducts: FlippingBookProductCardProps['product'][] = []
  try {
    featuredProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        images: true,
        productType: true,
        scentFamily: true,
        averageRating: true,
        reviewCount: true,
        isNew: true,
        stock: true,
        topNotes: true,
        heartNotes: true,
      },
    })

    if (featuredProducts.length < 4) {
      const fallbackBestsellers: FlippingBookProductCardProps['product'][] = [
        {
          id: 'prod-oud-royal',
          name: 'Cambodian Oud Royal Spray Mist',
          slug: 'cambodian-oud-royal',
          price: 1699,
          compareAtPrice: 2199,
          images: ['/images/scent-top-notes.png', '/images/hero-woman-perfume-perfect.png'],
          productType: 'SPRAY',
          scentFamily: 'Oriental Oud',
          averageRating: 4.9,
          reviewCount: 142,
          isNew: true,
          stock: 50,
          topNotes: ['Cambodian Oud', 'Bergamot'],
          heartNotes: ['Smoked Amber', 'Cardamom'],
          baseNotes: ['Musk', 'White Cedar'],
        },
        {
          id: 'prod-tuscan-leather',
          name: 'Tuscan Leather Solid Gel Jar',
          slug: 'tuscan-leather-gel',
          price: 1499,
          compareAtPrice: 1899,
          images: ['/images/scent-heart-notes.png', '/images/hero-woman-perfume-perfect.png'],
          productType: 'DASHBOARD_GEL',
          scentFamily: 'Leather Woody',
          averageRating: 4.8,
          reviewCount: 98,
          isNew: false,
          stock: 35,
          topNotes: ['Tuscan Leather', 'Saffron'],
          heartNotes: ['Smoked Cedar', 'Thyme'],
          baseNotes: ['Amber', 'Wild Leather'],
        },
        {
          id: 'prod-ocean-drive',
          name: 'Ocean Drive Marine Vent Clip',
          slug: 'ocean-drive-vent-clip',
          price: 1299,
          compareAtPrice: 1599,
          images: ['/images/car-vent-perfume-clip.png', '/images/hero-woman-perfume-perfect.png'],
          productType: 'VENT_CLIP',
          scentFamily: 'Fresh Aquatic',
          averageRating: 4.9,
          reviewCount: 176,
          isNew: true,
          stock: 80,
          topNotes: ['Calabrian Bergamot', 'Sea Spray'],
          heartNotes: ['Oceanic Notes', 'Sage'],
          baseNotes: ['Smoked Cedarwood', 'Oakmoss'],
        },
        {
          id: 'prod-kyoto-cedar',
          name: 'Kyoto Cedar Wooden Hanging Vial',
          slug: 'kyoto-cedar-vial',
          price: 999,
          compareAtPrice: 1299,
          images: ['/images/car-perfume-craft.png', '/images/hero-woman-perfume-perfect.png'],
          productType: 'HANGING',
          scentFamily: 'Woody Earthy',
          averageRating: 4.7,
          reviewCount: 84,
          isNew: false,
          stock: 45,
          topNotes: ['Japanese Cedarwood', 'Hinoki'],
          heartNotes: ['Kyoto Cypress', 'Vetiver'],
          baseNotes: ['Ambergris', 'Sandalwood'],
        },
      ]
      featuredProducts = fallbackBestsellers
    }

    const getProductImage = (type?: string, name?: string) => {
      const t = (type || '').toUpperCase()
      const n = (name || '').toLowerCase()
      if (t.includes('VENT') || n.includes('vent') || n.includes('clip') || n.includes('ocean')) {
        return '/images/car-vent-perfume-clip.png'
      }
      if (t.includes('SPRAY') || n.includes('spray') || n.includes('mist') || n.includes('oud') || n.includes('royal')) {
        return '/images/scent-top-notes.png'
      }
      if (t.includes('GEL') || n.includes('gel') || n.includes('tuscan') || n.includes('leather')) {
        return '/images/scent-heart-notes.png'
      }
      if (t.includes('HANGING') || n.includes('hanging') || n.includes('vial') || n.includes('kyoto') || n.includes('cedar')) {
        return '/images/car-perfume-craft.png'
      }
      return '/images/scent-top-notes.png'
    }

    featuredProducts = featuredProducts.map((p) => ({
      ...p,
      images: [getProductImage(p.productType, p.name), '/images/hero-woman-perfume-perfect.png'],
    }))
  } catch {
    featuredProducts = []
  }

  return (
    <main className="space-y-20 sm:space-y-24 pb-24 overflow-hidden bg-bg-primary text-white-100">
      {/* SECTION 1: BOMBAY MUSK EXACT MATCH HERO SECTION */}
      <section className="relative min-h-[90vh] sm:min-h-[88vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-white-500/20">
        {/* Full-Bleed Background Image: Woman right-aligned inside luxury SUV trunk holding gold perfume box near chest */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-woman-perfume-perfect.png"
            alt="Autoroma Luxury Car Perfume Model holding Gold Perfume Box"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_center] sm:object-[right_center] lg:object-[right_top] brightness-105"
          />
          {/* Responsive Vignette Gradients for Mobile & Desktop Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 sm:via-black/35 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent z-[1]" />
        </div>

        {/* Hero Left Content Overlay - Centered on Mobile, Left-Aligned on Desktop */}
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 relative z-10 flex-1 flex flex-col justify-center items-center sm:items-start text-center sm:text-left pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 space-y-4 sm:space-y-6">
          {/* Eyebrow Label */}
          <span className="text-white/80 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] font-inter font-semibold drop-shadow-md">
            LUXURY CAR PERFUME
          </span>

          {/* Main Headline - Compact 2-Line Editorial Headline */}
          <h1 className="text-white font-sans text-2xl sm:text-4xl lg:text-5xl font-semibold leading-tight sm:leading-tight tracking-tight max-w-xl drop-shadow-lg">
            The scent you&apos;re remembered by.
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-white/90 text-xs sm:text-sm md:text-base font-inter font-light max-w-md leading-relaxed drop-shadow">
            Designer-grade fragrance, engineered for hot vehicle cabins (60°C). Pure organic oils, zero chemical alcohol.
          </p>

          {/* Action Buttons Row - Stacks cleanly on Mobile with Full Width, Inline on Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-2 sm:pt-3 w-full sm:w-auto relative z-20">
            <Link href="/products" className="w-full sm:w-auto">
              <button
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
                className="w-full sm:w-auto font-inter text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-3.5 sm:py-4 rounded-sm shadow-2xl transition-all cursor-pointer border border-white hover:opacity-90 text-center"
              >
                SHOP THE COLLECTION
              </button>
            </Link>

            <a href="#scent-quiz" className="w-full sm:w-auto">
              <button
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.8)' }}
                className="w-full sm:w-auto backdrop-blur-md border hover:bg-white/20 font-inter text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-3.5 sm:py-4 rounded-sm transition-all cursor-pointer text-center"
              >
                TAKE THE SCENT QUIZ
              </button>
            </a>
          </div>
        </div>

        {/* Bottom Feature Ribbon Bar (3 Black Columns with Generous Padding & Gapping) */}
        <div className="relative z-10 w-full bg-black border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15 text-center text-[11px] sm:text-xs font-inter uppercase tracking-widest text-white/90 py-4 sm:py-6">
          <div className="py-4 sm:py-3 px-6 flex flex-col items-center justify-center space-y-1">
            <span className="font-semibold tracking-[0.2em] text-white flex items-center gap-2 text-xs sm:text-sm">
              🚚 24-HR DISPATCH
            </span>
            <span className="text-[10px] text-white/60 tracking-wider">FAST SHIPPING ACROSS INDIA</span>
          </div>

          <div className="py-4 sm:py-3 px-6 flex flex-col items-center justify-center space-y-1">
            <span className="font-semibold tracking-[0.2em] text-white flex items-center gap-2 text-xs sm:text-sm">
              🛡️ TRUSTED 135,000+
            </span>
            <span className="text-[10px] text-white/60 tracking-wider">AUTOMOTIVE ENTHUSIASTS</span>
          </div>

          <div className="py-4 sm:py-3 px-6 flex flex-col items-center justify-center space-y-1">
            <span className="font-semibold tracking-[0.2em] text-white flex items-center gap-2 text-xs sm:text-sm">
              ✨ 500,000+ SCENTED
            </span>
            <span className="text-[10px] text-white/60 tracking-wider">CAR CABINS NATIONWIDE</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: INFINITE BRAND TICKER WITH GENEROUS MARGINS */}
      <section className="bg-bg-surface border-y border-white-500/20 py-5 my-6 sm:my-10 overflow-hidden">
        <div className="flex whitespace-nowrap gap-12 animate-marquee text-[11px] sm:text-xs font-inter uppercase tracking-[0.3em] text-white-200 font-medium">
          <span>• AUTOROMA PARFUM D&apos;AUTOMOBILE</span>
          <span>• HEAT TESTED FORMULATIONS (60°C)</span>
          <span>• ANODIZED MATTE ALUMINUM CASING</span>
          <span>• IFRA CERTIFIED NATURAL OILS</span>
          <span>• FREE SHIPPING ABOVE ₹499 ACROSS INDIA</span>
          <span>• B2B & DEALERSHIP FLEET SUPPLY</span>
          <span>• AUTOROMA PARFUM D&apos;AUTOMOBILE</span>
        </div>
      </section>

      {/* SECTION 3: REVAMPED 3D HOLOGRAPHIC CABIN MATCHING CARDS */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-white uppercase tracking-widest block font-inter font-bold">
            CAR CABIN COMPATIBILITY
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            Engineered for Your Car Interior
          </h2>
          <p className="text-xs sm:text-body-md text-white-300 font-light font-inter">
            From executive sedans to luxury SUVs and minimalist EVs, choose the perfect car perfume formulation for your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <HolographicCabinCard
            iconName="car"
            title="Executive Sedans"
            subtitle="BMW 5/7 Series · Mercedes S-Class"
            desc="Opulent Cambodian Oud & Amber cabin mist formulated to pair with full-grain leather upholstery."
            href="/products?family=Oud"
            ctaText="Explore Oud Series →"
            imageSrc="/images/scent-top-notes.png"
          />

          <HolographicCabinCard
            iconName="shield"
            title="Luxury SUVs"
            subtitle="Range Rover · Porsche Cayenne"
            desc="Tuscan Leather solid gel jar designed to diffuse broad, even fragrance across large cabin volumes."
            href="/products?type=DASHBOARD_GEL"
            ctaText="Explore Gel Jars →"
            imageSrc="/images/scent-heart-notes.png"
          />

          <HolographicCabinCard
            iconName="zap"
            title="EV & Modern Cockpits"
            subtitle="Tesla · Volvo EX · Audi e-tron"
            desc="Ocean Drive Marine Vent Clips delivering crisp sea spray and bergamot for minimalist interiors."
            href="/products?family=Fresh"
            ctaText="Explore Fresh Marine →"
            imageSrc="/images/car-vent-perfume-clip.png"
          />

          <HolographicCabinCard
            iconName="award"
            title="Sports Cars & Coupes"
            subtitle="Porsche 911 · Mustang · BMW M"
            desc="Kyoto Cedar wooden cap vial hanging diffusers crafted with Japanese cedarwood & Hinoki cypress."
            href="/products?type=HANGING"
            ctaText="Explore Hanging Vials →"
            imageSrc="/images/car-perfume-craft.png"
          />
        </div>
      </ScrollReveal>

      {/* SECTION 4: REVAMPED GLOWING LED CATEGORY CARDS WITH AIRFLOW AUDIO */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-white uppercase tracking-widest block font-inter font-bold">
            FOUR CAR PERFUME FORMATS
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            How Would You Like to Scent Your Car?
          </h2>
          <p className="text-xs sm:text-body-md text-white-300 font-inter font-light">
            Discover our collection of anodized car vent clips, 50ml cabin spray mists, dashboard gel jars, and hanging glass vials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlowingCategoryCard
            iconName="wind"
            badge="Airflow Active"
            title="Vent Clip Fresheners"
            desc="Anodized matte aluminum clips that attach to AC louvers. Diffuses as climate control runs."
            href="/products?type=VENT_CLIP"
            ctaText="Explore Vent Clips →"
            imageSrc="/images/car-vent-perfume-clip.png"
          />

          <GlowingCategoryCard
            iconName="sparkles"
            badge="Instant Atmosphere"
            title="Interior Spray Mists"
            desc="50ml fine mist atomizer. Spritz on floor mats and fabric headliners for immediate luxury scenting."
            href="/products?type=SPRAY"
            ctaText="Explore Sprays →"
            imageSrc="/images/scent-top-notes.png"
          />

          <GlowingCategoryCard
            iconName="shield"
            badge="Constant Passive"
            title="Dashboard Gel Jars"
            desc="Heat-stable organic gel jar for cup holders or dashboard pads. Continuous 60-day evaporation."
            href="/products?type=DASHBOARD_GEL"
            ctaText="Explore Gel Jars →"
            imageSrc="/images/scent-heart-notes.png"
          />

          <GlowingCategoryCard
            iconName="award"
            badge="Wooden Cap Porous"
            title="Hanging Glass Bottles"
            desc="Hand-cut glass vial with porous beechwood cap. Suspends from rearview mirror for subtle diffusion."
            href="/products?type=HANGING"
            ctaText="Explore Hanging →"
            imageSrc="/images/car-perfume-craft.png"
          />
        </div>
      </ScrollReveal>

      {/* SECTION 5: FEATURED PRODUCTS FLIPPING BOOK CATALOG GRID */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 border-b border-white-500/20 pb-6">
          <div>
            <span className="text-label text-white uppercase tracking-widest block font-inter font-bold">
              BESTSELLING CAR PERFUMES 📖
            </span>
            <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
              India&apos;s Favorite Luxury Car Fragrances
            </h2>
            <p className="text-xs text-white-300 font-inter font-light">
              Curated car perfumes loved by 135,000+ automotive enthusiasts nationwide.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs text-white hover:underline uppercase tracking-wider font-inter underline underline-offset-8 font-semibold"
          >
            View Entire Collection ({featuredProducts.length}) →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="py-16 text-center bg-bg-surface border border-white-500/20 text-white-400 font-light">
            Catalog fragrances loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <FlippingBookProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* SECTION 6: BOMBAY MUSK INSPIRED INTERACTIVE SCENT QUIZ */}
      <section id="scent-quiz" className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <InteractiveScentQuiz />
      </section>

      {/* SECTION 7: AUDIO SPRAY MIST INTERACTIVE SCENT PYRAMID WITH DYNAMIC IMAGE SWITCHING */}
      <ScrollReveal className="bg-bg-secondary border-y border-white-500/20 py-16 sm:py-24 px-4 sm:px-6 md:px-12">
        <InteractiveScentPyramid />
      </ScrollReveal>

      {/* SECTION 7: CRAFTSMANSHIP STATS */}
      <section className="bg-bg-surface border-y border-white-500/20 py-16 sm:py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="space-y-1 sm:space-y-2 border-r border-white-500/10 pr-2 sm:pr-4">
            <span className="font-cormorant text-4xl sm:text-5xl text-white font-light block">60°C</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Hot Cabin Tested</span>
          </div>
          <div className="space-y-1 sm:space-y-2 md:border-r border-white-500/10 pr-2 sm:pr-4">
            <span className="font-cormorant text-4xl sm:text-5xl text-white font-light block">45 Days</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Continuous Scent</span>
          </div>
          <div className="space-y-1 sm:space-y-2 border-r border-white-500/10 pr-2 sm:pr-4">
            <span className="font-cormorant text-4xl sm:text-5xl text-white font-light block">0%</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Chemical Alcohol</span>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <span className="font-cormorant text-4xl sm:text-5xl text-white font-light block">IFRA</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Certified Safe Oils</span>
          </div>
        </div>
      </section>

      {/* SECTION 8: REAL-TIME B2B LASER ENGRAVER CUSTOMIZER */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <InteractiveLaserEngraver />
      </section>

      {/* SECTION 9: ANIMATED 3D DRIVER REVIEWS */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Verified Driver Reviews
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            Loved by Discerning Car Owners
          </h2>
          <p className="text-xs text-white-300 font-inter font-light">
            Hover over any driver review card below to trigger 3D elevation & gold star shimmer.
          </p>
        </div>

        <AnimatedTestimonials />
      </section>

      {/* SECTION 10: ANIMATED FAQ ACCORDION WITH AUDIO CLICK */}
      <section className="px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Concierge Knowledge Base
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            Frequently Asked Questions
          </h2>
        </div>

        <AnimatedFAQAccordion />
      </section>

      {/* SECTION 11: NEWSLETTER BANNER */}
      <section className="bg-bg-secondary py-16 sm:py-24 border-t border-white-500/20 px-4 sm:px-6 md:px-12 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Autoroma Atelier Club
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            Enjoy 10% Off Your First Fragrance Order
          </h2>
          <p className="text-xs sm:text-body-md text-white-300 font-light">
            Subscribe to receive private collection drops, seasonal scent formulations, and member-only B2B offers.
          </p>
        </div>

        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-bg-surface border border-white-500/20 px-4 py-3 text-xs text-white-100 placeholder:text-white-400 focus:border-white outline-none text-center sm:text-left rounded-sm"
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
            className="shrink-0 font-inter text-xs uppercase tracking-wider w-full sm:w-auto justify-center font-bold rounded-sm hover:bg-neutral-200"
          >
            Subscribe
          </Button>
        </form>

        <div className="pt-8 max-w-4xl mx-auto border-t border-white-500/10 flex flex-wrap justify-center gap-6 sm:gap-8 text-xs text-white-400 font-inter text-center">
          <span>✓ 100% Leakproof Guarantee</span>
          <span>✓ Free Express Shipping over ₹499</span>
          <span>✓ Easy 7-Day Returns</span>
          <span>✓ Razorpay 256-Bit Encrypted Payments</span>
        </div>
      </section>
    </main>
  )
}
