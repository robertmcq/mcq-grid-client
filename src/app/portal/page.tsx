'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { ClientEntitlement } from '@/lib/entitlements';

export default function PortalPage() {
  const router = useRouter();
  const [entitlement, setEntitlement] = useState<ClientEntitlement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login?redirect=/portal');
        return;
      }

      try {
        const res = await fetch('/api/account/entitlement');
        if (res.ok) {
          const data = await res.json();
          setEntitlement(data);
        }
      } catch {
        // entitlement fetch failed — user authenticated but no purchase on record
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    if (auth) {
      await auth.signOut();
    }
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading your portal...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">Client Portal</h1>
            <p className="text-gray-400 text-sm mt-1">MCQ Ventures</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>

        {entitlement ? (
          <div className="border border-gray-800 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Engagement</p>
              <h2 className="text-lg font-semibold">{entitlement.tier.replace(/_/g, ' ')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Engagement ID</p>
                <p className="text-white font-mono">{entitlement.engagementId}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className={entitlement.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                  {entitlement.status.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Purchased</p>
                <p className="text-white">{new Date(entitlement.purchasedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Account</p>
                <p className="text-white">{entitlement.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">No active engagement found.</p>
            <a
              href="/pricing"
              className="inline-block mt-4 bg-white text-black text-sm font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              View Engagements
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
