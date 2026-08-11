import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { RevealText } from '@/components/motion/RevealText'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { HolographicCabinCard } from '@/components/motion/HolographicCabinCard'
import { AtelierLabVisualizer } from '@/components/motion/AtelierLabVisualizer'
import { InteractiveLaserEngraver } from '@/components/motion/InteractiveLaserEngraver'
import { AnimatedTestimonials } from '@/components/motion/AnimatedTestimonials'
import { AnimatedFAQAccordion } from '@/components/motion/AnimatedFAQAccordion'
import { GLSLHillsHeroCard } from '@/components/ui/GLSLHillsHeroCard'
import { HeroFuturisticDemo } from '@/components/ui/hero-futuristic-demo'
import { Sparkles, Car, ShieldCheck, CheckCircle2, XCircle, Award, Flame, Wind, Droplets } from 'lucide-react'

export const metadata = {
  title: 'About the Atelier — Luxury Automotive Perfumery | AURA VÉLOCE',
  description:
    'Discover how Aura Véloce crafts heat-tested 60°C, alcohol-free luxury car fragrances for BMW, Mercedes, Porsche, and Range Rover interiors across India.',
}

export default function AboutPage() {
  return (
    <main className="space-y-20 sm:space-y-28 pb-24 bg-bg-primary text-white-100 overflow-hidden">
      {/* SECTION 1: HERO LANDING BANNER WITH 3D GLSL TERRAIN CANVAS */}
      <section className="relative min-h-[75vh] flex items-center px-4 sm:px-6 md:px-12 pt-16 pb-16 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary border-b border-white-500/15">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-300/10 border border-gold-300/30 text-gold-300 text-xs font-inter uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-gold-300 animate-pulse" />
              <span>THE AURA VÉLOCE ATELIER · GRASSE & MUMBAI</span>
            </div>

            <RevealText
              as="h1"
              className="font-cormorant text-4xl sm:text-6xl lg:text-7xl text-white-100 font-light leading-[1.08]"
            >
              Redefining the Sensory Experience of Driving
            </RevealText>

            <RevealText
              as="p"
              delay={0.2}
              className="text-xs sm:text-body-md text-white-200 font-light max-w-xl leading-relaxed font-inter"
            >
              Born from a refusal to accept cheap paper air fresheners or harsh synthetic alcohol sprays in luxury automobiles. Aura Véloce formulates pure essential oil mists, 60°C heat-resistant gel jars, and anodized aluminum vent diffusers engineered specifically for high-end vehicle cabins.
            </RevealText>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <MagneticButton>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="font-inter text-xs uppercase tracking-widest w-full sm:w-auto justify-center"
                  >
                    Explore Fragrance Catalog →
                  </Button>
                </Link>
              </MagneticButton>

              <Link
                href="/b2b"
                className="text-xs font-inter text-gold-300 uppercase tracking-widest hover:underline"
              >
                Showroom & B2B Supply →
              </Link>
            </div>
          </div>

          {/* Right Column: 3D GLSL Terrain Card (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <GLSLHillsHeroCard />
          </div>
        </div>
      </section>

      {/* SECTION 2: 3D DEPTH SCANNER & MASTER PERFUMER CRAFTSMANSHIP */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: 2.5D Interactive Depth Scanner Demo */}
          <div className="lg:col-span-6 min-h-[450px] sm:min-h-[520px] flex">
            <HeroFuturisticDemo />
          </div>

          {/* Right Column: Master Perfumery Copy */}
          <div className="lg:col-span-6 bg-bg-surface border border-gold-300/30 p-6 sm:p-10 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-gold-300 font-semibold block">
                MASTER PERFUMERY & BOTANICAL SCIENCE
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-white-100 font-light leading-tight">
                Hand-Cut Glass & Porous Beechwood Diffusers
              </h2>
              <p className="text-xs sm:text-body-md text-white-300 font-light leading-relaxed font-inter">
                Every bottle begins in Grasse, France—the fragrance capital of the world—where master perfumers blend Cambodian Oud, Tuscan Saffron, French Lavender, and Atlas Cedarwood into non-flammable essential oil matrices.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white-500/15 text-xs font-inter">
              <div className="space-y-1">
                <span className="text-[10px] text-gold-300 uppercase tracking-widest block font-semibold">
                  0% ALCOHOL
                </span>
                <span className="text-white-200 text-[11px] block">No Traffic Headaches</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-semibold">
                  60°C TESTED
                </span>
                <span className="text-white-200 text-[11px] block">Indian Summer Proof</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: WHY CHOOSE AURA VÉLOCE (COMPARISON MATRIX LANDING SECTION) */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            THE ATELIER ADVANTAGE
          </span>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-light text-white-100">
            Why Discerning Drivers Choose Aura Véloce
          </h2>
          <p className="text-xs sm:text-body-md text-white-300 font-light font-inter">
            See how our luxury automotive diffusers compare against conventional gas-station air fresheners.
          </p>
        </div>

        {/* Comparative Table / Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Card */}
          <div className="bg-red-950/20 border border-red-500/30 p-6 sm:p-8 space-y-6 rounded-sm">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-400 shrink-0" />
              <div>
                <h3 className="font-sans text-lg font-bold text-red-200 uppercase tracking-wider">
                  Conventional Car Fresheners
                </h3>
                <span className="text-[10px] text-red-400 font-inter uppercase tracking-widest">
                  Cheap Synthetic Solvents
                </span>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs text-white-300 font-inter">
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Harsh synthetic alcohol fumes causing headaches during traffic jams</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Rapid flash evaporation within 5–7 days under hot Indian sun</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Cheap plastic clips that bend and scratch AC vent louvers</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Artificial chemical pine/citrus scent destroying cabin luxury feel</span>
              </li>
            </ul>
          </div>

          {/* Aura Veloce Atelier Card */}
          <div className="bg-gold-300/10 border border-gold-300/60 p-6 sm:p-8 space-y-6 rounded-sm shadow-2xl relative">
            <div className="absolute top-4 right-4 px-2.5 py-1 bg-gold-300 text-bg-primary text-[9px] font-inter uppercase tracking-widest font-bold">
              ★ ATELIER STANDARD
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-gold-300 shrink-0" />
              <div>
                <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wider">
                  Aura Véloce Pure Oil Atelier
                </h3>
                <span className="text-[10px] text-gold-300 font-inter uppercase tracking-widest">
                  French Fine Perfumery
                </span>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs text-white-100 font-inter">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-300 shrink-0 mt-0.5" />
                <span>100% IFRA certified pure essential oils — 0% headache alcohol</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-300 shrink-0 mt-0.5" />
                <span>60°C heat-resistant formulations providing 45+ days of steady sillage</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-300 shrink-0 mt-0.5" />
                <span>Aircraft-grade anodized aluminum diffusers for BMW, Porsche, Mercedes & Audi</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold-300 shrink-0 mt-0.5" />
                <span>Bespoke laser engraving options for vehicle VIN, initials, or dealership branding</span>
              </li>
            </ul>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 4: 4-STEP CRAFTSMANSHIP JOURNEY */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            FROM GRASSE TO CABIN
          </span>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-light text-white-100">
            The 4 Pillars of Olfactory Engineering
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-surface border border-white-500/15 p-6 space-y-4 relative">
            <span className="text-4xl font-cormorant text-gold-300/40 font-bold block">01</span>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-inter font-bold block">
                Botanical Sourcing
              </span>
              <h3 className="font-sans text-base font-bold text-white uppercase tracking-wider">
                Grasse Oils
              </h3>
              <p className="text-xs text-white-300 font-light leading-relaxed font-inter">
                Extracted from French lavender fields, Cambodian oud resin, and Italian citrus orchards.
              </p>
            </div>
          </div>

          <div className="bg-bg-surface border border-white-500/15 p-6 space-y-4 relative">
            <span className="text-4xl font-cormorant text-gold-300/40 font-bold block">02</span>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-inter font-bold block">
                Aerodynamic Fit
              </span>
              <h3 className="font-sans text-base font-bold text-white uppercase tracking-wider">
                CNC Aluminum
              </h3>
              <p className="text-xs text-white-300 font-light leading-relaxed font-inter">
                Machined anodized casings designed to align seamlessly with turbine and horizontal AC louvers.
              </p>
            </div>
          </div>

          <div className="bg-bg-surface border border-white-500/15 p-6 space-y-4 relative">
            <span className="text-4xl font-cormorant text-gold-300/40 font-bold block">03</span>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-inter font-bold block">
                Climate Chamber
              </span>
              <h3 className="font-sans text-base font-bold text-white uppercase tracking-wider">
                60°C Stress Tested
              </h3>
              <p className="text-xs text-white-300 font-light leading-relaxed font-inter">
                Subjected to extreme thermal cycles to ensure zero liquid leaks or plastic warping in hot parked cars.
              </p>
            </div>
          </div>

          <div className="bg-bg-surface border border-white-500/15 p-6 space-y-4 relative">
            <span className="text-4xl font-cormorant text-gold-300/40 font-bold block">04</span>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-inter font-bold block">
                Direct Delivery
              </span>
              <h3 className="font-sans text-base font-bold text-white uppercase tracking-wider">
                Atelier Packaging
              </h3>
              <p className="text-xs text-white-300 font-light leading-relaxed font-inter">
                Shipped in velvet-lined gift boxes directly to luxury car collectors and dealership fleets across India.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 5: INTERACTIVE LASER ENGRAVER LAB EXPERIENCE */}
      <ScrollReveal className="bg-bg-secondary py-16 sm:py-24 border-y border-gold-300/20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
              INTERACTIVE BESPOKE STUDIO
            </span>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-light text-white-100">
              Personalize Your Fragrance Diffuser
            </h2>
            <p className="text-xs sm:text-body-md text-white-300 font-light font-inter">
              Test custom fiber-laser engraving on your anodized aluminum car diffuser live below.
            </p>
          </div>

          <InteractiveLaserEngraver />
        </div>
      </ScrollReveal>

      {/* SECTION 6: INTERACTIVE DISTILLATION LAB VISUALIZER */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <AtelierLabVisualizer />
      </ScrollReveal>

      {/* SECTION 7: DRIVER TESTIMONIALS & REVIEWS */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            VERIFIED AUTOMOTIVE REVIEWS
          </span>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-light text-white-100">
            Trusted by 135,000+ Luxury Car Owners
          </h2>
        </div>

        <AnimatedTestimonials />
      </ScrollReveal>

      {/* SECTION 8: INTERACTIVE ATELIER FAQ ACCORDION */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            CONCIERGE HELPDESK
          </span>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-light text-white-100">
            Frequently Asked Questions
          </h2>
        </div>

        <AnimatedFAQAccordion />
      </ScrollReveal>

      {/* SECTION 9: HIGH-IMPACT FINAL CALL TO ACTION */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-neutral-900 via-bg-surface to-neutral-900 border border-gold-300/40 p-8 sm:p-16 rounded-sm text-center space-y-6 shadow-2xl relative overflow-hidden">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-inter font-bold block">
            ELEVATE YOUR CABIN ATMOSPHERE TODAY
          </span>

          <h2 className="font-cormorant text-3xl sm:text-6xl text-white-100 font-light max-w-3xl mx-auto leading-tight">
            Transform Every Drive Into An Olfactory Sanctuary
          </h2>

          <p className="text-xs sm:text-body-md text-white-300 font-light max-w-xl mx-auto font-inter">
            Explore our heat-tested vent clips, mists, and gel jars with complimentary Express Shipping across India.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="xl" className="font-inter text-xs uppercase tracking-widest">
                Browse Full Fragrance Catalog →
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="secondary" size="xl" className="font-inter text-xs uppercase tracking-widest">
                Contact Fragrance Concierge
              </Button>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  )
}
