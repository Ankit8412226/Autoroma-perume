# 19_AI_RULES.md — AI Assistant Constraints & Standards

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: All AI Coding Assistants (Antigravity, Copilot, Cursor, etc.)  
> **Last Updated**: 2026-07-27

---

## CRITICAL: Read This First

> These rules are not suggestions. They are mandatory constraints for any AI assistant working on this project. Violation of these rules results in code that must be discarded and rewritten. There are no exceptions.

---

## Table of Contents

1. [Mandatory Pre-Task Checklist](#1-mandatory-pre-task-checklist)
2. [Never Generate](#2-never-generate)
3. [Design Rules](#3-design-rules)
4. [Animation Rules](#4-animation-rules)
5. [Coding Rules](#5-coding-rules)
6. [Component Rules](#6-component-rules)
7. [Folder Rules](#7-folder-rules)
8. [Naming Rules](#8-naming-rules)
9. [Review Checklist](#9-review-checklist)
10. [Luxury Anti-Generic Rules](#10-luxury-anti-generic-rules)

---

## 1. Mandatory Pre-Task Checklist

Before writing **any** code for this project, the AI must verify:

- [ ] **01_SKILL.md** has been read — coding standards, philosophy, and rules understood
- [ ] **02_PROJECT_ARCHITECTURE.md** has been read — rendering strategy and data flow understood
- [ ] **03_FOLDER_STRUCTURE.md** has been read — correct file location identified
- [ ] **04_DESIGN_SYSTEM.md** has been read — correct colors, typography, and tokens identified
- [ ] **05_COMPONENT_SYSTEM.md** has been read — if creating a component, it exists in the spec
- [ ] **06_MOTION_SYSTEM.md** has been read — if adding animation, correct GSAP pattern identified
- [ ] **08_DATABASE.md** has been read — if touching database, schema understood
- [ ] **09_API.md** has been read — if creating an endpoint, spec exists

**If any of the above have NOT been read, STOP and read them before proceeding.**

---

## 2. Never Generate

### Architecture

| Rule | Reason |
|---|---|
| Never use `fetch` directly for data fetching in components | Use TanStack Query or Server Components |
| Never use `useEffect` for data fetching | Violates architecture — data fetching belongs in RSC or TanStack Query |
| Never import Prisma in a Client Component | `prisma` is server-only |
| Never import `auth()` in a Client Component | `auth()` is server-only |
| Never call a Server Action from another Server Action | Compose at service layer instead |
| Never use `axios` | Only `fetch` (via TanStack Query) and Next.js data fetching |
| Never add a new npm package without asking | Stack is locked |

### Data

| Rule | Reason |
|---|---|
| Never trust client-provided prices | Always recalculate server-side |
| Never trust client-provided user IDs | Use `session.user.id` from Auth.js |
| Never skip Zod validation on any external input | Security — all inputs are untrusted |
| Never store sensitive data in `localStorage` | Sessions in DB, tokens server-only |
| Never return raw Prisma models to client | Serialize to plain objects first |

### UI/UX

| Rule | Reason |
|---|---|
| Never use `window.alert()` or `window.confirm()` | Not luxury — use custom modals |
| Never use CSS `transition: all` | Always specify the property |
| Never use `animate-bounce` (Tailwind) | Not luxury |
| Never use `animate-ping` except on live indicators | Not luxury |
| Never use `rounded-full` on buttons | Not luxury |
| Never use placeholder-as-label pattern on inputs | Accessibility violation |
| Never use `<img>` tag | Always use Next.js `<Image />` |
| Never hardcode colors in JSX/TSX | Use Tailwind classes referencing the design system |
| Never use inline `style={{}}` for colors | Use Tailwind |

---

## 3. Design Rules

### Colors — Always Use Design System

```typescript
// ✅ CORRECT — Design system colors
<div className="bg-bg-surface text-white-100 border border-white-500/20">

// ❌ WRONG — Arbitrary colors
<div style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
<div className="bg-gray-900 text-white border border-gray-700">
```

### Typography — Always Serif for Display

```typescript
// ✅ CORRECT — Serif for headings
<h1 className="font-cormorant text-display-xl font-light tracking-wide">
  The Art of Fragrance
</h1>

// ❌ WRONG — Sans-serif heading
<h1 className="font-inter text-4xl font-bold">
  The Art of Fragrance
</h1>
```

### Spacing — Luxury Requires Breathing Room

```typescript
// ✅ CORRECT — Generous section spacing
<section className="py-24 px-6">

// ❌ WRONG — Cramped sections
<section className="py-4 px-2">
```

### Borders — Sharp Corners Only

```typescript
// ✅ CORRECT — Sharp luxury card
<div className="bg-bg-surface border border-white-500/20">

// ❌ WRONG — Rounded corners on cards
<div className="bg-gray-900 rounded-xl border border-gray-700">
```

---

## 4. Animation Rules

### GSAP Only — No CSS Keyframe Animations (Except Shimmer)

```typescript
// ✅ CORRECT — GSAP animation
import { gsap } from '@/lib/gsap'
gsap.from(element, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' })

// ❌ WRONG — CSS animation for reveal
// class="animate-fade-in"  ← Not acceptable
```

### Always Clean Up GSAP

```typescript
// ✅ CORRECT — GSAP context with cleanup
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(ref.current, { opacity: 0, y: 40 })
  }, containerRef)
  return () => ctx.revert()
}, [])

// ❌ WRONG — No cleanup (memory leak)
useEffect(() => {
  gsap.from(ref.current, { opacity: 0, y: 40 })
}, [])
```

### Only Animate GPU Properties

```typescript
// ✅ CORRECT — GPU-accelerated
gsap.to(el, { x: 40, y: 20, opacity: 0.5, scale: 1.05 })

// ❌ WRONG — CPU-bound animation (causes layout reflow)
gsap.to(el, { width: '200px', height: '300px', top: '50px', left: '100px' })
```

### Reduced Motion

```typescript
// ✅ ALWAYS implement reduced motion check
import { getMotionPreference } from '@/utils/motion'

useEffect(() => {
  if (getMotionPreference() === 'reduced') return
  
  const ctx = gsap.context(() => {
    // animations here
  }, ref)
  return () => ctx.revert()
}, [])
```

---

## 5. Coding Rules

### TypeScript — Strict Mode Always

```typescript
// ✅ CORRECT — Explicit types, no any
export async function getProduct(id: string): Promise<Product | null> {
  const result = await prisma.product.findUnique({ where: { id } })
  return result
}

// ❌ WRONG — Implicit any, no return type
export async function getProduct(id) {
  return await prisma.product.findUnique({ where: { id } })
}
```

### Zod — Validate Everything External

```typescript
// ✅ CORRECT — Validate before processing
const validated = createOrderSchema.safeParse(requestBody)
if (!validated.success) {
  return { success: false, error: validated.error.flatten() }
}
// Use only validated.data from here

// ❌ WRONG — No validation
const { productId, quantity } = requestBody  // Untrusted!
```

### Server Actions — Always Check Auth

```typescript
// ✅ CORRECT — Auth check at top of every protected action
'use server'
export async function addToWishlist(productId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'UNAUTHORIZED' }
  // proceed...
}

// ❌ WRONG — Missing auth check
'use server'
export async function addToWishlist(productId: string) {
  await prisma.wishlist.create({ ... })  // No auth check!
}
```

### Error Handling — Always Return ActionResult

```typescript
// ✅ CORRECT — Typed error handling
export async function createOrder(data: unknown): Promise<ActionResult<Order>> {
  try {
    // ...
    return { success: true, data: order }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: 'Failed to create order. Please try again.' }
  }
}

// ❌ WRONG — Unhandled throw reaches client
export async function createOrder(data: unknown) {
  const order = await prisma.order.create({ ... })  // Uncaught exception!
  return order
}
```

---

## 6. Component Rules

### Component Must Exist in 05_COMPONENT_SYSTEM.md

Before creating any component, verify it is specified in `05_COMPONENT_SYSTEM.md`. If it's not in the spec:

1. Check if an existing component covers the need
2. If genuinely new: document it in `05_COMPONENT_SYSTEM.md` first, then implement

### Client Components Must Be Minimal

```typescript
// ✅ CORRECT — Minimal client component, receives data as props
'use client'
export function AddToCartButton({ productId, price, name }: Props) {
  const addItem = useCartStore(state => state.addItem)
  return <button onClick={() => addItem({ productId, price, name })}>Add</button>
}

// ❌ WRONG — Client component fetches its own data
'use client'
export function AddToCartButton({ productId }: { productId: string }) {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetch(`/api/products/${productId}`).then(r => r.json()).then(setProduct)
  }, [productId])
  // Violates: no useEffect data fetching
}
```

### Memoize List Items

```typescript
// ✅ CORRECT — Memoized list item
export const ProductCard = React.memo(function ProductCard({ product }: Props) {
  return <article>...</article>
})

// ❌ WRONG — No memoization on list-rendered component
export function ProductCard({ product }: Props) {
  return <article>...</article>
}
```

---

## 7. Folder Rules

| Rule | Correct | Wrong |
|---|---|---|
| Business logic | `src/features/[feature]/` | `app/` |
| Database access | `src/lib/db/` | `src/features/` |
| Shared components | `src/components/` | `src/features/` |
| Server actions | `src/features/[feature]/actions/` | `app/api/` |
| Types | `src/types/` (shared) or `src/features/[feature]/types/` | Root of `src/` |
| Utilities | `src/utils/` (shared) or `src/features/[feature]/utils/` | Root |
| Prisma schema | `prisma/schema.prisma` | Anywhere else |
| Email templates | `src/lib/email/templates/` | `src/features/` |

---

## 8. Naming Rules

| Type | Correct | Wrong |
|---|---|---|
| React Component file | `ProductCard.tsx` | `productCard.tsx`, `product-card.tsx` |
| Hook file | `useCartActions.ts` | `CartActions.ts`, `cart-actions.ts` |
| Server Action file | `createOrder.ts` | `CreateOrder.ts`, `create-order.ts` |
| Store file | `cart.store.ts` | `CartStore.ts`, `cartStore.ts` |
| Schema file | `checkout.schema.ts` | `CheckoutSchema.ts` |
| Type file | `product.types.ts` | `ProductTypes.ts` |
| Boolean variable | `isLoading`, `hasDiscount` | `loading`, `discount` |
| Event handler | `handleAddToCart` | `addToCart`, `onAdd` |
| Constant | `MAX_CART_ITEMS` | `maxCartItems`, `max_cart_items` |

---

## 9. Review Checklist

Run this checklist before submitting any code:

```
TYPESCRIPT
[ ] `pnpm type-check` passes with zero errors
[ ] All exported functions have explicit return types
[ ] No `any` type used
[ ] No `@ts-ignore` or `@ts-expect-error` without explanation

LINTING & FORMATTING
[ ] `pnpm lint` passes with zero warnings
[ ] `pnpm format` applied (Prettier)
[ ] Import order correct (React → Third-party → Internal → Types → Styles)

ARCHITECTURE
[ ] No database calls in Client Components
[ ] No data fetching in useEffect
[ ] Server Actions validated with Zod
[ ] Server Actions check authentication

DESIGN SYSTEM
[ ] Colors from design system (bg-*, gold-*, white-*)
[ ] Typography: serif (font-cormorant) for display, sans (font-inter) for body
[ ] No rounded corners on cards, buttons, inputs (rounded-none)
[ ] Images via Next.js <Image /> only

ANIMATION
[ ] GSAP used for all reveals (not CSS animations)
[ ] gsap.context() used for cleanup
[ ] Reduced motion check implemented
[ ] Only transform + opacity animated

SECURITY
[ ] User input validated with Zod
[ ] Auth checked in all protected actions
[ ] Prices calculated server-side
[ ] No secrets logged

TESTING
[ ] Unit tests for business logic
[ ] E2E test for new user journeys
```

---

## 10. Luxury Anti-Generic Rules

These rules specifically prevent the AI from generating the "typical e-commerce" patterns that are antithetical to this brand.

### Page Layout Anti-Patterns

```
❌ Generic e-commerce layout:
┌──────────────────────────────────────────┐
│ [Logo]  [Search Bar]  [Cart] [Account]   │ ← Crowded header
├──────────────────────────────────────────┤
│ [Hero Banner with text overlay]          │ ← Flat banner
├──────────────────────────────────────────┤
│ [Featured] [Sale] [New] [Category] tabs  │ ← Tab navigation
├──────────────────────────────────────────┤
│ [Product] [Product] [Product] [Product]  │ ← Dense grid immediately
└──────────────────────────────────────────┘

✅ Maison Noir layout:
┌──────────────────────────────────────────┐
│ logo          [nav]           icons      │ ← Clean, spaced
├──────────────────────────────────────────┤
│                                          │
│         [FULL SCREEN 3D SCENE]          │ ← Cinematic hero
│                                          │
│    Whispers of the Orient                │
│    Discover the collection ──>           │
│                                          │
└──────────────────────────────────────────┘
```

### CTA Button Anti-Patterns

```typescript
// ❌ Generic
<button className="bg-blue-600 text-white rounded-full px-6 py-2 font-bold">
  ADD TO CART
</button>

// ✅ Luxury
<MagneticButton className="bg-transparent border border-gold-300 text-gold-200 px-8 py-4 text-sm tracking-widest uppercase font-inter font-light hover:bg-gold-300/10 transition-colors duration-200">
  Add to Collection
</MagneticButton>
```

### Text Anti-Patterns

```typescript
// ❌ Generic e-commerce copy
<p>High quality car air freshener with long lasting scent. Buy now!</p>

// ✅ Luxury car fragrance copy
<p className="text-body-lg text-white-200 font-light leading-relaxed">
  Engineered for the road, crafted for the cabin. 
  Ocean Drive combines crisp coastal citrus with deep cedarwood notes 
  that withstand Indian summer heat while maintaining an effortless, subtle aura.
</p>
```

### Empty State Anti-Patterns

```typescript
// ❌ Generic
<p>No products found.</p>

// ✅ Luxury
<EmptyState
  icon={<SearchIcon className="h-8 w-8 text-gold-300/40" />}
  heading="The search yields silence"
  subtext="Perhaps the fragrance you seek is yet to be unveiled. Explore our curated collection."
  action={{ label: "Explore All Fragrances", href: "/products" }}
/>
```

### Error State Anti-Patterns

```typescript
// ❌ Generic
<p>Error: Something went wrong. Please try again.</p>

// ✅ Luxury
<div className="text-center py-16">
  <h2 className="font-cormorant text-heading-xl font-light text-white-100 mb-4">
    A rare interruption
  </h2>
  <p className="text-body-md text-white-300 mb-8 max-w-prose mx-auto">
    Our atelier has encountered an unexpected pause. 
    Our team has been notified and we are restoring service.
  </p>
  <Button variant="secondary" onClick={reset}>Try again</Button>
</div>
```

### Loading State Anti-Patterns

```typescript
// ❌ Generic spinner
<div className="flex justify-center">
  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full" />
</div>

// ✅ Luxury skeleton
<div className="grid grid-cols-4 gap-6">
  {Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  ))}
</div>
```
