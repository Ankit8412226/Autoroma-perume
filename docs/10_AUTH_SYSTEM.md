# 10_AUTH_SYSTEM.md — Authentication & Authorization

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: Backend Engineers, Security Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Technology](#1-technology)
2. [Auth Configuration](#2-auth-configuration)
3. [Registration Flow](#3-registration-flow)
4. [Login Flow](#4-login-flow)
5. [Forgot Password Flow](#5-forgot-password-flow)
6. [Session Management](#6-session-management)
7. [Roles & Permissions](#7-roles--permissions)
8. [Middleware](#8-middleware)
9. [Protected Routes](#9-protected-routes)
10. [Guest Experience](#10-guest-experience)

---

## 1. Technology

| Concern | Technology |
|---|---|
| Auth framework | Auth.js v5 (NextAuth) |
| Session strategy | Database sessions (MongoDB adapter) |
| Password hashing | bcryptjs (cost factor 12) |
| Email verification | Custom token (stored in `verificationTokens`) |
| Password reset | Custom time-limited token (1 hour TTL) |
| OAuth providers | Google (phase 2 — not in phase 1) |

---

## 2. Auth Configuration

```typescript
// src/lib/auth/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import { compare } from 'bcryptjs'
import { loginSchema } from '@/features/auth/schemas/login.schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  
  providers: [
    Credentials({
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null

        const { email, password } = validated.data

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            isActive: true,
            emailVerified: true,
          }
        })

        if (!user || !user.passwordHash) return null
        if (!user.isActive) return null  // Banned accounts
        if (!user.emailVerified) return null  // Unverified email

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],

  callbacks: {
    // Persist role in session
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as any).role
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',  // Errors redirect to login with ?error=
  },

  events: {
    // Audit log on sign-in
    async signIn({ user }) {
      await prisma.auditLog.create({
        data: {
          userId: user.id!,
          action: 'auth.signin',
          entityType: 'user',
          entityId: user.id!,
        }
      })
    }
  }
})
```

### Session Type Augmentation

```typescript
// src/types/next-auth.d.ts
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      role: UserRole
    }
  }
  
  interface User {
    role: UserRole
  }
}
```

---

## 3. Registration Flow

```
User fills RegisterForm (React Hook Form + Zod)
    │
    ▼
Server Action: register()
    │
    ├─► Zod validates input
    │
    ├─► Check email uniqueness (prisma.user.findUnique)
    │       └─► If exists: return error "An account with this email already exists"
    │
    ├─► Hash password: bcrypt.hash(password, 12)
    │
    ├─► Create user: prisma.user.create({ role: 'CUSTOMER', isActive: true })
    │
    ├─► Generate email verification token (crypto.randomBytes(32))
    │
    ├─► Store token: prisma.verificationToken.create
    │       └─► expires: new Date(Date.now() + 24 * 60 * 60 * 1000) — 24 hours
    │
    ├─► Send verification email via Resend
    │       └─► Link: /verify-email?token=[token]
    │
    └─► Return success — "Check your email to verify your account"
```

### Registration Validation Schema

```typescript
// src/features/auth/schemas/register.schema.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
```

---

## 4. Login Flow

```
User fills LoginForm
    │
    ▼
Client calls signIn('credentials', { email, password, redirect: false })
    │
    ├─► Auth.js authorize() runs (see auth.ts)
    │       ├─► Validate with Zod
    │       ├─► Find user by email
    │       ├─► Check isActive
    │       ├─► Check emailVerified
    │       ├─► Compare password with bcrypt
    │       └─► Return user object or null
    │
    ├─► On null: Auth.js returns error
    │       └─► Client shows "Invalid email or password" (no differentiation for security)
    │
    ├─► On success: session document created in MongoDB
    │
    ├─► If user is ADMIN/SUPER_ADMIN → redirect to /admin
    └─► If user is CUSTOMER → redirect to account page or original destination
```

### Login Brute Force Protection

- 5 failed attempts per IP per 15 minutes triggers temporary lock (rate limit middleware)
- Lock duration: 15 minutes
- Implementation: Vercel Edge Middleware with `@upstash/ratelimit`

---

## 5. Forgot Password Flow

```
User submits email on /forgot-password
    │
    ▼
Server Action: requestPasswordReset()
    │
    ├─► Find user by email
    │       └─► Always return "If this email exists, you'll receive a reset link"
    │           (Never confirm email existence — prevents enumeration)
    │
    ├─► If user exists and emailVerified:
    │       ├─► Delete any existing reset tokens for this user
    │       ├─► Generate new token: crypto.randomBytes(32).toString('hex')
    │       ├─► Store in verificationTokens: expires 1 hour
    │       └─► Send password reset email via Resend
    │
    └─► Return generic success message
```

### Reset Password Flow

```
User clicks link: /reset-password?token=abc123...
    │
    ▼
Page loads — Server Component validates token exists and is not expired
    │
    ├─► Token expired or not found → show error, link to /forgot-password
    │
    └─► Token valid → show ResetPasswordForm
            │
            ▼
        Server Action: resetPassword()
            │
            ├─► Re-validate token (prevent race conditions)
            ├─► Hash new password: bcrypt.hash(newPassword, 12)
            ├─► Update user.passwordHash
            ├─► Delete all verification tokens for user
            ├─► Invalidate all existing sessions: delete all sessions for userId
            └─► Redirect to /login with success message
```

---

## 6. Session Management

### Session Configuration

- **Strategy**: `database` — sessions stored in MongoDB `sessions` collection
- **Expiry**: 30 days from last activity
- **Session cookie**: `httpOnly: true`, `secure: true` (production), `sameSite: 'lax'`
- **Cookie name**: `next-auth.session-token` (production), `__Secure-next-auth.session-token`

### Session Extension

Sessions are automatically extended on each authenticated request (sliding window):

```typescript
// Auth.js handles session extension automatically when strategy: 'database'
// Each request checks the session, and if valid, extends it by 30 more days
```

### Session Revocation

Admin can revoke all sessions for a user:

```typescript
// Admin Server Action
export async function revokeUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } })
  await prisma.auditLog.create({
    data: { action: 'auth.sessions_revoked', entityType: 'user', entityId: userId, ... }
  })
}
```

---

## 7. Roles & Permissions

### Role Hierarchy

```
SUPER_ADMIN
    └─► All ADMIN permissions
        └─► All CUSTOMER permissions
            └─► Guest (unauthenticated)
```

### Permission Matrix

| Action | Guest | Customer | Admin | Super Admin |
|---|---|---|---|---|
| Browse products | ✅ | ✅ | ✅ | ✅ |
| View product details | ✅ | ✅ | ✅ | ✅ |
| Add to cart | ✅ | ✅ | ✅ | ✅ |
| Add to wishlist | ❌ | ✅ | ✅ | ✅ |
| Checkout | ❌ | ✅ | ✅ | ✅ |
| View own orders | ❌ | ✅ | ✅ | ✅ |
| Submit review | ❌ | ✅ (verified) | ✅ | ✅ |
| Submit B2B inquiry | ✅ | ✅ | ✅ | ✅ |
| Access /admin | ❌ | ❌ | ✅ | ✅ |
| Manage products | ❌ | ❌ | ✅ | ✅ |
| Manage all orders | ❌ | ❌ | ✅ | ✅ |
| Approve reviews | ❌ | ❌ | ✅ | ✅ |
| Manage coupons | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ✅ |
| Delete admin users | ❌ | ❌ | ❌ | ✅ |

### Role Check Helpers

```typescript
// src/lib/auth/roles.ts
import type { Session } from 'next-auth'
import { UserRole } from '@prisma/client'

export function isAdmin(session: Session | null): boolean {
  return session?.user.role === UserRole.ADMIN || session?.user.role === UserRole.SUPER_ADMIN
}

export function isSuperAdmin(session: Session | null): boolean {
  return session?.user.role === UserRole.SUPER_ADMIN
}

export function isCustomer(session: Session | null): boolean {
  return session?.user.role === UserRole.CUSTOMER
}

export function requireAuth(session: Session | null): asserts session is Session {
  if (!session?.user) throw new Error('UNAUTHORIZED')
}

export function requireAdmin(session: Session | null): asserts session is Session {
  if (!isAdmin(session)) throw new Error('FORBIDDEN')
}
```

---

## 8. Middleware

```typescript
// middleware.ts (root — Next.js middleware)
import { auth } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  // Admin routes — require ADMIN or SUPER_ADMIN
  if (pathname.startsWith('/admin')) {
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/login?next=/admin', req.url))
    }
  }

  // Account routes — require any authenticated user
  if (pathname.startsWith('/account') || pathname === '/checkout' || pathname === '/wishlist') {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url))
    }
  }

  // Auth pages — redirect logged-in users away
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (session) {
      return NextResponse.redirect(new URL('/account', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/wishlist',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ]
}
```

---

## 9. Protected Routes

### Route Classification

| Route | Protection | Redirect |
|---|---|---|
| `/account/*` | Authenticated | `/login?next=...` |
| `/checkout` | Authenticated | `/login?next=/checkout` |
| `/wishlist` | Authenticated | `/login?next=/wishlist` |
| `/admin/*` | ADMIN or SUPER_ADMIN | `/login?next=/admin` |
| `/api/orders/*` | Authenticated | 401 |
| `/api/wishlist/*` | Authenticated | 401 |
| `/api/cart/*` | Authenticated | 401 |
| `/api/admin/*` | ADMIN | 403 |
| `/api/payment/*` | Authenticated | 401 |
| `/api/webhooks/*` | Razorpay signature | 422 |

### Server Component Auth Check

```typescript
// In protected page Server Components
import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const session = await auth()
  if (!session) redirect('/login?next=/account')
  
  // session.user is now guaranteed to exist
  const user = session.user
  ...
}
```

### Server Action Auth Check

```typescript
// In every protected Server Action
'use server'

import { auth } from '@/lib/auth/auth'

export async function createOrder(input: unknown): Promise<ActionResult<Order>> {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'UNAUTHORIZED' }

  // Proceed...
}
```

---

## 10. Guest Experience

Guests (unauthenticated users) can:

1. **Browse** all products and collections
2. **Search** products
3. **Add to cart** — cart stored in Zustand (localStorage)
4. **Submit B2B inquiry** — no account required
5. **Subscribe to newsletter** — no account required

Guests cannot:

1. **Checkout** — redirected to login with `?next=/checkout`
2. **Save wishlist** — prompted to create account
3. **Submit reviews** — must have account + verified purchase
4. **Track orders** — account required

### Cart Merge on Login

When a guest logs in with items in their Zustand cart:

```typescript
// Triggered in useEffect after session changes from null to defined
async function mergeGuestCart(cartItems: CartItem[], userId: string) {
  // Server action: mergeCart()
  // 1. For each item in guest cart:
  //    - If item exists in DB cart: take higher quantity
  //    - If item doesn't exist: add to DB cart
  // 2. Return merged cart from DB
  // 3. Zustand store is updated with merged result
  // 4. localStorage cart cleared
}
```
