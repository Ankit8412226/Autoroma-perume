import { JsonLd } from './JsonLd'

export interface ProductJsonLdProps {
  product: {
    name: string
    description: string
    images: string[]
    sku: string
    price: number
    currency?: string
    availability?: string
    ratingValue?: number
    reviewCount?: number
  }
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Maison Noir',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency || 'INR',
      price: (product.price / 100).toFixed(2),
      availability: product.availability || 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.ratingValue && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue.toFixed(1),
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  }

  return <JsonLd data={schema} />
}
