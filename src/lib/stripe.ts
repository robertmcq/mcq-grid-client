import Stripe from 'stripe';

// Server-side Stripe instance (never expose secret key to client)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

// Service tier price ID map
export const TIER_PRICE_IDS: Record<'T1' | 'T2' | 'T3', string> = {
  T1: process.env.STRIPE_T1_PRICE_ID!,
  T2: process.env.STRIPE_T2_PRICE_ID!,
  T3: process.env.STRIPE_T3_PRICE_ID!,
};

export type ServiceTier = 'T1' | 'T2' | 'T3';

export const TIER_NAMES: Record<ServiceTier, string> = {
  T1: 'Awareness',
  T2: 'Advisory',
  T3: 'Full Governance',
};
