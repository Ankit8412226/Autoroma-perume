import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROPERTIES } from '@/data/properties'
import { AGENTS } from '@/data/agents'
import { PropertyGallery } from '@/components/real-estate/PropertyGallery'
import { PropertyStats } from '@/components/real-estate/PropertyStats'
import { PropertyAmenities } from '@/components/real-estate/PropertyAmenities'
import { PropertyMap } from '@/components/real-estate/PropertyMap'
import { InquiryForm } from '@/components/real-estate/InquiryForm'
import { FavoriteButton } from '@/components/real-estate/FavoriteButton'
import { PriceDisplay } from '@/components/real-estate/PriceDisplay'
import { PropertyGrid } from '@/components/real-estate/PropertyGrid'
import { RecentlyViewed } from '@/components/real-estate/RecentlyViewed'
import { CompareDrawer } from '@/components/real-estate/CompareDrawer'
import { MapPin, Phone, Mail, CheckCircle2, ChevronRight } from 'lucide-react'

interface PropertyPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const resolvedParams = await params
  const property = PROPERTIES.find((p) => p.slug === resolvedParams.slug)
  if (!property) return { title: 'Property Not Found' }

  return {
    title: `${property.title} — ${property.location.area}, ${property.location.city} | House & Sky`,
    description: property.description,
  }
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const resolvedParams = await params
  const property = PROPERTIES.find((p) => p.slug === resolvedParams.slug)

  if (!property) {
    notFound()
  }

  const agent = AGENTS.find((a) => a.id === property.agentId) || AGENTS[0]
  const similarProperties = PROPERTIES.filter((p) => p.id !== property.id).slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative bg-bg-primary">
      <CompareDrawer />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-brand-charcoal/60 font-mono">
        <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-brand-charcoal/40" />
        <Link href="/properties" className="hover:text-brand-green transition-colors">Properties</Link>
        <ChevronRight className="w-3 h-3 text-brand-charcoal/40" />
        <span className="text-brand-charcoal font-semibold truncate max-w-xs">{property.title}</span>
      </nav>

      {/* Property Title & Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-brand-green/10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-brand-soft text-brand-green border border-brand-green/20 text-[10px] uppercase tracking-[0.2em] font-bold rounded">
              {property.propertyType}
            </span>
            <span className="text-xs text-brand-charcoal/70 font-mono flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-green" />
              {property.location.address}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-brand-charcoal font-normal leading-tight">
            {property.title}
          </h1>

          <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light max-w-3xl">
            {property.tagline}
          </p>
        </div>

        {/* Price & Action Tools */}
        <div className="flex items-center gap-4 lg:flex-col lg:items-end justify-between shrink-0">
          <PriceDisplay
            formattedPrice={property.formattedPrice}
            formattedPricePerSqFt={property.formattedPricePerSqFt}
            size="lg"
          />

          <div className="flex items-center space-x-3">
            <FavoriteButton propertyId={property.id} size="md" />
          </div>
        </div>
      </div>

      {/* 1. Photo Lightbox Gallery */}
      <PropertyGallery
        heroImage={property.images.hero}
        galleryImages={property.images.gallery}
        title={property.title}
      />

      {/* 2. Key Specs Bar */}
      <PropertyStats specs={property.specs} />

      {/* 3. Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Editorial Overview */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
              Architectural Overview
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/80 font-light leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Key Architectural Highlights */}
          <div className="space-y-4 pt-6 border-t border-brand-green/10">
            <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
              Key Features & Inclusions
            </h3>
            <div className="space-y-2.5">
              {property.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-brand-charcoal/80 font-light">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Amenities Grid */}
          <div className="space-y-4 pt-6 border-t border-brand-green/10">
            <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
              Curated Amenities & Facilities
            </h3>
            <PropertyAmenities amenities={property.amenities} />
          </div>

          {/* Floor Plan Section */}
          <div className="space-y-4 pt-6 border-t border-brand-green/10">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
                Architectural Floor Plan
              </h3>
              <span className="text-xs font-mono text-brand-green font-bold">
                {property.specs.areaSqFt.toLocaleString()} SQ FT TOTAL
              </span>
            </div>

            <div className="relative aspect-[16/9] w-full bg-white border border-brand-green/15 rounded-lg overflow-hidden shadow-sm">
              <Image
                src={property.floorPlanUrl}
                alt={`${property.title} Floor Plan`}
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
              />
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-brand-charcoal/90 backdrop-blur-md text-[10px] uppercase tracking-widest text-white border border-white/20 rounded">
                Schematic Layout Draft
              </div>
            </div>
          </div>

          {/* Interactive Precinct Location Map */}
          <div className="space-y-4 pt-6 border-t border-brand-green/10">
            <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
              Location & Precinct Map
            </h3>
            <PropertyMap activeProperty={property} />
          </div>
        </div>

        {/* Right Column: Agent Profile & Schedule Visit Module */}
        <div className="lg:col-span-4 space-y-8 sticky top-28">
          {/* Agent Card */}
          <div className="bg-white border border-brand-green/15 rounded-lg p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 border border-brand-green/20 rounded-full overflow-hidden">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green block">
                  Listing Representative
                </span>
                <h4 className="font-serif text-lg text-brand-charcoal">{agent.name}</h4>
                <p className="text-[11px] text-brand-charcoal/70 font-light">{agent.title}</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-brand-green/10 text-xs text-brand-charcoal">
              <a
                href={`tel:${agent.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 hover:text-brand-green transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-green" />
                <span>{agent.phone}</span>
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-3 hover:text-brand-green transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-green" />
                <span>{agent.email}</span>
              </a>
            </div>
          </div>

          {/* Schedule Visit Inquiry Form */}
          <InquiryForm propertyTitle={property.title} agentName={agent.name} />
        </div>
      </div>

      {/* 4. Recently Viewed & Similar Properties */}
      <RecentlyViewed currentPropertyId={property.id} />

      <div className="pt-16 border-t border-brand-green/10 space-y-8">
        <h3 className="font-serif text-3xl text-brand-charcoal font-normal">
          Similar Luxury Residences
        </h3>
        <PropertyGrid properties={similarProperties} columns={3} variant="B" />
      </div>
    </div>
  )
}
