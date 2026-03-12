import { ContactForm } from "../../components/contact-form";

export default function ContactPage() {
  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="reveal-up">
          <span className="section-label">Join Today</span>
          <h1 className="section-title">Start Your Journey to Academic Excellence</h1>
          <p className="section-sub">
            Tell us what subject you need help with and we’ll help you choose the
            right support path.
          </p>

          <ul className="mt-8 space-y-4 text-[var(--navy)]">
            <li className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]"
                aria-hidden="true"
              >
                📚
              </span>
              Curriculum-aligned sessions
            </li>
            <li className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]"
                aria-hidden="true"
              >
                👨‍🏫
              </span>
              Qualified, experienced tutors
            </li>
            <li className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]"
                aria-hidden="true"
              >
                📊
              </span>
              Measurable progress tracking
            </li>
            <li className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]"
                aria-hidden="true"
              >
                💬
              </span>
              Ongoing tutor communication
            </li>
          </ul>

          <div className="mt-10 rounded-[1.6rem] border border-[var(--border)] bg-white/75 p-6 backdrop-blur">
            <h2 className="text-2xl">Direct Contact</h2>
            <p className="mt-3">
              Prefer a direct enquiry? Reach us on the details below and we will
              respond within one business day.
            </p>
            <div className="mt-6 space-y-3 text-[var(--navy)]">
              <p>
                Email:{" "}
                <a
                  href="mailto:mohalemarothi@gmail.com"
                  className="font-semibold hover:underline"
                >
                  mohalemarothi@gmail.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+27720697425" className="font-semibold hover:underline">
                  0720697425
                </a>
              </p>
              <p>50 Durban Road, Mowbray, Cape Town, 7700</p>
            </div>
          </div>
        </div>

        <div className="surface-card rounded-[1.8rem] p-8 reveal-up">
          <h2 className="text-3xl">Create Your Enquiry</h2>
          <p className="mt-3">
            Send your enquiry directly to our team and we will respond within one
            business day.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
