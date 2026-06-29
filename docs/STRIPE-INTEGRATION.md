# Stripe Integration Guide — MCQ GRID Client Portal

**Governance Authority:** MCQ-GOVERNANCE-BLUEPRINT-001-v1.0  
**Owner of Record:** Robert Millhouse | MCQ Ventures

---

## Overview

All commercial transactions in the GRID Client Portal are processed through Stripe. This document covers setup, configuration, and operational procedures.

---

## Products & Pricing Configuration

Create the following in your Stripe Dashboard (Products > Add Product):

| Product Name | Tier | Type | Description |
|---|---|---|---|
| GRID Awareness | T1 | Subscription | AI governance GRID report delivery |
| GRID Advisory | T2 | Subscription | Report + evidence ledger access |
| GRID Full Governance | T3 | Subscription | Report + ledger + closure package + implementation support |

Once created, copy each Price ID into your `.env.local` as `STRIPE_T1_PRICE_ID`, `STRIPE_T2_PRICE_ID`, `STRIPE_T3_PRICE_ID`.

---

## Webhook Configuration

1. In Stripe Dashboard > Developers > Webhooks > Add Endpoint
2. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.deleted`
4. Copy the signing secret into `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Local Development

```bash
npm install -g stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will output a webhook signing secret for local use.

---

## Payment Flow

```
Client selects tier → POST /api/stripe/create-checkout-session
  → Stripe Checkout hosted page
  → Payment captured
  → Stripe fires checkout.session.completed webhook
  → POST /api/stripe/webhook
  → Firestore updated: client tier entitlement activated
  → Client redirected to /portal
```

---

## Governance Evidence

All `checkout.session.completed` events are logged with `engagement_id` and `tier` metadata and must be recorded as evidence entries in the GRID evidence ledger. This is enforced at the webhook handler level.

---

## Test Cards

| Card Number | Scenario |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | 3D Secure authentication |
| `4000 0000 0000 9995` | Payment declined |
