/**
 * Firestore entitlement helpers — server-side only.
 * Called by webhook after checkout.session.completed.
 */
import { adminDb } from '@/lib/firebase-admin';
import { ProductKey } from '@/lib/stripe';

export interface ClientEntitlement {
  uid: string;
  email: string;
  tier: ProductKey;
  engagementId: string;
  stripeCustomer: string;
  purchasedAt: string;
  status: 'active' | 'revoked';
}

export async function grantEntitlement(data: ClientEntitlement): Promise<void> {
  if (!adminDb) {
    return;
  }

  await adminDb
    .collection('entitlements')
    .doc(data.uid)
    .set(data, { merge: true });
}

export async function getEntitlement(
  uid: string
): Promise<ClientEntitlement | null> {
  if (!adminDb) {
    return null;
  }

  const snap = await adminDb.collection('entitlements').doc(uid).get();
  if (!snap.exists) return null;
  return snap.data() as ClientEntitlement;
}

export async function revokeEntitlement(uid: string): Promise<void> {
  if (!adminDb) {
    return;
  }

  await adminDb
    .collection('entitlements')
    .doc(uid)
    .update({ status: 'revoked' });
}
