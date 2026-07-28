import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ProductHero } from '@/features/products/components/ProductHero'
import { ScentNotes } from '@/features/products/components/ScentNotes'

export const revalidate = 300 // ISR 5 minutes

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { name: true, shortDescription: true },
    })

    if (!product) return { title: 'Product Not Found | Maison Noir' }

    return {
      title: `${product.name} — Car Fragrance | Maison Noir`,
      description: product.shortDescription,
    }
  } catch {
    return { title: 'Product Detail | Maison Noir' }
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let product = null
  try {
    product = await prisma.product.findUnique({
      where: { slug, status: 'ACTIVE' },
      include: {
        collection: true,
      },
    })
  } catch {
    product = null
  }

  if (!product) {
    notFound()
  }

  return (
    <main className="py-12 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Product Hero Section */}
      <ProductHero product={product} />

      {/* Scent Notes Composition */}
      <ScentNotes
        topNotes={product.topNotes}
        heartNotes={product.heartNotes}
        baseNotes={product.baseNotes}
      />

      {/* Detailed Description */}
      <section className="max-w-3xl mx-auto space-y-6">
        <h3 className="font-cormorant text-heading-lg text-white-100 font-light text-center">
          The Scent Story
        </h3>
        <p className="text-body-lg text-white-200 font-light leading-relaxed text-center">
          {product.description}
        </p>
      </section>
    </main>
  )
}
