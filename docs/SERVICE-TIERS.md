# Service Tiers — MCQ Ventures Product Catalog

**Governance Authority:** MCQ-GOVERNANCE-BLUEPRINT-001-v1.0  
**Owner of Record:** Robert Millhouse | MCQ Ventures  
**Last Updated:** 2026-06-29

---

## Product Lines

MCQ Ventures operates two active product lines, both available through the GRID Client Portal and processed via Stripe.

---

## Line 1 — GRID Assessment

### Grid Control Analysis
**Stripe Product ID:** `prod_UEBLMJQL7IJ329`  
**Price ID:** Add to `.env.local` as `STRIPE_T1_PRICE_ID`  
**Type:** Fixed-fee assessment

AI Governance & Workflow Readiness Audit. Fixed-fee assessment identifying current AI usage, workflow exposure, review gaps, and required control structure. Includes decision-grade findings and recommended remediation path. Delivered within 5 business days after payment and intake materials are received.

**Deliverables:**
- Current AI usage mapping
- Workflow exposure identification
- Review gap analysis
- Required control structure
- Decision-grade findings report
- Recommended remediation path
- Delivery: 5 business days post-payment and intake

---

## Line 2 — Lane 01: Agent Creation

Three-tier custom AI agent build service. Tier determines scope, integration depth, and implementation oversight.

### Core Build
**Stripe Product ID:** `prod_UaPW3oMtrLY2eO`  
**Price ID:** Add to `.env.local` as `STRIPE_T2_PRICE_ID`  
**Tax Code:** `txcd_10000000`

Custom AI agent build for one defined business use case with controlled implementation scope.

**Deliverables:**
- Single-use-case agent build
- Controlled implementation scope
- Defined handoff deliverable

---

### Integrated Build
**Stripe Product ID:** `prod_UaPWM8Qsv0YW5F`  
**Price ID:** Add to `.env.local` as `STRIPE_T3_PRICE_ID`  
**Tax Code:** `txcd_10000000`

Custom AI agent build with deeper workflow integration, expanded implementation alignment, and stronger operating fit.

**Deliverables:**
- Everything in Core Build
- Deeper workflow integration
- Expanded implementation alignment
- Stronger operating fit documentation

---

### Enterprise Build
**Stripe Product ID:** `prod_UaPXKjwZvvm0Xq`  
**Price ID:** Add to `.env.local` as `STRIPE_T4_PRICE_ID`  
**Tax Code:** `txcd_10000000`

Enterprise-grade AI agent build for high-complexity environments requiring broader governance, integration depth, and implementation oversight.

**Deliverables:**
- Everything in Integrated Build
- Broader governance layer
- Full integration depth
- Ongoing implementation oversight

---

## Line 3 — Digital Products

### MCQ Law Firm Ops Template
**Stripe Product ID:** `prod_UmaGNMNQbVUUUV`  
**Price ID:** Add to `.env.local` as `STRIPE_TEMPLATE_PRICE_ID`  
**Type:** One-time purchase — Digital delivery

A 20-tab Google Sheets financial operations system built for solo and small law firms. Delivered as a Google Sheets file link. No software installation required. 15-minute setup.

**Deliverables:**
- Firm Setup (named ranges, billing structure, IOLTA account intake, fiscal year config)
- Dual Trust Account Ledgers (IOLTA-compliant, red alerts on negative balance)
- Operating Account Ledger (200 rows, category dropdowns, reconciliation flags)
- Invoice Log (250 rows, auto Paid/Partial/Unpaid status, days outstanding)
- AR Aging (0–30, 31–60, 61–90, 90+ day buckets with collection rate metrics)
- Retainer Burn-Down (per-matter alerts at 20% and 5%)
- Matter Profitability Tracker (hours, revenue, effective hourly rate, margin)
- Trust Reconciliation Dashboard (three-way book vs. bank vs. client ledger)
- Financial Health Scorecard (5-KPI Green/Yellow/Red composite rating)
- Monthly + Annual Dashboards, Compliance Calendar, Checkpoint Log, Glossary

**Note:** This is a digital product. No refunds after delivery.

---

## Entitlement Matrix

| Feature | Grid Control Analysis | Lane 01 Core | Lane 01 Integrated | Lane 01 Enterprise | Law Firm Template |
|---|---|---|---|---|---|
| GRID Assessment Report | ✅ | ❌ | ❌ | ❌ | ❌ |
| AI Workflow Audit | ✅ | ❌ | ❌ | ❌ | ❌ |
| Remediation Path | ✅ | ❌ | ❌ | ❌ | ❌ |
| Agent Build (1 use case) | ❌ | ✅ | ✅ | ✅ | ❌ |
| Workflow Integration | ❌ | ❌ | ✅ | ✅ | ❌ |
| Enterprise Governance Layer | ❌ | ❌ | ❌ | ✅ | ❌ |
| Implementation Oversight | ❌ | ❌ | ❌ | ✅ | ❌ |
| Google Sheets Ops System | ❌ | ❌ | ❌ | ❌ | ✅ |
| IOLTA-Compliant Ledgers | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## .env.local Configuration Reference

```bash
# GRID Assessment
STRIPE_T1_PRICE_ID=price_REPLACE_WITH_GRID_CONTROL_ANALYSIS_PRICE_ID

# Lane 01 — Agent Creation
STRIPE_T2_PRICE_ID=price_REPLACE_WITH_CORE_BUILD_PRICE_ID
STRIPE_T3_PRICE_ID=price_REPLACE_WITH_INTEGRATED_BUILD_PRICE_ID
STRIPE_T4_PRICE_ID=price_REPLACE_WITH_ENTERPRISE_BUILD_PRICE_ID

# Digital Products
STRIPE_TEMPLATE_PRICE_ID=price_REPLACE_WITH_LAW_FIRM_TEMPLATE_PRICE_ID
```

To find Price IDs: Stripe Dashboard → Products → click product → copy Price ID from Pricing section.
