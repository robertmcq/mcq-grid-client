# SYSTEM_STATUS.md — MCQ GRID Client Portal

**Last Updated:** 2026-06-29  
**Governance Authority:** MCQ-GOVERNANCE-BLUEPRINT-001-v1.0  
**Owner of Record:** Robert Millhouse | MCQ Ventures

---

## Current Status: 🟡 IN DEVELOPMENT

| Component | Status | Notes |
|-----------|--------|-------|
| Lead Qualification Flow (`/qualify`) | 🔴 Not Started | Pending UI scaffold |
| Intake Form (`/intake`) | 🔴 Not Started | Pending UI scaffold |
| Stripe Checkout Session | 🔴 Not Started | Price IDs required |
| Stripe Webhook Handler | 🔴 Not Started | Webhook secret required |
| Firebase Auth | 🔴 Not Started | Project config required |
| Client Dashboard (`/dashboard`) | 🔴 Not Started | Pending auth layer |
| Closure Package Delivery (`/closure`) | 🔴 Not Started | Pending Build 4 integration |
| GRID API Client (`lib/grid-api.ts`) | 🔴 Not Started | Pending mcq-ventures-core deployment |
| CI Pipeline | 🟢 Configured | GitHub Actions on push to main |

---

## Next Milestone

**M1 — Stripe + Auth Foundation**  
Target: Stripe Checkout session live in test mode with Firebase Auth gating portal access.

1. Configure Stripe products and price IDs
2. Implement `POST /api/stripe/create-checkout-session`
3. Implement `POST /api/stripe/webhook` with signature verification
4. Implement Firebase Auth (email/Google) on `/portal` route
5. Gate portal access on active Stripe subscription status

---

## Dependency Map

```
mcq-grid-client
  └── mcq-ventures-core (GRID Engine) — must be deployed before /intake and /route work
  └── Stripe (test mode) — keys required before checkout flows work
  └── Firebase (Auth + Firestore) — config required before portal access works
```
