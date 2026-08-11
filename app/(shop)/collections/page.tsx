import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui'

export const revalidate = 300 // ISR 5 minutes

export const metadata = {
  title: 'Fragrance Collections — Maison Noir',
  description: 'Explore curated automotive fragrance collections: The Leather & Oud Series, The Coastal Series, and The Woods & Cedar Edition.',
}

interface CollectionItem {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  _count: { products: number }
}

export default async function CollectionsPage() {
  let collections: CollectionItem[] = []
  try {
    collections = await prisma.collection.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        _count: { select: { products: true } },
      },
    })
  } catch {
    collections = []
  }

  return (
    <main className="py-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12 min-h-[70vh]">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-label text-gold-300 uppercase tracking-widest block font-inter">
          Olfactory Catalog
        </span>
        <h1 className="font-cormorant text-3xl sm:text-5xl lg:text-display-xl font-light text-white-100">
          Curated Fragrance Series
        </h1>
        <p className="text-xs sm:text-body-md text-white-300 font-light">
          Distinct olfactory themes crafted to complement specific vehicle interior materials and cabin moods.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {collections.map((col) => (
          <article key={col.id} className="group bg-bg-surface border border-white-500/20 hover:border-gold-300 transition-colors p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative aspect-[16/10] w-full bg-bg-secondary overflow-hidden border border-white-500/10">
                <Image
                  src={col.imageUrl}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-gold-300 uppercase tracking-widest font-inter">
                  {col._count?.products || 0} Fragrances Available
                </span>
                <h3 className="font-cormorant text-2xl text-white-100 font-light group-hover:text-gold-200 transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-white-400 font-light leading-relaxed">
                  {col.description}
                </p>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full">
              <Link href={`/products?family=${encodeURIComponent(col.name)}`}>Explore {col.name}</Link>
            </Button>
          </article>
        ))}
      </div>
    </main>
  )
}
