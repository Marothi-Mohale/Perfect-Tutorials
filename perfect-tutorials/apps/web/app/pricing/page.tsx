import Link from "next/link";
import { CheckoutButton } from "@/components/pricing/checkout-button";

const plans = [
  {
    id: "starter-1-session",
    name: "Starter",
    price: "R499",
    sub: "Great for targeted support",
    features: [
      "1 focused tutoring session",
      "Subject-specific guidance",
      "Practice support",
      "Email follow-up",
    ],
    featured: false,
  },
  {
    id: "standard-4-sessions",
    name: "Standard",
    price: "R1,499",
    sub: "Best for steady progress",
    features: [
      "4 monthly sessions",
      "Weekly academic support",
      "Progress check-ins",
      "Priority scheduling",
    ],
    featured: true,
    checkoutEnabled: true,
  },
  {
    id: "premium-8-sessions",
    name: "Premium",
    price: "R2,999",
    sub: "For intensive improvement",
    features: [
      "8 monthly sessions",
      "Deep exam preparation",
      "Personalized support plan",
      "Direct tutor guidance",
    ],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10">
        <div className="text-center reveal-up">
          <span className="section-label">Pricing</span>
          <h1 className="section-title">Simple, Transparent Pricing</h1>
          <p className="section-sub mx-auto">
            No hidden fees. Choose the support level that matches your academic goals.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[1.8rem] p-8 ${
                plan.featured
                  ? "bg-[linear-gradient(135deg,var(--sky),var(--navy))] text-white shadow-2xl"
                  : "surface-card hover-lift"
              }`}
            >
              <div className="text-sm font-bold uppercase tracking-[0.18em]">
                {plan.name}
              </div>

              <div className="mt-5 text-5xl font-bold">{plan.price}</div>
              <p className={`mt-3 ${plan.featured ? "text-white/80" : ""}`}>{plan.sub}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span>{plan.featured ? "✓" : "•"}</span>
                    <span className={plan.featured ? "text-white/85" : "text-[var(--muted)]"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`mt-8 inline-flex ${
                  plan.featured ? "btn-secondary" : "btn-primary"
                }`}
              >
                Get Started
              </Link>
              {plan.checkoutEnabled ? (
                <CheckoutButton
                  packageId={plan.id}
                  className={`mt-3 ${
                    plan.featured ? "btn-secondary" : "btn-primary"
                  }`}
                >
                  Checkout with Stripe
                </CheckoutButton>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
