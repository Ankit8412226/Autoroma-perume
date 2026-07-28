# 14_SEO.md — SEO Architecture & Implementation

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: Frontend Engineers, SEO Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [SEO Philosophy](#1-seo-philosophy)
2. [Metadata Strategy](#2-metadata-strategy)
3. [Structured Data (JSON-LD)](#3-structured-data-json-ld)
4. [Robots.txt](#4-robotstxt)
5. [Sitemap](#5-sitemap)
6. [OpenGraph & Twitter Cards](#6-opengraph--twitter-cards)
7. [Canonical URLs](#7-canonical-urls)
8. [Core Web Vitals](#8-core-web-vitals)
9. [Image SEO](#9-image-seo)
10. [Semantic HTML Standards](#10-semantic-html-standards)
11. [Page-Specific SEO Rules](#11-page-specific-seo-rules)

---

## 1. SEO Philosophy

- Every page must rank for its intended search intent
- Luxury brand keywords are non-negotiable in meta titles
- Product pages must rank for fragrance-specific long-tail keywords
- Structured data ensures rich snippets in search results (star ratings, price)
- Core Web Vitals are a ranking factor — performance IS SEO

**Target Keywords (Examples):**

| Page | Primary Keyword | Secondary |
|---|---|---|
| Homepage | car perfume India | buy car air freshener India online |
| Product — Vent Clip | car vent clip perfume India | best car vent freshener India |
| Product — Spray | car interior spray perfume India | car cabin perfume spray buy |
| Products listing | car perfume online India | best car freshener India buy |
| Collections — Fresh | fresh car fragrance India | citrus car perfume India |
| Collections — Luxury | premium car perfume India | luxury car air freshener India |

---

## 2. Metadata Strategy

### Root Layout Metadata (Defaults)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://maisonnoir.in'),
  title: {
    default: 'Maison Noir — Luxury Perfumes & Fragrances India',
    template: '%s | Maison Noir',
  },
  description:
    'Discover [BRAND NAME] — India\'s premium car fragrance brand. Shop vent clip fresheners, dashboard gels, hanging fresheners, spray perfumes and reed diffusers for your car. Free shipping above ₹499.',
  keywords: [
    'car perfume India',
    'buy car air freshener India',
    'car vent clip perfume',
    'car cabin freshener India',
    'premium car fragrance India',
    'best car perfume online India',
    'car interior spray India',
    'hanging car freshener India',
    'dashboard gel car freshener',
    'car reed diffuser India',
  ],
  authors: [{ name: 'Maison Noir' }],
  creator: 'Maison Noir',
  publisher: 'Maison Noir',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://maisonnoir.in',
    siteName: 'Maison Noir',
    images: [{ url: '/og/default.jpg', width: 1200, height: 630, alt: 'Maison Noir — Luxury Perfumes' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@maisonnoir_in',
    creator: '@maisonnoir_in',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}
```

### Product Page Metadata

```typescript
// app/(shop)/products/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found' }

  const priceFormatted = formatCurrency(product.price)
  const title = `${product.name} — ${priceFormatted} | Maison Noir`
  const description = `${product.shortDescription} Discover ${product.name} by Maison Noir. ${product.fragranceFamily} fragrance. Free shipping above ₹1,500.`

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      `${product.name} price India`,
      `${product.name} perfume`,
      `${product.fragranceFamily.toLowerCase()} perfume India`,
      ...product.topNotes.map(n => `${n.toLowerCase()} perfume`),
      'luxury perfume India',
    ],
    openGraph: {
      title,
      description,
      url: `https://maisonnoir.in/products/${product.slug}`,
      type: 'website',
      images: [{
        url: product.images[0],
        width: 800,
        height: 1000,
        alt: `${product.name} by Maison Noir`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `https://maisonnoir.in/products/${product.slug}`,
    },
  }
}
```

### Collection Page Metadata

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = await getCollectionBySlug(params.slug)
  if (!collection) return { title: 'Collection Not Found' }

  return {
    title: `${collection.name} — Luxury Perfumes | Maison Noir`,
    description: `${collection.description.slice(0, 160)} Shop the ${collection.name} at Maison Noir.`,
    alternates: { canonical: `https://maisonnoir.in/collections/${collection.slug}` },
  }
}
```

---

## 3. Structured Data (JSON-LD)

### Product Schema

```typescript
// src/components/seo/JsonLd.tsx
import type { Product } from '@/types/product.types'

export function ProductJsonLd({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Maison Noir',
    },
    offers: product.variants.map(variant => ({
      '@type': 'Offer',
      price: (variant.price / 100).toFixed(2),   // Paise → INR
      priceCurrency: 'INR',
      availability: variant.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://maisonnoir.in/products/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Maison Noir',
      },
    })),
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating.toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
    review: product.reviews?.slice(0, 5).map(r => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      author: { '@type': 'Person', name: r.userName },
      reviewBody: r.body,
      datePublished: r.createdAt.toISOString(),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### BreadcrumbList Schema

```typescript
export function BreadcrumbJsonLd({ items }: {
  items: Array<{ name: string; href: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://maisonnoir.in${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### Organization Schema (Root Layout)

```typescript
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Maison Noir',
  url: 'https://maisonnoir.in',
  logo: 'https://maisonnoir.in/images/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://instagram.com/maisonnoir_in',
    'https://pinterest.com/maisonnoir_in',
  ]
}
```

### WebSite Schema (for Sitelinks Searchbox)

```typescript
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Maison Noir',
  url: 'https://maisonnoir.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://maisonnoir.in/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
```

---

## 4. Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/checkout/',
          '/_next/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: 'https://maisonnoir.in/sitemap.xml',
  }
}
```

---

## 5. Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'ACTIVE', isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.collection.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const productUrls: MetadataRoute.Sitemap = products.map(p => ({
    url: `https://maisonnoir.in/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const collectionUrls: MetadataRoute.Sitemap = collections.map(c => ({
    url: `https://maisonnoir.in/collections/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: 'https://maisonnoir.in', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://maisonnoir.in/products', lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: 'https://maisonnoir.in/b2b', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://maisonnoir.in/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  return [...staticUrls, ...productUrls, ...collectionUrls]
}
```

---

## 6. OpenGraph & Twitter Cards

### Image Requirements

| Usage | Dimensions | Format | Max Size |
|---|---|---|---|
| Default OG image | 1200×630px | JPEG | 200KB |
| Product OG image | 1200×1200px | JPEG | 200KB |
| Collection OG | 1200×630px | JPEG | 200KB |
| Twitter card | 1200×628px | JPEG | 200KB |

**OG images** are stored in `public/og/` (static) and in Cloudinary (product images).

Product OG images use Cloudinary transformations:
```
https://res.cloudinary.com/maison-noir/image/upload/c_fill,w_1200,h_1200,g_center,q_90,f_jpg/[public_id]
```

---

## 7. Canonical URLs

### Rules

1. All paginated routes (`/products?page=2`) have canonical pointing to page 1 or non-paginated version
2. All filter combinations have canonical pointing to the base page
3. Product variants (50ml vs 100ml) share one canonical URL (the product page)
4. No duplicate content — `www.` redirects to non-www at Vercel level

```typescript
// Canonical in paginated listing
export async function generateMetadata({ searchParams }: {
  searchParams: Record<string, string>
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: 'https://maisonnoir.in/products',  // Always base URL
    },
  }
}
```

---

## 8. Core Web Vitals

### Targets & Responsibilities

| Metric | Target | How We Achieve It |
|---|---|---|
| **LCP** | < 1.2s | ISR, preload hero image, Next.js Image, Cloudinary CDN |
| **FID/INP** | < 50ms | Minimal client JS, lazy-load heavy components |
| **CLS** | < 0.05 | Explicit dimensions on all images, skeleton screens |
| **TTFB** | < 200ms | Vercel Edge network, ISR caching |
| **FCP** | < 1.0s | Critical CSS inlined, no render-blocking scripts |

### Hero Image Preloading

```tsx
// In page.tsx — preload the hero image
import type { Metadata } from 'next'

// Tell Next.js to preload the hero image
<link rel="preload" as="image" href="https://res.cloudinary.com/.../hero.webp" />
```

### No Layout Shift Rules

- All `<Image>` components must have `width` and `height` specified (or `fill` with explicit parent dimensions)
- Skeleton screens must match exact dimensions of loaded content
- Fonts use `display: swap` to prevent invisible text
- Cart drawer animates from off-screen (`translateX(100%)`) — never causes layout shift

---

## 9. Image SEO

### Alt Text Standards

```typescript
// Product images
alt={`${product.name} by Maison Noir — ${product.fragranceFamily} Perfume`}

// Collection images
alt={`${collection.name} — Luxury Perfume Collection by Maison Noir`}

// Hero image
alt="Maison Noir luxury perfume bottle on dark background"

// Never:
alt="perfume.jpg"           // Filename — meaningless
alt="image"                 // Generic
alt=""                      // Missing (only acceptable on purely decorative images)
```

### Cloudinary Image Transformations

All product images served via Cloudinary with:
- `f_auto` — format auto (AVIF for modern browsers, WebP for older)
- `q_auto:best` — quality optimization
- Width-specific transformations for responsive images

```tsx
// Next.js Image with Cloudinary loader
<Image
  src={product.images[0]}
  alt={`${product.name} by Maison Noir`}
  width={800}
  height={1000}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  quality={90}
  priority={isAboveFold}  // Only true for first visible image
/>
```

---

## 10. Semantic HTML Standards

```html
<!-- Page structure — correct hierarchy -->
<header>          <!-- Navbar -->
<main>
  <article>       <!-- Product page content -->
    <h1>          <!-- Product name — exactly ONE per page -->
    <section>     <!-- Fragrance Notes -->
      <h2>        <!-- "Fragrance Notes" -->
    <section>     <!-- Reviews -->
      <h2>        <!-- "Customer Reviews" -->
<footer>          <!-- Footer -->

<!-- Navigation -->
<nav aria-label="Main navigation">
<nav aria-label="Breadcrumb">
<nav aria-label="Pagination">

<!-- Landmark roles -->
<main id="main-content">
<aside aria-label="Shopping cart">

<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to content</a>
```

---

## 11. Page-Specific SEO Rules

| Page | H1 | Meta Title Formula | Canonical |
|---|---|---|---|
| Homepage | "Premium Car Fragrances & Fresheners" | "[BRAND NAME] — Premium Car Perfumes & Fresheners India" | `/` |
| Products | "Shop Car Fragrances" | "Shop Car Perfumes & Fresheners Online India \| [BRAND NAME]" | `/products` |
| Product (Vent Clip) | Product Name | `"{Name} Car Vent Freshener — {Price} \| [BRAND NAME]"` | `/products/{slug}` |
| Product (Spray) | Product Name | `"{Name} Car Interior Spray — {Price} \| [BRAND NAME]"` | `/products/{slug}` |
| Collection | Collection Name | `"{Collection} Car Fragrances \| [BRAND NAME]"` | `/collections/{slug}` |
| Search | "Search Results for {query}" | `"Search: {query} \| [BRAND NAME]"` | `/search?q={query}` |
| B2B | "Bulk Car Fresheners for Business" | "Bulk Car Fresheners for Dealerships, Fleet & Detailing \| [BRAND NAME]" | `/b2b` |
| About | "Our Story" | "Our Story — [BRAND NAME] Car Fragrances" | `/about` |
| Account | (No index) | "My Account \| [BRAND NAME]" | `noindex` |
| Checkout | (No index) | "Checkout \| [BRAND NAME]" | `noindex` |
| Admin | (No index) | Excluded from robots.txt | N/A |
