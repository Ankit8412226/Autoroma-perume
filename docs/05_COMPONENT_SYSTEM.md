# 05_COMPONENT_SYSTEM.md — Component Specification

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: Frontend Engineers, UI/UX Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Navbar](#1-navbar)
2. [Hero Section](#2-hero-section)
3. [Product Card](#3-product-card)
4. [Product Page](#4-product-page)
5. [Collection Section](#5-collection-section)
6. [Footer](#6-footer)
7. [Buttons](#7-buttons)
8. [Inputs](#8-inputs)
9. [Cart Drawer](#9-cart-drawer)
10. [Wishlist](#10-wishlist)
11. [Checkout](#11-checkout)
12. [Newsletter](#12-newsletter)
13. [Account Dashboard](#13-account-dashboard)
14. [Admin Components](#14-admin-components)
15. [Modals](#15-modals)
16. [Accordions](#16-accordions)
17. [Tabs](#17-tabs)
18. [Loading States](#18-loading-states)
19. [Skeletons](#19-skeletons)
20. [Empty States](#20-empty-states)
21. [Error States](#21-error-states)

---

## 1. Navbar

**File**: `src/components/layout/Navbar.tsx`  
**Type**: Client Component (`'use client'`)

### Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  MAISON NOIR                    [Products] [Collections] [B2B]   🔍 ♡ 🛒 👤 │
└──────────────────────────────────────────────────────────────────────┘
```

### Behavior

| State | Appearance |
|---|---|
| At top of page | `bg-transparent`, logo and links in `white-100` |
| Scrolled > 80px | Glass effect: `bg-bg-primary/85 backdrop-blur-xl border-b border-white-500/20` |
| Mobile | Hamburger icon — opens full-screen `MobileMenu` overlay |

### Props & State

```typescript
// No props — reads global scroll state and auth session
// Uses useScrolled() hook for scroll detection
// Uses auth session from Auth.js useSession() for user state
```

### Rules

- Logo always links to `/`
- Cart icon shows item count badge (from Zustand cart store)
- Wishlist icon shows count badge for authenticated users
- Search opens a slide-down search overlay
- Nav links use Next.js `<Link>` with `prefetch` enabled
- Active route highlighted with `text-gold-300` and bottom border
- Keyboard navigable — Tab through all interactive elements

### Mobile Menu

Full-screen overlay on mobile (`MobileMenu.tsx`):
- Dark background `bg-bg-primary`
- Links animate in one by one (staggered GSAP)
- Close on `Escape` key and outside click

---

## 2. Hero Section

**File**: `app/(marketing)/page.tsx` → `src/features/products/components/HeroSection.tsx`  
**Type**: Client Component (Three.js requires client)

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [THREE.JS BOTTLE SCENE — full viewport]                             │
│                                                                      │
│  ┌────────────────────────────────┐                                  │
│  │ Whispers of the Orient        │  ← display-2xl Cormorant          │
│  │ An olfactory journey          │  ← body-lg Inter                  │
│  │ [Discover the Collection]     │  ← Primary Button                 │
│  └────────────────────────────────┘                                  │
│                                                                      │
│                          ▼ Scroll                                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Responsibilities

- Renders the Three.js WebGL scene as background (see `07_THREEJS_SYSTEM.md`)
- Headline splits into characters with SplitType for letter-by-letter reveal
- Subtext fades in after headline completes
- CTA button fades in last with magnetic hover effect
- Scroll indicator pulses and fades out after first scroll

### Performance

- Three.js loaded via `dynamic(() => import('./BottleScene'), { ssr: false })`
- On low-power devices (detected via `navigator.hardwareConcurrency < 4`), falls back to static hero image
- Hero section is minimum `100svh` (safe viewport height for mobile browsers)

---

## 3. Product Card

**File**: `src/features/products/components/ProductCard.tsx`  
**Type**: Client Component (wishlist button interaction)

### Props

```typescript
interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number         // in paise
    compareAtPrice?: number
    images: string[]      // Cloudinary URLs
    collection: string
    productType: string   // VENT_CLIP, HANGING, SPRAY, DASHBOARD_GEL, REED_DIFFUSER
    scentFamily: string   // Fresh, Woody, Citrus, Floral, Musky, Aquatic
    averageRating: number
    reviewCount: number
    isNew: boolean
    stock: number
  }
}
```

### Layout

```
┌──────────────────────────┐
│                          │  ← aspect-[4/5]
│   [Product Image]         │
│                    [♥]   │  ← absolute top-3 right-3
│ [NEW]                    │  ← absolute top-3 left-3 (if isNew)
├──────────────────────────┤
│ VENT CLIP · FRESH          │  ← label (type · scent family)
│ Ocean Drive              │  ← heading-md, product name
│ ₹399  ~~₹499~~            │  ← body-md, gold-200 + strikethrough
│ ★★★★★ (47 reviews)       │  ← body-sm, white-300
└──────────────────────────┘
```

### Interactions

- **Hover on image**: scale(1.04) — 300ms ease — via GSAP
- **Hover on card**: border-color → `gold-300/50`
- **Wishlist button**: heart fills on click; Server Action called; optimistic UI update
- **Click**: navigate to `/products/[slug]`
- **Out of stock**: overlay "Out of Stock" text; card still navigable but CTA disabled

### Accessibility

- `role="article"` on card wrapper
- `aria-label` on wishlist button: `"Add [product name] to wishlist"`
- Price announced to screen readers as "₹399" — not "Rs 399"

---

## 4. Product Page

**File**: `app/(shop)/products/[slug]/page.tsx`  
**Type**: Server Component (data) + multiple Client Components (interactions)

### Sections

```
1. ProductHero         — Image gallery (left) + details (right)
2. ScentNotes          — Interactive scent pyramid (top/heart/base notes)
3. ProductDetails      — Type, compatibility, longevity, intensity
4. HowToUse            — Installation guide (vent clip, hanging, gel, spray) with illustrations
5. ProductReviews      — Star ratings + written reviews
6. RelatedProducts     — 4-product horizontal scroll (same scent family or type)
```

### ProductHero Layout

```
┌───────────────────────────────────────────────────────────────────────┐
│ LEFT (7 cols)                │ RIGHT (5 cols)                       │
│                              │                                       │
│ [Main Image - 4:5]           │ VENT CLIP · FRESH CITRUS              │
│                              │ Ocean Drive (heading-lg)             │
│ [Thumbnail Row]              │ ₹399                                 │
│                              │ ★★★★☆ 4.2 (47 reviews)             │
│                              │                                       │
│                              │ Scent: Fresh Citrus                  │
│                              │ Lasts: 2–4 Weeks                     │
│                              │ Fits: All Cars (AC Vent)             │
│                              │                                       │
│                              │ [Scent Variant Selector]             │
│                              │                                       │
│                              │ [Add to Garage]     (primary btn)    │
│                              │ [Add to Wishlist]   (secondary btn)  │
│                              │                                       │
│                              │ [✓ Free shipping above ₹499]         │
│                              │ [✓ Genuine fragrance oils]           │
│                              │ [✓ No artificial harshness]          │
└───────────────────────────────────────────────────────────────────────┘
```

### Image Gallery

- Main image: click to zoom (lightbox via CSS transform)
- Thumbnail strip: 4 images, click to swap main image
- All images: Cloudinary URLs with `w_800,q_auto,f_auto` transforms
- Keyboard: Arrow keys cycle through gallery images

### Fragrance Notes Component

```typescript
// Interactive SVG pyramid with three layers
// Top Notes (fast-evaporating): appear at tip
// Heart Notes (character): middle section
// Base Notes (lasting): bottom and widest
// Hover each note → tooltip shows note name + family
```

---

## 5. Collection Section

**File**: `src/features/products/components/CollectionSection.tsx`  
**Type**: Client Component (scroll animation)

### Purpose

B2B landing page targeting dealerships, car wash studios, detailing garages, fleet operators, and auto accessories retailers.

### Layout

Alternating left/right editorial layout:

```
[Odd collections]                      [Even collections]
┌──────────────────────────────────────────────────────┐
│ [Image - 55%]     │  Collection Title                │
│                   │  Description (3–4 lines)         │
│                   │  [Explore Collection]            │
└──────────────────────────────────────────────────────┘
```

### Animation

- Image reveals with MaskReveal (right-to-left mask clip)
- Text reveals line-by-line via SplitType + GSAP ScrollTrigger
- Image has subtle parallax: `y: -30px` at bottom, `y: +30px` at top

---

## 6. Footer

**File**: `src/components/layout/Footer.tsx`  
**Type**: Server Component

### Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ MAISON NOIR                                                          │
│ Crafting olfactory journeys since 2024                               │
│                                                                      │
│ SHOP          COMPANY        SUPPORT        LEGAL                    │
│ Products      Our Story      FAQ            Privacy Policy           │
│ Collections   B2B            Contact        Terms of Service         │
│ New Arrivals  Sustainability  Track Order   Refund Policy            │
│                                                                      │
│ [Instagram] [Pinterest] [WhatsApp]                                   │
│                                                                      │
│ ─────────────────────────────────────────────────────────────────── │
│ © 2024 Maison Noir. All rights reserved.     Powered by Razorpay    │
└──────────────────────────────────────────────────────────────────────┘
```

### Rules

- All footer links use `text-white-300 hover:text-gold-200`
- No JavaScript in footer — pure static HTML
- Footer does NOT have a newsletter form (separate Newsletter component handles this)

---

## 7. Buttons

**File**: `src/components/ui/Button.tsx`

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean  // Renders as slot for Link composition
}
```

### Loading State

```tsx
// When isLoading=true:
// - button disabled automatically
// - text replaced by spinner + "Please wait..."
// - cursor: wait
<button disabled aria-busy="true" aria-label="Processing...">
  <Spinner className="h-4 w-4 animate-spin" aria-hidden="true" />
  <span>Please wait…</span>
</button>
```

---

## 8. Inputs

**File**: `src/components/ui/Input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
}
```

### Rules

- Label is always visible (no placeholder-as-label pattern)
- Error message appears below with `role="alert"` for screen readers
- Always associated with label via `htmlFor` / `id`
- Never use `autocomplete="off"` — respect browser autofill

---

## 9. Cart Drawer

**File**: `src/features/cart/components/CartDrawer.tsx`  
**Type**: Client Component

### Behavior

- Slides in from right side: `transform: translateX(100%) → translateX(0)` — 400ms `expo.out`
- Backdrop overlay fades in: `opacity: 0 → 1` — 300ms ease
- Closes on backdrop click, `Escape` key, or explicit close button
- Traps focus when open (`focus-trap-react`)

### Content

```
┌─────────────────────────────┐
│ Your Collection         [×] │
├─────────────────────────────┤
│ [CartItem]                  │
│ [CartItem]                  │
├─────────────────────────────┤
│ Subtotal        ₹24,000     │
│ Shipping        Free        │
│ ──────────────────────────  │
│ Total           ₹24,000     │
│                             │
│ [Proceed to Checkout]       │
│ [Continue Shopping]         │
└─────────────────────────────┘
```

### CartItem

- Product thumbnail (48×60px), name, price, quantity selector (−/+), remove button
- Quantity changes trigger debounced Zustand store updates
- Remove with confirm — no alert dialog; inline text "Remove?" with [Yes] / [Keep]

---

## 10. Wishlist

**File**: `src/features/wishlist/components/WishlistGrid.tsx`  
**Type**: Client Component (for auth-gated interactions)

- For unauthenticated users: wishlist stored in Zustand (ephemeral)
- On login: ephemeral wishlist merged with DB wishlist via Server Action
- Grid: same `ProductCard` component, no duplicate component
- Empty state: editorial message with CTA to Products page

---

## 11. Checkout

**Files**: `src/features/checkout/components/`  
**Type**: Client Components + Server Actions

### Steps

```
Step 1: Contact Details & Shipping Address
Step 2: Order Review + Coupon
Step 3: Payment (Razorpay)
```

### Step 1 — Address Form

```typescript
// Fields validated with React Hook Form + Zod
{
  fullName:    z.string().min(2).max(100),
  email:       z.string().email(),
  phone:       z.string().regex(/^[6-9]\d{9}$/),  // Indian mobile
  address1:    z.string().min(5).max(200),
  address2:    z.string().optional(),
  city:        z.string().min(2).max(100),
  state:       z.string().min(2).max(100),
  pincode:     z.string().regex(/^[1-9][0-9]{5}$/), // Indian PIN
  country:     z.literal('India'),
}
```

### Step 3 — Razorpay Integration

```typescript
// Client-side Razorpay checkout initialization
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: totalInPaise,
  currency: 'INR',
  name: 'Maison Noir',
  description: `Order #${orderId}`,
  order_id: razorpayOrderId,
  prefill: { name, email, contact: phone },
  theme: { color: '#C9A96E' },
  modal: { backdropclose: false },
  handler: async (response) => {
    // Call /api/payment/verify
    // Navigate to /checkout/success
  }
}
new window.Razorpay(options).open()
```

---

## 12. Newsletter

**File**: `src/features/newsletter/components/NewsletterForm.tsx`  
**Type**: Client Component

- Full-width editorial section, typically before footer
- Single email input + subscribe button
- Server Action: validates email with Zod, saves to `Subscriber` collection, sends welcome email via Resend
- Success state: "You're on the list. Expect something extraordinary."
- Duplicate email handled gracefully: "You're already on our list."

---

## 13. Account Dashboard

**File**: `app/account/page.tsx` + `src/features/account/`  
**Type**: Server Component (data) + Client (interactive parts)

### Sidebar Navigation

```
- Overview
- My Orders
- Wishlist
- Addresses
- Profile Settings
```

### Overview Panel

- Greeting: "Welcome back, [First Name]"
- Stats: Total Orders, Total Spent, Wishlist Items
- Last Order quick-view card

---

## 14. Admin Components

See `13_ADMIN_SYSTEM.md` for full admin specification.

Key components:
- `AdminSidebar.tsx` — navigation rail
- `DashboardStats.tsx` — Recharts-powered metrics cards
- `ProductForm.tsx` — create/edit product with Cloudinary upload
- `OrderTable.tsx` — sortable, filterable data table
- `DataTable.tsx` — generic reusable admin table component

---

## 15. Modals

**File**: `src/components/ui/Modal.tsx`  
**Type**: Client Component (uses React Portal)

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
}
```

- Renders via `ReactDOM.createPortal` to `document.body`
- Background: `bg-bg-overlay backdrop-blur-sm`
- Dialog: `bg-bg-surface border border-white-500/20` — no border radius
- Animation: opacity + scale(0.97→1) on open — GSAP
- Focus trap active when open
- `Escape` key closes

---

## 16. Accordions

**File**: `src/components/ui/Accordion.tsx`  
**Type**: Client Component

Used in: Product FAQ, Shipping info, Admin settings

```typescript
interface AccordionItem {
  id: string
  trigger: string
  content: React.ReactNode
}
```

- Animates height with GSAP `.to({ height: 'auto' })` — not CSS `max-height` trick
- Plus/minus icon rotates on open/close
- Only one item open at a time (controlled mode) or multiple (uncontrolled mode)

---

## 17. Tabs

**File**: `src/components/ui/Tabs.tsx`  
**Type**: Client Component

Used in: Product page (Description / Notes / Reviews), Admin product form

```typescript
interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>
  defaultTab?: string
  variant?: 'underline' | 'pill'
}
```

- `underline` variant: gold underline slides to active tab — GSAP x translation
- `pill` variant: background pill moves to active tab — for admin
- Tab switching uses `aria-selected`, `role="tab"`, `role="tabpanel"`

---

## 18. Loading States

### Page Loading (`loading.tsx`)

For RSC page data loading (Next.js streaming):
- Full-page skeleton specific to each page's layout
- Never use a spinner-only loading state
- Match the skeleton structure exactly to the final layout

### Button Loading

- Spinner replaces text
- Button disabled with `aria-busy="true"`

### Form Submission Loading

- Input fields disabled
- Submit button shows spinner
- No full-page overlay

---

## 19. Skeletons

**File**: `src/components/ui/Skeleton.tsx`

```typescript
// Skeleton component — animated shimmer
<Skeleton className="h-4 w-full" />    // text line
<Skeleton className="aspect-[4/5]" />  // image placeholder
<Skeleton className="h-10 w-32" />     // button
```

Shimmer animation:
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-surface) 25%,
    var(--color-bg-elevated) 50%,
    var(--color-bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 20. Empty States

### Rules

- Never show bare "No results" text
- Always include: illustration or icon + heading + subtext + CTA
- Tone: inviting, not clinical

### Examples

```tsx
// Empty Cart
<EmptyState
  icon={<ShoppingBagIcon />}
  heading="Your collection awaits"
  subtext="Explore our curated fragrances and discover your signature scent."
  action={{ label: "Browse Collection", href: "/products" }}
/>

// Empty Search Results
<EmptyState
  icon={<SearchIcon />}
  heading="No fragrances found"
  subtext={`We couldn't find results for "${query}". Try a different term.`}
  action={{ label: "View All Products", href: "/products" }}
/>

// Empty Wishlist
<EmptyState
  icon={<HeartIcon />}
  heading="Nothing saved yet"
  subtext="Heart your favourite fragrances to save them here."
  action={{ label: "Explore", href: "/products" }}
/>
```

---

## 21. Error States

### Inline Error (Form Field)

```tsx
<p role="alert" className="mt-1 text-body-sm text-error flex items-center gap-1">
  <AlertCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
  {error.message}
</p>
```

### Page-Level Error (`error.tsx`)

```tsx
// Never: "Something went wrong"
// Always: Human, contextual, with recovery action

<div>
  <h1>A rare hiccup occurred</h1>
  <p>We couldn't load this page. Our team has been notified automatically.</p>
  <button onClick={reset}>Try again</button>
  <Link href="/">Return home</Link>
</div>
```

### Toast Notifications

**File**: `src/components/ui/Toast.tsx`

| Type | Icon | Color |
|---|---|---|
| Success | `CheckCircle` | `text-success` |
| Error | `AlertCircle` | `text-error` |
| Info | `Info` | `text-info` |
| Warning | `AlertTriangle` | `text-warning` |

- Position: bottom-right
- Duration: 4000ms auto-dismiss
- Animation: slides in from right, fades out
- Maximum 3 toasts visible at once (queue overflow)
