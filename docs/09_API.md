# 09_API.md — API Reference & Route Specification

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: Backend Engineers, Frontend Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [API Conventions](#1-api-conventions)
2. [Authentication Endpoints](#2-authentication-endpoints)
3. [Products API](#3-products-api)
4. [Collections API](#4-collections-api)
5. [Orders API](#5-orders-api)
6. [Cart API](#6-cart-api)
7. [Wishlist API](#7-wishlist-api)
8. [Reviews API](#8-reviews-api)
9. [Coupons API](#9-coupons-api)
10. [Search API](#10-search-api)
11. [Payment API](#11-payment-api)
12. [Webhook — Razorpay](#12-webhook--razorpay)
13. [Admin API](#13-admin-api)
14. [B2B API](#14-b2b-api)
15. [Error Codes](#15-error-codes)
16. [Rate Limits](#16-rate-limits)
17. [Validation Rules](#17-validation-rules)

---

## 1. API Conventions

### Base URL

```
Production:  https://maisonnoir.in/api
Staging:     https://staging.maisonnoir.in/api
Local:       http://localhost:3000/api
```

### Request Standards

- **Content-Type**: `application/json` for all POST/PATCH/PUT requests
- **Authentication**: Bearer token in `Authorization` header (managed by Auth.js session cookie automatically for same-origin requests)
- **Pagination**: Cursor-based for lists (not page-based)
- **Idempotency**: POST endpoints that create resources accept `Idempotency-Key` header

### Response Envelope

All API responses follow a consistent structure:

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {         // Optional, for paginated lists
    "total": 150,
    "cursor": "eyJpZCI6...",
    "hasMore": true
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product does not exist or has been removed.",
    "details": {}   // Optional validation errors
  }
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| `200` | Success (GET, PATCH, DELETE) |
| `201` | Created (POST) |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (no session) |
| `403` | Forbidden (wrong role) |
| `404` | Not Found |
| `409` | Conflict (duplicate resource) |
| `422` | Unprocessable Entity (business rule violation) |
| `429` | Too Many Requests (rate limit) |
| `500` | Internal Server Error |

---

## 2. Authentication Endpoints

These are handled by **Auth.js** and NOT custom route handlers.

### POST `/api/auth/signin`

Handled by Auth.js `[...nextauth]/route.ts`. Not documented here — handled by Auth.js internals.

### POST `/api/auth/signout`

Handled by Auth.js.

### Custom Auth Actions (Server Actions, not API routes)

```typescript
// Register — src/features/auth/actions/register.ts
'use server'
Input: { name: string, email: string, password: string }
Returns: ActionResult<{ userId: string }>

// Reset Password Request — src/features/auth/actions/requestPasswordReset.ts
'use server'
Input: { email: string }
Returns: ActionResult<void>

// Reset Password — src/features/auth/actions/resetPassword.ts
'use server'
Input: { token: string, password: string }
Returns: ActionResult<void>
```

---

## 3. Products API

### GET `/api/products`

Returns paginated, filtered product list.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `collection` | string | Filter by collection slug |
| `family` | string | Fragrance family filter |
| `gender` | string | `Unisex`, `Masculine`, `Feminine` |
| `minPrice` | number | Minimum price in paise |
| `maxPrice` | number | Maximum price in paise |
| `sort` | string | `price_asc`, `price_desc`, `newest`, `rating`, `bestselling` |
| `limit` | number | Default 12, max 48 |
| `cursor` | string | Pagination cursor |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Ambre Nuit",
      "slug": "ambre-nuit",
      "shortDescription": "A warm amber journey into the heart of Arabia.",
      "price": 1200000,
      "compareAtPrice": 1500000,
      "images": ["https://res.cloudinary.com/maison-noir/image/upload/..."],
      "collection": "Oriental Series",
      "fragranceFamily": "Oriental",
      "averageRating": 4.7,
      "reviewCount": 47,
      "isNew": false,
      "stock": 23
    }
  ],
  "meta": { "total": 48, "cursor": "eyJpZCI6...", "hasMore": true }
}
```

### GET `/api/products/[id]`

Returns full product detail.

**Response includes:** all product fields + collection name + last 5 reviews (summary).

**Caching:** ISR with `revalidate: 300`. Invalidated by admin update.

### GET `/api/products/[id]/reviews`

Returns paginated reviews for a product.

| Param | Type | Description |
|---|---|---|
| `status` | string | `approved` (public), `pending` (admin only) |
| `sort` | string | `newest`, `highest_rated`, `most_helpful` |
| `limit` | number | Default 10, max 50 |
| `cursor` | string | Cursor |

---

## 4. Collections API

### GET `/api/collections`

Returns all active collections with product count.

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Oriental Series",
      "slug": "oriental-series",
      "description": "...",
      "imageUrl": "...",
      "productCount": 8
    }
  ]
}
```

### GET `/api/collections/[slug]`

Returns collection with its products (paginated). Same query params as `/api/products`.

---

## 5. Orders API

**Authentication required** for all order endpoints.

### GET `/api/orders`

Returns authenticated user's order history.

| Param | Description |
|---|---|
| `status` | Filter by order status |
| `limit` | Default 10 |
| `cursor` | Pagination cursor |

### GET `/api/orders/[orderId]`

Returns a specific order. Returns 403 if `order.userId !== session.user.id` (unless admin).

**Response includes:** order details, items with product snapshots, payment info, shipping status.

---

## 6. Cart API

> **Note**: Cart is primarily managed client-side in Zustand. The Cart API is used only to **sync** cart for authenticated users across devices.

### GET `/api/cart`

Returns authenticated user's server-side cart.

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "productId": "...",
        "variantId": "50ml",
        "quantity": 1,
        "product": { "name": "Ambre Nuit", "price": 1200000, "images": [...] }
      }
    ],
    "total": 1200000
  }
}
```

### POST `/api/cart`

Add item to server cart.

```json
// Request
{ "productId": "65f1...", "variantId": "50ml", "quantity": 1 }

// Response 201
{ "success": true, "data": { "cartItemId": "..." } }
```

### PATCH `/api/cart/[cartItemId]`

Update quantity.

```json
// Request
{ "quantity": 2 }
```

### DELETE `/api/cart/[cartItemId]`

Remove item from cart.

### DELETE `/api/cart`

Clear entire cart (called after successful checkout).

---

## 7. Wishlist API

**Authentication required.**

### GET `/api/wishlist`

Returns user's wishlist product IDs (for client-side state hydration).

### POST `/api/wishlist`

```json
// Request
{ "productId": "65f1..." }
// Response 201
{ "success": true }
```

### DELETE `/api/wishlist/[productId]`

Remove from wishlist.

---

## 8. Reviews API

### POST `/api/reviews`

Submit a review. **Authentication required.** User must have a delivered order containing the product.

```json
// Request
{
  "productId": "65f1...",
  "rating": 5,
  "title": "A masterpiece in a bottle",
  "body": "The longevity is extraordinary. Still present after 12 hours."
}

// Response 201
{ "success": true, "data": { "reviewId": "...", "status": "pending" } }
```

**Business rules:**
- One review per user per product
- User must have purchased and received the product (`order.status === 'DELIVERED'`)
- Review goes into `PENDING` status — published only after admin approval

### POST `/api/reviews/[reviewId]/helpful`

Mark review as helpful (once per user per review).

---

## 9. Coupons API

### POST `/api/coupons/validate`

Validates a coupon code without applying it.

```json
// Request
{ "code": "NOIR20", "orderTotal": 1200000 }

// Response — valid
{
  "success": true,
  "data": {
    "couponId": "...",
    "code": "NOIR20",
    "type": "PERCENTAGE",
    "value": 20,
    "discount": 240000,   // Calculated discount in paise
    "newTotal": 960000
  }
}

// Response — invalid
{
  "success": false,
  "error": { "code": "COUPON_EXPIRED", "message": "This offer has expired." }
}
```

**Possible error codes:** `COUPON_NOT_FOUND`, `COUPON_EXPIRED`, `COUPON_USAGE_LIMIT_REACHED`, `COUPON_USER_LIMIT_REACHED`, `COUPON_MIN_ORDER_NOT_MET`

---

## 10. Search API

### GET `/api/search`

Full-text product search using MongoDB Atlas Search.

| Param | Type | Description |
|---|---|---|
| `q` | string | Search query (required) |
| `limit` | number | Default 10, max 20 |

```json
// GET /api/search?q=oud+rose

{
  "success": true,
  "data": {
    "products": [
      {
        "id": "...",
        "name": "Oud Rose Elixir",
        "slug": "oud-rose-elixir",
        "price": 1800000,
        "image": "...",
        "score": 0.94   // Atlas Search relevance score
      }
    ],
    "total": 3,
    "query": "oud rose"
  }
}
```

**Atlas Search Index configuration:**

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name":             { "type": "string", "analyzer": "lucene.english" },
      "description":      { "type": "string", "analyzer": "lucene.english" },
      "shortDescription": { "type": "string", "analyzer": "lucene.english" },
      "topNotes":         { "type": "string" },
      "heartNotes":       { "type": "string" },
      "baseNotes":        { "type": "string" },
      "fragranceFamily":  { "type": "string" },
      "status":           { "type": "string" },
      "isActive":         { "type": "boolean" }
    }
  }
}
```

---

## 11. Payment API

### POST `/api/payment/create-order`

Creates a Razorpay order. **Authentication required.**

```json
// Request
{
  "cartItems": [
    { "productId": "...", "variantId": "50ml", "quantity": 1 }
  ],
  "addressId": "...",
  "couponCode": "NOIR20"   // optional
}

// Response 201
{
  "success": true,
  "data": {
    "orderId": "MN-2024-00001",        // Our internal order ID
    "razorpayOrderId": "order_XYZ...", // Razorpay order ID
    "amount": 960000,                  // Total in paise
    "currency": "INR",
    "keyId": "rzp_live_..."            // Public Razorpay key
  }
}
```

**Server-side process:**
1. Validate all cart items against live inventory
2. Calculate total server-side (never trust client total)
3. Apply coupon if provided (validate again server-side)
4. Create `Order` document with status `PENDING`
5. Call Razorpay API to create order
6. Return Razorpay order details to client

### POST `/api/payment/verify`

Verifies payment signature after Razorpay checkout completion.

```json
// Request (from Razorpay handler function)
{
  "razorpay_order_id": "order_XYZ...",
  "razorpay_payment_id": "pay_ABC...",
  "razorpay_signature": "sha256_hash..."
}

// Response
{ "success": true, "data": { "orderId": "MN-2024-00001" } }
```

**Note**: This is a backup verification. Primary verification happens in the webhook.

---

## 12. Webhook — Razorpay

### POST `/api/webhooks/razorpay`

Receives Razorpay payment events. **No authentication** (signature verification instead).

**Supported Events:**

| Event | Action |
|---|---|
| `payment.captured` | Update order to `CONFIRMED`, decrement inventory, send confirmation email |
| `payment.failed` | Update order `paymentStatus` to `FAILED`, send failure notification |
| `refund.created` | Update order to `REFUNDED`, update `paymentStatus` |
| `order.paid` | Redundant with `payment.captured` — idempotently handled |

**Signature Verification:**

```typescript
// src/lib/payment/verifySignature.ts
import crypto from 'crypto'

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  )
}
```

**Idempotency**: Check if `razorpayPaymentId` already exists in DB before processing. Return 200 if duplicate.

---

## 13. Admin API

All admin routes require `session.user.role === 'ADMIN'` or `'SUPER_ADMIN'`. Return 403 otherwise.

### GET `/api/admin/stats`

Dashboard statistics.

```json
{
  "success": true,
  "data": {
    "totalRevenue": 45000000,
    "revenueChange": 12.5,       // % vs last period
    "totalOrders": 312,
    "ordersChange": 8.3,
    "avgOrderValue": 144230,
    "newCustomers": 89,
    "pendingOrders": 14,
    "lowStockProducts": 3
  }
}
```

### GET `/api/admin/stats/chart`

Revenue chart data.

| Param | Description |
|---|---|
| `period` | `7d`, `30d`, `90d`, `12m` |
| `metric` | `revenue`, `orders`, `customers` |

### GET `/api/admin/export/orders`

CSV export of orders. Admin only.

| Param | Description |
|---|---|
| `from` | ISO date string |
| `to` | ISO date string |
| `status` | Filter by order status |

**Response**: `Content-Type: text/csv` with `Content-Disposition: attachment`

---

## 14. B2B API

### POST `/api/b2b/inquiry`

Submit a bulk order inquiry (public — no auth required).

```json
// Request
{
  "companyName": "Grand Hyatt Mumbai",
  "contactName": "Priya Mehta",
  "email": "priya@grandhyatt.com",
  "phone": "9876543210",
  "requirements": "Room amenity sets — 500 units per month",
  "estimatedQty": 500,
  "targetBudget": "₹2,00,000 – ₹5,00,000"
}

// Response 201
{
  "success": true,
  "data": { "inquiryId": "...", "referenceNumber": "B2B-2024-001" }
}
```

---

## 15. Error Codes

| Code | HTTP | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request body failed Zod validation |
| `UNAUTHORIZED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Insufficient role |
| `PRODUCT_NOT_FOUND` | 404 | Product doesn't exist or inactive |
| `ORDER_NOT_FOUND` | 404 | Order not found |
| `COUPON_NOT_FOUND` | 404 | Coupon code doesn't exist |
| `COUPON_EXPIRED` | 422 | Coupon past expiry date |
| `COUPON_USAGE_LIMIT_REACHED` | 422 | Global usage exhausted |
| `COUPON_USER_LIMIT_REACHED` | 422 | Per-user limit reached |
| `COUPON_MIN_ORDER_NOT_MET` | 422 | Order below minimum threshold |
| `INSUFFICIENT_STOCK` | 422 | Not enough inventory |
| `PAYMENT_VERIFICATION_FAILED` | 422 | Signature mismatch |
| `REVIEW_ALREADY_EXISTS` | 409 | User already reviewed this product |
| `REVIEW_NO_PURCHASE` | 403 | No verified purchase for this product |
| `CART_ITEM_NOT_FOUND` | 404 | CartItem doesn't exist |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 16. Rate Limits

| Endpoint Group | Limit | Window |
|---|---|---|
| Search (`/api/search`) | 30 requests | 1 minute |
| Payment (`/api/payment/*`) | 10 requests | 1 minute |
| Auth (`/api/auth/*`) | 10 requests | 1 minute |
| Reviews (`POST /api/reviews`) | 5 requests | 1 hour |
| B2B Inquiry | 3 requests | 1 hour |
| All other endpoints | 100 requests | 1 minute |

Rate limiting implemented via Vercel's built-in edge middleware or `@upstash/ratelimit` with Redis.

Response when rate limited:
```json
// HTTP 429
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please wait before trying again.",
    "retryAfter": 45   // Seconds until limit resets
  }
}
```

Headers on rate-limited responses:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067245
Retry-After: 45
```

---

## 17. Validation Rules

All request bodies are validated with Zod before processing. Validation errors return:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": {
      "email": ["Invalid email format"],
      "phone": ["Must be a 10-digit Indian mobile number"]
    }
  }
}
```

Common Zod schemas for reuse:

```typescript
// src/lib/validation/common.ts
import { z } from 'zod'

export const indianPhone = z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid Indian mobile number')
export const indianPincode = z.string().regex(/^[1-9][0-9]{5}$/, 'Must be a valid Indian PIN code')
export const mongoId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format')
export const priceInPaise = z.number().int().positive('Price must be a positive integer')
export const slugString = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be lowercase kebab-case')
```
