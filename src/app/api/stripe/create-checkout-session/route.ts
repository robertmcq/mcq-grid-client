import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICE_IDS, CHECKOUT_MODE, PRODUCT_NAMES, ProductKey } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { product, customerEmail, engagementId } = await req.json() as {
      product: ProductKey;
      customerEmail: string;
      engagementId?: string;
    };

    const priceId = PRICE_IDS[product];
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid product key' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: CHECKOUT_MODE[product],
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        product_key: product,
        product_name: PRODUCT_NAMES[product],
        engagement_id: engagementId ?? '',
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
