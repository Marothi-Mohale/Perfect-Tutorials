import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10">
        <div className="surface-card mx-auto max-w-3xl rounded-[1.8rem] p-8 text-center">
          <span className="section-label">Payment Success</span>
          <h1 className="section-title">Your checkout was successful</h1>
          <p className="section-sub mx-auto mt-4 max-w-2xl">
            Stripe has confirmed the payment. You can continue to your dashboard
            or contact us if you want to schedule your first tutoring session.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
