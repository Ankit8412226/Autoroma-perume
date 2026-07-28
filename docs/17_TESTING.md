# 17_TESTING.md — Testing Strategy & Specification

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: All Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Technology Stack](#2-technology-stack)
3. [Unit Testing](#3-unit-testing)
4. [Integration Testing](#4-integration-testing)
5. [E2E Testing](#5-e2e-testing)
6. [Animation Testing](#6-animation-testing)
7. [Payment Testing](#7-payment-testing)
8. [Accessibility Testing](#8-accessibility-testing)
9. [SEO Testing](#9-seo-testing)
10. [Performance Testing](#10-performance-testing)
11. [QA Checklist](#11-qa-checklist)

---

## 1. Testing Philosophy

### Testing Pyramid

```
        ┌─────────────────────┐
        │      E2E Tests       │  ← Few, slow, high-value critical paths
        │      (Playwright)    │
        ├─────────────────────┤
        │  Integration Tests  │  ← Medium, test boundaries
        │     (Vitest)        │
        ├─────────────────────┤
        │    Unit Tests       │  ← Many, fast, isolated logic
        │     (Vitest)        │
        └─────────────────────┘
```

### Coverage Targets

| Layer | Coverage Target |
|---|---|
| Business logic (utils, calculations) | 90% |
| Server Actions | 80% |
| API Route Handlers | 75% |
| React Components | 60% |
| E2E (critical paths) | 100% of critical flows |

### What NOT to Test

- Prisma internals (trust the library)
- Third-party API behavior (mock instead)
- Tailwind class names (not behavior)
- Next.js routing internals

---

## 2. Technology Stack

| Tool | Role |
|---|---|
| **Vitest** | Unit and integration tests |
| **@testing-library/react** | Component rendering tests |
| **Playwright** | E2E browser tests |
| **MSW (Mock Service Worker)** | API mocking in tests |
| **@vitest/coverage-v8** | Code coverage |

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
      }
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
})
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'mobile-chrome', use: { browserName: 'chromium', ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 3. Unit Testing

### What to Test

- Pure utility functions
- Price calculation logic
- Coupon discount calculation
- Zod schema validation
- Store actions (Zustand)
- Business rule helpers

### Price Calculation Tests

```typescript
// tests/unit/calculateOrderTotal.test.ts
import { describe, it, expect } from 'vitest'
import { calculateCouponDiscount } from '@/features/checkout/lib/calculateOrderTotal'

describe('calculateCouponDiscount', () => {
  const baseCoupon = {
    isActive: true,
    expiresAt: null,
    type: 'PERCENTAGE' as const,
    value: 20,
    minOrderValue: null,
    maxDiscount: null,
  }

  it('calculates 20% discount correctly', () => {
    const discount = calculateCouponDiscount(1000000, baseCoupon)
    expect(discount).toBe(200000)  // ₹2,000 off on ₹10,000 order
  })

  it('applies maxDiscount cap', () => {
    const coupon = { ...baseCoupon, maxDiscount: 150000 }
    const discount = calculateCouponDiscount(1000000, coupon)
    expect(discount).toBe(150000)  // Capped at ₹1,500
  })

  it('returns 0 if below minOrderValue', () => {
    const coupon = { ...baseCoupon, minOrderValue: 500000 }
    const discount = calculateCouponDiscount(300000, coupon)
    expect(discount).toBe(0)
  })

  it('returns 0 for expired coupon', () => {
    const expired = { ...baseCoupon, expiresAt: new Date('2020-01-01') }
    const discount = calculateCouponDiscount(1000000, expired)
    expect(discount).toBe(0)
  })

  it('returns 0 for inactive coupon', () => {
    const inactive = { ...baseCoupon, isActive: false }
    const discount = calculateCouponDiscount(1000000, inactive)
    expect(discount).toBe(0)
  })

  it('FIXED type reduces by fixed amount', () => {
    const fixed = { ...baseCoupon, type: 'FIXED' as const, value: 50000 }
    const discount = calculateCouponDiscount(300000, fixed)
    expect(discount).toBe(50000)  // ₹500 off
  })

  it('FIXED type cannot discount more than subtotal', () => {
    const fixed = { ...baseCoupon, type: 'FIXED' as const, value: 500000 }
    const discount = calculateCouponDiscount(300000, fixed)
    expect(discount).toBe(300000)  // Cannot exceed subtotal
  })
})
```

### Zod Schema Tests

```typescript
// tests/unit/schemas.test.ts
import { describe, it, expect } from 'vitest'
import { registerSchema } from '@/features/auth/schemas/register.schema'

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'Priya Mehta',
      email: 'priya@example.com',
      password: 'SecurePass1!',
      confirmPassword: 'SecurePass1!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Priya', email: 'p@e.com',
      password: 'SecurePass1!', confirmPassword: 'DifferentPass1!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.confirmPassword).toBeDefined()
  })

  it('rejects password without uppercase', () => {
    const result = registerSchema.safeParse({
      name: 'Priya', email: 'p@e.com',
      password: 'nouppercase1!', confirmPassword: 'nouppercase1!',
    })
    expect(result.success).toBe(false)
  })
})
```

### Cart Store Tests

```typescript
// tests/unit/cart.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/stores/cart.store'

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('adds item to cart', () => {
    useCartStore.getState().addItem({
      productId: 'prod1', variantId: '50ml',
      name: 'Ambre Nuit', image: '/img.jpg', volume: 50, price: 1200000, quantity: 1
    })
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('increments quantity for duplicate item', () => {
    const item = { productId: 'prod1', variantId: '50ml', name: 'Ambre', image: '/img.jpg', volume: 50, price: 1200000, quantity: 1 }
    useCartStore.getState().addItem(item)
    useCartStore.getState().addItem(item)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('caps quantity at 10', () => {
    for (let i = 0; i < 15; i++) {
      useCartStore.getState().addItem({
        productId: 'prod1', variantId: '50ml', name: 'Ambre', image: '/img.jpg', volume: 50, price: 1200000, quantity: 1
      })
    }
    expect(useCartStore.getState().items[0].quantity).toBe(10)
  })
})
```

---

## 4. Integration Testing

### Server Action Tests

```typescript
// tests/integration/applyCoupon.test.ts
import { describe, it, expect, vi } from 'vitest'
import { applyCoupon } from '@/features/checkout/actions/applyCoupon'

// Mock Prisma
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    coupon: {
      findFirst: vi.fn(),
    }
  }
}))

// Mock auth
vi.mock('@/lib/auth/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: 'user1', email: 'test@test.com', role: 'CUSTOMER' }
  })
}))

import { prisma } from '@/lib/db/prisma'

describe('applyCoupon server action', () => {
  it('returns discount for valid coupon', async () => {
    vi.mocked(prisma.coupon.findFirst).mockResolvedValue({
      id: 'coupon1',
      code: 'NOIR20',
      type: 'PERCENTAGE',
      value: 20,
      isActive: true,
      expiresAt: null,
      minOrderValue: null,
      maxDiscount: null,
      usageLimit: null,
      usageCount: 0,
      perUserLimit: 1,
    } as any)

    const result = await applyCoupon({ code: 'NOIR20', orderTotal: 1000000 })
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.discount).toBe(200000)
    }
  })
})
```

### API Route Tests

```typescript
// tests/integration/api/search.test.ts
import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'

describe('GET /api/search', () => {
  it('returns 400 if query is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/search')
    const response = await GET(req)
    expect(response.status).toBe(400)
  })

  it('returns results for valid query', async () => {
    const req = new NextRequest('http://localhost:3000/api/search?q=oud')
    const response = await GET(req)
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data.products)).toBe(true)
  })
})
```

---

## 5. E2E Testing

### Critical User Journeys

#### Journey 1: B2C Purchase

```typescript
// tests/e2e/purchase.spec.ts
import { test, expect } from '@playwright/test'

test('complete B2C purchase flow', async ({ page }) => {
  // 1. Browse products
  await page.goto('/products')
  await expect(page.getByRole('heading', { name: 'Shop' })).toBeVisible()

  // 2. Open product
  await page.getByTestId('product-card').first().click()
  await expect(page.getByTestId('product-hero')).toBeVisible()

  // 3. Select variant and add to cart
  await page.getByTestId('variant-100ml').click()
  await page.getByRole('button', { name: 'Add to Collection' }).click()
  await expect(page.getByTestId('cart-drawer')).toBeVisible()
  await expect(page.getByTestId('cart-item-count')).toContainText('1')

  // 4. Proceed to checkout
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click()
  await expect(page).toHaveURL('/login?next=/checkout')

  // 5. Login
  await page.getByLabel('Email').fill('test@maisonnoir.in')
  await page.getByLabel('Password').fill('TestPass123!')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL('/checkout')

  // 6. Fill address
  await page.getByLabel('Full Name').fill('Priya Mehta')
  await page.getByLabel('Phone').fill('9876543210')
  await page.getByLabel('Address Line 1').fill('123 Marine Drive')
  await page.getByLabel('City').fill('Mumbai')
  await page.getByLabel('State').fill('Maharashtra')
  await page.getByLabel('PIN Code').fill('400001')
  await page.getByRole('button', { name: 'Continue to Review' }).click()

  // 7. Apply coupon
  await page.getByPlaceholder('Enter coupon code').fill('NOIR20')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByTestId('coupon-discount')).toBeVisible()

  // 8. Payment — Razorpay is mocked in test environment
  await page.getByRole('button', { name: 'Confirm & Pay' }).click()
  // Razorpay modal intercepted by MSW in test mode
  
  // 9. Verify success page
  await expect(page).toHaveURL(/\/checkout\/success/)
  await expect(page.getByText(/Order confirmed/i)).toBeVisible()
})
```

#### Journey 2: B2B Inquiry

```typescript
// tests/e2e/b2b.spec.ts
test('B2B inquiry submission', async ({ page }) => {
  await page.goto('/b2b')
  
  await page.getByLabel('Company Name').fill('Grand Hyatt Mumbai')
  await page.getByLabel('Contact Name').fill('Arjun Sharma')
  await page.getByLabel('Email').fill('arjun@grandhyatt.com')
  await page.getByLabel('Phone').fill('9123456789')
  await page.getByLabel('Requirements').fill('500 units per month for guest rooms')
  await page.getByLabel('Estimated Quantity').fill('500')
  
  await page.getByRole('button', { name: 'Submit Inquiry' }).click()
  
  await expect(page.getByText(/inquiry.*received/i)).toBeVisible()
})
```

#### Journey 3: Admin Order Management

```typescript
// tests/e2e/admin.spec.ts
test('admin updates order status to shipped', async ({ page }) => {
  // Login as admin
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@maisonnoir.in')
  await page.getByLabel('Password').fill('AdminPass123!')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL('/admin')

  // Navigate to orders
  await page.getByRole('link', { name: 'Orders' }).click()
  await page.getByTestId('order-row').first().click()

  // Update status
  await page.getByLabel('Status').selectOption('SHIPPED')
  await page.getByLabel('Tracking Number').fill('DELHIVERY123456')
  await page.getByRole('button', { name: 'Update Order' }).click()
  
  await expect(page.getByText('Order updated successfully')).toBeVisible()
})
```

---

## 6. Animation Testing

### Reduced Motion

```typescript
// tests/e2e/accessibility/animations.spec.ts
test('animations disabled with prefers-reduced-motion', async ({ page }) => {
  // Emulate reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  
  // Hero text should be visible immediately (no animation delay)
  await expect(page.getByTestId('hero-headline')).toBeVisible()
  
  // Check opacity — should not start at 0
  const opacity = await page.getByTestId('hero-headline').evaluate(
    el => window.getComputedStyle(el).opacity
  )
  expect(parseFloat(opacity)).toBeGreaterThan(0.5)
})
```

### GSAP Context Cleanup

```typescript
// Verify no ScrollTrigger memory leaks
// Tested in component mount/unmount cycle
it('cleans up GSAP context on unmount', () => {
  const { unmount } = render(<ProductCard product={mockProduct} />)
  const triggersBefore = ScrollTrigger.getAll().length
  unmount()
  const triggersAfter = ScrollTrigger.getAll().length
  expect(triggersAfter).toBeLessThanOrEqual(triggersBefore)
})
```

---

## 7. Payment Testing

### Test Credentials (Razorpay Test Mode)

```
Test Card: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits

Test UPI: success@razorpay
Test UPI (failure): failure@razorpay
```

### Payment Flow Tests

```typescript
// tests/e2e/payment.spec.ts — Uses Razorpay test mode
test('successful payment', async ({ page }) => {
  // ... reach Razorpay modal
  await page.frameLocator('[name="razorpay-iframe"]').getByLabel('Card Number').fill('4111111111111111')
  // Complete test payment
})

test('failed payment shows error', async ({ page }) => {
  // Test with failure UPI
  await page.frameLocator('[name="razorpay-iframe"]').getByLabel('UPI ID').fill('failure@razorpay')
  // Verify error handling
  await expect(page.getByText(/payment.*failed/i)).toBeVisible()
})
```

### Webhook Testing (Integration)

```typescript
// tests/integration/webhooks/razorpay.test.ts
it('processes payment.captured webhook', async () => {
  const payload = {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_test123',
          order_id: 'order_test456',
          amount: 1200000,
        }
      }
    }
  }
  
  const signature = generateTestWebhookSignature(JSON.stringify(payload))
  
  const response = await fetch('/api/webhooks/razorpay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature,
    },
    body: JSON.stringify(payload),
  })
  
  expect(response.status).toBe(200)
  // Verify order updated in DB
  const order = await prisma.order.findFirst({ where: { razorpayOrderId: 'order_test456' } })
  expect(order?.status).toBe('CONFIRMED')
})
```

---

## 8. Accessibility Testing

```typescript
// tests/e2e/accessibility/a11y.spec.ts
import { checkA11y, injectAxe } from 'axe-playwright'

test('homepage passes accessibility audit', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  await checkA11y(page, null, {
    detailedReport: true,
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  })
})

test('product page passes accessibility audit', async ({ page }) => {
  await page.goto('/products/ambre-nuit')
  await injectAxe(page)
  await checkA11y(page)
})

test('checkout form accessible', async ({ page }) => {
  // Login first
  await page.goto('/checkout')
  await injectAxe(page)
  await checkA11y(page)
})

test('keyboard navigation — cart drawer', async ({ page }) => {
  await page.goto('/products/ambre-nuit')
  await page.keyboard.press('Tab')  // Navigate to Add to Cart
  await page.keyboard.press('Enter') // Open cart drawer
  await expect(page.getByTestId('cart-drawer')).toBeVisible()
  
  // Focus should be trapped in drawer
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('cart-drawer')).not.toBeVisible()
})
```

---

## 9. SEO Testing

```typescript
// tests/e2e/seo.spec.ts
test('product page has correct metadata', async ({ page }) => {
  await page.goto('/products/ambre-nuit')
  
  // Title
  await expect(page).toHaveTitle(/Ambre Nuit.*Maison Noir/)
  
  // Meta description
  const metaDesc = await page.getAttribute('meta[name="description"]', 'content')
  expect(metaDesc?.length).toBeGreaterThan(120)
  expect(metaDesc?.length).toBeLessThan(160)
  
  // Single H1
  const h1s = await page.locator('h1').all()
  expect(h1s.length).toBe(1)
  
  // Canonical
  const canonical = await page.getAttribute('link[rel="canonical"]', 'href')
  expect(canonical).toBe('https://maisonnoir.in/products/ambre-nuit')
  
  // JSON-LD
  const jsonLd = await page.$eval(
    'script[type="application/ld+json"]',
    (el) => JSON.parse(el.textContent ?? '{}')
  )
  expect(jsonLd['@type']).toBe('Product')
  expect(jsonLd.name).toBe('Ambre Nuit')
})

test('sitemap is valid XML', async ({ page }) => {
  const response = await page.goto('/sitemap.xml')
  expect(response?.status()).toBe(200)
  const body = await response?.body()
  expect(body?.toString()).toContain('<urlset')
})

test('robots.txt blocks admin routes', async ({ page }) => {
  const response = await page.goto('/robots.txt')
  const body = await response?.text()
  expect(body).toContain('Disallow: /admin/')
  expect(body).toContain('Disallow: /api/')
})
```

---

## 10. Performance Testing

```bash
# Lighthouse CI — run in CI on every PR
pnpm dlx @lhci/cli autorun \
  --collect.url=https://staging.maisonnoir.in \
  --collect.url=https://staging.maisonnoir.in/products/ambre-nuit \
  --collect.url=https://staging.maisonnoir.in/products \
  --assert.preset=lighthouse:recommended \
  --assert.assertions.performance=error:1:minScore:0.95 \
  --assert.assertions.accessibility=error:1:minScore:0.95 \
  --assert.assertions.best-practices=error:1:minScore:0.95 \
  --assert.assertions.seo=error:1:minScore:0.95
```

### WebPageTest (Monthly)

- Run from Mumbai server (closest to primary user base)
- First View and Repeat View
- Waterfall analysis
- Film strip review

---

## 11. QA Checklist

### Pre-Release Checklist

```
FUNCTIONALITY
[ ] Add to cart — single item
[ ] Add to cart — multiple variants
[ ] Quantity increment/decrement
[ ] Remove item from cart
[ ] Cart persists on page refresh (localStorage)
[ ] Wishlist add/remove
[ ] Coupon valid → discount applied
[ ] Coupon expired → error shown
[ ] Coupon not found → error shown
[ ] Checkout — address form validation
[ ] Checkout — successful payment (test mode)
[ ] Checkout — failed payment handled
[ ] Order confirmation email received
[ ] Account → orders shows new order
[ ] Admin — order status update
[ ] Admin — low stock shows in dashboard
[ ] B2B inquiry submission → confirmation shown

RESPONSIVE
[ ] 375px (iPhone SE) — all pages functional
[ ] 768px (iPad) — layout correct
[ ] 1280px (laptop) — layout correct
[ ] 1920px (large screen) — no content stretching

ANIMATIONS
[ ] Hero headline animates on load
[ ] Product cards reveal on scroll
[ ] Cart drawer slides in/out
[ ] Loading screen appears only on first visit
[ ] Reduced motion: animations instant
[ ] Three.js scene loads correctly (desktop)
[ ] Three.js falls back to image (mobile)

ACCESSIBILITY
[ ] Keyboard navigation through all interactive elements
[ ] Screen reader announces cart changes
[ ] Focus visible on all interactive elements
[ ] Skip-to-content link works
[ ] Form errors announced by screen reader

SECURITY
[ ] /admin redirects to login when not admin
[ ] /account redirects to login when not authenticated
[ ] Coupon code cannot be manipulated in browser
[ ] Price cannot be manipulated in browser
```
