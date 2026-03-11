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
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]">📚</span>
              Curriculum-aligned sessions
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]">👨‍🏫</span>
              Qualified, experienced tutors
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]">📊</span>
              Measurable progress tracking
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pale)]">💬</span>
              Ongoing tutor communication
            </li>
          </ul>
        </div>

        <div className="surface-card rounded-[1.8rem] p-8 reveal-up">
          <h2 className="text-3xl">Create Your Enquiry</h2>
          <p className="mt-3">
            Join students already building confidence with Perfect Tutorials.
          </p>

          <form className="mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label">First Name</label>
                <input className="input" />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label">Level of Study</label>
                <select className="select">
                  <option>Choose level</option>
                  <option>Grade 8–9</option>
                  <option>Grade 10–12</option>
                  <option>University</option>
                </select>
              </div>
              <div>
                <label className="label">Subject</label>
                <select className="select">
                  <option>Select subject</option>
                  <option>Mathematics</option>
                  <option>Physical Science</option>
                  <option>Both</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Message</label>
              <textarea rows={5} className="textarea" />
            </div>

            <button type="submit" className="btn-primary">
              Sign Up & Get Started →
            </button>

            <p className="text-sm text-[var(--muted)]">
              🔒 Your information is secure and never shared.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}