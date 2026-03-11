export default function AboutPage() {
  return (
    <section className="py-20">
      <div className="page-shell">
        <div className="surface-card rounded-[2rem] p-10 md:p-14">
          <span className="section-label">About Us</span>
          <h1 className="section-title">Learn. Grow. Excel.</h1>
          <p className="section-sub">
            Perfect Tutorials is dedicated to helping every student reach their full
            academic potential in Mathematics and Physical Science through clear
            teaching, personal attention, and structured academic support.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.3rem] bg-[var(--math-light)] p-6">
              <h3 className="text-2xl">Clear Teaching</h3>
              <p className="mt-3">Complex topics explained simply and patiently.</p>
            </div>
            <div className="rounded-[1.3rem] bg-[var(--science-light)] p-6">
              <h3 className="text-2xl">Personal Support</h3>
              <p className="mt-3">Small-group and focused tutoring that adapts to the learner.</p>
            </div>
            <div className="rounded-[1.3rem] bg-[var(--pale)] p-6">
              <h3 className="text-2xl">Real Outcomes</h3>
              <p className="mt-3">Confidence, stronger marks, and better exam readiness.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}