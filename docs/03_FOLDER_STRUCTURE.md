# 03_FOLDER_STRUCTURE.md — Complete Folder Architecture

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: All Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Root Structure](#1-root-structure)
2. [App Router Structure](#2-app-router-structure)
3. [Source Feature Structure](#3-source-feature-structure)
4. [Shared Components](#4-shared-components)
5. [Library Layer](#5-library-layer)
6. [Stores](#6-stores)
7. [Types](#7-types)
8. [Naming Rules](#8-naming-rules)
9. [Import Rules](#9-import-rules)
10. [Barrel Exports](#10-barrel-exports)
11. [Server vs Client Files](#11-server-vs-client-files)

---

## 1. Root Structure

```
maison-noir/
├── app/                          # Next.js 15 App Router
├── src/                          # Application source code
│   ├── features/                 # Feature-scoped modules
│   ├── components/               # Shared UI components
│   ├── lib/                      # Infrastructure layer
│   ├── stores/                   # Zustand global stores
│   ├── types/                    # Shared TypeScript types
│   ├── hooks/                    # Shared custom hooks
│   ├── utils/                    # Pure utility functions
│   ├── constants/                # Application constants
│   └── styles/                   # Global styles
├── prisma/                       # Prisma schema and migrations
│   ├── schema.prisma             # Single source of truth for DB schema
│   ├── migrations/               # Auto-generated migration history
│   └── seed.ts                   # DB seed script
├── public/                       # Static files served at root
│   ├── fonts/                    # Self-hosted fonts (woff2)
│   ├── icons/                    # SVG icons not in Lucide
│   ├── models/                   # GLTF/GLB 3D models
│   └── images/                   # Static images (not product images)
├── docs/                         # This documentation
├── tests/                        # Test suites
│   ├── unit/                     # Vitest unit tests
│   ├── integration/              # Vitest integration tests
│   └── e2e/                      # Playwright E2E tests
├── .env.local                    # Local dev secrets (git-ignored)
├── .env.example                  # Template for env vars (committed)
├── .eslintrc.json                # ESLint config
├── .prettierrc                   # Prettier config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── prisma.config.ts              # Prisma client config
├── vitest.config.ts              # Vitest config
├── playwright.config.ts          # Playwright config
├── sentry.client.config.ts       # Sentry client init
├── sentry.server.config.ts       # Sentry server init
├── sentry.edge.config.ts         # Sentry edge init
└── package.json
```

**Purpose**: Root organizes config at top level and keeps source in `app/` and `src/`.  
**Rules**:
- No business logic at root level — only config files
- `app/` contains only Next.js routing primitives and co-located RSC pages
- All reusable logic lives in `src/`

---

## 2. App Router Structure

```
app/
├── (marketing)/                  # Route group — public marketing pages
│   ├── layout.tsx                # Marketing layout (full-screen hero support)
│   ├── page.tsx                  # Homepage
│   ├── about/
│   │   └── page.tsx
│   └── b2b/
│       ├── page.tsx              # B2B inquiry landing
│       └── loading.tsx
│
├── (shop)/                       # Route group — commerce pages
│   ├── layout.tsx                # Shop layout (with nav, cart drawer)
│   ├── products/
│   │   ├── page.tsx              # Product listing (ISR)
│   │   ├── loading.tsx           # Skeleton screen
│   │   ├── error.tsx             # Error boundary
│   │   └── [slug]/
│   │       ├── page.tsx          # Product detail (ISR)
│   │       ├── loading.tsx
│   │       └── error.tsx
│   ├── collections/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── search/
│   │   └── page.tsx              # Search results (dynamic)
│   ├── cart/
│   │   └── page.tsx              # Cart review
│   ├── checkout/
│   │   ├── page.tsx              # Checkout form (dynamic, auth-protected)
│   │   └── success/
│   │       └── page.tsx
│   └── wishlist/
│       └── page.tsx              # Wishlist (dynamic, auth-protected)
│
├── (auth)/                       # Route group — authentication
│   ├── layout.tsx                # Minimal auth layout
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
│
├── account/                      # User account (auth-protected)
│   ├── layout.tsx                # Account layout with sidebar
│   ├── page.tsx                  # Account dashboard
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [orderId]/
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── addresses/
│   │   └── page.tsx
│   └── wishlist/
│       └── page.tsx
│
├── admin/                        # Admin panel (admin-role protected)
│   ├── layout.tsx                # Admin shell layout
│   ├── page.tsx                  # Admin dashboard
│   ├── products/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── bulk-orders/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── customers/
│   │   └── page.tsx
│   ├── collections/
│   │   └── page.tsx
│   ├── coupons/
│   │   └── page.tsx
│   ├── reviews/
│   │   └── page.tsx
│   ├── media/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── api/                          # API Route Handlers
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts          # Auth.js handler
│   ├── products/
│   │   ├── route.ts              # GET /api/products (list)
│   │   └── [id]/
│   │       └── route.ts          # GET/PATCH/DELETE /api/products/[id]
│   ├── search/
│   │   └── route.ts              # GET /api/search?q=
│   ├── payment/
│   │   ├── create-order/
│   │   │   └── route.ts          # POST — create Razorpay order
│   │   └── verify/
│   │       └── route.ts          # POST — verify payment signature
│   ├── webhooks/
│   │   └── razorpay/
│   │       └── route.ts          # POST — Razorpay webhook
│   ├── upload/
│   │   └── route.ts              # POST — Cloudinary signed upload
│   └── admin/
│       ├── stats/
│       │   └── route.ts
│       └── export/
│           └── route.ts
│
├── layout.tsx                    # Root layout
├── not-found.tsx                 # 404 page
├── error.tsx                     # Global error boundary
├── loading.tsx                   # Global loading
├── sitemap.ts                    # Dynamic sitemap
└── robots.ts                     # robots.txt
```

**Rules**:
- `(groupname)` route groups never appear in the URL
- Every dynamic segment `[param]` must have `generateStaticParams` for ISR
- Every page with data fetching must have a sibling `loading.tsx`
- API routes only handle HTTP concerns — business logic lives in `src/lib/services/`

---

## 3. Source Feature Structure

Each feature is self-contained. Features own their components, hooks, actions, and schemas.

```
src/features/
├── products/
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductHero.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── FragranceNotes.tsx
│   │   └── ProductReviews.tsx
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   └── useProduct.ts
│   ├── actions/
│   │   └── (none — product mutations are admin-only, in admin feature)
│   ├── schemas/
│   │   └── product.schema.ts
│   ├── types/
│   │   └── product.types.ts
│   └── utils/
│       └── formatFragranceNotes.ts
│
├── cart/
│   ├── components/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── hooks/
│   │   └── useCartActions.ts
│   └── utils/
│       └── calculateCartTotal.ts
│
├── checkout/
│   ├── components/
│   │   ├── CheckoutForm.tsx
│   │   ├── AddressForm.tsx
│   │   ├── OrderSummary.tsx
│   │   └── PaymentSection.tsx
│   ├── actions/
│   │   ├── createOrder.ts
│   │   └── applyCoupon.ts
│   ├── hooks/
│   │   └── useCheckout.ts
│   └── schemas/
│       ├── checkout.schema.ts
│       └── address.schema.ts
│
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ResetPasswordForm.tsx
│   ├── actions/
│   │   ├── register.ts
│   │   └── resetPassword.ts
│   └── schemas/
│       ├── login.schema.ts
│       └── register.schema.ts
│
├── wishlist/
│   ├── components/
│   │   ├── WishlistGrid.tsx
│   │   └── WishlistButton.tsx
│   ├── actions/
│   │   ├── addToWishlist.ts
│   │   └── removeFromWishlist.ts
│   └── hooks/
│       └── useWishlist.ts
│
├── orders/
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   ├── OrderTimeline.tsx
│   │   └── OrderConfirmation.tsx
│   └── hooks/
│       └── useOrders.ts
│
├── reviews/
│   ├── components/
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   └── StarRating.tsx
│   ├── actions/
│   │   └── submitReview.ts
│   └── schemas/
│       └── review.schema.ts
│
├── b2b/
│   ├── components/
│   │   ├── B2BHero.tsx
│   │   └── BulkInquiryForm.tsx
│   ├── actions/
│   │   └── submitBulkInquiry.ts
│   └── schemas/
│       └── bulkInquiry.schema.ts
│
├── admin/
│   ├── components/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── ProductForm.tsx
│   │   ├── OrderTable.tsx
│   │   └── CouponForm.tsx
│   ├── actions/
│   │   ├── createProduct.ts
│   │   ├── updateProduct.ts
│   │   ├── deleteProduct.ts
│   │   ├── updateOrderStatus.ts
│   │   └── createCoupon.ts
│   └── hooks/
│       └── useAdminStats.ts
│
└── newsletter/
    ├── components/
    │   └── NewsletterForm.tsx
    └── actions/
        └── subscribeNewsletter.ts
```

---

## 4. Shared Components

Components used by 2+ features live in `src/components/`:

```
src/components/
├── ui/                           # Primitive UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Badge.tsx
│   ├── Skeleton.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   ├── Tooltip.tsx
│   ├── Accordion.tsx
│   ├── Tabs.tsx
│   └── Toast.tsx
│
├── layout/                       # Layout-level components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MobileMenu.tsx
│   └── PageWrapper.tsx
│
├── seo/                          # SEO components
│   ├── JsonLd.tsx
│   └── Breadcrumbs.tsx
│
├── three/                        # Three.js / R3F components
│   ├── BottleScene.tsx
│   ├── BottleModel.tsx
│   ├── SceneLighting.tsx
│   ├── ParticleField.tsx
│   └── SmokeEffect.tsx
│
├── motion/                       # Animation wrapper components
│   ├── RevealText.tsx
│   ├── MaskReveal.tsx
│   ├── MagneticButton.tsx
│   └── ParallaxSection.tsx
│
└── providers/                    # Context and store providers
    ├── QueryProvider.tsx
    ├── ThemeProvider.tsx
    ├── LenisProvider.tsx
    └── ToastProvider.tsx
```

---

## 5. Library Layer

Infrastructure that is not UI and not feature-specific:

```
src/lib/
├── db/
│   ├── prisma.ts                 # Singleton Prisma client
│   └── queries/                  # Complex reusable Prisma queries
│       ├── products.ts
│       ├── orders.ts
│       └── analytics.ts
│
├── auth/
│   ├── auth.ts                   # Auth.js configuration
│   ├── middleware.ts             # Auth middleware helpers
│   └── roles.ts                  # Role definitions and checks
│
├── payment/
│   ├── razorpay.ts               # Razorpay client singleton
│   ├── createOrder.ts            # Payment order creation
│   ├── verifySignature.ts        # HMAC verification
│   └── webhookHandler.ts         # Webhook event processing
│
├── email/
│   ├── resend.ts                 # Resend client singleton
│   ├── templates/
│   │   ├── OrderConfirmation.tsx # React Email template
│   │   ├── PasswordReset.tsx
│   │   ├── BulkInquiryReceived.tsx
│   │   └── WelcomeEmail.tsx
│   └── sendEmail.ts              # Typed email dispatch function
│
├── storage/
│   ├── cloudinary.ts             # Cloudinary SDK config
│   ├── uploadImage.ts            # Upload helper with transforms
│   └── s3.ts                     # AWS S3 client (optional assets)
│
├── search/
│   └── atlasSearch.ts            # MongoDB Atlas Search helpers
│
└── monitoring/
    ├── sentry.ts                 # Sentry capture helpers
    └── analytics.ts              # GA4 event helpers (server-side)
```

---

## 6. Stores

```
src/stores/
├── cart.store.ts                 # Cart items, totals, drawer state
├── wishlist.store.ts             # Wishlist items (synced with DB for auth users)
├── ui.store.ts                   # Global UI: mobile menu, cursor, loading screen
└── checkout.store.ts             # Checkout step, selected address, coupon state
```

**Rules**:
- Each store must export typed selectors, not the whole store object
- Stores must be initialized from server data via `hydrate` pattern when SSR state is needed
- No API calls inside stores — stores are pure state; actions call server actions or API routes

---

## 7. Types

```
src/types/
├── product.types.ts
├── order.types.ts
├── user.types.ts
├── cart.types.ts
├── coupon.types.ts
├── review.types.ts
├── collection.types.ts
├── action.types.ts               # ActionResult<T> type
├── api.types.ts                  # API request/response shapes
└── next-auth.d.ts                # Module augmentation for Auth.js session
```

---

## 8. Naming Rules

| Rule | Example |
|---|---|
| Feature folders: lowercase-kebab | `bulk-orders/`, `fragrance-notes/` |
| Component files: PascalCase | `ProductCard.tsx` |
| Hook files: camelCase with `use` prefix | `useCartActions.ts` |
| Action files: camelCase verb-first | `createOrder.ts`, `updateProduct.ts` |
| Schema files: camelCase `.schema.ts` | `checkout.schema.ts` |
| Type files: PascalCase `.types.ts` | `product.types.ts` |
| Store files: camelCase `.store.ts` | `cart.store.ts` |
| Util files: camelCase descriptive | `formatCurrency.ts` |

---

## 9. Import Rules

### Absolute Paths Only

Configure `tsconfig.json` path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./app/*"],
      "@prisma/*": ["./prisma/*"]
    }
  }
}
```

```typescript
// ✅ CORRECT
import { ProductCard } from '@/features/products/components/ProductCard'
import { prisma } from '@/lib/db/prisma'

// ❌ WRONG — relative paths
import { ProductCard } from '../../../features/products/components/ProductCard'
```

### Cross-Feature Imports

- Features may NOT import from other features directly
- Shared code between features must be promoted to `src/components/` or `src/lib/`
- Exception: Types may be imported cross-feature

---

## 10. Barrel Exports

Barrel files (`index.ts`) are used sparingly and **only** in `src/components/ui/` and `src/types/`:

```typescript
// src/components/ui/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Modal } from './Modal'
// ... etc

// Usage
import { Button, Input, Modal } from '@/components/ui'
```

**Rules**:
- No barrel in `src/features/` — import specific files
- No barrel in `src/lib/` — always import specific modules
- Barrel exports must never create circular dependencies

---

## 11. Server vs Client Files

| Pattern | Location | Marker |
|---|---|---|
| Server-only utilities | `src/lib/db/`, `src/lib/auth/` | Add `import 'server-only'` |
| Client-only utilities | `src/utils/client/` | Add `'use client'` or `import 'client-only'` |
| Shared utilities | `src/utils/` | No marker — must be isomorphic |
| Server Components | `app/**/*.tsx` (default) | No marker needed |
| Client Components | `app/**/*.tsx` or `src/**/*.tsx` | `'use client'` at top |
| Server Actions | `src/features/**/actions/*.ts` | `'use server'` at top |

```typescript
// src/lib/db/prisma.ts — server-only guard
import 'server-only'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
