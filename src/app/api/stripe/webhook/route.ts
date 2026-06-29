import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { grantEntitlement, revokeEntitlement } from '@/lib/entitlements';
import { adminAuth } from '@/lib/firebase-admin';
import Stripe from 'stripe';
import type { ProductKey } from '@/lib/stripe';

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
        const email = session.customer_details?.email ?? session.customer_email;
        const tier = session.metadata?.tier as ProductKey | undefined;
        const engagementId = session.metadata?.engagement_id ?? '';
        const stripeCustomer = typeof session.customer === 'string'
          ? session.customer
          : '';

        if (!email || !tier) {
          console.error('Webhook missing email or tier in session metadata', {
            session_id: session.id,
          });
          break;
        }

        if (!adminAuth) {
          console.warn('Firebase Admin auth unavailable; skipping entitlement grant.');
          break;
        }

        let uid: string;
        try {
          const user = await adminAuth.getUserByEmail(email);
          uid = user.uid;
        } catch {
          const newUser = await adminAuth.createUser({ email });
          uid = newUser.uid;
        }

        await grantEntitlement({
          uid,
          email,
          tier,
          engagementId,
          stripeCustomer,
          purchasedAt: new Date().toISOString(),
          status: 'active',
        });

        console.log(JSON.stringify({
          severity: 'INFO',
          event: 'STRIPE_CHECKOUT_COMPLETED',
          uid,
          engagement_id: engagementId,
          tier,
          customer: stripeCustomer,
          governance_authority: 'MCQ-GOVERNANCE-BLUEPRINT-001-v1.0',
          timestamp: new Date().toISOString(),
        }));
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
        const email = typeof subscription.customer === 'string'
          ? null
          : (subscription.customer as Stripe.Customer)?.email ?? null;

        if (email) {
          if (!adminAuth) {
            console.warn('Firebase Admin auth unavailable; skipping entitlement revoke.');
            break;
          }

          try {
            const user = await adminAuth.getUserByEmail(email);
            await revokeEntitlement(user.uid);
            console.log(JSON.stringify({
              severity: 'WARNING',
              event: 'STRIPE_SUBSCRIPTION_CANCELLED',
              uid: user.uid,
              customer: subscription.customer,
              timestamp: new Date().toISOString(),
            }));
          } catch (err) {
            console.error('Failed to revoke entitlement on subscription cancel:', err);
          }
        }
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
