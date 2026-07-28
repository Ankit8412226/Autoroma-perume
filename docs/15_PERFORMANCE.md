# 15_PERFORMANCE.md — Performance Architecture & Budget

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: Frontend Engineers, DevOps Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Performance Budget](#1-performance-budget)
2. [Caching Strategy](#2-caching-strategy)
3. [Image Optimization](#3-image-optimization)
4. [Font Optimization](#4-font-optimization)
5. [Bundle Optimization](#5-bundle-optimization)
6. [Dynamic Imports](#6-dynamic-imports)
7. [Streaming & Suspense](#7-streaming--suspense)
8. [Prefetching](#8-prefetching)
9. [Lazy Loading](#9-lazy-loading)
10. [Optimization Checklist](#10-optimization-checklist)

---

## 1. Performance Budget

### Core Web Vitals

| Metric | Target | Hard Limit | Measurement Tool |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 1.2s | 2.0s | Lighthouse / CrUX |
| FID / INP | < 50ms | 100ms | Lighthouse / CrUX |
| CLS (Cumulative Layout Shift) | < 0.05 | 0.1 | Lighthouse / CrUX |
| TTFB (Time to First Byte) | < 200ms | 400ms | WebPageTest |
| FCP (First Contentful Paint) | < 1.0s | 1.8s | Lighthouse |
| TBT (Total Blocking Time) | < 150ms | 300ms | Lighthouse |

### Bundle Budget

| Asset | Target | Hard Limit |
|---|---|---|
| Initial JS (entry chunk) | < 150KB | 200KB |
| Initial CSS | < 50KB | 80KB |
| Three.js chunk | < 300KB | 450KB |
| GSAP chunk | < 60KB | 80KB |
| Total JS on homepage | < 500KB | 700KB |
| Hero image (WebP) | < 150KB | 250KB |
| Largest product image (WebP) | < 120KB | 200KB |
| GLTF model (GLB) | < 3MB | 5MB |

---

## 2. Caching Strategy

### Layer 1: Vercel CDN / Edge Cache

ISR pages are cached at Vercel's global edge network.

```typescript
// next.config.ts — Cache control headers
const nextConfig = {
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/models/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },  // 1 day
        ],
      },
      {
        source: '/hdr/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },
}
```

### Layer 2: Next.js Data Cache

```typescript
// ISR page revalidation
export const revalidate = 300  // 5 minutes — placed in page files

// Or per-fetch
const product = await fetch(`/api/products/${id}`, {
  next: { revalidate: 300, tags: ['products', `product-${id}`] }
})

// Tag-based invalidation on admin update
revalidateTag('products')
revalidateTag(`product-${id}`)
```

### Layer 3: TanStack Query (Client)

```typescript
// Standard query config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,      // Don't refetch on tab focus
    },
  },
})
```

### Layer 4: Static Asset Cache (CDN)

- Fonts: `immutable, max-age=31536000` (versioned by Next.js)
- 3D Models: `max-age=86400` (updated rarely)
- Product Images: Cloudinary CDN — global edge

---

## 3. Image Optimization

### Strategy

All images go through **Cloudinary** with automatic optimization:

```typescript
// next.config.ts — Cloudinary image loader
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudinaryLoader.ts',
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
}
```

```typescript
// src/lib/cloudinaryLoader.ts
export default function cloudinaryLoader({
  src, width, quality
}: { src: string; width: number; quality?: number }) {
  const params = [
    `f_auto`,
    `q_${quality || 'auto:best'}`,
    `w_${width}`,
    `dpr_auto`,
  ]

  // Extract public_id from full URL or use as-is
  if (src.startsWith('https://res.cloudinary.com')) {
    return src.replace('/upload/', `/upload/${params.join(',')}/`)
  }
  
  return src
}
```

### Responsive Images

```tsx
// Product card — responsive srcset
<Image
  src={product.images[0]}
  alt={`${product.name} by Maison Noir`}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
  className="object-cover"
/>
```

### Priority Loading

```tsx
// Hero image — always priority
<Image src={heroImage} alt="Hero" priority sizes="100vw" />

// First product in list — priority
{products.map((product, index) => (
  <ProductCard key={product.id} product={product} priority={index < 4} />
))}
```

---

## 4. Font Optimization

```typescript
// app/layout.tsx — Next.js font optimization
import { Cormorant_Garamond, Inter } from 'next/font/google'

// Fonts are self-hosted automatically by Next.js
// Zero third-party font request to Google — no GDPR issue
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-cormorant',
  display: 'swap',        // Prevent invisible text
  preload: true,          // Preload for hero text
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})
```

**Rules:**
- Only load the weights actually used (300, 400, 500 — no 600, 700, 800, 900)
- `display: swap` prevents invisible text during font load
- `preload: true` for fonts used above the fold (hero text)

---

## 5. Bundle Optimization

### Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  // Tree-shake Lucide React (only import used icons)
  experimental: {
    optimizePackageImports: ['lucide-react', '@react-three/drei', 'recharts'],
  },

  // Webpack bundle analyzer (dev only)
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }))
    }
    return config
  },
}
```

```bash
# Analyze bundle
ANALYZE=true pnpm build
```

### Package Import Rules

```typescript
// ✅ CORRECT — Named import (tree-shakeable)
import { ShoppingBag } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

// ❌ WRONG — Default import (imports entire library)
import * as Icons from 'lucide-react'
import Recharts from 'recharts'
```

---

## 6. Dynamic Imports

Heavy libraries are loaded only when needed:

```typescript
// Three.js scene — only on client, only in hero
const BottleScene = dynamic(
  () => import('@/components/three/BottleScene'),
  {
    ssr: false,
    loading: () => <HeroImageFallback />,  // Static image while loading
  }
)

// Admin charts — only in admin pages
const RevenueChart = dynamic(
  () => import('@/features/admin/components/RevenueChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

// Admin rich text editor — only on product form
const RichTextEditor = dynamic(
  () => import('@/components/ui/RichTextEditor'),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> }
)

// Cloudinary upload widget — admin only
const CloudinaryUpload = dynamic(
  () => import('@/components/admin/CloudinaryUpload'),
  { ssr: false }
)
```

---

## 7. Streaming & Suspense

React 18 Suspense + Next.js streaming allows fast TTFB with progressive loading:

```tsx
// app/(shop)/products/page.tsx — Stream product grid while header renders instantly
import { Suspense } from 'react'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { ProductGridSkeleton } from '@/features/products/components/ProductGridSkeleton'

export default function ProductsPage({ searchParams }: { searchParams: Record<string, string> }) {
  return (
    <div>
      {/* Renders immediately — no data dependency */}
      <PageHeader title="Shop" subtitle="Explore our curated collection" />
      <FilterSidebar />
      
      {/* Streams in when data is ready */}
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
```

### Nested Suspense Boundaries

```tsx
// Product detail page — stream each section independently
<Suspense fallback={<ProductHeroSkeleton />}>
  <ProductHero slug={params.slug} />
</Suspense>

<Suspense fallback={<FragranceNotesSkeleton />}>
  <FragranceNotes slug={params.slug} />
</Suspense>

<Suspense fallback={<ReviewsSkeleton />}>
  <ProductReviews productId={params.slug} />
</Suspense>
```

---

## 8. Prefetching

### Route Prefetching

```tsx
// Next.js Link prefetches on hover by default
// For above-the-fold CTAs, use prefetch={true} explicitly
<Link href="/products" prefetch={true}>Explore Collection</Link>

// For admin routes — don't prefetch (reduces bundle waste for most users)
<Link href="/admin" prefetch={false}>Admin</Link>
```

### Data Prefetching (TanStack Query)

```typescript
// Prefetch product data on product card hover
const queryClient = useQueryClient()

const handleCardHover = (slug: string) => {
  queryClient.prefetchQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    staleTime: 5 * 60 * 1000,
  })
}
```

---

## 9. Lazy Loading

### Below-the-Fold Images

```tsx
// Default — lazy load (no priority)
<Image src={image} alt="..." width={400} height={500} />

// Next.js handles lazy loading automatically for non-priority images
// Uses native loading="lazy" attribute
```

### Heavy Sections

```tsx
// Three.js scene in non-hero position (e.g., product page background)
// Lazy mount only when in viewport
import { useInView } from 'react-intersection-observer'

function ProductScene({ modelUrl }: { modelUrl: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' })
  
  return (
    <div ref={ref}>
      {inView && <BottleScene modelUrl={modelUrl} />}
    </div>
  )
}
```

---

## 10. Optimization Checklist

### Before Every Feature Ship

```bash
# 1. Build production bundle
pnpm build

# 2. Run bundle analyzer
ANALYZE=true pnpm build

# 3. Check bundle sizes
# Open .next/analyze/client.html
# Verify no new chunk exceeds 200KB

# 4. Lighthouse CI
pnpm dlx lighthouse-ci autorun --collect.url=http://localhost:3000

# 5. Check Core Web Vitals
# Performance > 95
# Accessibility > 95
# SEO > 95
# Best Practices > 95
```

### Image Checklist

- [ ] All product images uploaded to Cloudinary
- [ ] All images served as WebP/AVIF via Cloudinary auto format
- [ ] No image > 200KB in production
- [ ] All `<Image>` components have `width`, `height` or `fill` + sized parent
- [ ] Hero image has `priority={true}`
- [ ] Meaningful `alt` text on all images

### JavaScript Checklist

- [ ] No `useEffect` data fetching
- [ ] No blocking render scripts (Razorpay uses `strategy="beforeInteractive"` — justified)
- [ ] Three.js loaded dynamically with `ssr: false`
- [ ] Admin charts loaded dynamically
- [ ] No `import *` from heavy libraries
- [ ] Lucide icons imported individually

### CSS Checklist

- [ ] Tailwind JIT purges unused styles (auto in Next.js)
- [ ] No `transition: all` — only specific properties
- [ ] `will-change` removed after animation completes
- [ ] No CSS-in-JS runtime (Tailwind is compile-time)
- [ ] `@layer components` for repeated patterns (avoids duplication)

### Font Checklist

- [ ] Only weights 300, 400, 500 loaded
- [ ] `display: swap` on all fonts
- [ ] No Google Fonts CDN request (Next.js self-hosts automatically)
- [ ] Fonts preloaded for above-fold content
