import Link from 'next/link'
import { Button } from '@/components/ui'
import { RevealText } from '@/components/motion/RevealText'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { HeroSceneWrapper } from '@/components/three/HeroSceneWrapper'
import { HolographicCabinCard } from '@/components/motion/HolographicCabinCard'
import { GlowingCategoryCard } from '@/components/motion/GlowingCategoryCard'
import { InteractiveScentPyramid } from '@/components/motion/InteractiveScentPyramid'
import { InteractiveLaserEngraver } from '@/components/motion/InteractiveLaserEngraver'
import { AnimatedTestimonials } from '@/components/motion/AnimatedTestimonials'
import { AnimatedFAQAccordion } from '@/components/motion/AnimatedFAQAccordion'
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
      {/* SECTION 1: HERO SECTION WITH 3D BOTTLE & SUPERCAR CANVAS (IMAGE TOP ON MOBILE) */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 md:px-12 pt-12 sm:pt-16 pb-20 bg-gradient-to-b from-bg-primary via-bg-secondary/80 to-bg-primary border-b border-white-500/15">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[650px] h-[320px] sm:h-[650px] bg-gold-300/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* On Mobile: 3D Bottle Canvas rendered FIRST on top */}
          <div className="order-1 lg:order-2 lg:col-span-5 h-[340px] sm:h-[480px] lg:h-[580px] w-full relative">
            <HeroSceneWrapper />
          </div>

          {/* Hero Content below image on mobile, centered alignment */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold-300/10 border border-gold-300/30 text-gold-300 text-[10px] sm:text-[11px] uppercase tracking-widest font-inter">
              <Car className="h-3.5 w-3.5 text-gold-300" />
              <span>Automotive Fragrance House · France & India</span>
            </div>

            <div className="space-y-4">
              <RevealText
                as="h1"
                className="font-cormorant text-3xl sm:text-6xl lg:text-7xl text-white-100 font-light leading-[1.08] tracking-tight"
              >
                Engineered for the Road.{' '}
                <span className="bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 bg-clip-text text-transparent italic font-normal block sm:inline">
                  Crafted for the Cabin.
                </span>
              </RevealText>

              <RevealText
                as="p"
                delay={0.2}
                className="text-body-md sm:text-body-lg text-white-200 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed font-inter"
              >
                Elevate your daily drive with heat-resistant, pure fragrance oil vent clips, interior mists, and dashboard gels designed specifically for luxury vehicle cabins across India.
              </RevealText>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-inter text-white-300 pt-2">
              <span className="flex items-center gap-1.5 bg-bg-surface px-3 py-1.5 border border-white-500/10 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold-300" /> 100% Pure Oils
              </span>
              <span className="flex items-center gap-1.5 bg-bg-surface px-3 py-1.5 border border-white-500/10 text-[11px]">
                <CheckCircle2 className="h-4 w-4 text-gold-300" /> 60°C Heat Tested
              </span>
              <span className="flex items-center gap-1.5 bg-bg-surface px-3 py-1.5 border border-white-500/10 text-[11px]">
                <CheckCircle2 className="h-4 w-4 text-gold-300" /> 0% Alcohol
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 w-full sm:w-auto">
              <MagneticButton>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="primary" size="xl" className="shadow-2xl font-inter tracking-wider uppercase text-xs px-8 py-4 w-full sm:w-auto justify-center">
                    <span>Explore Collection</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>

              <Link
                href="/b2b"
                className="text-xs font-inter text-gold-300 hover:text-gold-200 uppercase tracking-widest underline underline-offset-8 font-medium transition-colors"
              >
                B2B & Fleet Wholesale →
              </Link>
            </div>
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

      {/* SECTION 6: AUDIO SPRAY MIST INTERACTIVE SCENT PYRAMID WITH DYNAMIC IMAGE SWITCHING */}
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
            className="flex-1 bg-bg-surface border border-white-500/20 px-4 py-3 text-xs text-white-100 placeholder:text-white-400 focus:border-gold-300 outline-none text-center sm:text-left"
            required
          />
          <Button type="submit" variant="primary" size="md" className="shrink-0 font-inter text-xs uppercase tracking-wider w-full sm:w-auto justify-center">
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
