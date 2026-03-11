import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Atom, Calculator, Sparkles, Star, Zap } from "lucide-react";

const highlights = [
  {
    title: "Maths without the panic",
    copy: "Break down tough topics into fast, clear wins that actually stick.",
    icon: Calculator,
    tone: "from-[#ffd7a8] to-[#ff8b6b]",
  },
  {
    title: "Science that clicks",
    copy: "Visual explanations and exam-focused coaching for better marks and less stress.",
    icon: Atom,
    tone: "from-[#8df0d2] to-[#31b9a4]",
  },
  {
    title: "Momentum every week",
    copy: "Study plans, progress check-ins, and lessons built around your real goals.",
    icon: Zap,
    tone: "from-[#b6b4ff] to-[#6676ff]",
  },
];

const stats = [
  { value: "92%", label: "say lessons feel easier after the first month" },
  { value: "1:1", label: "support tailored to pace, exams, and confidence" },
  { value: "24/7", label: "study momentum with clear notes and next steps" },
];

export default function HomePage() {
  return (
    <div>
      <section className="hero-bg youth-hero relative isolate overflow-hidden">
        <div className="page-shell relative z-10 grid gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24">
          <div className="reveal-up">
            <span className="section-label">For ambitious students who want more</span>

            <h1 className="section-title max-w-3xl text-balance">
              Study support that looks sharp, feels personal, and gets real results.
            </h1>

            <p className="section-sub max-w-2xl">
              Perfect Tutorials helps high school and university students level up in
              maths and science with confidence-building sessions, modern learning
              tools, and teaching that actually makes sense.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses" className="btn-primary">
                Start Exploring
                <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Book a Session
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="pill-chip">
                <Sparkles size={16} />
                Exam-ready tutoring
              </div>
              <div className="pill-chip">
                <Star size={16} />
                Confidence-first coaching
              </div>
              <div className="pill-chip">
                <Zap size={16} />
                Online flexibility
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-tile">
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-copy">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-up relative">
            <div className="hero-stack">
              <div className="hero-photo-card">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1838]/55 via-transparent to-transparent" />
                <Image
                  src="/hero-tutor1.jpg"
                  alt="Tutor helping a student learn maths and science"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover object-center"
                  priority
                />
                <div className="hero-badge left-4 top-4">
                  <span className="hero-badge-dot bg-[#7ef0cc]" />
                  Live support
                </div>
                <div className="hero-badge bottom-4 right-4">
                  <span className="hero-badge-dot bg-[#ffd166]" />
                  Weekly wins
                </div>
              </div>

              <div className="floating-note floating-note-left">
                <p className="floating-note-kicker">This week</p>
                <p className="floating-note-title">Functions, stoichiometry, test prep</p>
              </div>

              <div className="floating-note floating-note-right">
                <p className="floating-note-kicker">Student vibe</p>
                <p className="floating-note-title">Less cramming. More clarity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-8 md:py-12">
        <div className="info-band">
          <p>Built for students who want structure, style, and serious academic support.</p>
          <p>From first principles to final exam prep, every lesson is tailored.</p>
        </div>
      </section>

      <section className="page-shell py-12 md:py-18">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">What makes it different</span>
            <h2 className="section-title max-w-2xl">A smarter tutoring experience for a new generation.</h2>
          </div>
          <p className="section-sub max-w-xl">
            The experience is structured enough to drive results and modern enough to
            feel motivating from day one.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ title, copy, icon: Icon, tone }) => (
            <div key={title} className="feature-card hover-lift">
              <div className={`feature-icon bg-gradient-to-br ${tone}`}>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell pb-18 pt-6 md:pb-24">
        <div className="cta-panel">
          <div>
            <span className="section-label text-white/70">Ready to level up?</span>
            <h2 className="section-title max-w-2xl text-white">
              Turn stressful subjects into your strongest ones.
            </h2>
            <p className="mt-4 max-w-2xl text-[1.02rem] text-white/70">
              Build consistency, sharpen technique, and walk into class or exams with
              more confidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-contrast">
              Book Your First Session
            </Link>
            <Link href="/about" className="btn-ghost-light">
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
