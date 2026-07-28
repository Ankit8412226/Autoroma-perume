import { Suspense } from 'react'
import Link from 'next/link'
import { ProductFilters } from '@/features/products/components/ProductFilters'
import { FlippingBookProductCard, type FlippingBookProductCardProps } from '@/features/products/components/FlippingBookProductCard'
import { prisma } from '@/lib/db/prisma'
import { Sparkles, ShieldCheck, Truck, RefreshCw, Car } from 'lucide-react'

export const metadata = {
  title: 'Atelier Car Fragrance Collection — Vent Clips, Sprays & Gels | Maison Noir',
  description:
    'Explore Maison Noir luxury car fragrances. Shop heat-tested 60°C vent clips, interior sprays, dashboard gels, and hanging diffusers for BMW, Mercedes, Porsche, Audi, and Range Rover across India.',
}

export const revalidate = 300 // ISR 5 minutes

interface PageProps {
  searchParams: Promise<{
    type?: string
    family?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = (await searchParams) || {}
  const { type, family, sort } = resolvedParams

  // Construct Prisma Filter Clause Safely
  const whereClause: Record<string, unknown> = {
    status: 'ACTIVE',
  }

  if (type) {
    whereClause.productType = type
  }

  if (family) {
    whereClause.scentFamily = family
  }

  // Construct OrderBy Clause
  let orderByClause: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }
  if (sort === 'price_asc') {
    orderByClause = { price: 'asc' }
  } else if (sort === 'price_desc') {
    orderByClause = { price: 'desc' }
  } else if (sort === 'rating') {
    orderByClause = { averageRating: 'desc' }
  }

  let products: FlippingBookProductCardProps['product'][] = []
  try {
    products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
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
    products = []
  }

  return (
    <main className="space-y-12 pb-24 bg-bg-primary text-white-100 min-h-screen">
      {/* Editorial Header Banner */}
      <section className="bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-primary border-b border-white-500/15 py-16 px-6 md:px-12 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-300/10 border border-gold-300/30 text-gold-300 text-xs font-inter uppercase tracking-widest">
            <Car className="h-3.5 w-3.5" />
            <span>French Olfactory Craftsmanship · Heat-Tested Formulations</span>
          </div>

          <h1 className="font-cormorant text-4xl sm:text-6xl text-white-100 font-light leading-tight">
            Atelier Automotive Fragrance Catalog
          </h1>

          <p className="text-body-md text-white-300 font-light max-w-2xl mx-auto leading-relaxed font-inter">
            Click any formulation card below to flip open its Atelier Book 📖 detailing top, heart, and base notes.
          </p>
        </div>

        {/* Value Pillars */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left text-xs font-inter border-t border-white-500/10">
          <div className="flex items-center gap-3 p-3 bg-bg-surface border border-white-500/10">
            <Sparkles className="h-4 w-4 text-gold-300 shrink-0" />
            <div>
              <strong className="text-white-100 block">100% Pure Oil</strong>
              <span className="text-white-400 text-[10px]">No Headache Alcohol</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-bg-surface border border-white-500/10">
            <ShieldCheck className="h-4 w-4 text-gold-300 shrink-0" />
            <div>
              <strong className="text-white-100 block">60°C Heat Tested</strong>
              <span className="text-white-400 text-[10px]">Indian Summer Proof</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-bg-surface border border-white-500/10">
            <Truck className="h-4 w-4 text-gold-300 shrink-0" />
            <div>
              <strong className="text-white-100 block">Free Shipping</strong>
              <span className="text-white-400 text-[10px]">Orders Above ₹499</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-bg-surface border border-white-500/10">
            <RefreshCw className="h-4 w-4 text-gold-300 shrink-0" />
            <div>
              <strong className="text-white-100 block">7-Day Guarantee</strong>
              <span className="text-white-400 text-[10px]">100% Leakproof Policy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Main Body */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        {/* Interactive Filter Pills & Dropdowns */}
        <Suspense fallback={<div className="h-16 bg-bg-surface animate-pulse" />}>
          <ProductFilters />
        </Suspense>

        {/* Results Info */}
        <div className="flex justify-between items-center text-xs font-inter text-white-400 border-b border-white-500/15 pb-4">
          <span>
            Showing <strong className="text-gold-300 font-semibold">{products.length}</strong> active atelier formulations
          </span>
          <span className="hidden sm:inline">
            Curated for Luxury Vehicle Cabins Across India
          </span>
        </div>

        {/* Catalog 3D Book Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center bg-bg-surface border border-white-500/20 space-y-4">
            <h3 className="font-cormorant text-2xl text-white-100 font-light">
              No Fragrances Found
            </h3>
            <p className="text-xs text-white-400 font-inter">
              Try adjusting your category pills or scent family filter.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-gold-300 text-bg-primary font-inter text-xs uppercase tracking-widest font-semibold"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <FlippingBookProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
