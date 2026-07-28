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
        baseNotes: true,
      },
    })
  } catch {
    featuredProducts = []
  }

  return (
    <main className="space-y-20 sm:space-y-24 pb-24 overflow-hidden bg-bg-primary text-white-100">
      {/* SECTION 1: BOMBAY MUSK EXACT MATCH HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-white-500/20">
        {/* Full-Bleed Background Image: Woman right-aligned inside luxury SUV trunk holding gold perfume box near chest */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-woman-perfume-perfect.png"
            alt="Autoroma Luxury Car Perfume Model holding Gold Perfume Box"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[right_center] sm:object-[right_top] brightness-105"
          />
          {/* Subtle Dark Vignette Gradients for Left-side Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[1]" />
        </div>

        {/* Hero Left Content Overlay */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-16 lg:px-20 relative z-10 my-auto pt-28 pb-16 flex flex-col items-start text-left space-y-6">
          {/* Eyebrow Label */}
          <span className="text-white/80 text-xs sm:text-sm uppercase tracking-[0.3em] font-inter font-semibold drop-shadow-md">
            LUXURY CAR PERFUME
          </span>

          {/* Main Headline */}
          <h1 className="text-white font-sans text-5xl sm:text-7xl lg:text-[5.5rem] font-semibold leading-[1.05] tracking-tight max-w-2xl drop-shadow-lg">
            The scent you&apos;re remembered by.
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-white/90 text-sm sm:text-base font-inter font-light max-w-lg leading-relaxed drop-shadow">
            Designer-grade fragrance, engineered to last for weeks inside a hot cabin. Not a chemical air freshener.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4 relative z-20">
            <Link href="/products">
              <button
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
                className="font-inter text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-sm shadow-2xl transition-all cursor-pointer border border-white hover:opacity-90"
              >
                SHOP THE COLLECTION
              </button>
            </Link>

            <a href="#scent-quiz">
              <button
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.8)' }}
                className="backdrop-blur-md border hover:bg-white/20 font-inter text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-sm transition-all cursor-pointer"
              >
                TAKE THE SCENT QUIZ
              </button>
            </a>
          </div>
        </div>

        {/* Bottom Feature Bar (3 Black Columns matching screenshot) */}
        <div className="relative z-10 w-full bg-black border-t border-white/15 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 text-center text-xs font-inter uppercase tracking-widest text-white/90 py-5">
          <div className="py-2.5 px-4 flex flex-col items-center justify-center space-y-1">
            <span className="font-semibold tracking-[0.2em] text-white flex items-center gap-2">
              🚚 24-HR DISPATCH
            </span>
            <span className="text-[10px] text-white/60 tracking-wider">FAST SHIPPING</span>
          </div>

          <div className="py-2.5 px-4 flex flex-col items-center justify-center space-y-1">
            <span className="font-semibold tracking-[0.2em] text-white flex items-center gap-2">
              🛡️ TRUSTED 135,000+
            </span>
            <span className="text-[10px] text-white/60 tracking-wider">ENTHUSIASTS</span>
          </div>

          <div className="py-2.5 px-4 flex flex-col items-center justify-center space-y-1">
            <span className="font-semibold tracking-[0.2em] text-white flex items-center gap-2">
              ✨ 500,000+ SCENTED
            </span>
            <span className="text-[10px] text-white/60 tracking-wider">CARS</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: INFINITE GOLD BRAND TICKER */}
      <section className="bg-bg-surface border-y border-gold-300/20 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap gap-12 animate-marquee text-[11px] sm:text-xs font-inter uppercase tracking-[0.3em] text-gold-300 font-medium">
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
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Interactive Cabin Architecture
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            Tailored for Fine Vehicle Interiors
          </h2>
          <p className="text-xs sm:text-body-md text-white-300 font-light font-inter">
            Hover over any holographic card below to trigger 3D magnetic tilt & gold glare sweep.
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
          />

          <HolographicCabinCard
            iconName="shield"
            title="Luxury SUVs"
            subtitle="Range Rover · Porsche Cayenne"
            desc="Tuscan Leather solid gel jar designed to diffuse broad, even fragrance across large cabin volumes."
            href="/products?type=DASHBOARD_GEL"
            ctaText="Explore Gel Jars →"
          />

          <HolographicCabinCard
            iconName="zap"
            title="EV & Modern Cockpits"
            subtitle="Tesla · Volvo EX · Audi e-tron"
            desc="Ocean Drive Marine Vent Clips delivering crisp sea spray and bergamot for minimalist interiors."
            href="/products?family=Fresh"
            ctaText="Explore Fresh Marine →"
          />

          <HolographicCabinCard
            iconName="award"
            title="Sports Cars & Coupes"
            subtitle="Porsche 911 · Mustang · BMW M"
            desc="Kyoto Cedar wooden cap vial hanging diffusers crafted with Japanese cedarwood & Hinoki cypress."
            href="/products?type=HANGING"
            ctaText="Explore Hanging Vials →"
          />
        </div>
      </ScrollReveal>

      {/* SECTION 4: REVAMPED GLOWING LED CATEGORY CARDS WITH AIRFLOW AUDIO */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Atelier Formulations
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            Four Ways to Scent Your Drive
          </h2>
          <p className="text-xs sm:text-body-md text-white-300 font-inter font-light">
            Click any category card to trigger audio AC airflow sound effect & gold ambient pulse.
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
          />

          <GlowingCategoryCard
            iconName="sparkles"
            badge="Instant Atmosphere"
            title="Interior Spray Mists"
            desc="50ml fine mist atomizer. Spritz on floor mats and fabric headliners for immediate luxury scenting."
            href="/products?type=SPRAY"
            ctaText="Explore Sprays →"
          />

          <GlowingCategoryCard
            iconName="shield"
            badge="Constant Passive"
            title="Dashboard Gel Jars"
            desc="Heat-stable organic gel jar for cup holders or dashboard pads. Continuous 60-day evaporation."
            href="/products?type=DASHBOARD_GEL"
            ctaText="Explore Gel Jars →"
          />

          <GlowingCategoryCard
            iconName="award"
            badge="Wooden Cap Porous"
            title="Hanging Glass Bottles"
            desc="Hand-cut glass vial with porous beechwood cap. Suspends from rearview mirror for subtle diffusion."
            href="/products?type=HANGING"
            ctaText="Explore Hanging →"
          />
        </div>
      </ScrollReveal>

      {/* SECTION 5: FEATURED PRODUCTS FLIPPING BOOK CATALOG GRID */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 border-b border-white-500/20 pb-6">
          <div>
            <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
              Interactive Atelier Edition Books 📖
            </span>
            <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
              Bestselling Automotive Fragrances
            </h2>
            <p className="text-xs text-white-300 font-inter font-light">
              Click any card to flip 3D open the fragrance formulation book with audio sound effect.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs text-gold-300 hover:text-gold-200 uppercase tracking-wider font-inter underline underline-offset-8 font-medium"
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
            <span className="font-cormorant text-4xl sm:text-5xl text-gold-200 font-light block">60°C</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Heat Tested</span>
          </div>
          <div className="space-y-1 sm:space-y-2 md:border-r border-white-500/10 pr-2 sm:pr-4">
            <span className="font-cormorant text-4xl sm:text-5xl text-gold-200 font-light block">45 Days</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Continuous Scent</span>
          </div>
          <div className="space-y-1 sm:space-y-2 border-r border-white-500/10 pr-2 sm:pr-4">
            <span className="font-cormorant text-4xl sm:text-5xl text-gold-200 font-light block">0%</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Headache Alcohol</span>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <span className="font-cormorant text-4xl sm:text-5xl text-gold-200 font-light block">IFRA</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white-300 font-inter">Certified Standards</span>
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
