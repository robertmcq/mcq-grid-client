import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getEntitlement } from '@/lib/entitlements';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('mcq_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const entitlement = await getEntitlement(decoded.uid);

    if (!entitlement) {
      return NextResponse.json({ error: 'No entitlement found' }, { status: 404 });
    }

    return NextResponse.json(entitlement);
  } catch (err) {
    console.error('Entitlement fetch failed:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
