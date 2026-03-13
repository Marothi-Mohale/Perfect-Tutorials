const testimonials = [
  {
    quote:
      "I went from failing Grade 11 Maths to getting 78% in my final exam. The tutors actually explain things until you understand.",
    name: "Lerato M.",
    role: "Grade 11 · Mathematics",
    avatar: "L",
  },
  {
    quote:
      "Physical Science finally clicked for me here. The way they break down electricity and waves made everything so much clearer.",
    name: "Thabo K.",
    role: "Grade 12 · Physical Science",
    avatar: "T",
  },
  {
    quote:
      "As a first-year engineering student, Calculus was destroying me. These sessions genuinely saved my semester.",
    name: "Ayanda N.",
    role: "1st Year · University Maths",
    avatar: "A",
  },
];

export default function TestimonialsPage() {
  return (
    <section className="py-20">
      <div className="page-shell">
        <div className="text-center reveal-up">
          <span className="section-label">Student Stories</span>
          <h1 className="section-title">Results That Speak</h1>
          <p className="section-sub mx-auto">
            Hear from students whose confidence and academic performance improved.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div key={item.name} className="surface-card hover-lift rounded-[1.6rem] p-7">
              <div className="text-xl text-[var(--sky)]">★★★★★</div>
              <p className="mt-5 text-base leading-8 text-[var(--text)]">“{item.quote}”</p>

              <div className="mt-7 flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{
                    background:
                      index % 2 === 0
                        ? "linear-gradient(135deg, var(--sky), var(--navy))"
                        : "linear-gradient(135deg, var(--science), #1a7a6a)",
                  }}
                >
                  {item.avatar}
                </div>
                <div>
                  <div className="font-semibold text-[var(--navy)]">{item.name}</div>
                  <div className="text-sm text-[var(--muted)]">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}