# On the Books

A verified-supply local services platform. Local trade businesses — electricians,
plumbers, HVAC, mobile groomers — get a **free scheduling tool immediately upon
signup**, but only appear in the public marketplace once an admin approves their
license/insurance verification. That verification gate is the product's core
trust mechanism, enforced at the data layer (not just the UI).

The repo contains two parts:

1. **Landing page** — a municipal-ledger-styled marketing site (App Router, static output).
2. **Backend API** — production-ready Next.js route handlers + MongoDB/Mongoose.

## Stack

- [Next.js 16](https://nextjs.org) (App Router route handlers, dynamic `params` are `Promise`s)
- MongoDB + Mongoose 9 — connection cached across serverless invocations
- `jose` for JWT session tokens (works in the proxy runtime, so the auth gate never needs a DB hit)
- `bcryptjs` for password hashing (Node runtime only — kept in its own module, never imported by `proxy.ts`)
- `zod` for request validation on every route
- Auth via httpOnly session cookie, no bearer tokens

> **Note for the proxy:** In Next.js 16, `middleware.ts` is renamed to `proxy.ts`
> (`src/proxy.ts`). It verifies the session cookie at the edge and lets public
> GET marketplace routes through; fine-grained role checks still happen inside
> each route handler.

## Project structure

```
src/
  proxy.ts        # edge auth gate for /api/*
  lib/            # db connection, auth (jose), password (bcrypt), validators, response helpers
  models/         # User, Provider, Verification, Service, Availability, Booking, Review
  app/api/        # route handlers (auth, providers, admin, services, availability, search, bookings, reviews)
scripts/create-admin.ts  # promote an existing user to admin (real input via env)
```

## Setup

```bash
npm install
cp .env.example .env.local   # fill in MONGODB_URI and JWT_SECRET
npm run create-admin          # promote/create the first admin (uses ADMIN_EMAIL + ADMIN_PASSWORD)
npm run dev                   # http://localhost:3000
```

- `MONGODB_URI`: local (`mongodb://127.0.0.1:27017/tradeverify`) or Atlas —
  atlas.mongodb.com → Create Cluster → Connect → Drivers → copy the connection
  string and replace `<password>`.
- `JWT_SECRET`: generate one with `openssl rand -base64 48`.

There is no seeded/demo data — all accounts, provider profiles, services,
bookings, and reviews come from real usage through the API.

## API reference

All responses follow `{ success: true, data }` or `{ success: false, error, details? }`.
Auth uses an httpOnly cookie set on login/register.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account (`role: customer \| provider`) |
| POST | `/api/auth/login` | — | Log in, sets session cookie |
| POST | `/api/auth/logout` | — | Clears session cookie |
| GET  | `/api/auth/me` | session | Current user |
| POST | `/api/providers` | provider | Create provider profile (`unverified` by default) |
| GET  | `/api/providers?trade=&verificationStatus=` | — | Back-office listing (defaults to verified) |
| GET  | `/api/providers/:id` | — | Public provider profile |
| PATCH| `/api/providers/:id` | owner/admin | Edit provider profile |
| POST | `/api/providers/:id/verification` | owner | Submit license/insurance doc → flips to `pending` |
| GET  | `/api/providers/:id/verification` | owner/admin | List submissions (full audit trail) |
| GET  | `/api/admin/verifications?status=pending` | admin | Review queue |
| PATCH| `/api/admin/verifications/:id` | admin | Approve/reject → flips provider to `verified` |
| POST | `/api/services` | provider | Add a bookable service |
| GET  | `/api/services?providerId=` | — | List a provider's active services |
| PATCH/DELETE | `/api/services/:id` | owner | Edit/deactivate a service |
| POST | `/api/availability` | provider | Add a weekly time slot (the free scheduling tool) |
| GET  | `/api/availability/:providerId` | — | Public weekly schedule |
| GET  | `/api/search?trade=&lat=&lng=&radiusKm=&minRating=` | — | **The marketplace.** Verified providers only, `$nearSphere` geo query when lat/lng given |
| POST | `/api/bookings` | customer | Request a booking (blocked unless provider is `verified`) |
| GET  | `/api/bookings` | session | List your own bookings (role-aware; admin sees all) |
| GET/PATCH | `/api/bookings/:id` | participant | View/update booking status (valid transitions only) |
| POST | `/api/reviews` | customer | Review a completed booking (one per booking); recalculates provider rating |
| GET  | `/api/reviews?providerId=` | — | List a provider's reviews |

### The trust gate, concretely

1. Provider registers → creates a Provider profile → status `unverified`. They can
   already use `/api/services` and `/api/availability` — the free tooling wedge.
2. Provider submits license/insurance docs → status flips to `pending`.
3. Admin reviews via `/api/admin/verifications` → approves → status flips to `verified`.
4. **Only now** does `/api/search` (and therefore booking creation) surface them.

Enforcement is in the data layer, not just the UI:

- `/api/search` hard-filters to `verificationStatus: 'verified'`; booking creation
  refuses any provider who isn't `verified`.
- Booking status transitions are validated by a **Mongoose pre-save hook** on the
  `Booking` model (requested → confirmed/declined/cancelled, confirmed →
  completed/cancelled, then terminal), with a `statusHistory` audit trail.
- Provider rating/reviewCount are recalculated by a **Mongoose post-save hook** on
  the `Review` model.
- Verification is a first-class collection (`Verification`) with `reviewedBy` /
  `reviewedAt` audit fields — not a boolean on Provider.

## Deployment (Vercel + MongoDB Atlas)

1. Push this repo to GitHub.
2. In MongoDB Atlas: allow network access from anywhere (`0.0.0.0/0`) or Vercel's
   IP ranges, and create a database user.
3. In Vercel: "Add New Project" → import the repo → under **Environment Variables**
   add `MONGODB_URI`, `JWT_SECRET`, and `AUTH_COOKIE_NAME` (use a fresh `JWT_SECRET`,
   different from local dev).
4. Deploy. Vercel builds with `npm run build` automatically.

## What's intentionally NOT included yet

This is the transactional core. Before taking real customer payments or going
fully live you'll still want: a payments integration (Stripe Connect fits this
two-sided model well), file upload handling for verification documents (e.g.
S3/Cloudflare R2 presigned URLs — `documentUrl` just accepts any URL), email/SMS
notifications on booking status changes, and rate limiting on the public auth routes.
