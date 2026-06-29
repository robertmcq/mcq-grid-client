import Link from 'next/link';
import { PRODUCT_NAMES, PRODUCT_PRICES, PRICE_IDS } from '@/lib/stripe';
import type { ProductKey } from '@/lib/stripe';

const PRODUCT_DESCRIPTIONS: Record<ProductKey, string> = {
  GRID_CONTROL_ANALYSIS:
    'Single-engagement AI governance audit. Full Grid Assessment report with risk findings and remediation roadmap.',
  LANE01_CORE_BUILD:
    'Core AI governance framework build. Policy architecture, control mapping, and foundational documentation suite.',
  LANE01_INTEGRATED_BUILD:
    'Integrated build with workflow automation, Google Workspace integration, and staff enablement package.',
  LANE01_ENTERPRISE_BUILD:
    'Enterprise-grade deployment with multi-system integration, board-ready reporting, and 90-day advisory retainer.',
  LAW_FIRM_OPS_TEMPLATE:
    'Plug-and-play MCQ Law Firm Operations Template. Immediate download. Governance-ready from day one.',
};

export default function PricingPage() {
  const products = Object.keys(PRODUCT_NAMES) as ProductKey[];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight">MCQ Ventures</h1>
          <p className="text-gray-400 mt-2 text-sm">Select your engagement tier to begin.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {products.map((key) => (
            <div
              key={key}
              className="border border-gray-800 rounded-lg p-6 flex flex-col justify-between hover:border-gray-500 transition"
            >
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  {PRODUCT_NAMES[key]}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {PRODUCT_DESCRIPTIONS[key]}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-white font-bold text-xl">
                  ${PRODUCT_PRICES[key].toLocaleString()}
                </span>
                <CheckoutButton productKey={key} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function CheckoutButton({ productKey }: { productKey: ProductKey }) {
  return (
    <form action="/api/stripe/checkout" method="POST">
      <input type="hidden" name="productKey" value={productKey} />
      <Link
        href={`/checkout?product=${productKey}`}
        className="bg-white text-black text-sm font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        Get Started
      </Link>
    </form>
  );
}
