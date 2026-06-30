import Stripe from 'stripe';

// Lazy singleton — initialized on first request, not at module load
// Prevents Next.js build-time crash when STRIPE_SECRET_KEY is not available
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }
  return _stripe;
}

// Live Stripe Product IDs
export const PRODUCT_IDS = {
  GRID_CONTROL_ANALYSIS:      'prod_UEBLMJQL7IJ329',
  LANE01_CORE_BUILD:          'prod_UaPW3oMtrLY2eO',
  LANE01_INTEGRATED_BUILD:    'prod_UaPWM8Qsv0YW5F',
  LANE01_ENTERPRISE_BUILD:    'prod_UaPXKjwZvvm0Xq',
  LAW_FIRM_OPS_TEMPLATE:      'prod_UmaGNMNQbVUUUV',
} as const;

// Live Stripe Price IDs — verified 2026-06-29
export const PRICE_IDS = {
  GRID_CONTROL_ANALYSIS:      process.env.STRIPE_T1_PRICE_ID ?? '',
  LANE01_CORE_BUILD:          process.env.STRIPE_T2_PRICE_ID ?? '',
  LANE01_INTEGRATED_BUILD:    process.env.STRIPE_T3_PRICE_ID ?? '',
  LANE01_ENTERPRISE_BUILD:    process.env.STRIPE_T4_PRICE_ID ?? '',
  LAW_FIRM_OPS_TEMPLATE:      process.env.STRIPE_TEMPLATE_PRICE_ID ?? '',
} as const;

export type ProductKey = keyof typeof PRICE_IDS;

export const PRODUCT_NAMES: Record<ProductKey, string> = {
  GRID_CONTROL_ANALYSIS:      'Grid Control Analysis',
  LANE01_CORE_BUILD:          'Lane 01 — Agent Creation: Core Build',
  LANE01_INTEGRATED_BUILD:    'Lane 01 — Agent Creation: Integrated Build',
  LANE01_ENTERPRISE_BUILD:    'Lane 01 — Agent Creation: Enterprise Build',
  LAW_FIRM_OPS_TEMPLATE:      'MCQ Law Firm Ops Template',
};

export const PRODUCT_PRICES: Record<ProductKey, number> = {
  GRID_CONTROL_ANALYSIS:      2997,
  LANE01_CORE_BUILD:          15000,
  LANE01_INTEGRATED_BUILD:    25000,
  LANE01_ENTERPRISE_BUILD:    37500,
  LAW_FIRM_OPS_TEMPLATE:      47,
};

// All products are fixed-fee one-time payments
export const CHECKOUT_MODE: Record<ProductKey, Stripe.Checkout.SessionCreateParams.Mode> = {
  GRID_CONTROL_ANALYSIS:      'payment',
  LANE01_CORE_BUILD:          'payment',
  LANE01_INTEGRATED_BUILD:    'payment',
  LANE01_ENTERPRISE_BUILD:    'payment',
  LAW_FIRM_OPS_TEMPLATE:      'payment',
};
