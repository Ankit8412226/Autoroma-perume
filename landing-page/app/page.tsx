import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PropertySearch } from '@/components/real-estate/PropertySearch'
import { PropertyGrid } from '@/components/real-estate/PropertyGrid'
import { SectionHeading } from '@/components/real-estate/SectionHeading'
import { LocationCard } from '@/components/real-estate/LocationCard'
import { DevelopmentFeature } from '@/components/real-estate/DevelopmentFeature'
import { MarketSnapshot } from '@/components/real-estate/MarketSnapshot'
import { AgentCard } from '@/components/real-estate/AgentCard'
import { PropertyMap } from '@/components/real-estate/PropertyMap'
import { PROPERTIES } from '@/data/properties'
import { LOCATIONS } from '@/data/locations'
import { AGENTS } from '@/data/agents'
import { Shield, Sparkles, Building2, CheckCircle2, UserPlus, ArrowUpRight } from 'lucide-react'

export default function HomePage() {
  const featuredProperties = PROPERTIES.filter((p) => p.isFeatured).slice(0, 3)
  const heroProperty = PROPERTIES[0]

  const stats = [
    { label: 'PROPERTIES REPRESENTED', value: '140+' },
    { label: 'COMMUNITY ADVISORS', value: '45+' },
    { label: 'PRIME LOCATIONS', value: '6 CITIES' },
    { label: 'OFF-MARKET MANIFEST', value: '₹1,200 Cr+' },
  ]

  const categories = [
    {
      title: 'Seafront Penthouses',
      subtitle: 'Bandra West, Worli, Marine Drive',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      href: '/properties?category=penthouse',
    },
    {
      title: 'Private Coastal Villas',
      subtitle: 'Assagao, Anjuna, Moira',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      href: '/properties?category=villa',
    },
    {
      title: 'Golf Course Residences',
      subtitle: 'Golf Course Road, Gurgaon',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      href: '/properties?category=duplex',
    },
    {
      title: 'Heritage Palatial Estates',
      subtitle: 'Jubilee Hills, Sadashivnagar',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      href: '/properties?category=estate',
    },
  ]

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-charcoal text-white pt-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85&auto=format&fit=crop"
            alt="House & Sky Architectural Estate"
            fill
            priority
            className="object-cover opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Main Hero Copy & Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-brand-sky" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white">
                  EXCEPTIONAL HOMES. UNDER OPEN SKIES.
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-6xl font-normal leading-[1.1] text-white tracking-tight">
                  Architectural Residences & Trophy Estates
                </h1>
                <p className="text-xs sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
                  Representing India&apos;s most distinguished sea-facing penthouses, private coastal villas, and high-yield real estate investments.
                </p>
              </div>

              <div className="pt-2">
                <PropertySearch />
              </div>
            </div>

            {/* Right Floating Featured Residence Showcase */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/95 backdrop-blur-md border border-brand-green/30 rounded-xl p-6 shadow-2xl text-brand-charcoal space-y-4">
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-brand-green/15">
                  <Image
                    src={heroProperty.images.hero}
                    alt={heroProperty.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-brand-green text-white text-[10px] uppercase font-bold tracking-widest rounded">
                    FEATURED RESIDENCE
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xl font-serif font-bold text-brand-green block">
                    {heroProperty.formattedPrice}
                  </span>
                  <h3 className="font-serif text-lg text-brand-charcoal font-bold">
                    {heroProperty.title}
                  </h3>
                  <p className="text-xs text-brand-charcoal/70 font-light">
                    {heroProperty.location.area}, {heroProperty.location.city}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-green/15 flex items-center justify-between text-xs">
                  <span className="font-mono text-brand-charcoal/70">
                    {heroProperty.specs.bedrooms} Beds · {heroProperty.specs.bathrooms} Baths · {heroProperty.specs.areaSqFt.toLocaleString()} sq ft
                  </span>
                  <Link
                    href={`/properties/${heroProperty.slug}`}
                    className="px-3.5 py-2 bg-brand-green hover:bg-brand-dark text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all shadow-sm"
                  >
                    View Residence
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-brand-green/15 rounded-lg p-6 sm:p-8 shadow-sm">
          {stats.map((s) => (
            <div key={s.label} className="text-center space-y-1">
              <span className="block text-[10px] font-bold tracking-[0.2em] text-brand-green uppercase">
                {s.label}
              </span>
              <span className="text-2xl sm:text-3xl font-serif text-brand-charcoal font-bold block">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FEATURED PROPERTIES"
          title="Homes worth seeing."
          subtitle="A considered selection of properties in exceptional locations."
          action={{ label: 'View all properties →', href: '/properties' }}
        />
        <PropertyGrid properties={featuredProperties} columns={3} variant="B" />
      </section>

      {/* 4. EXPLORE THE NEIGHBOURHOOD (MAP SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyMap properties={PROPERTIES} />
      </section>

      {/* 5. LOCATION DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="LOCATION DISCOVERY"
          title="Explore prime destinations."
          subtitle="Find exceptional residences across India's most sought-after coastal and urban enclaves."
          action={{ label: 'View all locations →', href: '/locations' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      </section>

      {/* 6. PROPERTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="PROPERTY CATEGORIES"
          title="Find the way you want to live."
          subtitle="Curated architectural typologies tailored for your lifestyle."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative aspect-[4/5] bg-white border border-brand-green/15 rounded-lg overflow-hidden block shadow-sm hover:border-brand-green/40 transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-85" />
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 z-10 text-white">
                <h3 className="font-serif text-xl text-white font-normal group-hover:text-brand-soft transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/80 font-light">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. FLAGSHIP DEVELOPMENT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DevelopmentFeature />
      </section>

      {/* 8. PHILOSOPHY / TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-brand-green/15 rounded-lg p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-md overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
                alt="House & Sky Architectural Advisory"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-green block">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal leading-tight">
                Property decisions deserve better information.
              </h2>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Curated</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Properties selected with architectural intent and verified legal title lineage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Clear</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Information without unnecessary noise or inflated marketing claims.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Human</h4>
                    <p className="text-xs text-brand-charcoal/70 font-light">Real advisors for important financial and lifestyle decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. MARKET SNAPSHOT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketSnapshot />
      </section>

      {/* 10. WORK WITH US / BECOME AN AGENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-soft border border-brand-green/20 rounded-lg p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-brand-green/15 rounded-md">
              <UserPlus className="w-4 h-4 text-brand-green" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">
                CAREERS & PARTNERSHIPS
              </span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal">
              Work with Us — Join House & Sky Advisory
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light leading-relaxed">
              We empower top-tier real estate agents, estate managers, and luxury property advisors with full multi-level network backing, transparent commissions, and high-net-worth client leads.
            </p>
          </div>

          <Link
            href="/contact?role=agent"
            className="px-6 py-3.5 bg-brand-green hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-[0.18em] rounded-md transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <span>Apply as an Agent</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </section>

      {/* 11. MEET THE PEOPLE BEHIND THE PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="OUR TEAM"
          title="Meet the people behind the properties."
          subtitle="Experienced advisors dedicated to confidential real estate representation."
          action={{ label: 'View all advisors →', href: '/agents' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark text-white rounded-lg p-8 sm:p-14 text-center space-y-6 shadow-xl border border-brand-green/20">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Your next address starts here.
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-light">
            Connect with our team for confidential advisory and private property viewings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/properties"
              className="px-6 py-3.5 bg-white text-brand-dark font-bold text-xs uppercase tracking-widest hover:bg-brand-soft rounded-md transition-all cursor-pointer shadow-md"
            >
              Explore Properties
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-brand-green text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-brand-dark rounded-md transition-all cursor-pointer shadow-md border border-brand-green"
            >
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
