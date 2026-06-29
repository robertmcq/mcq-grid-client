# MCQ GRID Client Portal

**Owner of Record:** Robert Millhouse | MCQ Ventures  
**Governance Authority:** MCQ-GOVERNANCE-BLUEPRINT-001-v1.0  
**Schema Version:** 1.0 (LOCKED)  
**Runtime:** Node.js ≥ 18 | TypeScript | Next.js | Stripe | Firebase Auth | Firestore

---

## What This Is

The GRID Client Portal is the public-facing commercial layer of MCQ Ventures. It is the product surface that law firm prospects and clients interact with directly — from initial lead qualification through paid service delivery and engagement closeout. It connects to `mcq-ventures-core` for backend GRID processing and Stripe for all payment and subscription operations.

---

## System Architecture

```
Client Browser
  │
  ├── /qualify        → Lead Routing Gate (Build 5)
  ├── /intake         → Engagement Intake Form (Build 1)
  ├── /dashboard      → Engagement Status + Evidence Ledger View
  ├── /checkout       → Stripe Payment — Service Tier Selection
  ├── /portal         → Authenticated Client Portal (post-payment)
  └── /closure        → Closure Package Delivery
         │
         ↓
  Next.js API Routes
         │
         ├── mcq-ventures-core (GRID Engine — HTTP API)
         └── Stripe API (Payments, Subscriptions, Webhooks)
```

---

## Repository Structure

```
mcq-grid-client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── qualify/            # Lead qualification flow
│   │   ├── intake/             # Engagement intake form
│   │   ├── dashboard/          # Client engagement dashboard
│   │   ├── checkout/           # Stripe Checkout session flow
│   │   ├── portal/             # Authenticated post-payment portal
│   │   ├── closure/            # Closure package delivery
│   │   └── api/                # Next.js API routes
│   │       ├── stripe/         # Stripe webhook handler + checkout session
│   │       ├── intake/         # Proxy to mcq-ventures-core /intake
│   │       ├── route/          # Proxy to mcq-ventures-core /route
│   │       └── evidence/       # Proxy to mcq-ventures-core /evidence/*
│   ├── components/             # Reusable UI components
│   ├── lib/
│   │   ├── stripe.ts           # Stripe client + server SDK init
│   │   ├── grid-api.ts         # mcq-ventures-core API client
│   │   ├── firebase.ts         # Firebase Auth + Firestore client
│   │   └── auth.ts             # Auth helpers and session management
│   └── types/                  # TypeScript type definitions
├── docs/
│   ├── STRIPE-INTEGRATION.md   # Stripe setup, webhook config, product IDs
│   └── SERVICE-TIERS.md        # Pricing tiers and entitlement mapping
├── .github/
│   └── workflows/
│       └── ci.yml              # Build, lint, type-check on push
├── public/                     # Static assets
├── AGENTS.md                   # AI agent skill definitions
├── SYSTEM_STATUS.md            # Live operational status
├── .env.example                # Required environment variables
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

---

## Stripe Integration

This portal uses Stripe for all commercial transactions. See `docs/STRIPE-INTEGRATION.md` for full configuration.

**Payment flows implemented:**
- **Checkout Sessions** — one-time service tier purchase via `POST /api/stripe/create-checkout-session`
- **Webhooks** — `POST /api/stripe/webhook` handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
- **Customer Portal** — Stripe Billing Portal for subscription management
- **Entitlement Gating** — portal access gated on active Stripe subscription status

**Service Tiers:**

| Tier | Name | Access |
|------|------|--------|
| T1 | Awareness | GRID report only |
| T2 | Advisory | Report + evidence ledger access |
| T3 | Full Governance | Report + ledger + closure package + implementation support |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- Stripe account (test mode keys for dev)
- Firebase project (Auth + Firestore enabled)
- `mcq-ventures-core` running locally or deployed

### Setup

```bash
git clone https://github.com/robertmcq/mcq-grid-client.git
cd mcq-grid-client
npm install
cp .env.example .env.local
# Fill in Stripe keys, Firebase config, and GRID API URL
npm run dev
```

### Stripe Webhook (Local Dev)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Environment Variables

See `.env.example` for the full list. Key variables:

**Stripe**
- `STRIPE_SECRET_KEY` — Server-side Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` — Client-side Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` — Webhook signing secret from Stripe dashboard
- `STRIPE_T1_PRICE_ID` — Stripe Price ID for Tier 1
- `STRIPE_T2_PRICE_ID` — Stripe Price ID for Tier 2
- `STRIPE_T3_PRICE_ID` — Stripe Price ID for Tier 3

**Firebase**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`

**GRID Engine**
- `GRID_API_URL` — Base URL for mcq-ventures-core API
- `GRID_API_KEY` — Internal service-to-service auth key

---

## CI/CD

GitHub Actions runs on every push to `main`:
- TypeScript type-check (`tsc --noEmit`)
- ESLint
- Build verification (`next build`)

See `.github/workflows/ci.yml`.

---

## Governance

Operates under **MCQ-GOVERNANCE-BLUEPRINT-001-v1.0**. All client data processed through this portal is subject to the evidence ledger append-only policy enforced by `mcq-ventures-core`. Payment events are recorded as governance evidence entries on `checkout.session.completed`.

**License:** UNLICENSED — Proprietary. All rights reserved, MCQ Ventures.
