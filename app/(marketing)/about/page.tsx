import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { RevealText } from '@/components/motion/RevealText'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { HolographicCabinCard } from '@/components/motion/HolographicCabinCard'
import { AtelierLabVisualizer } from '@/components/motion/AtelierLabVisualizer'
import { Sparkles, Car } from 'lucide-react'

export const metadata = {
  title: 'About the Atelier — Luxury Automotive Perfumery | Autoroma',
  description: 'Discover how Autoroma crafts heat-tested 60°C, alcohol-free luxury car fragrances for BMW, Mercedes, Porsche, and Range Rover interiors.',
}

export default function AboutPage() {
  return (
    <main className="space-y-20 sm:space-y-24 pb-24 bg-bg-primary text-white-100 overflow-hidden">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-6 md:px-12 pt-16 pb-16 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary border-b border-white-500/15">
        <div className="max-w-4xl mx-auto text-center space-y-6 z-10 flex flex-col items-center">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold-300 animate-pulse" />
            <span>The Autoroma Atelier · France & India</span>
          </span>

          <RevealText
            as="h1"
            className="font-cormorant text-4xl sm:text-6xl lg:text-7xl text-white-100 font-light leading-tight"
          >
            Redefining the Sensory Experience of Driving
          </RevealText>

          <RevealText
            as="p"
            delay={0.2}
            className="text-body-md sm:text-body-lg text-white-200 font-light max-w-2xl mx-auto leading-relaxed font-inter"
          >
            Born from a refusal to accept cheap paper trees or harsh synthetic alcohol sprays in luxury automobiles. Every Autoroma fragrance is formulated like fine perfumery, calibrated specifically for cabin climate control.
          </RevealText>
        </div>
      </section>

      {/* SECTION 2: LUXURY CAR PERFUME BOTTLE FEATURE BANNER */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative aspect-[16/9] w-full bg-bg-secondary border border-gold-300/40 overflow-hidden group shadow-2xl">
          <Image
            src="/images/car-perfume-craft.png"
            alt="Handcrafted Luxury Car Perfume Bottle in Vehicle Cabin"
            fill
            sizes="100vw"
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent flex flex-col justify-end p-6 sm:p-12 space-y-2 text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gold-300 font-inter font-bold">
              Master Perfumery & Craftsmanship
            </span>
            <h2 className="font-cormorant text-2xl sm:text-4xl md:text-5xl text-white-100 font-light">
              Hand-Cut Glass & Porous Beechwood Diffusers
            </h2>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: CRAFTSMANSHIP 3D HOLOGRAPHIC CARDS */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
            Atelier Standards
          </span>
          <h2 className="font-cormorant text-display-lg sm:text-display-xl font-light text-white-100">
            Engineered Without Compromise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HolographicCabinCard
            iconName="zap"
            title="Heat-Stable Formula (60°C)"
            subtitle="Indian Summer Proof"
            desc="Car interiors parked under the Indian sun can reach over 60°C. Our organic oil bases prevent rapid flash evaporation and maintain steady sillage."
            href="/products"
            ctaText="Explore Collection →"
          />

          <HolographicCabinCard
            iconName="shield"
            title="0% Synthetic Alcohol"
            subtitle="IFRA Certified Oils"
            desc="We eliminate cheap solvents that cause headaches during traffic jams. Only IFRA-certified natural essential oils and perfumery accords are used."
            href="/products?type=SPRAY"
            ctaText="Explore Mists →"
          />

          <HolographicCabinCard
            iconName="award"
            title="Anodized Metal Clips"
            subtitle="Precision Louver Fit"
            desc="Crafted from weighted matte aluminum alloy that integrates seamlessly with BMW, Audi, Mercedes, and Porsche turbine AC vent louvers."
            href="/products?type=VENT_CLIP"
            ctaText="Explore Vent Clips →"
          />
        </div>
      </ScrollReveal>

      {/* SECTION 4: CRAZY FEATURE 1 — INTERACTIVE DISTILLATION LAB VISUALIZER */}
      <ScrollReveal className="bg-bg-secondary py-16 sm:py-24 border-y border-gold-300/20 px-4 sm:px-6 md:px-12">
        <AtelierLabVisualizer />
      </ScrollReveal>

      {/* SECTION 5: SCENT FORMULATION STORY */}
      <ScrollReveal className="px-4 sm:px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Mobile Image Top Stack */}
          <div className="order-1 lg:order-1 lg:col-span-6 relative aspect-[4/5] w-full border border-gold-300/40 overflow-hidden shadow-2xl group">
            <Image
              src="/images/car-vent-perfume-clip.png"
              alt="Anodized Gold Car Vent Perfume Clip"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="order-2 lg:order-2 lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300 font-inter">
              <Car className="h-4 w-4 text-gold-300" />
              <span>Formulated in Grasse · Assembled in India</span>
            </div>
            <h2 className="font-cormorant text-display-lg sm:text-display-xl text-white-100 font-light">
              Designed for Long Indian Commutes
            </h2>
            <p className="text-xs sm:text-body-md text-white-200 font-light leading-relaxed font-inter">
              Whether navigating Mumbai&apos;s monsoon traffic or cruising along the Bengaluru expressway, your car cabin is your personal sanctuary. Autoroma transforms mundane driving time into a grounding olfactory ritual.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <MagneticButton>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="font-inter text-xs uppercase tracking-widest w-full sm:w-auto justify-center">
                    Explore Fragrance Catalog
                  </Button>
                </Link>
              </MagneticButton>

              <Link href="/b2b" className="text-xs font-inter text-gold-300 uppercase tracking-widest hover:underline">
                B2B & Fleet Supply →
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </main>
  )
}
