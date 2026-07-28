# 18_DEPLOYMENT.md — Deployment & Infrastructure

> **Status**: Immutable Specification  
> **Project**: Maison Noir — Luxury Perfume E-Commerce Platform  
> **Audience**: DevOps Engineers, Senior Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Infrastructure Overview](#1-infrastructure-overview)
2. [Environments](#2-environments)
3. [Environment Variables](#3-environment-variables)
4. [MongoDB Atlas Setup](#4-mongodb-atlas-setup)
5. [Cloudinary Setup](#5-cloudinary-setup)
6. [Razorpay Setup](#6-razorpay-setup)
7. [Resend Setup](#7-resend-setup)
8. [Vercel Deployment](#8-vercel-deployment)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Production Monitoring](#10-production-monitoring)
11. [Backups](#11-backups)
12. [Rollback Strategy](#12-rollback-strategy)

---

## 1. Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│  INTERNET                                                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  VERCEL (CDN + Edge + Serverless)                           │
│  ├─ Static assets (CDN edge — global)                       │
│  ├─ ISR pages (Edge cache — auto-invalidated)               │
│  ├─ Server Components (Serverless functions)                │
│  ├─ API Routes (Serverless functions)                       │
│  └─ Middleware (Edge Runtime)                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
           ┌────────────────┼─────────────────┐
           ▼                ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
│ MongoDB Atlas│  │  Cloudinary  │  │ External Services│
│ (M10 cluster)│  │  (Image CDN) │  │ - Razorpay      │
│              │  │              │  │ - Resend        │
│              │  │              │  │ - Sentry        │
└──────────────┘  └──────────────┘  └─────────────────┘
```

---

## 2. Environments

| Environment | URL | Branch | Purpose |
|---|---|---|---|
| **Development** | `http://localhost:3000` | Any feature branch | Local development |
| **Preview** | Auto-generated Vercel URL | Any PR | PR preview |
| **Staging** | `https://staging.maisonnoir.in` | `develop` | Pre-production testing |
| **Production** | `https://maisonnoir.in` | `main` | Live production |

### Environment Rules

- `main` branch → auto-deploys to production
- `develop` branch → auto-deploys to staging
- Feature branches (`feat/*`) → Vercel preview URLs on PR creation
- Hotfix branches (`hotfix/*`) → PR to `main` with emergency review

---

## 3. Environment Variables

### Complete Variable Reference

```bash
# ─────────────────────────────────────────────
# APPLICATION
# ─────────────────────────────────────────────
NEXTAUTH_URL=https://maisonnoir.in                    # Production URL
NEXTAUTH_SECRET=                                       # 64-char random: openssl rand -base64 48

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/maisonnoir?retryWrites=true&w=majority

# ─────────────────────────────────────────────
# CLOUDINARY
# ─────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=maison-noir
CLOUDINARY_API_KEY=                                    # From Cloudinary dashboard
CLOUDINARY_API_SECRET=                                 # From Cloudinary dashboard

# ─────────────────────────────────────────────
# RAZORPAY
# ─────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_...                          # Production key
RAZORPAY_KEY_SECRET=                                   # Never expose to client
RAZORPAY_WEBHOOK_SECRET=                               # Set in Razorpay dashboard

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...              # Public key for client

# ─────────────────────────────────────────────
# RESEND (EMAIL)
# ─────────────────────────────────────────────
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=orders@maisonnoir.in
RESEND_FROM_NAME=Maison Noir

# ─────────────────────────────────────────────
# AWS S3 (optional static assets)
# ─────────────────────────────────────────────
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=maison-noir-assets

# ─────────────────────────────────────────────
# MONITORING
# ─────────────────────────────────────────────
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=maison-noir
SENTRY_PROJECT=maison-noir-web
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx

# ─────────────────────────────────────────────
# RATE LIMITING (Upstash Redis)
# ─────────────────────────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ─────────────────────────────────────────────
# GOOGLE VERIFICATION
# ─────────────────────────────────────────────
GOOGLE_SITE_VERIFICATION=

# ─────────────────────────────────────────────
# FEATURE FLAGS
# ─────────────────────────────────────────────
NEXT_PUBLIC_ENABLE_THREE_JS=true      # Disable for emergency performance recovery
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### `.env.example` (Committed to Repository)

```bash
# .env.example — Template with all required variables
# Copy to .env.local and fill in values for development
# Production values are set in Vercel dashboard

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-64-char-secret-here

DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/maisonnoir-dev

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

RESEND_API_KEY=
RESEND_FROM_EMAIL=dev@maisonnoir.in
RESEND_FROM_NAME=Maison Noir (Dev)

SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 4. MongoDB Atlas Setup

### Cluster Configuration

| Setting | Value |
|---|---|
| Cluster tier | M10 (production), M2 (development) |
| Provider | AWS |
| Region | Mumbai (ap-south-1) — lowest latency for India |
| Version | MongoDB 7.0+ |
| Backup | Continuous (production), Daily (staging) |

### Database Users

| User | Role | Environment |
|---|---|---|
| `maison-prod` | `readWrite` on `maisonnoir` | Production |
| `maison-staging` | `readWrite` on `maisonnoir-staging` | Staging |
| `maison-dev` | `readWrite` on `maisonnoir-dev` | Development |
| `maison-backup` | `read` on all | Backup scripts |

### Network Access

- Production: Allow Vercel IPs only (or use Atlas Private Endpoint)
- Development: Allow developer IP addresses (update as needed)

### Atlas Search Index

Create in Atlas UI under `maisonnoir.products`:
```json
{
  "name": "products_search",
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": { "type": "string", "analyzer": "lucene.english" },
      "description": { "type": "string", "analyzer": "lucene.english" },
      "shortDescription": { "type": "string", "analyzer": "lucene.english" },
      "topNotes": { "type": "string" },
      "heartNotes": { "type": "string" },
      "baseNotes": { "type": "string" },
      "fragranceFamily": { "type": "string" },
      "status": { "type": "string" },
      "isActive": { "type": "boolean" }
    }
  }
}
```

---

## 5. Cloudinary Setup

### Account Configuration

| Setting | Value |
|---|---|
| Cloud name | `maison-noir` |
| Plan | Pro (for upload presets and access control) |
| Folder structure | `maison-noir/products/[productId]/`, `maison-noir/collections/`, `maison-noir/hero/` |

### Upload Presets

Create in Cloudinary console:

**Preset: `product_upload`**
```json
{
  "folder": "maison-noir/products",
  "transformation": [
    { "width": 1200, "crop": "limit" },
    { "quality": "auto:best" },
    { "format": "auto" }
  ],
  "allowed_formats": ["jpg", "jpeg", "png", "webp"],
  "max_file_size": 10485760
}
```

**Preset: `hero_upload`**
```json
{
  "folder": "maison-noir/hero",
  "transformation": [
    { "width": 2560, "crop": "limit" },
    { "quality": "auto:best" },
    { "format": "auto" }
  ]
}
```

---

## 6. Razorpay Setup

### Dashboard Configuration

1. **Business Name**: Maison Noir
2. **Business Type**: Proprietorship / Private Limited
3. **Settlement Account**: Bank details verified
4. **Webhook URL** (production): `https://maisonnoir.in/api/webhooks/razorpay`
5. **Webhook URL** (staging): `https://staging.maisonnoir.in/api/webhooks/razorpay`
6. **Webhook Events** (subscribe to):
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
   - `order.paid`
7. **Webhook Secret**: 32-char random string (stored in `RAZORPAY_WEBHOOK_SECRET`)

### Test vs Live Keys

- Development: Use `rzp_test_*` keys
- Staging: Use `rzp_test_*` keys (separate test account)
- Production: Use `rzp_live_*` keys

---

## 7. Resend Setup

### Domain Configuration

1. Add domain `maisonnoir.in` to Resend
2. Add DNS records: SPF, DKIM, DMARC
3. Verify domain

### SPF Record
```
"v=spf1 include:amazonses.com ~all"
```

### DKIM Record
```
resend._domainkey.maisonnoir.in → TXT → [Resend DKIM value]
```

### From Email

- Transactional: `orders@maisonnoir.in`
- Marketing: `hello@maisonnoir.in`
- Support: `support@maisonnoir.in`

---

## 8. Vercel Deployment

### Project Setup

```bash
# Install Vercel CLI
pnpm add -g vercel

# Link project
vercel link

# Set environment variables from local
vercel env pull .env.local  # Pull existing env vars

# Deploy
vercel --prod  # Production deploy
vercel         # Preview deploy
```

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "regions": ["bom1"],  // Mumbai — closest to India
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Domain Configuration

1. Add custom domain `maisonnoir.in` in Vercel dashboard
2. Update DNS: CNAME `www` → Vercel; A record for apex domain
3. SSL: Auto-provisioned by Vercel (Let's Encrypt)
4. www → non-www redirect: Configure in Vercel domains

---

## 9. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Unit tests
        run: pnpm test:unit --coverage

      - name: Security audit
        run: pnpm audit --audit-level=high

      - name: Build
        run: pnpm build
        env:
          # Test build with non-sensitive env vars only
          NEXTAUTH_URL: http://localhost:3000
          NEXTAUTH_SECRET: test-secret-for-build
          DATABASE_URL: mongodb://localhost:27017/test

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    if: github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm playwright install --with-deps chromium
      - name: E2E Tests
        run: pnpm test:e2e
        env:
          PLAYWRIGHT_BASE_URL: https://staging.maisonnoir.in

  lighthouse:
    runs-on: ubuntu-latest
    needs: e2e
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - name: Lighthouse CI
        run: pnpm dlx @lhci/cli autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Deployment Flow

```
Developer pushes to feature branch
    │
    ▼
GitHub Actions CI runs (lint, types, unit tests, build)
    │
    ├─► PR opened → Vercel preview URL created
    │
    ├─► PR approved + merged to develop
    │       ├─► CI runs again
    │       ├─► E2E tests on staging
    │       ├─► Lighthouse CI
    │       └─► Vercel deploys to staging.maisonnoir.in
    │
    └─► develop merged to main (after staging verification)
            ├─► CI runs
            └─► Vercel deploys to maisonnoir.in (production)
```

---

## 10. Production Monitoring

### Sentry

- Error tracking for server and client errors
- Performance monitoring (transaction traces)
- Alert: `Sentry.captureException()` on all unexpected errors
- Alert rules: Email on > 5 new errors in 5 minutes

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,  // 10% of transactions traced (cost control)
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
})
```

### Google Analytics 4

- Track: page views, add to cart, checkout started, purchase completed
- Custom events for: wishlist add, coupon applied, B2B form submitted
- Conversion goal: `purchase` event

### Microsoft Clarity

- Session recordings for UX insights
- Heatmaps on key pages: Homepage, Product page, Checkout

### Vercel Analytics

- Built-in performance monitoring
- Tracks Core Web Vitals per page
- Real User Monitoring (RUM)

---

## 11. Backups

### MongoDB Atlas Backups

| Environment | Backup Type | Retention |
|---|---|---|
| Production | Continuous backup + daily snapshots | 30 days |
| Staging | Daily snapshots | 7 days |
| Development | No backups | N/A |

### Manual Backup Before Major Deployments

```bash
# Export production database before major schema changes
mongodump \
  --uri="$DATABASE_URL" \
  --db=maisonnoir \
  --out=./backups/$(date +%Y%m%d_%H%M%S)

# Compress
tar -czf backup_$(date +%Y%m%d).tar.gz ./backups/$(date +%Y%m%d_%H%M%S)
```

### Cloudinary Backup

- Cloudinary stores all media redundantly in AWS S3 internally
- Additional backup: Monthly export of all product images to AWS S3 bucket `maison-noir-media-backup`

---

## 12. Rollback Strategy

### Vercel Rollback (Instant)

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]

# Or via Vercel Dashboard → Deployments → Redeploy previous
```

### Database Rollback

```bash
# Restore from Atlas backup
# 1. Go to Atlas Dashboard → Backup
# 2. Select restore point
# 3. Choose: restore to same cluster or new cluster
# 4. Confirm

# For data migrations: reverse the migration script
pnpm tsx prisma/migrations/scripts/reverse-migration-name.ts
```

### Emergency Procedures

1. **Critical bug in production**: Immediately rollback Vercel deployment (30 seconds)
2. **Data corruption**: Restore from Atlas backup to new cluster, update `DATABASE_URL`
3. **Payment gateway down**: Enable maintenance mode (`NEXT_PUBLIC_MAINTENANCE_MODE=true`), deploy
4. **DDoS / Rate limit exceeded**: Vercel WAF + Upstash Redis rate limiting absorbs it

```typescript
// Maintenance mode — checked in middleware.ts
if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
  if (!pathname.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/maintenance', req.url))
  }
}
```
