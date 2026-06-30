import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICE_IDS, ProductKey } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { productKey, engagementId, customerEmail } = await req.json() as {
      productKey: ProductKey;
      engagementId: string;
      customerEmail: string;
    };

    if (!productKey || !PRICE_IDS[productKey]) {
      return NextResponse.json(
        { error: 'Invalid product key' },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: PRICE_IDS[productKey],
          quantity: 1,
        },
      ],
      metadata: {
        engagement_id: engagementId,
        tier: productKey,
        governance_authority: 'MCQ-GOVERNANCE-BLUEPRINT-001-v1.0',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session creation failed:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
