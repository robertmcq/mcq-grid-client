import Stripe from 'stripe';

// Server-side Stripe instance (never expose secret key to client)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// Live Stripe Product IDs
export const PRODUCT_IDS = {
  GRID_CONTROL_ANALYSIS:      'prod_UEBLMJQL7IJ329',
  LANE01_CORE_BUILD:          'prod_UaPW3oMtrLY2eO',
  LANE01_INTEGRATED_BUILD:    'prod_UaPWM8Qsv0YW5F',
  LANE01_ENTERPRISE_BUILD:    'prod_UaPXKjwZvvm0Xq',
  LAW_FIRM_OPS_TEMPLATE:      'prod_UmaGNMNQbVUUUV',
} as const;

// Price IDs from environment (pulled from Stripe Dashboard per product)
export const PRICE_IDS = {
  GRID_CONTROL_ANALYSIS:      process.env.STRIPE_T1_PRICE_ID!,
  LANE01_CORE_BUILD:          process.env.STRIPE_T2_PRICE_ID!,
  LANE01_INTEGRATED_BUILD:    process.env.STRIPE_T3_PRICE_ID!,
  LANE01_ENTERPRISE_BUILD:    process.env.STRIPE_T4_PRICE_ID!,
  LAW_FIRM_OPS_TEMPLATE:      process.env.STRIPE_TEMPLATE_PRICE_ID!,
} as const;

export type ProductKey = keyof typeof PRICE_IDS;

export const PRODUCT_NAMES: Record<ProductKey, string> = {
  GRID_CONTROL_ANALYSIS:      'Grid Control Analysis',
  LANE01_CORE_BUILD:          'Lane 01 — Agent Creation: Core Build',
  LANE01_INTEGRATED_BUILD:    'Lane 01 — Agent Creation: Integrated Build',
  LANE01_ENTERPRISE_BUILD:    'Lane 01 — Agent Creation: Enterprise Build',
  LAW_FIRM_OPS_TEMPLATE:      'MCQ Law Firm Ops Template',
};

// Checkout mode per product (subscription vs one-time)
export const CHECKOUT_MODE: Record<ProductKey, Stripe.Checkout.SessionCreateParams.Mode> = {
  GRID_CONTROL_ANALYSIS:      'payment',
  LANE01_CORE_BUILD:          'payment',
  LANE01_INTEGRATED_BUILD:    'payment',
  LANE01_ENTERPRISE_BUILD:    'payment',
  LAW_FIRM_OPS_TEMPLATE:      'payment',
};
