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
import { OceanWaves } from '@/components/motion/OceanWaves'
import { RomanticPerfumeHeroVideo } from '@/components/motion/RomanticPerfumeHeroVideo'
import { FlippingBookProductCard, type FlippingBookProductCardProps } from '@/features/products/components/FlippingBookProductCard'
import { prisma } from '@/lib/db/prisma'
import {
  ArrowRight,
  CheckCircle2,
  Car,
} from 'lucide-react'
import { HeroFuturisticSection } from '@/components/ui/HeroFuturisticSection'
import { HeroScrollDemo } from '@/components/ui/container-scroll-demo'
import { GLSLHillsHeroCard } from '@/components/ui/GLSLHillsHeroCard'

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
        {/* Romantic Perfume Video & Voiceover Sound Background Layer */}
        <RomanticPerfumeHeroVideo />

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

      {/* BOMBAY MUSK LUXURY ANIMATED OCEAN WAVES DIVIDER */}
      <OceanWaves className="-mt-4 -mb-6" />

      {/* SECTION 2: INFINITE BRAND TICKER WITH GENEROUS MARGINS */}
      <section className="bg-bg-surface border-y border-white-500/20 py-5 my-6 sm:my-10 overflow-hidden">
        <div className="flex whitespace-nowrap gap-12 animate-marquee text-[11px] sm:text-xs font-inter uppercase tracking-[0.3em] text-white-200 font-medium">
          <span>• AURA VÉLOCE PARFUM D&apos;AUTOMOBILE</span>
          <span>• HEAT TESTED FORMULATIONS (60°C)</span>
          <span>• ANODIZED MATTE ALUMINUM CASING</span>
          <span>• IFRA CERTIFIED NATURAL OILS</span>
          <span>• FREE SHIPPING ABOVE ₹499 ACROSS INDIA</span>
          <span>• B2B & DEALERSHIP FLEET SUPPLY</span>
          <span>• AURA VÉLOCE PARFUM D&apos;AUTOMOBILE</span>
        </div>
      </section>

      {/* 3D SCROLL CONTAINER SHOWCASE */}
      <HeroScrollDemo />

      {/* BOMBAY MUSK COMPETITOR UX SECTION A: BEST SELLERS GRID ("The scents people ask about") */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-inter uppercase tracking-[0.3em] text-white-300 font-semibold block">
            BEST SELLERS
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-light text-white tracking-tight">
            The scents people ask about
          </h2>
          <p className="text-xs sm:text-sm text-white-300 font-inter font-light">
            Loved by 500,000+ drivers. Start with the ones they reach for most.
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="py-16 text-center bg-bg-surface border border-white-500/20 text-white-400 font-light">
            Loading bestselling scents...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((p) => (
              <FlippingBookProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/products"
            className="inline-block text-xs font-inter uppercase tracking-[0.25em] text-white font-semibold underline underline-offset-8 hover:text-white-300 transition-colors"
          >
            VIEW ALL SCENTS →
          </Link>
        </div>
      </ScrollReveal>

      {/* BOMBAY MUSK COMPETITOR UX SECTION B: WHY IT LASTS 3 METRIC CIRCLES */}
      <section className="bg-black border-y border-white-500/20 py-12 sm:py-20 px-4 sm:px-6 md:px-12 my-10 sm:my-16">
        <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-inter uppercase tracking-[0.3em] text-white-300 font-semibold block">
              WHY IT LASTS
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
              Built like a perfume. Tuned for a car.
            </h2>
            <p className="text-xs sm:text-sm text-white-300 font-inter font-light">
              Most car scents flash off in the heat. Ours is engineered to hold.
            </p>
          </div>

          {/* 3 Circular Glowing Spec Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-center justify-center">
            {/* Circle 1 */}
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-white/20 bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all hover:scale-105 hover:border-white">
                <span className="font-sans text-xl sm:text-3xl font-bold text-white tracking-tight">
                  20-30%
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-inter uppercase tracking-[0.25em] text-white-300 font-medium">
                DESIGNER OIL
              </span>
            </div>

            {/* Circle 2 */}
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-white/20 bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all hover:scale-105 hover:border-white">
                <span className="font-sans text-xl sm:text-3xl font-bold text-white tracking-tight">
                  60°C
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-inter uppercase tracking-[0.25em] text-white-300 font-medium">
                HEAT STABLE
              </span>
            </div>

            {/* Circle 3 */}
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-white/20 bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all hover:scale-105 hover:border-white">
                <span className="font-sans text-xl sm:text-3xl font-bold text-white tracking-tight">
                  100%
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-inter uppercase tracking-[0.25em] text-white-300 font-medium">
                PLANT-BASED ALCOHOL-FREE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BOMBAY MUSK LUXURY ANIMATED OCEAN WAVES DIVIDER */}
      <OceanWaves className="my-6" />

      {/* BOMBAY MUSK COMPETITOR UX SECTION C: DARK ATMOSPHERIC OUD SHOWCASE MATCHING SCREENSHOT 3 */}
      <section className="bg-black py-20 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Rating Badge Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] sm:text-xs font-inter uppercase tracking-[0.35em] text-white-300 font-semibold block">
              LOVED BY 500,000+ DRIVERS
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-sans text-4xl sm:text-5xl font-bold text-white">4.9</span>
              <span className="text-amber-400 text-xl tracking-widest">★★★★★</span>
            </div>
            <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-white-400 block">
              1,611 VERIFIED REVIEWS
            </span>
          </div>

          {/* Split Media Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image: Raw Oud Wood, Cocoa & Smoldering Incense Smoke */}
            <div className="lg:col-span-7 relative h-[360px] sm:h-[480px] rounded-sm overflow-hidden border border-white-500/20 shadow-2xl group">
              <Image
                src="/images/bombay-musk-oud-smoke.png"
                alt="Aura Véloce Raw Agarwood Oud Atmosphere"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Right Card Overlay Matching Screenshot 3 */}
            <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900/90 to-black border border-white-500/20 hover:border-gold-300 p-8 sm:p-10 rounded-sm space-y-6 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(201,169,110,0.2)] transition-all duration-500 relative group">
              <h3 className="font-sans text-2xl sm:text-4xl font-light text-white leading-tight">
                The scent you&apos;re remembered by.
              </h3>
              <p className="text-xs sm:text-sm text-white-300 font-inter font-light leading-relaxed">
                We were tired of car scents that smelled like chemicals and vanished by lunch. So we built a real fragrance at designer-grade concentration, engineered to survive a hot cabin and linger for days. The kind people remember long after you&apos;ve driven off.
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-white-500/15">
                <span className="text-[10px] font-inter uppercase tracking-widest text-white-400 font-semibold">
                  CAMBODIAN OUD ROYAL
                </span>
                <Link href="/products?family=Oud">
                  <button className="px-5 py-2.5 bg-white text-black font-inter text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-200 transition-all cursor-pointer">
                    SHOP OUD →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOMBAY MUSK LUXURY ANIMATED OCEAN WAVES DIVIDER */}
      <OceanWaves className="my-6" />

      {/* FOUR CAR PERFUME FORMATS */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-inter uppercase tracking-[0.3em] text-white-300 font-semibold block">
            FOUR CAR PERFUME FORMATS
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-light text-white tracking-tight">
            How Would You Like to Scent Your Car?
          </h2>
          <p className="text-xs sm:text-sm text-white-300 font-inter font-light">
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

      {/* BOMBAY MUSK LUXURY ANIMATED OCEAN WAVES DIVIDER */}
      <OceanWaves className="my-6" />

      {/* LUXURY SECTION: AS SEEN IN AUTOMOTIVE & LUXURY PRESS */}
      <section className="bg-black border-y border-white-500/20 py-16 px-4 sm:px-6 md:px-12 my-12">
        <div className="max-w-7xl mx-auto space-y-10 text-center">
          <span className="text-xs font-inter uppercase tracking-[0.35em] text-white-400 font-semibold block">
            FEATURED IN LUXURY AUTOMOTIVE PRESS
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Press Card 1 */}
            <div className="bg-bg-surface border border-white-500/20 hover:border-gold-300 p-8 rounded-sm space-y-4 shadow-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(201,169,110,0.2)] transition-all duration-500 group cursor-pointer">
              <span className="font-sans text-xl font-bold tracking-widest text-white group-hover:text-gold-200 transition-colors block">
                AUTOCAR INDIA
              </span>
              <p className="text-xs text-white-300 font-inter font-light italic leading-relaxed">
                &ldquo;The Rolls-Royce of luxury car perfumes. The Cambodian Oud mist smells identical to a 5-star hotel lobby.&rdquo;
              </p>
              <span className="text-[10px] text-gold-300 uppercase tracking-widest font-inter block font-medium">
                ★ ★ ★ ★ ★ EDITORS CHOICE
              </span>
            </div>

            {/* Press Card 2 */}
            <div className="bg-bg-surface border border-white-500/20 hover:border-gold-300 p-8 rounded-sm space-y-4 shadow-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(201,169,110,0.2)] transition-all duration-500 group cursor-pointer">
              <span className="font-sans text-xl font-bold tracking-widest text-white group-hover:text-gold-200 transition-colors block">
                TOP GEAR INDIA
              </span>
              <p className="text-xs text-white-300 font-inter font-light italic leading-relaxed">
                &ldquo;Engineered to withstand 60°C summer cabin heat without evaporating away in 3 days. A game changer.&rdquo;
              </p>
              <span className="text-[10px] text-gold-300 uppercase tracking-widest font-inter block font-medium">
                ★ ★ ★ ★ ★ AUTOMOTIVE INNOVATION
              </span>
            </div>

            {/* Press Card 3 */}
            <div className="bg-bg-surface border border-white-500/20 hover:border-gold-300 p-8 rounded-sm space-y-4 shadow-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(201,169,110,0.2)] transition-all duration-500 group cursor-pointer">
              <span className="font-sans text-xl font-bold tracking-widest text-white group-hover:text-gold-200 transition-colors block">
                GQ MAGAZINE
              </span>
              <p className="text-xs text-white-300 font-inter font-light italic leading-relaxed">
                &ldquo;The laser-engraved anodized diffuser is the ultimate gift for car purists and luxury car owners.&rdquo;
              </p>
              <span className="text-[10px] text-gold-300 uppercase tracking-widest font-inter block font-medium">
                ★ ★ ★ ★ ★ LUXURY ESSENTIAL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BOMBAY MUSK LUXURY ANIMATED OCEAN WAVES DIVIDER */}
      <OceanWaves className="my-6" />

      {/* LUXURY SECTION: ORDINARY AIR FRESHENER VS AURA VÉLOCE COMPARISON */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-inter uppercase tracking-[0.3em] text-white-300 font-semibold block">
            THE AURA VÉLOCE DIFFERENCE
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-light text-white tracking-tight">
            Why Ordinary Car Scents Fail
          </h2>
          <p className="text-xs sm:text-sm text-white-300 font-inter font-light">
            Compare cheap chemical gas-station air fresheners with Aura Véloce&apos;s haute perfumery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ordinary Chemical Freshener */}
          <div className="bg-neutral-950 border border-red-500/30 hover:border-red-500/60 p-8 rounded-sm space-y-6 shadow-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(239,68,68,0.15)] transition-all duration-500 relative group cursor-pointer">
            <span className="text-xs font-inter uppercase tracking-widest text-red-400 font-bold block">
              ❌ ORDINARY CAR SCENTS
            </span>
            <h3 className="font-sans text-2xl font-bold text-white group-hover:text-red-300 transition-colors">
              Synthetic Chemical Spray
            </h3>
            <ul className="space-y-3 text-xs text-white-300 font-inter font-light">
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✕</span> Fades off in 3–5 days under summer heat
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✕</span> Harsh synthetic alcohol causes driver headaches
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✕</span> Leaks corrosive oil onto dashboard plastic
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✕</span> Single flat smell with zero top/base notes
              </li>
            </ul>
          </div>

          {/* Aura Véloce Luxury Car Perfume */}
          <div className="bg-gradient-to-b from-neutral-900 to-black border border-white-500/30 hover:border-emerald-400 p-8 rounded-sm space-y-6 shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(52,211,153,0.25)] transition-all duration-500 relative group cursor-pointer">
            <span className="text-xs font-inter uppercase tracking-widest text-emerald-400 font-bold block">
              ✓ AURA VÉLOCE HAUTE PARFUMERIE
            </span>
            <h3 className="font-sans text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
              Pure Organic Essential Oil
            </h3>
            <ul className="space-y-3 text-xs text-white-100 font-inter font-light">
              <li className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span> Continuous 45-day slow evaporation
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span> 0% chemical alcohol (IFRA certified safe)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span> 100% leakproof anodized aluminum casing
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span> 3-tier olfactory pyramid (Top, Heart, Base)
              </li>
            </ul>
          </div>
        </div>
      </ScrollReveal>

      {/* BOMBAY MUSK LUXURY ANIMATED OCEAN WAVES DIVIDER BEFORE SCENT QUIZ */}
      <OceanWaves mode="interactive" className="my-8" />

      {/* SECTION: BOMBAY MUSK INSPIRED INTERACTIVE SCENT QUIZ */}
      <section id="scent-quiz" className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <InteractiveScentQuiz />
      </section>

      {/* BOMBAY MUSK LUXURY ANIMATED OCEAN WAVES DIVIDER */}
      <OceanWaves className="my-6" />

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

      {/* FUTURISTIC 3D ATELIER & CONTACT FORM SHOWCASE SECTION */}
      <HeroFuturisticSection />

      {/* SECTION 11: NEWSLETTER BANNER */}
      <section className="bg-bg-secondary py-16 sm:py-24 border-t border-white-500/20 px-4 sm:px-6 md:px-12 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Aura Véloce Atelier Club
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
