# 08_DATABASE.md — Database Schema & Architecture

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: Backend Engineers, Database Administrators  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Database Technology](#1-database-technology)
2. [Collections Overview](#2-collections-overview)
3. [ER Diagram](#3-er-diagram)
4. [Prisma Schema](#4-prisma-schema)
5. [Collection Specifications](#5-collection-specifications)
6. [Indexes](#6-indexes)
7. [Validation Rules](#7-validation-rules)
8. [Relations](#8-relations)
9. [Future Collections](#9-future-collections)
10. [Migration Strategy](#10-migration-strategy)

---

## 1. Database Technology

| Layer | Technology | Role |
|---|---|---|
| **Database** | MongoDB Atlas (M10+ cluster) | Primary data store |
| **ORM** | Prisma (MongoDB provider) | Schema management, type-safe queries |
| **Search** | MongoDB Atlas Search | Full-text product search |
| **Sessions** | MongoDB (Auth.js adapter) | Session storage |
| **Backup** | Atlas automated backups | Daily snapshots, 7-day retention |

### Connection

```typescript
// src/lib/db/prisma.ts
import 'server-only'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 2. Collections Overview

| Collection | Purpose | Est. Documents (1 year) |
|---|---|---|
| `users` | Customer and admin accounts | 10,000 |
| `accounts` | OAuth provider accounts (Auth.js) | 10,000 |
| `sessions` | Auth.js server sessions | 50,000 |
| `verificationTokens` | Email verification, password reset | 5,000 |
| `products` | Perfume product catalog | 200 |
| `collections` | Product groupings/series | 20 |
| `orders` | Customer purchase orders | 50,000 |
| `orderItems` | Individual items within orders | 150,000 |
| `cartItems` | Server-side cart persistence | 20,000 |
| `wishlists` | User saved products | 30,000 |
| `reviews` | Product reviews and ratings | 100,000 |
| `coupons` | Discount codes | 500 |
| `addresses` | Saved shipping addresses | 25,000 |
| `bulkOrders` | B2B inquiry requests | 1,000 |
| `newsletters` | Email subscriber list | 20,000 |
| `auditLogs` | Admin action logs | 200,000 |

---

## 3. ER Diagram

```
┌──────────────┐        ┌──────────────────┐
│    users     │──────< │    addresses     │
│              │        └──────────────────┘
│              │──────< │    orders        │──────< │ orderItems │
│              │        │                  │                      │
│              │──────< │    wishlists     │                      │
│              │                                                   │
│              │──────< │    reviews       │<──── │ products │────<│ orderItems│
│              │        └──────────────────┘      │          │
│              │──────< │    bulkOrders    │       │          │──── │ collections│
└──────────────┘        └──────────────────┘       └──────────┘
        │
        └──────< │ cartItems │<──── products
        
┌──────────────┐
│   coupons    │<──── orders (applied coupon)
└──────────────┘
```

---

## 4. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// AUTH MODELS (Auth.js MongoDB Adapter)
// ─────────────────────────────────────────────

model User {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  name           String?
  email          String    @unique
  emailVerified  DateTime?
  image          String?
  passwordHash   String?   // null for OAuth users
  role           UserRole  @default(CUSTOMER)
  phone          String?
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  accounts       Account[]
  sessions       Session[]
  orders         Order[]
  reviews        Review[]
  wishlists      Wishlist[]
  addresses      Address[]
  bulkOrders     BulkOrder[]
  cartItems      CartItem[]

  @@map("users")
}

model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.String
  access_token      String? @db.String
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.String
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationTokens")
}

// ─────────────────────────────────────────────
// CATALOG MODELS
// ─────────────────────────────────────────────

enum UserRole {
  CUSTOMER
  ADMIN
  SUPER_ADMIN
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

model Collection {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  slug        String    @unique
  description String
  imageUrl    String
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  products    Product[]

  @@map("collections")
}

enum ProductType {
  VENT_CLIP         // Attaches to AC vent
  HANGING           // Rearview mirror hanging card/bottle
  DASHBOARD_GEL     // Gel jar for dashboard
  SPRAY             // Spray bottle (interior mist)
  REED_DIFFUSER     // Car reed diffuser
  SACHET            // Fabric/paper sachet
}

model Product {
  id               String        @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  slug             String        @unique
  description      String        // Rich text (HTML)
  shortDescription String
  collectionId     String        @db.ObjectId
  status           ProductStatus @default(DRAFT)
  productType      ProductType   // e.g. VENT_CLIP, SPRAY, etc.

  // Pricing (in paise — 1 INR = 100 paise)
  price            Int           // e.g., 39900 = ₹399
  compareAtPrice   Int?          // Original price for sale display

  // Inventory
  sku              String        @unique
  stock            Int           @default(0)
  lowStockThreshold Int          @default(10)

  // Media
  images           String[]      // Cloudinary URLs, first is primary

  // Fragrance Properties
  scentFamily      String        // Fresh, Woody, Citrus, Floral, Musky, Aquatic, Oriental, Vanilla
  intensity        String        // Light, Moderate, Strong
  longevity        String        // Short (1-2 weeks), Medium (2-4 weeks), Long (1-3 months), Very Long (3+ months)
  season           String[]      // Spring, Summer, Monsoon, Winter, All-Season
  occasion         String[]      // Daily Commute, Road Trip, Office, Sports

  // Scent Notes (same pyramid concept applied to car fragrance)
  topNotes         String[]      // Opening burst: e.g., ["Citrus", "Bergamot"]
  heartNotes       String[]      // Core character: e.g., ["Cedar", "Sandalwood"]
  baseNotes        String[]      // Lingering: e.g., ["Musk", "Vanilla"]

  // Car-specific
  compatible       String[]      // ["All cars"] or specific types ["SUV", "Sedan"]
  mountType        String[]      // ["AC Vent", "Dashboard", "Rearview Mirror"] — from ProductType

  // Variants (scent variants, not volume variants primarily)
  variants         ProductVariant[]

  // SEO
  metaTitle        String?
  metaDescription  String?

  // Stats (denormalized for performance)
  averageRating    Float         @default(0)
  reviewCount      Int           @default(0)
  salesCount       Int           @default(0)

  isNew            Boolean       @default(false)
  isFeatured       Boolean       @default(false)
  isActive         Boolean       @default(true)

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  // Relations
  collection       Collection    @relation(fields: [collectionId], references: [id])
  reviews          Review[]
  orderItems       OrderItem[]
  wishlists        Wishlist[]
  cartItems        CartItem[]

  @@map("products")
}

type ProductVariant {
  id       String  // UUID
  label    String  // e.g., "Ocean Breeze", "Luxury Oud", "Fresh Lemon" OR size "50ml"
  sku      String
  price    Int     // override price in paise
  stock    Int
}

// ─────────────────────────────────────────────
// COMMERCE MODELS
// ─────────────────────────────────────────────

enum OrderStatus {
  PENDING         // Created, awaiting payment
  CONFIRMED       // Payment confirmed
  PROCESSING      // Being prepared
  SHIPPED         // Dispatched
  DELIVERED       // Delivered to customer
  CANCELLED       // Cancelled before dispatch
  REFUNDED        // Refund processed
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

model Order {
  id              String        @id @default(auto()) @map("_id") @db.ObjectId
  orderNumber     String        @unique  // e.g., "MN-2024-00001"
  userId          String        @db.ObjectId
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)

  // Pricing (in paise)
  subtotal        Int
  discount        Int           @default(0)
  shippingCharge  Int           @default(0)
  tax             Int           @default(0)  // GST
  total           Int

  // Applied coupon
  couponId        String?       @db.ObjectId
  couponCode      String?
  couponDiscount  Int           @default(0)

  // Payment
  razorpayOrderId   String?     @unique
  razorpayPaymentId String?
  razorpaySignature String?

  // Shipping
  shippingAddress   ShippingAddress  // Embedded document
  trackingNumber    String?
  shippingProvider  String?
  estimatedDelivery DateTime?

  // Notes
  customerNote  String?
  adminNote     String?

  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  paidAt     DateTime?
  shippedAt  DateTime?
  deliveredAt DateTime?

  // Relations
  user       User        @relation(fields: [userId], references: [id])
  items      OrderItem[]
  coupon     Coupon?     @relation(fields: [couponId], references: [id])

  @@map("orders")
}

type ShippingAddress {
  fullName  String
  phone     String
  address1  String
  address2  String?
  city      String
  state     String
  pincode   String
  country   String @default("India")
}

model OrderItem {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  orderId     String   @db.ObjectId
  productId   String   @db.ObjectId
  variantId   String?  // UUID of ProductVariant
  
  // Snapshot at time of purchase (immutable)
  productName  String
  productImage String
  volume       Int     // ml
  price        Int     // paise, price at time of purchase
  quantity     Int
  total        Int     // price × quantity

  order    Order   @relation(fields: [orderId], references: [id])
  product  Product @relation(fields: [productId], references: [id])

  @@map("orderItems")
}

model CartItem {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  userId     String   @db.ObjectId
  productId  String   @db.ObjectId
  variantId  String?
  quantity   Int      @default(1)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId, variantId])
  @@map("cartItems")
}

model Wishlist {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  productId String   @db.ObjectId
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@map("wishlists")
}

// ─────────────────────────────────────────────
// REVIEW MODEL
// ─────────────────────────────────────────────

enum ReviewStatus {
  PENDING    // Awaiting moderation
  APPROVED
  REJECTED
}

model Review {
  id        String       @id @default(auto()) @map("_id") @db.ObjectId
  userId    String       @db.ObjectId
  productId String       @db.ObjectId
  rating    Int          // 1–5
  title     String
  body      String
  status    ReviewStatus @default(PENDING)
  isVerifiedPurchase Boolean @default(false)
  helpfulCount Int      @default(0)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])  // One review per user per product
  @@map("reviews")
}

// ─────────────────────────────────────────────
// COUPON MODEL
// ─────────────────────────────────────────────

enum CouponType {
  PERCENTAGE   // e.g., 10% off
  FIXED        // e.g., ₹500 off
  FREE_SHIPPING
}

model Coupon {
  id              String      @id @default(auto()) @map("_id") @db.ObjectId
  code            String      @unique  // e.g., "NOIR20"
  type            CouponType
  value           Int         // Percentage (0-100) or fixed amount in paise
  minOrderValue   Int?        // Minimum order in paise to apply
  maxDiscount     Int?        // Cap on percentage discounts (in paise)
  usageLimit      Int?        // Total uses allowed; null = unlimited
  usageCount      Int         @default(0)
  perUserLimit    Int         @default(1)
  isActive        Boolean     @default(true)
  startsAt        DateTime    @default(now())
  expiresAt       DateTime?
  createdAt       DateTime    @default(now())

  orders          Order[]

  @@map("coupons")
}

// ─────────────────────────────────────────────
// ADDRESS MODEL
// ─────────────────────────────────────────────

model Address {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  label     String?  // "Home", "Office"
  fullName  String
  phone     String
  address1  String
  address2  String?
  city      String
  state     String
  pincode   String
  country   String   @default("India")
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("addresses")
}

// ─────────────────────────────────────────────
// B2B MODEL
// ─────────────────────────────────────────────

enum BulkOrderStatus {
  NEW
  REVIEWING
  QUOTE_SENT
  NEGOTIATING
  CONFIRMED
  REJECTED
}

model BulkOrder {
  id              String          @id @default(auto()) @map("_id") @db.ObjectId
  userId          String?         @db.ObjectId  // null for guests
  companyName     String
  contactName     String
  email           String
  phone           String
  requirements    String          // Free text description
  estimatedQty    Int
  targetBudget    String?         // Text range like "₹50,000 – ₹1,00,000"
  status          BulkOrderStatus @default(NEW)
  adminNotes      String?
  quotedPrice     Int?            // In paise
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  user User? @relation(fields: [userId], references: [id])

  @@map("bulkOrders")
}

// ─────────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────────

model Newsletter {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  email       String   @unique
  isActive    Boolean  @default(true)
  subscribedAt DateTime @default(now())
  source      String?  // "homepage", "checkout", "product_page"

  @@map("newsletters")
}

// ─────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────

model AuditLog {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  userId     String   @db.ObjectId  // Admin who performed action
  action     String   // e.g., "product.update", "order.status_change"
  entityType String   // "product", "order", "coupon"
  entityId   String   @db.ObjectId
  before     Json?    // Previous state
  after      Json?    // New state
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  @@map("auditLogs")
}
```

---

## 5. Collection Specifications

### products — Key Business Rules

- `price` and `compareAtPrice` are always stored in **paise** (integer arithmetic — no floating point)
- `images[0]` is always the primary display image
- `stock` is the sum of all `variants[].stock` — do not allow negative
- `averageRating` and `reviewCount` are denormalized — recalculated by background job or via aggregation on review submission
- `slug` must match regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`

### orders — Key Business Rules

- `orderNumber` format: `MN-YYYY-NNNNN` (e.g., `MN-2024-00001`) — sequential, never reused
- `total` = `subtotal` − `couponDiscount` + `shippingCharge` + `tax` — verified server-side before payment creation
- Order items snapshot product data at time of purchase — never reference live product data
- `razorpayOrderId` must be unique and indexed — used for idempotency on webhook

---

## 6. Indexes

```typescript
// Defined via Prisma @@index and MongoDB Atlas UI

// products
@@index([slug])                          // Product page lookups
@@index([collectionId, status, isActive]) // Collection filter
@@index([status, isFeatured])            // Featured products
@@index([fragranceFamily])               // Fragrance family filter
@@index([averageRating])                 // Sort by rating
@@index([price])                         // Sort/filter by price
@@index([salesCount])                    // Best sellers

// orders
@@index([userId, createdAt])             // User order history
@@index([orderNumber])                   // Order lookup
@@index([razorpayOrderId])               // Webhook idempotency
@@index([status])                        // Admin order management
@@index([createdAt])                     // Date range queries

// reviews
@@index([productId, status])             // Product reviews list
@@index([userId])                        // User's reviews

// coupons
@@index([code])                          // Coupon validation
@@index([isActive, expiresAt])           // Active coupon check

// newsletters
@@index([email])                         // Duplicate check

// auditLogs
@@index([entityType, entityId])          // Entity history
@@index([userId, createdAt])             // Admin activity
@@index([createdAt])                     // Time-range queries
```

---

## 7. Validation Rules

All validation enforced at two levels: Zod (API boundary) + Prisma schema constraints.

| Field | Rule |
|---|---|
| `user.email` | Valid email format; unique |
| `user.phone` | Indian format: `/^[6-9]\d{9}$/` |
| `product.price` | Integer > 0; in paise |
| `product.slug` | Lowercase kebab-case; unique |
| `product.stock` | Integer ≥ 0; never negative |
| `order.total` | Must equal subtotal − discount + shipping + tax |
| `review.rating` | Integer 1–5 inclusive |
| `coupon.value` | If PERCENTAGE: 1–100; if FIXED: > 0 |
| `address.pincode` | Indian PIN: `/^[1-9][0-9]{5}$/` |
| `bulkOrder.estimatedQty` | Integer ≥ 1 |

---

## 8. Relations

| Relation | Type | Cascade |
|---|---|---|
| User → Orders | One-to-Many | Restrict delete (preserve order history) |
| User → Wishlist | One-to-Many | Cascade delete |
| User → CartItems | One-to-Many | Cascade delete |
| User → Addresses | One-to-Many | Cascade delete |
| User → Reviews | One-to-Many | Restrict (preserve review integrity) |
| Product → OrderItems | One-to-Many | Restrict |
| Product → Reviews | One-to-Many | Restrict |
| Collection → Products | One-to-Many | Restrict (must move products first) |
| Order → OrderItems | One-to-Many | Cascade delete |
| Order → Coupon | Many-to-One | Set null on coupon delete |

---

## 9. Future Collections

| Collection | Purpose | When |
|---|---|---|
| `giftCards` | Gift card codes with balance | Phase 2 |
| `loyaltyAccounts` | Points earning/burning per user | Phase 2 |
| `subscriptions` | Monthly fragrance subscriptions | Phase 3 |
| `affiliates` | Referral program tracking | Phase 3 |
| `notifications` | In-app and push notifications | Phase 2 |
| `inventoryLogs` | Stock movement history | Phase 2 |

---

## 10. Migration Strategy

### Schema Changes

Prisma with MongoDB does **not** run SQL migrations — schema changes are applied via `prisma db push` in development and `prisma generate` + controlled rollout in production.

**Process:**

1. Modify `schema.prisma`
2. Run `pnpm prisma generate` to update Prisma Client types
3. Run `pnpm prisma db push --preview-feature` in dev to sync schema
4. For production: apply via CI/CD pipeline after staging verification
5. Document change in `prisma/migrations/CHANGELOG.md`

### Data Migrations

For data transformations (e.g., backfilling a new field):

```typescript
// prisma/migrations/scripts/backfill-order-numbers.ts
import { prisma } from '../../src/lib/db/prisma'

async function run() {
  const orders = await prisma.order.findMany({ where: { orderNumber: null } })
  
  for (let i = 0; i < orders.length; i++) {
    const number = `MN-2024-${String(i + 1).padStart(5, '0')}`
    await prisma.order.update({ where: { id: orders[i].id }, data: { orderNumber: number } })
  }
  
  console.log(`Backfilled ${orders.length} orders`)
}

run().catch(console.error).finally(() => prisma.$disconnect())
```

Run with: `pnpm tsx prisma/migrations/scripts/backfill-order-numbers.ts`
