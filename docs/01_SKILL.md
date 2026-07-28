# 01_SKILL.md — Project Skill, Vision & Standards

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: Senior Frontend, Backend, UI/UX, DevOps Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Project Vision](#1-project-vision)
2. [Brand Philosophy](#2-brand-philosophy)
3. [Luxury Design Philosophy](#3-luxury-design-philosophy)
4. [Coding Standards](#4-coding-standards)
5. [Folder Rules](#5-folder-rules)
6. [Naming Conventions](#6-naming-conventions)
7. [Animation Rules](#7-animation-rules)
8. [Performance Rules](#8-performance-rules)
9. [Accessibility](#9-accessibility)
10. [SEO](#10-seo)
11. [Responsive Rules](#11-responsive-rules)
12. [Code Review Rules](#12-code-review-rules)
13. [AI Constraints](#13-ai-constraints)
14. [Things AI Must Never Generate](#14-things-ai-must-never-generate)
15. [Definition of Luxury](#15-definition-of-luxury)
16. [Definition of Done](#16-definition-of-done)
17. [Checklist](#17-checklist)

---

## 1. Project Vision

**[BRAND NAME TBD]** is a premium, digital-first car fragrance e-commerce experience. It is not a generic air freshener store. It is not a cheap convenience product. It is a curated automotive fragrance brand that communicates quality craftsmanship, drive experience elevation, and sensory identity through every pixel, interaction, and line of code.

### Core Objectives

| Objective | Description |
|---|---|
| **Luxury Experience** | Every touchpoint must feel like entering a physical luxury boutique |
| **B2C Commerce** | Individual car fragrance purchases with Razorpay checkout |
| **B2B Commerce** | Bulk inquiry system for car dealerships, car wash studios, fleet operators, auto accessories retailers |
| **Performance** | Sub-2s LCP, 100 Lighthouse score, perfect Core Web Vitals |
| **Scalability** | Architecture supports adding new product lines, markets, and languages |
| **Brand Trust** | Security, authenticity cues, and certifications embedded at design level |

### North Star Metric

> The platform must feel like a premium automotive lifestyle brand — think **AMMO NYC**, **Chemical Guys**, or **Carzor** — but built exclusively for the Indian market with a dark, bold aesthetic and Razorpay integration.

---

## 2. Brand Philosophy

### Identity

- **Name**: [BRAND NAME TBD]
- **Tone**: Bold, confident, driver-focused — masculine energy without being aggressive
- **Personality**: The brand speaks like a car enthusiast who understands the joy of a perfectly scented cabin
- **Visual Language**: Deep blacks, electric accents, metallic silvers, amber-gold tones

### Voice

| Context | Voice |
|---|---|
| Product Descriptions | Energetic, sensory, driver-centric ("Built for the road, crafted for the cabin") |
| Error Messages | Composed, clear, never alarming |
| Loading States | Atmospheric ("Preparing your drive experience…") |
| Empty States | Inviting ("Your car cabin is waiting") |
| CTAs | Action-oriented: "Shop Now", "Add to Garage", "Scent Your Ride" |

### What We Are NOT

- We are not a roadside shop air freshener brand
- We are not a discount platform
- We are not generic
- We are not a supermarket car care brand
- We are not cheap or disposable

---

## 3. Luxury Design Philosophy

### The Six Pillars of Luxury UI

#### 3.1 Restraint

> Luxury is what you remove, not what you add.

- Maximum 2 typefaces on any screen
- Maximum 3 colors in any single composition
- Negative space is a design element, not wasted space
- No information is shown unless it earns its presence

#### 3.2 Texture

- Glass morphism is used sparingly for floating UI elements only (cart drawer, modals)
- Grain textures via CSS noise filters on hero sections
- Subtle gradients — never rainbow, never neon
- Material-inspired cards (leather, velvet, gold-leaf metaphors in CSS)

#### 3.3 Motion as Storytelling

- Every animation tells a part of the brand story
- Entrance animations reveal information sequentially, like unwrapping a gift
- No animation exists purely for decoration — each serves a narrative function
- Scroll is a journey, not a feed

#### 3.4 Typography as Hierarchy

- Headings in serif (Cormorant Garamond or Playfair Display) — weight 300–400 only
- Body in sans-serif (Inter or DM Sans) — weight 300–400 only
- Never bold for luxury content; emphasis through size and spacing
- Letter spacing (tracking) is generous on headings (+0.05em to +0.2em)

#### 3.5 Color as Emotion

| Color Role | Value | Emotion |
|---|---|---|
| Background Primary | `#080808` | Depth, elegance |
| Background Secondary | `#111111` | Warmth, safety |
| Background Surface | `#1A1A1A` | Cards, surfaces |
| Gold Primary | `#C9A96E` | Luxury, aspiration |
| Gold Secondary | `#E8C98A` | Highlight, delight |
| White Primary | `#F5F0E8` | Clarity, purity |
| White Secondary | `#D4CEC4` | Warmth, softness |
| Accent Amber | `#8B5E3C` | Depth, richness |
| Error | `#A0522D` | Sienna, not alarm-red |
| Success | `#4A7C59` | Forest, not neon-green |

#### 3.6 Photography Standards

- Only full-bleed, high-resolution product photography
- Dark background preferred
- Single product hero shots — never busy collages
- Cloudinary transformations enforce quality standards automatically

---

## 4. Coding Standards

### TypeScript Rules

```typescript
// ✅ CORRECT — Explicit return types on all functions
export async function getProduct(id: string): Promise<Product | null> { ... }

// ❌ WRONG — Implicit any, missing return type
export async function getProduct(id) { ... }
```

- **Strict mode**: `"strict": true` in `tsconfig.json` — no exceptions
- **No `any`**: Use `unknown` and narrow; never use `any`
- **No type assertions** unless parsing external data: use `zod` to validate instead
- **Explicit return types** on all exported functions
- **Interfaces over types** for object shapes; `type` for unions and aliases

### Import Order (enforced by ESLint)

```typescript
// 1. React / Next.js core
import { useState, useEffect } from 'react'
import { Metadata } from 'next'

// 2. Third-party libraries
import { motion } from 'framer-motion'
import { gsap } from 'gsap'

// 3. Internal — absolute paths only
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/stores/cart.store'

// 4. Types
import type { Product } from '@/types/product'

// 5. Styles (only in layout/page files)
import styles from './page.module.css'
```

### File Length Limits

| File Type | Max Lines |
|---|---|
| React Component | 300 lines |
| API Route Handler | 150 lines |
| Utility Function File | 200 lines |
| Store File | 200 lines |
| Schema File | 150 lines |

> **Rule**: If a file exceeds the limit, it must be split into smaller composable units.

### Comments & Documentation

```typescript
/**
 * Calculates the discounted price after applying a coupon code.
 * 
 * @param originalPrice - Base price in paise (1 INR = 100 paise)
 * @param coupon - Validated Coupon document from MongoDB
 * @returns Final price in paise after discount; never below 0
 * @throws {InvalidCouponError} if coupon has expired or usage limit exceeded
 */
export function applyDiscount(originalPrice: number, coupon: Coupon): number { ... }
```

- All exported functions must have JSDoc
- No inline comments explaining *what* code does — only *why*
- Business rule comments must reference the specification document

---

## 5. Folder Rules

- Every folder must have a `README.md` explaining its purpose and rules
- No file at the root of `src/` — everything lives in a named folder
- No mixing of server and client code in the same folder without explicit `server/` and `client/` sub-folders
- Feature folders are self-contained: components, hooks, types, and utils live together
- Shared utilities live in `src/lib/` — never duplicated across features
- Database access lives exclusively in `src/lib/db/` — never in components

---

## 6. Naming Conventions

### Files

| Type | Convention | Example |
|---|---|---|
| React Component | PascalCase | `ProductCard.tsx` |
| Page | `page.tsx` (Next.js) | `app/products/[slug]/page.tsx` |
| Layout | `layout.tsx` | `app/(shop)/layout.tsx` |
| Server Action | camelCase | `createOrder.ts` |
| API Route | `route.ts` | `app/api/products/route.ts` |
| Hook | camelCase, `use` prefix | `useCartStore.ts` |
| Store | camelCase, `.store.ts` suffix | `cart.store.ts` |
| Util | camelCase | `formatCurrency.ts` |
| Type | PascalCase, `.types.ts` suffix | `product.types.ts` |
| Schema (Zod) | camelCase, `.schema.ts` suffix | `product.schema.ts` |
| Prisma Schema | singular PascalCase | `Product`, `Order` |

### Variables & Functions

```typescript
// Constants — SCREAMING_SNAKE_CASE
const MAX_CART_ITEMS = 10
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!

// Booleans — is/has/can/should prefix
const isLoading = true
const hasDiscount = coupon !== null
const canCheckout = cartItems.length > 0

// Event handlers — handle prefix
const handleAddToCart = () => { ... }
const handleQuantityChange = (qty: number) => { ... }

// Async functions — verb first
async function fetchProducts() { ... }
async function createOrder() { ... }
```

### CSS Classes (Tailwind)

- Use semantic class grouping, not random ordering
- Group: layout → spacing → typography → color → border → effect → animation
- Extract repeated patterns to `@layer components` in `globals.css`

---

## 7. Animation Rules

### Core Principles

1. **Purpose over decoration** — every animation must serve a UX or narrative function
2. **Subtlety over flash** — duration 0.4s–1.2s; easing `power2.out` to `expo.out`
3. **Sequence over simultaneous** — stagger reveals; never everything at once
4. **Performance first** — only animate `transform` and `opacity`; never `width`, `height`, `top`, `left`
5. **Reduced motion respected** — `prefers-reduced-motion: reduce` disables all non-essential animations

### GSAP Timing Standards

| Animation Type | Duration | Ease |
|---|---|---|
| Page entrance | 1.0s | `power3.out` |
| Scroll reveal | 0.8s | `power2.out` |
| Hover micro | 0.3s | `power1.inOut` |
| Letter reveal | 0.05s per char | `power4.out` |
| Modal open | 0.5s | `expo.out` |
| Loading screen exit | 1.2s | `power4.inOut` |

### What Is Forbidden

- `animate-bounce` (Tailwind) — it is not luxury
- `animate-pulse` except in skeleton loaders
- Spring-based physics unless specifically requested
- Infinite marquee text unless used for brand storytelling
- CSS `transition: all` — always specify the property

---

## 8. Performance Rules

### Budgets

| Metric | Target | Hard Limit |
|---|---|---|
| LCP | < 1.2s | 2.0s |
| FID / INP | < 50ms | 100ms |
| CLS | < 0.05 | 0.1 |
| TBT | < 150ms | 300ms |
| Bundle Size (initial JS) | < 150KB | 200KB |
| Largest Image (WebP) | < 200KB | 400KB |

### Rules

- All images served via Cloudinary with automatic WebP/AVIF format switching
- Next.js `<Image />` component mandatory for all images — no raw `<img>`
- Dynamic imports for all heavy components (Three.js scenes, charts, admin panels)
- `React.memo` for all list-item components (ProductCard, OrderRow, etc.)
- No `useEffect` data fetching — use TanStack Query or Server Components
- Route prefetching enabled for all navigation links

---

## 9. Accessibility

### Standards

- **WCAG 2.1 AA** compliance — non-negotiable
- Color contrast ratio: minimum 4.5:1 for body text, 3:1 for large text
- All interactive elements keyboard-navigable
- Focus indicators must be visible (gold outline on dark backgrounds)
- ARIA labels on all icon-only buttons
- `alt` text on all product images — descriptive, not filename
- Skip-to-content link at top of every page

### Luxury Accessibility Pattern

```tsx
// ✅ CORRECT — Accessible icon button with luxury label
<button
  aria-label="Add Ambre Nuit to wishlist"
  className="wishlist-btn"
  onClick={handleWishlistToggle}
>
  <HeartIcon className="h-5 w-5" aria-hidden="true" />
</button>

// ❌ WRONG — Icon with no label
<button onClick={handleWishlistToggle}>
  <HeartIcon />
</button>
```

---

## 10. SEO

- Every page has a unique `<title>` and `<meta name="description">`
- All product pages have JSON-LD structured data (`Product`, `BreadcrumbList`)
- `sitemap.xml` auto-generated by Next.js sitemap API
- `robots.txt` blocks `/admin`, `/api`, `/checkout` from indexing
- OpenGraph and Twitter Card meta on all shareable pages
- Canonical URLs on all paginated routes
- No orphan pages — every page is reachable from navigation or sitemap

---

## 11. Responsive Rules

### Breakpoints (Tailwind defaults, not overridden)

| Name | Min-width | Usage |
|---|---|---|
| `sm` | 640px | Small phones landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Mandatory

- All styles written mobile-first, then overridden upward
- No desktop-only features — all pages work on 375px width
- Touch targets minimum 44×44px
- Hover states have equivalent touch/focus states
- Three.js scenes degrade gracefully: show static image on mobile < 768px if needed for performance

---

## 12. Code Review Rules

### Pre-Review Checklist (Author)

- [ ] TypeScript strict passes with zero errors
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting applied
- [ ] All `console.log` removed
- [ ] All `TODO` comments resolved or converted to GitHub Issues
- [ ] No hardcoded strings — use constants or i18n keys
- [ ] No hardcoded URLs — use environment variables
- [ ] Performance budget not broken (bundle analyzer checked)

### Review Criteria (Reviewer)

- [ ] Does the code match the specification in the relevant `.md` doc?
- [ ] Are all animations respecting GSAP standards?
- [ ] Is database access isolated in `lib/db/`?
- [ ] Are Zod schemas used for all external data?
- [ ] Are Server Components used where possible?
- [ ] Is the component under 300 lines?

---

## 13. AI Constraints

These constraints apply to any AI tool (GitHub Copilot, Cursor, ChatGPT, Antigravity) used during development.

1. AI must read all 20 specification documents before generating any code
2. AI must follow the architecture exactly — no substitutions
3. AI must never generate a component that doesn't exist in `05_COMPONENT_SYSTEM.md`
4. AI must use only the locked tech stack — no alternatives
5. AI must never generate inline styles — Tailwind classes only
6. AI must never use `useEffect` for data fetching
7. AI must validate all external data with Zod before use
8. AI must ask for clarification rather than assume
9. AI must never create placeholder content or lorem ipsum
10. AI must never simplify the architecture to "save time"

---

## 14. Things AI Must Never Generate

| Category | Never Generate |
|---|---|
| **Layout** | Generic two-column product grid, Shopify-style layout |
| **Animations** | CSS keyframe bounce, generic fade-in only |
| **Typography** | System fonts, Arial, Helvetica |
| **Colors** | Plain blue CTAs, white backgrounds with black text |
| **Components** | Alert dialogs using `window.alert()` |
| **State** | `localStorage` for cart without Zustand |
| **API Calls** | `fetch` without TanStack Query or server actions |
| **Auth** | `localStorage` JWT storage |
| **Database** | Raw MongoDB queries outside `lib/db/` |
| **Images** | `<img>` tags without Next.js `<Image />` |
| **Errors** | Generic "Something went wrong" without context |
| **Loading** | Spinner only — must use skeleton screens |
| **Empty States** | "No products found" as bare text |

---

## 15. Definition of Luxury

> **Luxury is not price. Luxury is the feeling of being understood before you ask.**

In digital context, luxury means:

1. The page loads before the user notices it loading
2. The animation completes before the user thinks to skip it
3. The product description makes the user smell the fragrance
4. The checkout feels inevitable, not transactional
5. The error message feels like an apology from a human, not a machine
6. The typography makes reading feel like a reward
7. The empty cart doesn't feel like failure — it feels like anticipation

---

## 16. Definition of Done

A feature is **Done** when:

- [ ] All TypeScript errors resolved (zero)
- [ ] All ESLint warnings resolved (zero)
- [ ] All Zod validations in place
- [ ] Unit tests written and passing (Vitest)
- [ ] E2E tests written and passing (Playwright) for critical paths
- [ ] Lighthouse score ≥ 95 (Performance, Accessibility, SEO, Best Practices)
- [ ] Responsive verified at 375px, 768px, 1280px, 1920px
- [ ] Reduced motion tested with system preference enabled
- [ ] Reviewed by at least one senior engineer
- [ ] Merged to `develop` branch
- [ ] Deployed to staging and smoke-tested
- [ ] Product Owner signoff received

---

## 17. Checklist

### Before Every Commit

```bash
pnpm lint          # Zero warnings allowed
pnpm type-check    # Zero errors allowed
pnpm test          # All tests passing
pnpm build         # Production build must succeed
```

### Before Every PR

- [ ] Self-review against the relevant specification `.md` file
- [ ] Screenshot or video attached for UI changes
- [ ] Performance impact assessed
- [ ] Security implications reviewed (auth, input validation, CORS)

### Before Every Release

- [ ] `pnpm build` succeeds on clean environment
- [ ] All environment variables documented in `.env.example`
- [ ] Database migration applied and verified
- [ ] Smoke test on production URL
- [ ] Sentry errors at zero for 30 minutes after deploy
- [ ] Rollback plan documented

---

*This document is the single source of truth for all engineering culture, standards, and philosophy on this project. Any deviation requires a formal architectural decision record (ADR) and team consensus.*
