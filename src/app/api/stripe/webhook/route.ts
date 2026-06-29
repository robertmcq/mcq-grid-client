import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(JSON.stringify({
          severity: 'INFO',
          event: 'STRIPE_CHECKOUT_COMPLETED',
          engagement_id: session.metadata?.engagement_id,
          tier: session.metadata?.tier,
          customer: session.customer,
          governance_authority: 'MCQ-GOVERNANCE-BLUEPRINT-001-v1.0',
          timestamp: new Date().toISOString(),
        }));
        // TODO: Update Firestore — set client tier entitlement and record payment evidence
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(JSON.stringify({
          severity: 'INFO',
          event: 'STRIPE_INVOICE_PAID',
          customer: invoice.customer,
          amount: invoice.amount_paid,
          timestamp: new Date().toISOString(),
        }));
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(JSON.stringify({
          severity: 'WARNING',
          event: 'STRIPE_SUBSCRIPTION_CANCELLED',
          customer: subscription.customer,
          timestamp: new Date().toISOString(),
        }));
        // TODO: Revoke portal access in Firestore
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
