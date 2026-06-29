# AGENTS.md — MCQ GRID Client Portal

**Governance Authority:** MCQ-GOVERNANCE-BLUEPRINT-001-v1.0  
**Owner of Record:** Robert Millhouse | MCQ Ventures

---

## Agent Scope

This file defines the AI agent operating boundaries for the MCQ GRID Client Portal. Agents operating within this repository are authorized to assist with:

- TypeScript/Next.js component development
- Stripe API integration and webhook handler logic
- Firebase Auth and Firestore client-side integration
- API route development (Next.js App Router)
- UI flow for lead qualification, intake, dashboard, and checkout

## Constraints

- Agents must not modify `.env.example` to include real credentials.
- Agents must not alter Stripe webhook signature verification logic without explicit instruction.
- Agents must not change service tier pricing without explicit instruction from Owner of Record.
- All schema changes require a version bump aligned with `mcq-ventures-core` schema version.

## Integration Points

| System | Interface | Auth Method |
|--------|-----------|-------------|
| mcq-ventures-core | REST HTTP API | `GRID_API_KEY` header |
| Stripe | Stripe SDK + Webhooks | `STRIPE_SECRET_KEY` + webhook secret |
| Firebase | Firebase SDK | Service account (admin) / API key (client) |
