import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10">
        <div className="surface-card mx-auto max-w-3xl rounded-[1.8rem] p-8 text-center">
          <span className="section-label">Checkout Cancelled</span>
          <h1 className="section-title">No payment was taken</h1>
          <p className="section-sub mx-auto mt-4 max-w-2xl">
            Your Stripe checkout was cancelled before completion. You can return
            to pricing and try again when you are ready.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/pricing" className="btn-primary">
              Back to Pricing
            </Link>
            <Link href="/contact" className="btn-secondary">
              Ask a Question
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
