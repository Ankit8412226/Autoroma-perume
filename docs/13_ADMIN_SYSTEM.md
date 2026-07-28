# 13_ADMIN_SYSTEM.md — Admin Panel Specification

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: Frontend Engineers, Backend Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Admin Architecture](#1-admin-architecture)
2. [Dashboard](#2-dashboard)
3. [Analytics](#3-analytics)
4. [Products Management](#4-products-management)
5. [Orders Management](#5-orders-management)
6. [Inventory Management](#6-inventory-management)
7. [Coupon Management](#7-coupon-management)
8. [Customer Management](#8-customer-management)
9. [Reviews Management](#9-reviews-management)
10. [Media Management](#10-media-management)
11. [Bulk Orders Management](#11-bulk-orders-management)
12. [SEO Management](#12-seo-management)
13. [Settings](#13-settings)
14. [Permissions](#14-permissions)

---

## 1. Admin Architecture

### Route Structure

```
/admin                → Dashboard
/admin/products        → Product list
/admin/products/new    → Create product
/admin/products/[id]   → Edit product
/admin/orders          → Order list
/admin/orders/[id]     → Order detail
/admin/bulk-orders     → B2B inquiry list
/admin/bulk-orders/[id]→ B2B inquiry detail
/admin/customers       → Customer list
/admin/collections     → Collection management
/admin/coupons         → Coupon list
/admin/reviews         → Review moderation
/admin/media           → Cloudinary media browser
/admin/analytics       → Revenue and traffic analytics
/admin/settings        → Application settings
```

### Admin Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ MAISON NOIR ADMIN                           [Admin Name]  [Logout]   │
├──────────────────────────────────────────────────────────────────────┤
│ │ Dashboard      │                                                   │
│ │ Analytics      │      [MAIN CONTENT AREA]                         │
│ │ Products       │                                                   │
│ │ Orders         │                                                   │
│ │ Bulk Orders    │                                                   │
│ │ Customers      │                                                   │
│ │ Collections    │                                                   │
│ │ Coupons        │                                                   │
│ │ Reviews        │                                                   │
│ │ Media          │                                                   │
│ │ Settings       │                                                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Design**: Dark theme, consistent with brand. Sidebar: `bg-bg-secondary`, content: `bg-bg-primary`.

---

## 2. Dashboard

**File**: `app/admin/page.tsx`

### KPI Cards (Top Row)

| Metric | Calculation | Display |
|---|---|---|
| Total Revenue | Sum of all `CONFIRMED`+ order totals (current month) | ₹X,XX,XXX |
| Revenue Change | % change vs previous month | +12.5% (green) |
| Total Orders | Count of confirmed orders (current month) | 312 |
| Avg Order Value | Total Revenue / Total Orders | ₹12,440 |
| New Customers | Users created (current month) | 89 |
| Pending Orders | Orders in PENDING or CONFIRMED status | 14 |

### Recent Orders Table

Last 10 orders: Order Number, Customer, Total, Status, Date.

### Low Stock Alert

Products where `stock <= lowStockThreshold`: Product Name, Variant, Stock, SKU.

### Quick Actions

- + New Product
- View Pending Orders
- Review Bulk Inquiries

---

## 3. Analytics

**File**: `app/admin/analytics/page.tsx`  
**Charts**: Recharts library

### Revenue Chart

```typescript
// Line chart — Revenue over time
// X-axis: Date (daily for 7/30d, weekly for 90d, monthly for 12m)
// Y-axis: Revenue in INR
// Series: Total Revenue, Net Revenue (after refunds)

<LineChart data={revenueData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#3D3A36" />
  <XAxis dataKey="date" stroke="#6B6560" />
  <YAxis stroke="#6B6560" tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
  <Tooltip formatter={(value: number) => formatCurrency(value)} />
  <Line type="monotone" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} dot={false} />
</LineChart>
```

### Orders by Status (Donut Chart)

Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded.

### Top Products (Bar Chart)

Top 10 products by revenue and units sold.

### Customer Acquisition (Line Chart)

New customers per day/week.

### Fragrance Family Distribution (Pie Chart)

Sales by fragrance family.

---

## 4. Products Management

### Product List

**File**: `app/admin/products/page.tsx`

- Sortable by: Name, Price, Stock, Created Date, Sales Count
- Filterable by: Status (Draft/Active/Archived), Collection, Stock (In/Out/Low)
- Search by: Name, SKU
- Bulk actions: Activate, Archive, Delete (soft delete)

### Product Form

**File**: `app/admin/products/new/page.tsx` and `app/admin/products/[id]/page.tsx`

#### Form Sections

**1. Basic Information**
- Name (required)
- Slug (auto-generated from name, editable)
- Collection (dropdown)
- Status (Draft → Active → Archived)
- Short Description (max 200 chars)

**2. Description**
- Rich text editor (Tiptap or React Quill)
- Supports: headings, bold, italic, lists, blockquotes
- Max 5000 characters

**3. Pricing**
- Price (₹ — converted to paise internally)
- Compare At Price (₹ — must be higher than price)

**4. Fragrance Properties**
- Fragrance Family (select)
- Gender (select)
- Sillage (select)
- Longevity (select)
- Seasons (multi-select checkboxes)
- Occasions (multi-select checkboxes)

**5. Fragrance Notes**
- Top Notes (tag input)
- Heart Notes (tag input)
- Base Notes (tag input)

**6. Variants (Volume)**
- Dynamic row: Volume (ml) | SKU | Price (₹) | Stock
- Minimum 1 variant required
- Max 5 variants

**7. Images**
- Cloudinary upload widget
- Drag to reorder (first = primary)
- Minimum 1 image, maximum 8

**8. SEO**
- Meta Title (auto-filled from name)
- Meta Description (auto-filled from short description)

**9. Settings**
- Is New (boolean)
- Is Featured (boolean)
- Is Active (boolean)

### Image Upload

```typescript
// Cloudinary upload in admin uses signed uploads
// 1. Admin clicks upload
// 2. Client requests signed upload URL from /api/upload
// 3. Server signs with Cloudinary credentials
// 4. Client uploads directly to Cloudinary
// 5. On success, Cloudinary URL saved to product.images

// Upload transformation preset: product_upload
// Transformations applied: c_limit,w_1200,q_auto,f_auto
// Folder: maison-noir/products/[productId]/
```

---

## 5. Orders Management

### Order List

**File**: `app/admin/orders/page.tsx`

- Columns: Order #, Customer, Items, Total, Payment Status, Status, Date
- Filters: Status, Payment Status, Date Range
- Search by: Order Number, Customer Email

### Order Detail

**File**: `app/admin/orders/[id]/page.tsx`

**Sections:**

1. **Order Header**: Order number, date, customer info
2. **Status Timeline**: Visual progress (Pending → Confirmed → Processing → Shipped → Delivered)
3. **Order Items**: Product snapshot, quantity, price
4. **Payment Info**: Razorpay IDs, payment status, amount paid
5. **Shipping Info**: Address, tracking number input, shipping provider
6. **Admin Actions**: Update status, add tracking, add admin note, initiate refund

### Status Update

```typescript
// Admin updates order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
): Promise<ActionResult<void>> {
  const session = await auth()
  requireAdmin(session)

  const before = await prisma.order.findUnique({ where: { id: orderId } })
  
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      trackingNumber,
      shippedAt: status === 'SHIPPED' ? new Date() : undefined,
      deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
    }
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session!.user.id,
      action: 'order.status_change',
      entityType: 'order',
      entityId: orderId,
      before: { status: before?.status },
      after: { status },
    }
  })

  // Email customer on status change
  if (status === 'SHIPPED') {
    // Send shipping notification email with tracking
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  return { success: true, data: undefined }
}
```

---

## 6. Inventory Management

- Low stock alerts (shown in dashboard and product list)
- Per-variant stock editing (inline edit in product detail)
- Bulk stock import via CSV: Columns: `sku, stock_change` (positive = restock, negative = adjustment)

---

## 7. Coupon Management

### Coupon List

Columns: Code, Type, Value, Usage, Expiry, Active.

### Coupon Form

```typescript
// Fields:
{
  code:           string  // Auto-uppercase on save
  type:           'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'
  value:          number  // % or ₹ amount
  minOrderValue?: number  // ₹
  maxDiscount?:   number  // ₹ (only for PERCENTAGE)
  usageLimit?:    number  // null = unlimited
  perUserLimit:   number  // default 1
  startsAt:       Date
  expiresAt?:     Date    // null = never expires
  isActive:       boolean
}
```

### Business Rules

- Coupon codes are always stored uppercase
- `PERCENTAGE` coupons must have value 1–100
- `FIXED` coupons must have value > 0
- Cannot delete a coupon that has been used — only deactivate

---

## 8. Customer Management

### Customer List

**SUPER_ADMIN only**

Columns: Name, Email, Phone, Role, Orders, Total Spent, Joined Date, Status.

Filters: Role, Date Range, Order Count (0 orders, 1-5, 5+).

### Customer Actions (SUPER_ADMIN only)

- View order history
- Change role (CUSTOMER → ADMIN)
- Deactivate account (soft ban)
- Revoke all sessions

---

## 9. Reviews Management

### Review Queue

Default view: All `PENDING` reviews.

Columns: Product, Customer, Rating, Excerpt, Date, Is Verified Purchase, Actions.

**Actions:**
- **Approve**: Status → APPROVED; product stats recalculated
- **Reject**: Status → REJECTED; reason stored in admin notes
- **Delete**: Hard delete (SUPER_ADMIN only)

---

## 10. Media Management

### Cloudinary Browser

- Lists all media under `maison-noir/` folder in Cloudinary
- Filter by: folder (products, hero, collections)
- Actions: Copy URL, Delete, View metadata
- Upload: Direct Cloudinary widget

---

## 11. Bulk Orders Management

### Inquiry List

Columns: Reference #, Company, Contact, Quantity, Status, Created, Last Updated.

Filters: Status.

### Inquiry Detail

- All inquiry fields displayed
- Status selector (dropdown)
- Admin notes (internal)
- Email: "Send Quote" button — opens email compose modal with template
- Timeline of status changes

---

## 12. SEO Management

- Edit product meta titles and descriptions (per-product override)
- Edit collection meta titles and descriptions
- Preview how a page will appear in Google search results (inline preview)
- Regenerate sitemap on demand (`revalidatePath('/sitemap.xml')`)

---

## 13. Settings

**SUPER_ADMIN only**

### General Settings

- Site name, support email, phone
- Free shipping threshold (₹)
- GST rate (informational — currently hardcoded at 18%)

### Email Settings

- Resend API key (masked)
- From email address
- Reply-to email

### Notification Settings

- Low stock email threshold
- New B2B inquiry email recipients
- Daily sales summary email

---

## 14. Permissions

| Feature | ADMIN | SUPER_ADMIN |
|---|---|---|
| Dashboard | ✅ | ✅ |
| Analytics | ✅ | ✅ |
| Products (CRUD) | ✅ | ✅ |
| Orders (view + status) | ✅ | ✅ |
| Bulk Orders | ✅ | ✅ |
| Coupons (CRUD) | ✅ | ✅ |
| Reviews (approve/reject) | ✅ | ✅ |
| Media | ✅ | ✅ |
| Customers (view) | ✅ | ✅ |
| Customers (role change) | ❌ | ✅ |
| Customers (deactivate) | ❌ | ✅ |
| Audit Logs | ❌ | ✅ |
| Settings | ❌ | ✅ |
| Refund initiation | ✅ | ✅ |
| Delete reviews | ❌ | ✅ |
| Delete products | ❌ | ✅ (soft) |
