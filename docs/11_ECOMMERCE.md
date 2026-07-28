# 11_ECOMMERCE.md — E-Commerce Business Logic

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: Backend Engineers, Product Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Cart System](#1-cart-system)
2. [Wishlist System](#2-wishlist-system)
3. [Checkout Flow](#3-checkout-flow)
4. [Coupon System](#4-coupon-system)
5. [Inventory Management](#5-inventory-management)
6. [Shipping](#6-shipping)
7. [Tax (GST)](#7-tax-gst)
8. [Returns & Refunds](#8-returns--refunds)
9. [Reviews System](#9-reviews-system)
10. [Search & Filters](#10-search--filters)
11. [Recommendations](#11-recommendations)
12. [B2B Workflow](#12-b2b-workflow)
13. [B2C Workflow](#13-b2c-workflow)
14. [Business Rules](#14-business-rules)

---

## 1. Cart System

### Architecture

- **Primary store**: Zustand (`cart.store.ts`) with `localStorage` persistence
- **Server sync**: MongoDB `cartItems` collection (sync on login)
- **Guest cart**: Zustand only — ephemeral until login
- **Authenticated cart**: Zustand (client) + MongoDB (server) — synced on session change

### Cart Store

```typescript
// src/stores/cart.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string            // Local UUID
  productId: string
  variantId: string     // Volume variant ID
  name: string
  image: string
  volume: number        // ml
  price: number         // paise
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  
  // Computed (via selectors)
  // getTotal() — not stored, computed
  // getItemCount() — not stored, computed
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      
      addItem: (newItem) => set(state => {
        const existing = state.items.find(
          i => i.productId === newItem.productId && i.variantId === newItem.variantId
        )
        if (existing) {
          // Increase quantity instead of adding duplicate
          return {
            items: state.items.map(i =>
              i.productId === newItem.productId && i.variantId === newItem.variantId
                ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, 10) }
                : i
            ),
            isDrawerOpen: true
          }
        }
        return {
          items: [...state.items, { ...newItem, id: crypto.randomUUID() }],
          isDrawerOpen: true
        }
      }),

      removeItem: (productId, variantId) => set(state => ({
        items: state.items.filter(i => !(i.productId === productId && i.variantId === variantId))
      })),

      updateQuantity: (productId, variantId, quantity) => set(state => {
        if (quantity <= 0) {
          return { items: state.items.filter(i => !(i.productId === productId && i.variantId === variantId)) }
        }
        return {
          items: state.items.map(i =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, 10) }
              : i
          )
        }
      }),

      clearCart: () => set({ items: [], isDrawerOpen: false }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: 'maison-cart',
      version: 1,
    }
  )
)

// Selectors (outside store for memoization)
export const selectCartTotal = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const selectCartItemCount = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)
```

### Business Rules

- Maximum 10 units of any single variant per cart
- Maximum 20 distinct items per cart
- Stock validation happens at checkout initiation (not at add-to-cart)
- Price in cart is the price at time of adding — re-verified at checkout

---

## 2. Wishlist System

### Architecture

- **Unauthenticated**: Zustand store (`wishlist.store.ts`) — ephemeral
- **Authenticated**: MongoDB `wishlists` collection + Zustand (optimistic)
- On login: merge local wishlist with DB wishlist (deduplicate)

### Optimistic Updates

```typescript
// Toggle wishlist — optimistic UI
async function handleWishlistToggle(productId: string) {
  const isInWishlist = wishlistStore.has(productId)
  
  // 1. Optimistic update immediately
  wishlistStore.toggle(productId)
  
  // 2. Call server action in background
  const result = isInWishlist
    ? await removeFromWishlist(productId)
    : await addToWishlist(productId)
  
  // 3. Revert on failure
  if (!result.success) {
    wishlistStore.toggle(productId)  // Revert
    toast.error('Failed to update wishlist')
  }
}
```

---

## 3. Checkout Flow

### Steps

```
Step 1 — Contact & Address
    ├─► For authenticated users: show saved addresses + "Add new"
    ├─► For new checkout: show address form
    └─► Validate: name, email, phone (Indian), address, city, state, pincode

Step 2 — Review Order
    ├─► Show cart items with current prices (re-fetched from DB)
    ├─► Coupon code input → validate via /api/coupons/validate
    ├─► Show: subtotal, discount, shipping, GST, total
    └─► "Confirm & Pay" button

Step 3 — Payment (Razorpay)
    ├─► POST /api/payment/create-order
    ├─► Razorpay checkout modal opens
    ├─► User completes payment
    ├─► On success: POST /api/payment/verify
    └─► Redirect to /checkout/success
```

### Price Calculation (Server-Side — always)

```typescript
// src/features/checkout/lib/calculateOrderTotal.ts

interface OrderTotals {
  subtotal: number       // Sum of item prices × quantities (paise)
  discount: number       // Coupon discount (paise)
  shippingCharge: number // 0 if free, else in paise
  tax: number            // GST (paise)
  total: number          // Final amount (paise)
}

export async function calculateOrderTotal(
  cartItems: { productId: string; variantId: string; quantity: number }[],
  coupon?: CouponDocument
): Promise<OrderTotals> {
  // 1. Fetch live prices from DB
  const products = await prisma.product.findMany({
    where: { id: { in: cartItems.map(i => i.productId) } },
    select: { id: true, variants: true, stock: true }
  })

  // 2. Calculate subtotal
  let subtotal = 0
  for (const item of cartItems) {
    const product = products.find(p => p.id === item.productId)
    if (!product) throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`)
    
    const variant = product.variants.find(v => v.id === item.variantId)
    if (!variant) throw new Error(`VARIANT_NOT_FOUND:${item.variantId}`)
    if (variant.stock < item.quantity) throw new Error(`INSUFFICIENT_STOCK:${item.productId}`)
    
    subtotal += variant.price * item.quantity
  }

  // 3. Apply coupon discount
  let discount = 0
  if (coupon) {
    discount = calculateCouponDiscount(subtotal, coupon)
  }

  // 4. Shipping — free above ₹1,500 (150,000 paise)
  const afterDiscount = subtotal - discount
  const shippingCharge = afterDiscount >= 150000 ? 0 : 9900  // ₹99 shipping

  // 5. GST — 18% on subtotal after discount
  const taxableAmount = afterDiscount + shippingCharge
  const tax = Math.round(taxableAmount * 0.18)

  // 6. Total
  const total = taxableAmount + tax

  return { subtotal, discount, shippingCharge, tax, total }
}
```

---

## 4. Coupon System

### Coupon Types

| Type | Description | Example |
|---|---|---|
| `PERCENTAGE` | Percentage off subtotal | 20% off → NOIR20 |
| `FIXED` | Fixed amount off subtotal | ₹500 off → FLAT500 |
| `FREE_SHIPPING` | Waives shipping charge | FREESHIP |

### Discount Calculation

```typescript
export function calculateCouponDiscount(subtotal: number, coupon: Coupon): number {
  if (!coupon.isActive) return 0
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return 0
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return 0

  let discount = 0

  switch (coupon.type) {
    case 'PERCENTAGE':
      discount = Math.round(subtotal * coupon.value / 100)
      // Apply max discount cap if set
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
      break
    case 'FIXED':
      discount = Math.min(coupon.value, subtotal)  // Can't discount more than subtotal
      break
    case 'FREE_SHIPPING':
      discount = 0  // Handled at shipping charge level
      break
  }

  return discount
}
```

### Coupon Validation Rules

1. Coupon code is case-insensitive (stored uppercase, compared uppercase)
2. Coupon must be active (`isActive: true`)
3. Coupon must not be expired (`expiresAt > now` or `expiresAt === null`)
4. If `usageLimit` set: `usageCount < usageLimit`
5. If `perUserLimit` set: check user's usage count for this coupon
6. If `minOrderValue` set: subtotal must be ≥ minOrderValue (before discount)
7. Discount cannot bring total below ₹1 (100 paise)

---

## 5. Inventory Management

### Stock Tracking

- Stock is tracked per variant (`ProductVariant.stock`)
- `Product.stock` is the computed sum of all variant stocks
- Stock is **decremented atomically** on webhook confirmation (not on checkout initiation)

### Atomic Decrement

```typescript
// In webhook handler — prevents race conditions
async function decrementInventory(
  items: { productId: string; variantId: string; quantity: number }[]
) {
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product) continue

    const updatedVariants = product.variants.map(v => {
      if (v.id === item.variantId) {
        const newStock = v.stock - item.quantity
        if (newStock < 0) throw new Error(`NEGATIVE_STOCK:${item.productId}:${item.variantId}`)
        return { ...v, stock: newStock }
      }
      return v
    })

    await prisma.product.update({
      where: { id: item.productId },
      data: {
        variants: updatedVariants,
        stock: updatedVariants.reduce((sum, v) => sum + v.stock, 0),
      }
    })
  }
}
```

### Low Stock Alerts

- Products with `stock <= lowStockThreshold` appear in admin dashboard under "Low Stock"
- Email alert sent to admin when any variant reaches 0 stock
- Out-of-stock variants: `Add to Collection` button disabled; variant selector shows "Out of stock"

---

## 6. Shipping

### Shipping Rules

| Order Value | Shipping Charge |
|---|---|
| ≥ ₹499 | Free |
| < ₹499 | ₹60 |

- All shipments are within India only (Phase 1)
- International shipping: Phase 3
- Shipping providers: Delhivery, Shiprocket (integrated in Phase 2 for tracking)
- Phase 1: Manual shipping — admin updates tracking number and status

### Delivery Estimates

| State | Estimated Days |
|---|---|
| Metro cities (Mumbai, Delhi, Bangalore, etc.) | 2–3 business days |
| Non-metro cities | 4–6 business days |
| Remote areas | 7–10 business days |

Estimates shown at checkout are indicative, not guaranteed.

---

## 7. Tax (GST)

- All prices displayed to customers are **inclusive of GST**
- GST rate: **18%** (applicable on luxury goods / perfumes)
- Tax calculation: `tax = Math.round((afterDiscount + shippingCharge) * 0.18)`
- GST breakdown shown on order confirmation and invoice
- GSTIN is not collected from customers in Phase 1 (B2C only)
- B2B orders: GSTIN collection added in Phase 2

---

## 8. Returns & Refunds

### Return Policy

- Returns accepted within **7 days** of delivery
- Conditions: Unopened, original packaging, seal intact
- Non-returnable: Opened bottles, gift sets with broken seal

### Refund Process

```
Customer raises return request (from /account/orders/[id])
    │
    ▼
Admin reviews request in /admin/orders/[id]
    │
    ├─► Approve: Initiate Razorpay refund via API
    │       ├─► POST to Razorpay refund endpoint
    │       ├─► Razorpay webhook fires `refund.created`
    │       ├─► Order status → REFUNDED
    │       ├─► Inventory restocked (if product usable)
    │       └─► Refund confirmation email sent
    │
    └─► Reject: Admin notes added, rejection email sent
```

### Refund Timeline

- Razorpay to bank: 5–7 business days
- Razorpay to card: 5–7 business days
- Refund amount: Full order amount including GST and shipping

---

## 9. Reviews System

### Review Eligibility

- User must have a delivered order containing the product
- One review per user per product (enforced by `@@unique([userId, productId])`)
- Reviews require moderation (default: `PENDING`)
- Admin approves/rejects in `/admin/reviews`

### Review Stats Update

After a review is approved or rejected:

```typescript
// Recalculate product stats after review moderation
async function updateProductReviewStats(productId: string) {
  const stats = await prisma.review.aggregate({
    where: { productId, status: 'APPROVED' },
    _avg: { rating: true },
    _count: { id: true },
  })

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: stats._avg.rating ?? 0,
      reviewCount: stats._count.id,
    }
  })
}
```

---

## 10. Search & Filters

### Search (Atlas Search)

Full-text search across: name, description, short description, notes (top/heart/base), family.

```typescript
// src/lib/search/atlasSearch.ts
export async function searchProducts(query: string, limit = 10) {
  return prisma.product.aggregateRaw({
    pipeline: [
      {
        $search: {
          index: 'products_search',
          compound: {
            must: [{ equals: { path: 'status', value: 'ACTIVE' } }],
            should: [
              { text: { query, path: 'name', score: { boost: { value: 3 } } } },
              { text: { query, path: 'shortDescription', score: { boost: { value: 2 } } } },
              { text: { query, path: ['topNotes', 'heartNotes', 'baseNotes'] } },
            ]
          }
        }
      },
      { $limit: limit },
      { $project: { name: 1, slug: 1, price: 1, images: 1, score: { $meta: 'searchScore' } } }
    ]
  })
}
```

### Filters

Available filters on `/products`:

| Filter | Type | Options |
|---|---|---|
| Product Type | Checkbox | Vent Clip, Hanging, Dashboard Gel, Spray, Reed Diffuser, Sachet |
| Scent Family | Checkbox | Fresh, Woody, Citrus, Floral, Musky, Aquatic, Oriental, Vanilla |
| Intensity | Radio | Light, Moderate, Strong |
| Longevity | Checkbox | Short (1–2 wks), Medium (2–4 wks), Long (1–3 months), Very Long (3+ months) |
| Price Range | Dual slider | ₹99 – ₹2,000 |
| Season | Checkbox | All-Season, Summer, Monsoon, Winter |
| Occasion | Checkbox | Daily Commute, Road Trip, Office, Sports |
| Rating | Star select | ≥ 3★, ≥ 4★, ≥ 4.5★ |

Sort options: Newest, Price Low–High, Price High–Low, Best Rated, Best Selling

---

## 11. Recommendations

### "You May Also Like" (Product Page)

Algorithm:
1. Same collection: 2 products
2. Same fragrance family: 2 products
3. Exclude current product and already-in-cart items

```typescript
// Simple rule-based (no ML in Phase 1)
async function getRelatedProducts(product: Product, limit = 4) {
  return prisma.product.findMany({
    where: {
      id: { not: product.id },
      status: 'ACTIVE',
      isActive: true,
      OR: [
        { collectionId: product.collectionId },
        { fragranceFamily: product.fragranceFamily },
      ]
    },
    orderBy: { salesCount: 'desc' },
    take: limit,
  })
}
```

---

## 12. B2B Workflow

### Customer Journey

```
Business discovers [BRAND NAME]
    │
    ▼
Visits /b2b — editorial landing page
    ├┐ Car dealership & showroom use cases featured
    ├┐ Car wash & detailing studio use cases featured
    ├┐ Fleet operator (Ola, Uber, cab) use cases featured
    ├┐ Auto accessories retailer reseller program featured
    └┐ Minimum quantity: 24 units
    │
    ▼
Fills BulkInquiryForm
    ├─ Business type (dropdown: Dealership, Car Wash, Fleet, Retailer, Other)
    ├─ Company name, contact, email, phone
    ├─ Product types of interest (multi-select)
    ├─ Estimated monthly volume
    └─ Target budget range
```    │
    ▼
Server Action: submitBulkInquiry()
    ├─► Zod validation
    ├─► Create BulkOrder in DB (status: NEW)
    ├─► Send notification to admin (Resend)
    └─► Send acknowledgment to business (Resend)
    │
    ▼
Admin action in /admin/bulk-orders
    ├─► Status: REVIEWING → QUOTE_SENT
    ├─► Admin sends quote email (custom price, terms)
    ├─► Business responds (via email, not platform)
    └─► Admin updates status: CONFIRMED or REJECTED
```

---

## 13. B2C Workflow

See [Checkout Flow](#3-checkout-flow) and [Payment API](./09_API.md#11-payment-api).

---

## 14. Business Rules

### Pricing Rules

1. All prices in the system are stored in **paise** (integers). Displayed in INR.
2. The server always recalculates totals — client totals are never trusted.
3. `compareAtPrice` must always be > `price` (enforced by Zod on product creation)
4. Discounts cannot make the total go below ₹1

### Order Rules

1. Orders are immutable after `CONFIRMED` status — items cannot be modified
2. Cancellation only possible if status is `PENDING` or `CONFIRMED` (not yet shipped)
3. `orderNumber` is sequential, never reused, never predictable (padded counter)
4. Order items snapshot the product price at purchase time (historical integrity)

### Inventory Rules

1. Inventory is never decremented at cart add (only at payment confirmation)
2. Between checkout initiation and payment, items are not reserved (race condition tolerance)
3. If stock becomes 0 between checkout and payment webhook, order is still confirmed but admin is alerted
4. Restocking a product removes "Out of Stock" label automatically

### Coupon Rules

1. One coupon per order (multiple coupons cannot be stacked)
2. Coupon validation is re-run server-side at order creation (prevent code manipulation)
3. `usageCount` is incremented atomically on order confirmation, not on checkout initiation
4. Expired coupons show human message: "This offer has ended" — not a generic error

### Review Rules

1. Reviews are published only after admin approval
2. Admin cannot modify review content — only approve or reject
3. Approved reviews cannot be deleted by the user (only admin)
4. `averageRating` on Product is recalculated whenever review status changes
