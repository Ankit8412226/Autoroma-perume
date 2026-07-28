# 04_DESIGN_SYSTEM.md — Design System Specification

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: UI/UX Engineers, Frontend Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Color Palette](#1-color-palette)
2. [Typography](#2-typography)
3. [Spacing System](#3-spacing-system)
4. [Grid & Layout](#4-grid--layout)
5. [Containers](#5-containers)
6. [Buttons](#6-buttons)
7. [Cards](#7-cards)
8. [Forms & Inputs](#8-forms--inputs)
9. [Tables](#9-tables)
10. [Icons](#10-icons)
11. [Borders & Radius](#11-borders--radius)
12. [Elevation & Shadow](#12-elevation--shadow)
13. [Glass Usage](#13-glass-usage)
14. [Luxury Rules](#14-luxury-rules)
15. [Never Use Rules](#15-never-use-rules)

---

## 1. Color Palette

All colors are defined as CSS custom properties in `src/styles/globals.css` and extended into Tailwind config.

### Core Palette

```css
/* src/styles/globals.css */
:root {
  /* Backgrounds */
  --color-bg-primary:    #080808;   /* Main page background */
  --color-bg-secondary:  #111111;   /* Sections, alternating bg */
  --color-bg-surface:    #1A1A1A;   /* Cards, panels */
  --color-bg-elevated:   #222222;   /* Dropdowns, tooltips */
  --color-bg-overlay:    rgba(8, 8, 8, 0.85); /* Modals, drawers */

  /* Gold — Primary Brand Color */
  --color-gold-100:      #F7EDD8;   /* Lightest gold, text on dark */
  --color-gold-200:      #E8C98A;   /* Highlight, hover states */
  --color-gold-300:      #C9A96E;   /* Primary gold — CTAs, accents */
  --color-gold-400:      #A8834A;   /* Darker gold, pressed state */
  --color-gold-500:      #7A5C2E;   /* Deep gold, decorative */

  /* Neutrals */
  --color-white-100:     #F5F0E8;   /* Primary text */
  --color-white-200:     #D4CEC4;   /* Secondary text */
  --color-white-300:     #A09890;   /* Placeholder, disabled */
  --color-white-400:     #6B6560;   /* Muted, captions */
  --color-white-500:     #3D3A36;   /* Borders, dividers */

  /* Accent */
  --color-amber:         #8B5E3C;   /* Warm accent for fragrance notes */
  --color-rose:          #9B6B6B;   /* Floral notes accent */
  --color-sage:          #5C7A63;   /* Fresh/green notes accent */

  /* Semantic */
  --color-success:       #4A7C59;
  --color-error:         #A0522D;
  --color-warning:       #C49A3C;
  --color-info:          #4A6FA5;

  /* Gradients */
  --gradient-gold:       linear-gradient(135deg, #C9A96E 0%, #E8C98A 50%, #C9A96E 100%);
  --gradient-dark:       linear-gradient(180deg, #080808 0%, #111111 100%);
  --gradient-surface:    linear-gradient(135deg, #1A1A1A 0%, #222222 100%);
  --gradient-glass:      linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
}
```

### Tailwind Extension

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#080808',
          secondary: '#111111',
          surface:   '#1A1A1A',
          elevated:  '#222222',
        },
        gold: {
          100: '#F7EDD8',
          200: '#E8C98A',
          300: '#C9A96E',
          400: '#A8834A',
          500: '#7A5C2E',
        },
        white: {
          100: '#F5F0E8',
          200: '#D4CEC4',
          300: '#A09890',
          400: '#6B6560',
          500: '#3D3A36',
        },
        amber:   '#8B5E3C',
        success: '#4A7C59',
        error:   '#A0522D',
        warning: '#C49A3C',
      },
    },
  },
}

export default config
```

---

## 2. Typography

### Font Selection

| Role | Font | Weights | Source |
|---|---|---|---|
| Display / Headings | Cormorant Garamond | 300, 400 | Google Fonts |
| Body / UI | Inter | 300, 400, 500 | Google Fonts |
| Monospace (admin) | JetBrains Mono | 400 | Google Fonts |

**Rationale**: Cormorant Garamond is a refined old-style serif, used by luxury houses globally. Its thin weight at large sizes communicates restraint and sophistication. Inter is the standard of choice for readable, neutral UI text.

### Loading Strategy

```typescript
// app/layout.tsx
import { Cormorant_Garamond, Inter } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})
```

### Type Scale

| Token | Size | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|
| `display-2xl` | 96px / 6rem | 1.05 | -0.02em | Homepage hero headline |
| `display-xl` | 72px / 4.5rem | 1.08 | -0.01em | Section headlines |
| `display-lg` | 56px / 3.5rem | 1.1 | 0em | Product names (hero) |
| `heading-xl` | 40px / 2.5rem | 1.15 | 0.02em | Page titles |
| `heading-lg` | 32px / 2rem | 1.2 | 0.02em | Section titles |
| `heading-md` | 24px / 1.5rem | 1.3 | 0.03em | Card headings |
| `body-lg` | 18px / 1.125rem | 1.6 | 0.01em | Product descriptions |
| `body-md` | 16px / 1rem | 1.65 | 0em | Body text |
| `body-sm` | 14px / 0.875rem | 1.6 | 0em | Captions, labels |
| `label` | 11px / 0.6875rem | 1.5 | 0.12em | Category labels, tags (uppercase) |

```css
/* Tailwind extensions */
fontSize: {
  'display-2xl': ['6rem',   { lineHeight: '1.05', letterSpacing: '-0.02em' }],
  'display-xl':  ['4.5rem', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
  'display-lg':  ['3.5rem', { lineHeight: '1.1',  letterSpacing: '0em'    }],
  'heading-xl':  ['2.5rem', { lineHeight: '1.15', letterSpacing: '0.02em' }],
  'heading-lg':  ['2rem',   { lineHeight: '1.2',  letterSpacing: '0.02em' }],
  'heading-md':  ['1.5rem', { lineHeight: '1.3',  letterSpacing: '0.03em' }],
  'body-lg':     ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.01em'}],
  'label':       ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.12em'}],
}
```

### Typography Rules

- **Serif font** (Cormorant): headlines, product names, quote text, display text only
- **Sans-serif font** (Inter): all body text, UI labels, buttons, navigation, forms
- Never mix both fonts in the same text block
- Never bold serif headings — thin weight is the luxury signal
- Line lengths for body text: 55–75 characters (`max-w-prose`)

---

## 3. Spacing System

Uses Tailwind's default 4px base scale with custom additions:

```typescript
spacing: {
  '18': '4.5rem',   // 72px
  '22': '5.5rem',   // 88px
  '26': '6.5rem',   // 104px
  '30': '7.5rem',   // 120px
  '34': '8.5rem',   // 136px
  '38': '9.5rem',   // 152px
  '42': '10.5rem',  // 168px
  '46': '11.5rem',  // 184px
  '50': '12.5rem',  // 200px
  '120': '30rem',   // 480px
  '160': '40rem',   // 640px
}
```

### Spacing Philosophy

- **Sections**: `py-24` (96px) on desktop, `py-16` on mobile — luxury needs breathing room
- **Component internal padding**: `p-6` to `p-10` — never cramped
- **Text line spacing**: margin-bottom = 0.75em on paragraphs

---

## 4. Grid & Layout

### Grid System

```css
/* Default grid — 12 columns */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem; /* 24px gutter */
}

/* At 768px+ — standard 12-col grid */
/* At < 768px — 4-column grid */
/* At < 640px — 2-column or 1-column */
```

### Product Grid

| Breakpoint | Columns |
|---|---|
| < 640px | 1 column |
| 640px–1023px | 2 columns |
| 1024px–1279px | 3 columns |
| ≥ 1280px | 4 columns |

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```

---

## 5. Containers

```css
/* Three container widths for different content purposes */
.container-tight    { max-width: 720px;  margin: 0 auto; padding: 0 1.5rem; }
.container-default  { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.container-wide     { max-width: 1440px; margin: 0 auto; padding: 0 1.5rem; }
.container-full     { width: 100%; padding: 0; } /* Full-bleed sections */
```

| Container | Usage |
|---|---|
| `container-tight` | Blog posts, legal pages, account pages |
| `container-default` | Product grids, checkout, general pages |
| `container-wide` | Admin dashboard, analytics |
| `container-full` | Hero sections, Three.js scenes, full-bleed images |

---

## 6. Buttons

### Variants

```tsx
// Primary — Gold filled
<Button variant="primary">Add to Collection</Button>
// bg-gold-300 text-bg-primary hover:bg-gold-200 — gold background, dark text

// Secondary — Ghost with gold border
<Button variant="secondary">Explore</Button>
// border border-gold-300 text-gold-300 hover:bg-gold-300/10

// Tertiary — Text only
<Button variant="tertiary">Learn more →</Button>
// text-gold-200 hover:text-gold-100 underline-offset-4

// Destructive — For delete/remove actions
<Button variant="destructive">Remove</Button>
// border border-error/50 text-error hover:bg-error/10

// Icon — Square icon button
<Button variant="icon" aria-label="Close"><XIcon /></Button>
```

### Sizes

| Size | Height | Padding | Font Size |
|---|---|---|---|
| `sm` | 36px | `px-4 py-2` | 13px |
| `md` | 44px | `px-6 py-3` | 14px |
| `lg` | 52px | `px-8 py-4` | 15px |
| `xl` | 60px | `px-10 py-4` | 16px |

### Button States

- **Default**: Base styling
- **Hover**: 150ms ease — background lightens, subtle scale(1.01)
- **Active/Pressed**: scale(0.99), background darkens
- **Focus**: 2px gold-300 ring with 2px offset
- **Disabled**: opacity-40, cursor-not-allowed, no hover effect
- **Loading**: Spinner replaces text, button disabled

### Magnetic Button Effect

Primary CTAs in hero sections use a magnetic hover effect (see `06_MOTION_SYSTEM.md`).

---

## 7. Cards

### Product Card

```
┌─────────────────────────────┐
│                             │  ← 4:5 aspect ratio image
│    [Product Image]          │
│                             │
│   [Wishlist Icon]     [New] │  ← Absolute overlay
├─────────────────────────────┤
│ Collection Label             │  ← text-label uppercase text-gold-300
│ Product Name                 │  ← text-heading-md font-cormorant
│ ₹12,000                     │  ← text-gold-200 tabular-nums
│ ★★★★★ (47)                  │  ← Stars + count
└─────────────────────────────┘
```

Properties:
- Background: `bg-bg-surface`
- Border: `border border-white-500/30`
- Border Radius: `rounded-none` (luxury — no rounded corners on cards)
- Hover: Image scales to 1.04 (300ms ease), border-color transitions to gold-300/50
- Never use drop shadows — use borders instead

### Information Card (Admin / Account)

- Background: `bg-bg-surface`
- Border: `border border-white-500/20`
- Padding: `p-6`
- Radius: `rounded-none`

---

## 8. Forms & Inputs

### Input Field

```
┌─────────────────────────────────┐
│ Label                           │  ← text-label uppercase text-white-300
├─────────────────────────────────┤
│ Placeholder text...             │  ← text-body-md text-white-400
└─────────────────────────────────┘
```

```css
/* Base input styles */
.input-base {
  background: transparent;
  border: 1px solid var(--color-white-500);
  color: var(--color-white-100);
  padding: 0.75rem 1rem;
  font-family: var(--font-inter);
  font-size: 0.9375rem;
  transition: border-color 150ms ease;
  outline: none;
  border-radius: 0;   /* Never rounded on inputs */
}

.input-base::placeholder {
  color: var(--color-white-400);
}

.input-base:focus {
  border-color: var(--color-gold-300);
}

.input-base:invalid:not(:placeholder-shown) {
  border-color: var(--color-error);
}
```

### Validation States

| State | Border Color | Helper Text Color |
|---|---|---|
| Default | `white-500` | — |
| Focus | `gold-300` | — |
| Valid | `success` | `success` |
| Invalid | `error` | `error` |
| Disabled | `white-500/40` | — |

---

## 9. Tables

Admin tables and order history:

```css
table { width: 100%; border-collapse: collapse; }

thead th {
  text-align: left;
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-white-300);
  border-bottom: 1px solid var(--color-white-500);
  padding: 0.75rem 1rem;
}

tbody td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-white-500)/30;
  color: var(--color-white-200);
  font-size: 0.9375rem;
}

tbody tr:hover {
  background: var(--color-bg-elevated);
}
```

---

## 10. Icons

- **Primary library**: Lucide React — consistent 24px stroke-based icons
- **Usage**: Always use `aria-hidden="true"` on decorative icons; always provide `aria-label` on icon-only buttons
- **Size scale**: `h-4 w-4` (16px), `h-5 w-5` (20px), `h-6 w-6` (24px)
- **Color**: Inherit from parent — never hardcode icon color
- **Custom icons**: SVG files in `public/icons/` — imported as React components

---

## 11. Borders & Radius

### Philosophy

> Luxury design uses **sharp corners**. Rounded corners communicate playfulness, not refinement.

| Element | Border Radius |
|---|---|
| Cards | `0` (sharp) |
| Inputs | `0` (sharp) |
| Buttons | `0` (sharp) |
| Modals / Drawers | `0` |
| Badges / Tags | `0` or `2px` maximum |
| Avatar images | `50%` (circles only) |
| Tooltips | `2px` |

### Border Widths

- Standard: `1px`
- Decorative accent lines: `0.5px` or `1px`
- Never use `2px` or thicker borders in luxury UI

---

## 12. Elevation & Shadow

**Rule**: No box-shadows on cards or buttons. Elevation is communicated through:

1. **Color contrast**: Elevated elements use a lighter background (`bg-elevated`)
2. **Border**: `border border-white-500/20` defines the edge
3. **Backdrop blur**: Only on glass elements (cart drawer, modals)

```css
/* Allowed shadow — only for floating utility elements */
.shadow-luxury {
  box-shadow:
    0 0 0 1px rgba(201, 169, 110, 0.1),
    0 24px 64px rgba(0, 0, 0, 0.6);
}
```

---

## 13. Glass Usage

Glass morphism is used **sparingly** — only for:

1. Cart Drawer overlay
2. Sticky navigation on scroll
3. Modal/dialog backgrounds
4. Tooltip backgrounds

```css
.glass {
  background: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 169, 110, 0.1);
}
```

**Anti-patterns**:
- Never apply glass to product cards
- Never apply glass to main content areas
- Never stack multiple glass layers

---

## 14. Luxury Rules

1. **No filled backgrounds** on hero sections — use full-bleed photography or Three.js scene
2. **Generous negative space** — section padding minimum `py-24`
3. **Single accent color per screen** — gold is the only accent; never use two accent colors together
4. **Typography hierarchy must be obvious** — size difference between heading and body must be at least 2 scale steps
5. **Animated reveals** — text never just "appears"; always reveals with mask or opacity transition
6. **One CTA per section** — never two competing calls-to-action in the same viewport
7. **Image quality gate** — minimum 1200px wide, maximum 200KB compressed via Cloudinary auto:quality
8. **Price display** — always with currency symbol, always `tabular-nums` font feature

---

## 15. Never Use Rules

| Category | Never Use | Reason |
|---|---|---|
| **Colors** | Pure white `#FFFFFF` as background | Too stark, not luxury |
| **Colors** | Pure black `#000000` | Harsh; use `#080808` |
| **Colors** | Neon or highly saturated colors | Conflicts with brand |
| **Colors** | More than 3 colors in one composition | Visual clutter |
| **Typography** | System fonts (Arial, Helvetica, sans-serif) | Not premium |
| **Typography** | Bold weight on serif headings | Not luxury |
| **Typography** | ALL CAPS for body text | Reduces readability |
| **Layout** | Centered layout for product grids | Not editorial |
| **Buttons** | Rounded full pill buttons | Too playful |
| **Animation** | `animate-bounce` | Not luxury |
| **Animation** | Immediate layout shift | Unprofessional |
| **Shadow** | Heavy drop shadows | Not luxury |
| **Borders** | `border-2` or thicker | Too heavy |
| **Icons** | Filled icon style | Prefer stroke icons only |
| **Images** | Raw `<img>` tag | No optimization |
