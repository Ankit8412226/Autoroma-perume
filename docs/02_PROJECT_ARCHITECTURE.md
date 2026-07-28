# 02_PROJECT_ARCHITECTURE.md — System Architecture & Rendering Strategy

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: Senior Full-Stack & DevOps Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Architecture Diagram](#1-architecture-diagram)
2. [System Flow](#2-system-flow)
3. [Rendering Strategy](#3-rendering-strategy)
4. [Server Components](#4-server-components)
5. [Client Components](#5-client-components)
6. [Server Actions](#6-server-actions)
7. [Data Flow](#7-data-flow)
8. [Caching Strategy](#8-caching-strategy)
9. [Folder Responsibility](#9-folder-responsibility)
10. [Scalability](#10-scalability)
11. [Error Handling](#11-error-handling)
12. [Future Expansion](#12-future-expansion)

---

## 1. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │ Next.js RSC │  │  Zustand     │  │  TanStack  │  │  GSAP / Lenis │  │
│  │  App Router │  │  Store       │  │  Query     │  │  Three.js     │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  └───────────────┘  │
└─────────┼────────────────┼────────────────┼────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 15 SERVER LAYER                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │  App Router │  │  Middleware  │  │  Server    │  │  Route        │  │
│  │  (RSC/RCC)  │  │  (Auth.js)   │  │  Actions   │  │  Handlers     │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  └───────┬───────┘  │
└─────────┼────────────────┼────────────────┼─────────────────┼──────────┘
          │                │                │                 │
          ▼                ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │  MongoDB    │  │  Prisma ORM  │  │  Cloudinary│  │  Redis Cache  │  │
│  │  Atlas      │  │  (Schema)    │  │  (Images)  │  │  (Sessions)   │  │
│  └─────────────┘  └──────────────┘  └────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
          │                                           │
          ▼                                           ▼
┌─────────────────────────┐             ┌─────────────────────────────────┐
│   EXTERNAL SERVICES     │             │   MONITORING & OBSERVABILITY    │
│  ┌───────────────────┐  │             │  ┌─────────┐  ┌──────────────┐  │
│  │  Razorpay         │  │             │  │ Sentry  │  │ Google GA4   │  │
│  │  Resend (Email)   │  │             │  │         │  │ MS Clarity   │  │
│  │  AWS S3 (Assets)  │  │             │  └─────────┘  └──────────────┘  │
│  └───────────────────┘  │             └─────────────────────────────────┘
└─────────────────────────┘
```

---

## 2. System Flow

### B2C Purchase Flow

```
User visits /products/[slug]
    │
    ├─► RSC fetches product data from MongoDB via Prisma
    │       (cached at ISR level, revalidated every 300s)
    │
    ├─► Client hydrates Three.js scene (bottle model)
    │
    ├─► User adds to cart
    │       └─► Zustand cart store updated (persisted to localStorage)
    │
    ├─► User proceeds to /checkout
    │       ├─► Server Action validates cart against live inventory
    │       ├─► Coupon applied (if any) via Server Action
    │       └─► Order document created with status: "pending"
    │
    ├─► Razorpay order created via API Route (/api/payment/create-order)
    │
    ├─► User completes payment on Razorpay UI
    │
    ├─► Razorpay webhook fires to /api/webhooks/razorpay
    │       ├─► Signature verified (HMAC-SHA256)
    │       ├─► Order status updated to "confirmed"
    │       ├─► Inventory decremented
    │       ├─► Confirmation email sent via Resend
    │       └─► Cart cleared via Zustand action
    │
    └─► User redirected to /orders/[orderId]/confirmation
```

### B2B Inquiry Flow

```
Business user visits /b2b
    │
    ├─► Fills inquiry form (React Hook Form + Zod validation)
    │
    ├─► Server Action processes submission
    │       ├─► Zod validates all fields
    │       ├─► Bulk order document created in MongoDB
    │       ├─► Notification email sent to admin via Resend
    │       └─► Confirmation email sent to business user
    │
    └─► Admin reviews in /admin/bulk-orders
            ├─► Admin updates status, sends quote
            └─► Business user receives quote email
```

---

## 3. Rendering Strategy

### Decision Matrix

| Route | Strategy | Reason |
|---|---|---|
| `/` (Homepage) | ISR (300s) | Marketing content, changes infrequently |
| `/products` | ISR (300s) | Catalog, inventory changes occasionally |
| `/products/[slug]` | ISR (300s) | Product data, revalidated on admin update |
| `/collections/[slug]` | ISR (300s) | Collection pages |
| `/checkout` | Dynamic (no cache) | User-specific, must be fresh |
| `/account/*` | Dynamic + Auth | User-specific, protected |
| `/admin/*` | Dynamic + Auth | Admin content, no caching |
| `/api/*` | No cache (dynamic) | API routes always fresh |
| `/blog/[slug]` | ISR (3600s) | Rarely changes |

### ISR Revalidation Triggers

Admin actions that mutate data trigger `revalidatePath()` or `revalidateTag()`:

```typescript
// In server action — after product update
import { revalidatePath, revalidateTag } from 'next/cache'

export async function updateProduct(id: string, data: UpdateProductInput) {
  await prisma.product.update({ where: { id }, data })
  revalidateTag('products')
  revalidatePath(`/products/${data.slug}`)
  revalidatePath('/products')
}
```

---

## 4. Server Components

Server Components are the default in the App Router. They:

- Have **direct database access** via Prisma (never exposed to client)
- Are **not hydrated** on the client — zero JavaScript sent for their rendering
- Can be **async** — `async function ProductPage()` is valid
- Must **never** use hooks (`useState`, `useEffect`, etc.)
- Must **never** import client-only code

### Server Component Examples

```typescript
// app/products/[slug]/page.tsx — RSC
import { prisma } from '@/lib/db/prisma'
import { ProductHero } from '@/features/products/components/ProductHero'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { collection: true, reviews: { take: 10, orderBy: { createdAt: 'desc' } } }
  })

  if (!product) return notFound()

  return <ProductHero product={product} />
}
```

### Rules for Server Components

1. All data fetching happens in Server Components — never in `useEffect`
2. Sensitive data (admin tokens, pricing rules) stays in Server Components
3. Props passed to Client Components must be serializable (no Prisma models — serialize to plain objects first)
4. Server Components must handle loading states via `loading.tsx` siblings

---

## 5. Client Components

Client Components are explicitly marked with `'use client'` at the top. They:

- Handle **interactivity**: click, hover, form input, scroll
- Have access to browser APIs (`window`, `document`)
- Are **hydrated** on the client
- Can use React hooks
- Should be as **small and leaf-level as possible**

### Client Component Rules

1. Mark with `'use client'` only when genuinely needed
2. Never fetch data directly — receive it as props from RSC parents or use TanStack Query
3. Use `React.memo()` on list-item components
4. Avoid large Client Components — split into smaller ones

```typescript
// ✅ CORRECT — Minimal client component for interactivity
'use client'
import { useCartStore } from '@/stores/cart.store'

interface AddToCartButtonProps {
  productId: string
  price: number
  name: string
}

export const AddToCartButton = React.memo(function AddToCartButton({
  productId, price, name
}: AddToCartButtonProps) {
  const addItem = useCartStore(state => state.addItem)
  
  return (
    <button onClick={() => addItem({ productId, price, name })}>
      Add to Collection
    </button>
  )
})
```

---

## 6. Server Actions

Server Actions replace REST API calls for mutations originating from the client. They run on the server, have direct database access, and can be called directly from forms or event handlers.

### Server Action Structure

```typescript
// src/features/checkout/actions/createOrder.ts
'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { createOrderSchema } from '@/features/checkout/schemas/createOrder.schema'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: unknown): Promise<ActionResult<Order>> {
  try {
    const session = await auth()
    if (!session?.user) return { success: false, error: 'Unauthorized' }

    const validated = createOrderSchema.safeParse(formData)
    if (!validated.success) return { success: false, error: validated.error.flatten() }

    const order = await prisma.order.create({
      data: { ...validated.data, userId: session.user.id, status: 'pending' }
    })

    revalidatePath('/account/orders')
    return { success: true, data: order }
  } catch (error) {
    // Sentry.captureException(error)
    return { success: false, error: 'Failed to create order. Please try again.' }
  }
}
```

### ActionResult Type

```typescript
// src/types/action.types.ts
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string | Record<string, string[]> }
```

### Rules for Server Actions

1. Every Server Action must validate input with Zod before processing
2. Every Server Action must check authentication if operating on user data
3. Every Server Action must return `ActionResult<T>` — never throw raw errors to client
4. Server Actions that mutate must call `revalidatePath` or `revalidateTag`
5. Never call Server Actions from other Server Actions — compose at the service layer instead

---

## 7. Data Flow

### Read Path (GET)

```
Browser Request
    │
    ▼
Next.js Router (App Router)
    │
    ├─► Route segment: RSC
    │       └─► Prisma query → MongoDB Atlas
    │               └─► Returns typed Prisma model
    │                       └─► Serialized to plain object
    │                               └─► Passed as props to Client Components
    │
    └─► Route segment: Client Component (TanStack Query)
            └─► fetch('/api/[route]')
                    └─► Route Handler → Prisma → MongoDB
                            └─► JSON response → TanStack Query cache
```

### Write Path (POST/PATCH/DELETE)

```
Client Component
    │
    ├─► Server Action (preferred for mutations)
    │       └─► Zod validation
    │               └─► Auth check
    │                       └─► Prisma mutation → MongoDB
    │                               └─► revalidate → ISR cache cleared
    │
    └─► API Route Handler (for webhooks, Razorpay callbacks)
            └─► Signature verification
                    └─► Prisma mutation → MongoDB
```

---

## 8. Caching Strategy

### Layer 1: Next.js Data Cache

```typescript
// Force caching with tags
const products = await fetch('/api/products', {
  next: { revalidate: 300, tags: ['products'] }
})

// On-demand revalidation
revalidateTag('products') // called from server action on admin update
```

### Layer 2: TanStack Query Cache (Client)

```typescript
// src/features/products/hooks/useProducts.ts
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 30 * 60 * 1000,           // 30 minutes in cache
  })
}
```

### Layer 3: Vercel Edge Cache

- Static assets cached at CDN edge automatically
- ISR pages cached at edge with `s-maxage` headers
- Cache invalidated via `revalidatePath` / `revalidateTag`

### Cache TTL Reference

| Data Type | TTL | Strategy |
|---|---|---|
| Products | 300s | ISR + Tag-based invalidation |
| Collections | 300s | ISR + Tag-based invalidation |
| Blog Posts | 3600s | ISR |
| User Cart | 0s | Client-only (Zustand + localStorage) |
| Sessions | 30 days | Auth.js (DB adapter) |
| Exchange Rates | 3600s | Background job |

---

## 9. Folder Responsibility

| Folder | Responsibility |
|---|---|
| `app/` | Next.js App Router — pages, layouts, API routes only |
| `src/features/` | Feature-scoped code: components, hooks, actions, schemas |
| `src/components/` | Shared UI components used across 2+ features |
| `src/lib/` | Infrastructure: db, auth, email, payment, storage |
| `src/stores/` | Zustand global stores |
| `src/types/` | Shared TypeScript types and interfaces |
| `src/hooks/` | Shared custom hooks |
| `src/utils/` | Pure utility functions |
| `src/constants/` | Application-wide constants |
| `src/styles/` | Global CSS, Tailwind config overrides |
| `public/` | Static assets: fonts, icons, static images |
| `prisma/` | Prisma schema, migrations, seed script |
| `docs/` | This documentation |

---

## 10. Scalability

### Horizontal Scaling

- **Stateless server**: All session state in MongoDB (Auth.js adapter) — any Vercel instance can serve any request
- **Serverless functions**: Each API route and Server Action is an independent serverless function
- **CDN-first**: ISR ensures heavy traffic hits Vercel's global CDN, not origin

### Vertical Scaling (Data)

- **MongoDB Atlas** auto-scales storage; tier upgrades require no code changes
- **Indexes** on all query-critical fields (see `08_DATABASE.md`)
- **Atlas Search** for full-text product search — separates search from transactional DB
- **Aggregation pipelines** for analytics — never computed in-memory on server

### Feature Scaling

- Feature-folder architecture means new features (gift cards, subscriptions, loyalty) are added without touching existing features
- Zustand stores are modular — new stores don't pollute existing state
- TanStack Query query keys are namespaced — new feature queries are isolated

---

## 11. Error Handling

### Error Boundary Strategy

```
app/
├── error.tsx              ← Global error boundary (unexpected errors)
├── not-found.tsx          ← 404 handler
├── loading.tsx            ← Global loading UI
└── (shop)/
    ├── products/
    │   ├── error.tsx      ← Product list error boundary
    │   └── [slug]/
    │       └── error.tsx  ← Single product error boundary
```

### Error Categories

| Category | Handler | User Facing |
|---|---|---|
| 404 Not Found | `notFound()` → `not-found.tsx` | "This fragrance is no longer available" |
| Auth Required | `redirect('/login')` | Redirect, no error shown |
| Validation Error | `ActionResult.error` | Inline form errors |
| Payment Error | Razorpay error codes mapped | Human-readable payment message |
| Network Error | TanStack Query retry + error state | Retry button shown |
| Unexpected Server | Sentry captured + `error.tsx` | "Something rare happened. We've been notified." |

### Sentry Integration

```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

export function captureOrderError(error: unknown, context: { orderId: string }) {
  Sentry.withScope(scope => {
    scope.setTag('feature', 'checkout')
    scope.setContext('order', context)
    Sentry.captureException(error)
  })
}
```

---

## 12. Future Expansion

| Feature | Architecture Impact | Complexity |
|---|---|---|
| **Multi-language (i18n)** | Add `next-intl`, move strings to locale files | Medium |
| **Subscription Boxes** | New `Subscription` Prisma model, Razorpay recurring | High |
| **Gift Cards** | New `GiftCard` model, apply at checkout | Medium |
| **Loyalty Points** | New `LoyaltyAccount` model, earn/burn rules | Medium |
| **Mobile App** | Expose existing API routes as REST, add App route guards | High |
| **Multi-currency** | Exchange rate service, price display logic | Medium |
| **Affiliate Program** | `Referral` model, tracking UTM params | Medium |
| **AR Try-On** | WebXR integration in Three.js scene | Very High |

> Each future expansion must have its own specification document before implementation begins. Architecture changes require ADR (Architectural Decision Record).
