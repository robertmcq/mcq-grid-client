import { NextRequest, NextResponse } from 'next/server';
import { stripe, TIER_PRICE_IDS, ServiceTier } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { tier, customerEmail, engagementId } = await req.json() as {
      tier: ServiceTier;
      customerEmail: string;
      engagementId: string;
    };

    const priceId = TIER_PRICE_IDS[tier];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid service tier' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        engagement_id: engagementId,
        tier,
        governance_authority: 'MCQ-GOVERNANCE-BLUEPRINT-001-v1.0',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session error:', err);
    return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 });
  }
}
