const plans = [
  {
    name: 'Free',
    price: '$0',
    billing: '/month',
    description: 'Great for getting started and testing the core product experience.',
    features: ['1 project', 'Basic analytics', 'Community support'],
    cta: 'Subscribe',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    billing: '/month',
    description: 'Best for growing teams that need more power and collaboration.',
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support'],
    cta: 'Subscribe',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    billing: '/month',
    description: 'For organizations that require scale, security, and dedicated support.',
    features: ['SSO & security controls', 'Custom onboarding', 'Dedicated success manager'],
    cta: 'Subscribe',
    highlighted: false,
  },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 px-6 py-16">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Simple monthly plans</h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Choose a plan that fits your stage today. Stripe Checkout integration can be connected later
            by wiring each subscribe action to a checkout session endpoint.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                plan.highlighted
                  ? 'border-primary/70 ring-2 ring-primary/40 dark:ring-primary/50'
                  : 'border-border/80'
              }`}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              ) : null}

              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.billing}</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
