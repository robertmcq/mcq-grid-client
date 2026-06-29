'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCT_NAMES, PRODUCT_PRICES } from '@/lib/stripe';
import type { ProductKey } from '@/lib/stripe';
import { Suspense } from 'react';

function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const productKey = params.get('product') as ProductKey | null;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productKey || !PRODUCT_NAMES[productKey]) {
      router.push('/pricing');
    }
  }, [productKey, router]);

  if (!productKey || !PRODUCT_NAMES[productKey]) return null;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKey,
          customerEmail: email,
          engagementId: `eng_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Checkout failed');
      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-gray-400 text-sm">You are purchasing</p>
          <h1 className="text-xl font-bold mt-1">{PRODUCT_NAMES[productKey]}</h1>
          <p className="text-gray-300 text-sm mt-1">${PRODUCT_PRICES[productKey].toLocaleString()} — one-time payment</p>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-white"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-2 rounded text-sm hover:bg-gray-100 disabled:opacity-50 transition"
          >
            {loading ? 'Redirecting to Stripe...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
