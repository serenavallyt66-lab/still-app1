'use client';

import { useCallback } from 'react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    billing: '/month',
    description: 'Perfect for trying Still and building your quiet writing habit.',
    features: ['1 private workspace', 'Local + cloud draft sync', 'Community support'],
    cta: 'Subscribe',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    billing: '/month',
    description: 'For focused creators who want more space, speed, and control.',
    features: ['Unlimited workspaces', 'Version history', 'Priority support'],
    cta: 'Subscribe',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$79',
    billing: '/month',
    description: 'Advanced controls, onboarding, and security for larger teams.',
    features: ['SAML SSO', 'Audit logs and controls', 'Dedicated onboarding'],
    cta: 'Subscribe',
    highlighted: false,
  },
] as const;

const createCheckoutUrl = (planId: string) => `/checkout?plan=${encodeURIComponent(planId)}`;

export default function PricingPage() {
  const handleSubscribe = useCallback((planId: string) => {
    // Stripe checkout integration can later call an API route
    // to create a session before redirecting.
    window.location.href = createCheckoutUrl(planId);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-6 py-16 text-stone-800 dark:bg-stone-950 dark:text-stone-100">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Pricing</p>
          <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">Choose the right plan</h1>
          <p className="mt-4 text-base text-stone-600 dark:text-stone-300 sm:text-lg">
            Flexible plans for every stage, with subscribe buttons wired for future Stripe checkout.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 ${
                plan.highlighted
                  ? 'border-stone-900 bg-white shadow-xl dark:border-stone-100 dark:bg-stone-900'
                  : 'border-stone-200/80 bg-white/90 dark:border-stone-800 dark:bg-stone-900/70'
              }`}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                  Most Popular
                </span>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <span className="rounded-full border border-stone-200 px-2.5 py-1 text-[11px] uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-300">
                  {plan.id}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-sm text-stone-500 dark:text-stone-400">{plan.billing}</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-stone-600 dark:text-stone-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-stone-700 dark:bg-stone-300" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleSubscribe(plan.id)}
                className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/70 ${
                  plan.highlighted
                    ? 'bg-stone-900 text-white hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300'
                    : 'bg-stone-100 text-stone-900 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
