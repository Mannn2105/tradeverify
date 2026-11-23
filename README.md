# On the Books — Verified Local Services Platform

**On the Books** is a local-services marketplace concept built around one core idea: customers should be able to discover and book trade professionals whose credentials have been reviewed.

The platform gives service providers access to scheduling tools after signup. A provider becomes discoverable in the public marketplace only after an administrator approves their verification submission. This approval check is enforced by the backend, not only by the frontend.

> Repository: `Mannn2105/tradeverify`  
> Product focus: trusted local services, provider verification, scheduling, and bookings.

## Live preview

[Open the public landing page](https://tradeverify-lemon.vercel.app/).

The public homepage is deployed and verified. Registry statistics and marketplace data are loaded from MongoDB; if the database is unavailable, the landing page renders with empty registry values rather than failing. Authenticated marketplace workflows still require a valid `MONGODB_URI` and production environment configuration.

## Project at a glance

- **Frontend and API:** Next.js 16 App Router
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT session tokens with httpOnly cookies
- **Validation:** Zod
- **Password hashing:** bcryptjs

## Key features

### Customer and provider accounts
- Register and log in with role-aware accounts.
- Store the session in an httpOnly cookie.
- Retrieve the currently authenticated user.
- Restrict provider and administrative actions by role.

### Provider verification workflow
1. A provider creates a profile with an `unverified` status.
2. The provider submits license or insurance information for review.
3. An administrator reviews the submission.
4. Approved providers become eligible to appear in marketplace search.

### Services, availability, and bookings
- Providers can create and manage services.
- Providers can publish weekly availability in their local IANA timezone (defaults to `UTC`).
- Customers can request bookings only within the provider’s published weekly availability.
- Booking times are checked in the provider’s timezone, including daylight-saving changes.
- MongoDB transactions serialize concurrent booking attempts for the same provider.
- Booking status changes follow defined transitions.
- Customers can review completed bookings.

### Backend safeguards
- Marketplace search filters for verified providers.
- Booking creation checks the provider's verification status.
- Request payloads are validated with Zod.
- Booking status history is retained.
- Provider ratings and review counts are recalculated from reviews.

## Architecture

The codebase is organized around Next.js route handlers and Mongoose models.

```text
src/
├── app/
│   └── api/          # Auth, providers, admin, services, availability,
│                     # search, bookings, and reviews
├── lib/              # Database, auth, password, validation, responses
├── models/           # User, Provider, Verification, Service,
│                     # Availability, Booking, and Review
└── proxy.ts          # Request-level session gate

scripts/
└── create-admin.ts   # Bootstrap an administrator using environment variables
```

## API overview

All API responses use a consistent success/error response structure.

| Area | Routes | Purpose |
|---|---|---|
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Account and session management |
| Providers | `/api/providers`, `/api/providers/:id` | Provider profiles and updates |
| Verification | `/api/providers/:id/verification`, `/api/admin/verifications` | Submit and review credentials |
| Services | `/api/services`, `/api/services/:id` | Create, update, and deactivate services |
| Availability | `/api/availability`, `/api/availability/:providerId` | Provider scheduling |
| Search | `GET /api/search` | Find verified providers |
| Bookings | `/api/bookings`, `/api/bookings/:id` | Booking requests and status updates |
| Reviews | `/api/reviews` | Reviews for completed bookings |

For query parameters, authorization requirements, and request/response details, inspect the route handlers under `src/app/api/`.

## Run locally

### 1. Requirements

- Node.js version compatible with the installed Next.js release
- npm
- MongoDB running as a replica set (MongoDB Atlas supports this)

The booking API uses MongoDB transactions to serialize concurrent booking requests per provider. A standalone local MongoDB server does not support these transactions; use MongoDB Atlas or configure a local replica set.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Set the following values in `.env.local`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long, randomly generated secret for signing sessions |
| `AUTH_COOKIE_NAME` | Name of the httpOnly session cookie |
| `ADMIN_EMAIL` | Email used when bootstrapping the first administrator |
| `ADMIN_PASSWORD` | Strong password used when bootstrapping the first administrator |

Generate a secret locally, for example:

```bash
openssl rand -base64 48
```

Do not commit `.env.local`, real credentials, database connection strings, or private verification documents.

### 4. Create the first administrator

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your local environment, then run:

```bash
npm run create-admin
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the application |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run verify` | Run the repository verification script |
| `npm run create-admin` | Create or promote the initial administrator |

## Security and deployment notes

This repository is a project implementation and should be reviewed and tested before handling real customer data.

Before a public production launch:

- Use a strong, unique `JWT_SECRET` and keep it outside source control.
- Restrict MongoDB network access to the deployment environment where possible; do not expose the database broadly.
- Add secure handling and private storage for uploaded license/insurance documents.
- Add rate limiting and abuse protection to public authentication endpoints.
- Configure HTTPS, secure cookie settings, logging, monitoring, and backups.
- Add email/SMS notifications and a payment provider only after the core booking flow is tested.
- Run the build, lint, type-check, and verification commands as part of deployment checks.

## Potential next improvements

- Private document upload and storage for provider verification
- Email/SMS notifications for booking updates
- Payment integration
- Automated API and end-to-end tests
- Admin audit views and operational monitoring

## What this project demonstrates

- Designing role-aware REST API routes
- Modeling related marketplace entities with MongoDB and Mongoose
- Implementing cookie-based authentication
- Validating API input and enforcing backend authorization
- Building a verification-gated search and booking workflow
- Structuring a full-stack application with Next.js and TypeScript

---

Built as a practical exploration of trust, verification, and booking workflows for local service marketplaces.
