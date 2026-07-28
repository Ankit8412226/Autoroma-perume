# 06_MOTION_SYSTEM.md — Motion & Animation System

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: Frontend Engineers, Animation Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Animation Philosophy](#1-animation-philosophy)
2. [Technology Stack](#2-technology-stack)
3. [GSAP Configuration](#3-gsap-configuration)
4. [Lenis Smooth Scroll](#4-lenis-smooth-scroll)
5. [SplitType Text System](#5-splittype-text-system)
6. [ScrollTrigger Patterns](#6-scrolltrigger-patterns)
7. [Timelines](#7-timelines)
8. [Scroll Storytelling](#8-scroll-storytelling)
9. [Pinned Sections](#9-pinned-sections)
10. [Parallax](#10-parallax)
11. [Mask Reveal](#11-mask-reveal)
12. [Image Reveal](#12-image-reveal)
13. [Letter Reveal](#13-letter-reveal)
14. [Light Sweep](#14-light-sweep)
15. [Magnetic Buttons](#15-magnetic-buttons)
16. [Custom Cursor](#16-custom-cursor)
17. [Micro Interactions](#17-micro-interactions)
18. [Page Transitions](#18-page-transitions)
19. [Loading Screen](#19-loading-screen)
20. [Performance Rules](#20-performance-rules)
21. [Reduced Motion Support](#21-reduced-motion-support)

---

## 1. Animation Philosophy

### The Luxury Motion Manifesto

> Animation at Maison Noir does not announce itself. It is felt, not seen.

**Five Principles:**

1. **Intention** — Every animation serves a narrative or UX purpose. No animation is decorative.
2. **Restraint** — Less is always more. One well-crafted reveal is worth more than ten effects.
3. **Timing** — Luxury moves slowly. Minimum duration is 0.4s. Maximum is 2.0s (for cinematic moments).
4. **Easing** — Never linear. Never elastic. Only power easing (power2–power4) and expo easing.
5. **Sequence** — Elements reveal in meaningful order: context first, then details, then actions.

### Motion Vocabulary

| Motion Type | When Used | Emotional Effect |
|---|---|---|
| Mask Reveal | New sections entering viewport | Unveiling, anticipation |
| Letter Reveal | Hero headlines | Craftsmanship, attention |
| Fade + Rise | Body text, UI elements | Gentle arrival |
| Image Parallax | Editorial images | Depth, dimensionality |
| Pinned Scroll | Product storytelling | Immersion, luxury |
| Magnetic Pull | Hero CTAs | Connection, invitation |
| Light Sweep | Premium product cards | Polish, material quality |
| Page Transition | Route changes | Continuity |

---

## 2. Technology Stack

| Library | Version | Role |
|---|---|---|
| `gsap` | 3.x | Core animation engine |
| `gsap/ScrollTrigger` | (bundled) | Scroll-linked animations |
| `gsap/SplitText` | (bundled, Club) | Text splitting — or use `split-type` |
| `lenis` | latest | Smooth scroll (replaces native scroll) |
| `split-type` | latest | Character/word/line splitting |

### GSAP Registration

```typescript
// src/lib/gsap.ts — shared GSAP config
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase)

  // Custom luxury eases
  CustomEase.create('luxury', 'M0,0 C0.25,0.1 0.25,1 1,1')
  CustomEase.create('entrance', 'M0,0 C0.16,1 0.3,1 1,1')
  CustomEase.create('cinematic', 'M0,0 C0.1,0 0,1 1,1')
}

export { gsap, ScrollTrigger }
```

---

## 3. GSAP Configuration

### Global Defaults

```typescript
// Applied once in root layout provider
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
})
```

### Ease Reference

| Name | GSAP Ease | Usage |
|---|---|---|
| `entrance` | `expo.out` | Element first appears on page |
| `scroll-reveal` | `power3.out` | Elements reveal on scroll |
| `micro-hover` | `power1.inOut` | Small hover state changes |
| `magnetic` | `power2.out` | Magnetic button following cursor |
| `modal-open` | `expo.out` | Modal, drawer open |
| `page-exit` | `power4.in` | Page exit transition |
| `loading-exit` | `power4.inOut` | Loading screen dismissal |

### Duration Standards

```typescript
const DURATION = {
  MICRO:      0.2,   // Hover color changes
  FAST:       0.35,  // Hover transforms
  DEFAULT:    0.6,   // Standard reveals
  MEDIUM:     0.8,   // Scroll reveals
  SLOW:       1.0,   // Page-level events
  CINEMATIC:  1.5,   // Loading screen, hero entrance
} as const
```

---

## 4. Lenis Smooth Scroll

### Configuration

```typescript
// src/components/providers/LenisProvider.tsx
'use client'

import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(() => {})
    }
  }, [])

  return <>{children}</>
}
```

### Rules

- Lenis must be initialized **before** any ScrollTrigger instances
- Lenis scroll events must be connected to `ScrollTrigger.update`
- **Never** mix Lenis with `scroll-behavior: smooth` in CSS — remove it globally
- Lenis is disabled on touch devices with `touchMultiplier: 2.0` (native feel preserved)

---

## 5. SplitType Text System

### Setup

```typescript
import SplitType from 'split-type'

// Split into lines for paragraphs
const splitLines = new SplitType(element, { types: 'lines' })

// Split into words for subheadings
const splitWords = new SplitType(element, { types: 'words' })

// Split into characters for hero headlines
const splitChars = new SplitType(element, { types: 'chars' })
```

### Cleanup

```typescript
// Always clean up in useEffect return
useEffect(() => {
  const split = new SplitType(ref.current, { types: 'chars' })
  // ... animate

  return () => {
    split.revert()  // Restores original HTML
  }
}, [])
```

### Responsive Re-splitting

```typescript
// Re-split on window resize (debounced)
const handleResize = debounce(() => {
  split.revert()
  split.split({})
  // Re-animate
}, 200)

window.addEventListener('resize', handleResize)
```

---

## 6. ScrollTrigger Patterns

### Standard Scroll Reveal

```typescript
// Used on almost all section elements
gsap.from(element, {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 85%',
    end: 'top 50%',
    toggleActions: 'play none none reverse',
  }
})
```

### Staggered Grid Reveal

```typescript
// Used on product grids, feature lists
gsap.from(cards, {
  y: 60,
  opacity: 0,
  duration: 0.7,
  ease: 'power3.out',
  stagger: {
    each: 0.1,
    from: 'start',
  },
  scrollTrigger: {
    trigger: container,
    start: 'top 80%',
  }
})
```

### Scrub Animation (scroll-linked progress)

```typescript
// Used for parallax and progress-tied effects
gsap.to(image, {
  y: -80,
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,  // Smooth 1.5s lag for luxury feel
  }
})
```

---

## 7. Timelines

### Pattern: Entrance Timeline

```typescript
// Used for hero section or page entrance sequences
const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

tl
  .from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.6 })
  .from(headlineChars, { opacity: 0, y: '110%', stagger: 0.04, duration: 0.8 }, '-=0.2')
  .from(subheadingRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
  .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
  .from(scrollIndicatorRef.current, { opacity: 0, duration: 0.4 }, '-=0.1')
```

### Pattern: Section Timeline

```typescript
// Controlled by ScrollTrigger
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top 70%',
    end: 'top 30%',
    scrub: false,
  }
})

tl
  .from(labelRef.current, { opacity: 0, y: 10, duration: 0.4 })
  .from(titleLines, { opacity: 0, y: 40, stagger: 0.1, duration: 0.7 }, '-=0.2')
  .from(bodyLines, { opacity: 0, y: 20, stagger: 0.05, duration: 0.5 }, '-=0.3')
  .from(ctaRef.current, { opacity: 0, duration: 0.4 }, '-=0.2')
```

---

## 8. Scroll Storytelling

### Product Storytelling Section

A pinned horizontal scroll sequence on desktop that walks through a product's story:

```
[Section pinned to viewport]
Panel 1: Product Origin Story (text + background image)
Panel 2: The Perfumer (portrait + quote)
Panel 3: Key Ingredients (animated fragrance pyramid)
Panel 4: The Bottle Design (Three.js model rotates)
[Pin release → continue normal scroll]
```

```typescript
const panels = gsap.utils.toArray('.story-panel')

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: storyContainer,
    pin: true,
    scrub: 1,
    end: () => `+=${storyContainer.offsetWidth}`,
    snap: {
      snapTo: 1 / (panels.length - 1),
      duration: { min: 0.2, max: 0.5 },
      ease: 'power2.inOut',
    },
  }
})
```

---

## 9. Pinned Sections

### Usage

Pinning is used sparingly for:
1. Product storytelling (horizontal scroll above)
2. Collection feature (text reveals while image stays fixed)
3. Statistics / brand values counter section

### Text-Pin Pattern (Image Fixed, Text Scrolls)

```typescript
// Image stays pinned while text panels scroll past it
ScrollTrigger.create({
  trigger: imageRef.current,
  start: 'top center',
  end: 'bottom center',
  pin: true,
  pinSpacing: false,
})

// Text panels animate on scroll past image
textPanels.forEach((panel, i) => {
  gsap.from(panel, {
    opacity: 0,
    y: 30,
    scrollTrigger: {
      trigger: panel,
      start: 'top 60%',
    }
  })
})
```

---

## 10. Parallax

### Image Parallax (Section Background)

```typescript
// Applied to editorial section images
gsap.to(imageRef.current, {
  y: '-15%',    // Moves up as user scrolls down
  ease: 'none',
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 2,
  }
})
```

### Text Parallax (Subtle depth)

```typescript
// Foreground text moves slightly slower than background
gsap.to(textRef.current, {
  y: '-5%',
  ease: 'none',
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
  }
})
```

---

## 11. Mask Reveal

The most-used reveal in the system. A clipping mask slides to reveal content.

### Implementation

```typescript
// src/components/motion/MaskReveal.tsx
'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface MaskRevealProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'top' | 'bottom'
  delay?: number
}

export function MaskReveal({ children, direction = 'left', delay = 0 }: MaskRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const mask = maskRef.current
    if (!wrapper || !mask) return

    const clipStart = direction === 'left'
      ? 'inset(0 100% 0 0)'
      : direction === 'right'
        ? 'inset(0 0 0 100%)'
        : direction === 'top'
          ? 'inset(100% 0 0 0)'
          : 'inset(0 0 100% 0)'

    gsap.fromTo(mask, 
      { clipPath: clipStart },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.0,
        ease: 'expo.out',
        delay,
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(st => st.kill())
  }, [direction, delay])

  return (
    <div ref={wrapperRef} style={{ overflow: 'hidden' }}>
      <div ref={maskRef}>
        {children}
      </div>
    </div>
  )
}
```

---

## 12. Image Reveal

Combines mask reveal with a subtle scale effect:

```typescript
// Image starts slightly zoomed in, reveals with clip + scale back to 1
gsap.fromTo(imageRef.current,
  { scale: 1.1, clipPath: 'inset(0 100% 0 0)' },
  {
    scale: 1,
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top 80%',
    }
  }
)
```

---

## 13. Letter Reveal

Used on hero headlines and major section titles only:

```typescript
// src/components/motion/RevealText.tsx
'use client'

import SplitType from 'split-type'
import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'

interface RevealTextProps {
  text: string
  as?: keyof JSX.IntrinsicElements
  type?: 'chars' | 'words' | 'lines'
  stagger?: number
  delay?: number
  className?: string
}

export function RevealText({
  text, as: Tag = 'h1', type = 'chars', stagger = 0.04, delay = 0, className
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const split = new SplitType(el, { types: type })
    const targets = type === 'chars' ? split.chars
      : type === 'words' ? split.words
      : split.lines

    gsap.from(targets, {
      yPercent: 110,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out',
      stagger,
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    })

    return () => {
      split.revert()
    }
  }, [type, stagger, delay])

  return <Tag ref={ref as React.Ref<HTMLElement>} className={className}>{text}</Tag>
}
```

---

## 14. Light Sweep

A premium shimmer that travels across product cards on hover:

```css
/* Pseudo-element shimmer on card hover */
.product-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(201, 169, 110, 0.08) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity 150ms ease;
}

.product-card:hover::after {
  opacity: 1;
  animation: light-sweep 600ms ease forwards;
}

@keyframes light-sweep {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

---

## 15. Magnetic Buttons

Primary CTA buttons have a magnetic cursor-following effect:

```typescript
// src/components/motion/MagneticButton.tsx
'use client'

import { useRef, useCallback } from 'react'
import { gsap } from '@/lib/gsap'

export function MagneticButton({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.5,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    gsap.to(btnRef.current, {
      x: 0, y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }, [])

  return (
    <button
      ref={btnRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  )
}
```

---

## 16. Custom Cursor

A custom cursor replaces the default on desktop (≥ 1024px):

```typescript
// src/components/motion/CustomCursor.tsx
// Outer ring: follows cursor with 0.15 lag (GSAP lerp)
// Inner dot: follows cursor instantly
// On hoverable elements: outer ring scales to 2.5x
// On product images: shows "View" text inside cursor
// On drag areas: shows custom drag icon
```

**States:**
| Element | Cursor State |
|---|---|
| Default | `dot (8px) + ring (32px)` |
| Links & Buttons | Ring scales 2.5× |
| Product images | Ring shows "VIEW" text |
| Draggable carousels | Ring shows `⟷` icon |
| Text | Ring shrinks to 4px dot |
| Loading | Ring shows spinner |

---

## 17. Micro Interactions

| Element | Interaction | Animation |
|---|---|---|
| Product Card | Hover | Image scale 1.04, border gold fade |
| Wishlist Button | Toggle | Heart fill/unfill with scale 1.3→1 |
| Add to Cart | Click | Button text morphs → checkmark → "Added" |
| Quantity +/− | Click | Number slides up/down (ticker) |
| Accordion | Toggle | Height animates, icon rotates 45° |
| Tab Switch | Click | Underline slides to new position |
| Toast | Appear | Slides in from right, slides out left |
| Star Rating | Hover | Stars fill progressively left-to-right |
| Checkbox | Check | Checkmark draws in with stroke animation |

---

## 18. Page Transitions

**Pattern**: Curtain transition — dark panel wipes down to cover old page, then wipes up to reveal new.

```typescript
// Implemented in app/layout.tsx using GSAP
// 1. On route change start: animate curtain down (cover page)
// 2. Route changes (Next.js navigation)
// 3. On route change complete: animate curtain up (reveal new page)

const curtainEnter = () => {
  gsap.to(curtainRef.current, {
    scaleY: 1,
    transformOrigin: 'bottom center',
    duration: 0.5,
    ease: 'power4.in',
  })
}

const curtainExit = () => {
  gsap.to(curtainRef.current, {
    scaleY: 0,
    transformOrigin: 'top center',
    duration: 0.6,
    ease: 'expo.out',
    delay: 0.1,
  })
}
```

---

## 19. Loading Screen

Displayed for 1.5–2s on first visit only (not on subsequent navigation):

```
Phase 1: Logo mark appears (opacity 0→1, scale 0.9→1), 600ms
Phase 2: Brand name reveals letter by letter, 800ms
Phase 3: Loading bar fills from left to right, 600ms
Phase 4: All elements fade out simultaneously, 400ms
Phase 5: Curtain slides up revealing the page, 600ms
```

```typescript
// Stored in sessionStorage — only shows on first page load
// If 'visited' key exists in sessionStorage, skip loading screen
const hasVisited = sessionStorage.getItem('maison-visited')
if (!hasVisited) {
  sessionStorage.setItem('maison-visited', '1')
  // Play loading screen
}
```

---

## 20. Performance Rules

1. **GPU-only properties**: Only animate `transform` (translate, scale, rotate) and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, `padding`.
2. **`will-change` management**: Add `will-change: transform` before animation, remove after completion
3. **Kill ScrollTriggers**: Always call `ScrollTrigger.kill()` or `kill()` on specific instances in `useEffect` cleanup
4. **Batch DOM reads**: Use `gsap.context()` to scope all animations and batch cleanup
5. **Avoid layout thrash**: Never read layout properties (offsetWidth) inside a GSAP callback
6. **Throttle mouse events**: Magnetic button mouse handler throttled to 16ms (60fps)

```typescript
// Correct pattern — GSAP context for automatic cleanup
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations here are automatically cleaned up
    gsap.from('.my-element', { opacity: 0, y: 40 })
    ScrollTrigger.create({ trigger: '.my-trigger', ... })
  }, containerRef)

  return () => ctx.revert()
}, [])
```

---

## 21. Reduced Motion Support

**All** non-essential animations are disabled when `prefers-reduced-motion: reduce` is set:

```typescript
// src/utils/motion.ts
export function getMotionPreference(): 'full' | 'reduced' {
  if (typeof window === 'undefined') return 'full'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'reduced'
    : 'full'
}

// GSAP global conditional
if (getMotionPreference() === 'reduced') {
  gsap.globalTimeline.timeScale(1000) // Instant — effectively disabled
}
```

```css
/* CSS fallback */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**What stays active under reduced motion:**
- State transitions (color changes on hover) — functional, not decorative
- Loading indicators — necessary for feedback
- Toast notifications — necessary for accessibility

**What is disabled under reduced motion:**
- All GSAP ScrollTrigger reveals
- Page transitions
- Loading screen animation
- Letter reveals
- Parallax
- Magnetic cursor
- Three.js particle animations
