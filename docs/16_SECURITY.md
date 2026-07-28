# 16_SECURITY.md — Security Architecture

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: Backend Engineers, Security Engineers, DevOps  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Authentication Security](#1-authentication-security)
2. [Authorization Security](#2-authorization-security)
3. [Input Validation](#3-input-validation)
4. [Rate Limiting](#4-rate-limiting)
5. [CSRF Protection](#5-csrf-protection)
6. [XSS Prevention](#6-xss-prevention)
7. [Injection Prevention](#7-injection-prevention)
8. [MongoDB Security](#8-mongodb-security)
9. [Secrets & Environment Variables](#9-secrets--environment-variables)
10. [Security Headers](#10-security-headers)
11. [Audit Logs](#11-audit-logs)
12. [Dependency Security](#12-dependency-security)

---

## 1. Authentication Security

### Password Policy

```typescript
// Enforced by Zod on registration + password reset
const passwordSchema = z.string()
  .min(8, 'Minimum 8 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^a-zA-Z0-9]/, 'At least one special character')
  .max(128, 'Maximum 128 characters')
```

### Password Hashing

```typescript
import { hash, compare } from 'bcryptjs'

// On registration
const passwordHash = await hash(plainPassword, 12)  // Cost factor 12

// On login
const isValid = await compare(plainPassword, passwordHash)

// Never:
// - MD5
// - SHA-256 (unsalted)
// - bcrypt cost factor < 10
```

### Token Security

```typescript
// Email verification and password reset tokens
import { randomBytes } from 'crypto'

// Generate 32-byte (256-bit) cryptographically secure random token
const token = randomBytes(32).toString('hex')

// Token stored with:
// - Short TTL (24h for email verification, 1h for password reset)
// - Single use (deleted after consumption)
// - Never sent in URL query params in GET requests (POST only for reset)
```

### Session Security

- Sessions stored in MongoDB with `httpOnly`, `secure`, `sameSite: 'lax'` cookies
- Cookie name: `__Secure-next-auth.session-token` in production (prefixed with `__Secure-`)
- Sessions expire after 30 days of inactivity
- Logout deletes session from DB (not just clearing cookie)
- Re-authentication required for sensitive actions (password change, role change)

---

## 2. Authorization Security

### Defense in Depth

Authorization is enforced at **three layers**:

1. **Middleware** (`middleware.ts`) — route-level guard
2. **Server Action / Route Handler** — per-action guard
3. **Database query** — userId scoped queries

```typescript
// Layer 1: Middleware
if (pathname.startsWith('/admin')) {
  if (!session || !isAdmin(session)) redirect('/login')
}

// Layer 2: Server Action
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth()
  requireAdmin(session)  // throws if not admin
  ...
}

// Layer 3: Database query — always scope by userId for customer data
const order = await prisma.order.findFirst({
  where: {
    id: orderId,
    userId: session.user.id,  // Prevent IDOR — never fetch by ID alone
  }
})
```

### IDOR Prevention

**Never** query by `id` alone for user-owned resources:

```typescript
// ✅ CORRECT — Scoped to user
const order = await prisma.order.findFirst({
  where: { id: orderId, userId: session.user.id }
})

// ❌ DANGEROUS — Any authenticated user can access any order
const order = await prisma.order.findUnique({ where: { id: orderId } })
```

---

## 3. Input Validation

**All** external input is validated with Zod before processing. No exceptions.

```typescript
// Validation in API Route Handler
export async function POST(req: NextRequest) {
  const body = await req.json()
  const validated = createOrderSchema.safeParse(body)
  if (!validated.success) {
    return NextResponse.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', details: validated.error.flatten() }
    }, { status: 400 })
  }
  // Use only validated.data — never use body directly
}
```

### Zod Strict Schemas

```typescript
// Use .strict() to prevent extra fields
const productSchema = z.object({
  name: z.string().min(2).max(200),
  price: z.number().int().positive(),
}).strict()  // Rejects any keys not in schema

// For unknown shapes, validate explicitly
const webhook = z.object({
  event: z.string(),
  payload: z.record(z.unknown()),  // Accept but don't trust nested data
})
```

---

## 4. Rate Limiting

### Implementation

```typescript
// middleware.ts — using @upstash/ratelimit with Redis
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),  // 100 req/min default
})

// Stricter limits per endpoint
const authRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),   // 10 req/min for auth
})
```

### Limits by Endpoint

| Endpoint Group | Limit | Window | Identifier |
|---|---|---|---|
| `/api/auth/*` | 10 | 1 min | IP |
| `/api/payment/*` | 10 | 1 min | IP + userId |
| `/api/search` | 30 | 1 min | IP |
| `POST /api/reviews` | 5 | 1 hour | userId |
| `POST /api/b2b/*` | 3 | 1 hour | IP |
| Default | 100 | 1 min | IP |

---

## 5. CSRF Protection

### Server Actions

Server Actions are inherently CSRF-protected by Next.js:
- They require the `Next-Action` header
- They verify the `Origin` header matches the host
- No additional CSRF token needed for Server Actions

### API Route Handlers

API routes that modify state:
1. Check `Origin` header matches allowed origins
2. Auth.js session cookie uses `sameSite: lax` — prevents cross-site form submissions

```typescript
// Middleware — CSRF origin check for non-GET API routes
if (req.method !== 'GET' && pathname.startsWith('/api/')) {
  const origin = req.headers.get('origin')
  const allowedOrigins = [
    process.env.NEXTAUTH_URL!,
    'https://maisonnoir.in',
    'https://staging.maisonnoir.in',
  ]
  
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
}
```

---

## 6. XSS Prevention

### React's Built-in Protection

React escapes all string values rendered in JSX — XSS via user content is prevented by default.

### `dangerouslySetInnerHTML` Rules

Only permitted for:
1. JSON-LD structured data (controlled, no user input)
2. Trusted rich text from admin (sanitized before storage)

```typescript
// ✅ Allowed — JSON-LD (fully controlled content)
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>

// ✅ Allowed — Admin rich text (must be sanitized before storage)
import DOMPurify from 'isomorphic-dompurify'

// Before saving to DB
const sanitizedHtml = DOMPurify.sanitize(richTextHtml, {
  ALLOWED_TAGS: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'br'],
  ALLOWED_ATTR: [],  // No attributes allowed
})

// ❌ Never — User-submitted content without sanitization
<div dangerouslySetInnerHTML={{ __html: review.body }} />
```

### Content Security Policy

```typescript
// next.config.ts — CSP headers
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://res.cloudinary.com https://lh3.googleusercontent.com;
  connect-src 'self' https://api.razorpay.com https://www.google-analytics.com;
  font-src 'self';
  frame-src https://api.razorpay.com;
  object-src 'none';
  base-uri 'self';
`
```

---

## 7. Injection Prevention

### MongoDB Injection

Prisma uses parameterized queries — no raw string interpolation in queries:

```typescript
// ✅ SAFE — Prisma parameterized
const product = await prisma.product.findFirst({
  where: { slug: userInput }  // Prisma handles escaping
})

// ✅ SAFE — Prisma aggregation
const results = await prisma.product.aggregateRaw({
  pipeline: [{ $match: { slug: userInput } }]  // Prisma parameterizes
})

// ❌ DANGEROUS — Never use raw string interpolation
await db.collection('products').find({ $where: `this.slug == '${userInput}'` })
```

### Regex Injection (ReDoS)

```typescript
// ✅ SAFE — Fixed patterns
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// ❌ DANGEROUS — User-controlled regex
const regex = new RegExp(userInput)  // Never allow this
```

---

## 8. MongoDB Security

### Atlas Configuration

1. **Network Access**: Allow only Vercel's IP ranges (or use Atlas Private Link)
2. **Database User**: Separate user per environment (dev, staging, production)
3. **Minimal permissions**: Production user has `readWrite` only on `maisonnoir` database — no `dbAdmin`
4. **Encryption at rest**: Atlas encrypts data at rest by default (AES-256)
5. **Encryption in transit**: TLS 1.2+ enforced — no unencrypted connections
6. **Audit logging**: Atlas auditing enabled on production for admin actions

### Connection Security

```bash
# DATABASE_URL must use TLS
mongodb+srv://username:password@cluster.mongodb.net/maisonnoir?retryWrites=true&w=majority&tls=true
```

---

## 9. Secrets & Environment Variables

### Classification

| Tier | Examples | Storage | Access |
|---|---|---|---|
| **Public** | `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `NEXT_PUBLIC_GA_ID` | `.env` committed | Client + Server |
| **Private** | `RAZORPAY_KEY_SECRET`, `DATABASE_URL`, `RESEND_API_KEY` | `.env.local` / Vercel secrets | Server only |
| **Ultra-sensitive** | `NEXTAUTH_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Vercel secrets | Server only |

### Rules

1. **Never** commit `.env.local` to git (`.gitignore` enforced)
2. **Never** log environment variable values (even in dev)
3. **Never** expose server-side env vars in client components
4. All server-only secrets guarded with `import 'server-only'`
5. `NEXTAUTH_SECRET` must be a 64-char random string: `openssl rand -base64 48`

```typescript
// Guard at startup — fails loudly if misconfigured
const requiredServerEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const

// In src/lib/env.ts
for (const key of requiredServerEnvVars) {
  if (!process.env[key]) {
    throw new Error(`[env] Missing required server environment variable: ${key}`)
  }
}
```

---

## 10. Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

---

## 11. Audit Logs

All admin actions are logged to the `auditLogs` collection.

### Events Logged

| Event | Trigger |
|---|---|
| `auth.signin` | Any successful login |
| `auth.signout` | Any logout |
| `auth.sessions_revoked` | Admin revokes user sessions |
| `product.create` | Admin creates product |
| `product.update` | Admin updates product |
| `product.delete` | Admin deletes product |
| `order.status_change` | Admin changes order status |
| `coupon.create` | Admin creates coupon |
| `coupon.deactivate` | Admin deactivates coupon |
| `review.approve` | Admin approves review |
| `review.reject` | Admin rejects review |
| `user.role_change` | Super admin changes user role |
| `user.deactivate` | Super admin deactivates user |

---

## 12. Dependency Security

```bash
# Run weekly in CI
pnpm audit

# Auto-fix non-breaking updates
pnpm audit --fix

# Check for known vulnerabilities
pnpm dlx better-npm-audit audit
```

### Dependency Rules

1. No unmaintained packages (last update > 2 years old)
2. No packages with known critical CVEs without a fix
3. Lock file (`pnpm-lock.yaml`) must be committed and verified in CI
4. `pnpm audit` runs in CI pipeline — fails build on high/critical vulnerabilities
5. Dependabot configured for automated security PRs
