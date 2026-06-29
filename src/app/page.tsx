import Link from 'next/link';

const tiers = [
  {
    name: 'Grid Control Analysis',
    price: '$2,997',
    description: 'A focused assessment for leadership and delivery teams.',
    href: '/api/stripe/create-checkout-session',
  },
  {
    name: 'Lane 01 Core Build',
    price: '$15,000',
    description: 'A deeper implementation track for building out the core workflow.',
    href: '/api/stripe/create-checkout-session',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">MCQ GRID</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Choose the engagement tier that fits your rollout.</h1>
          <p className="max-w-2xl text-lg text-slate-300">
            These starter pricing cards use Tailwind styling and avoid the form/link nesting issue mentioned earlier.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
              <h2 className="text-2xl font-semibold">{tier.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{tier.description}</p>
              <div className="mt-6 text-4xl font-semibold text-white">{tier.price}</div>
              <Link
                href={tier.href}
                className="mt-8 inline-flex items-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Select tier
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
