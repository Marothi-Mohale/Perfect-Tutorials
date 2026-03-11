import Link from "next/link";

const courses = [
  {
    title: "High School Mathematics",
    level: "Grade 8–12",
    price: "R350",
    accent: "var(--math)",
    bg: "var(--math-light)",
    features: [
      "Algebra, functions and graphs",
      "Geometry and trigonometry",
      "Calculus and exam revision",
      "Weekly practice support",
    ],
  },
  {
    title: "High School Physical Science",
    level: "Grade 10–12",
    price: "R380",
    accent: "var(--science)",
    bg: "var(--science-light)",
    features: [
      "Mechanics, waves and electricity",
      "Chemistry foundations",
      "Problem-solving techniques",
      "Practical exam support",
    ],
  },
  {
    title: "University Mathematics",
    level: "1st–3rd Year",
    price: "R420",
    accent: "var(--math)",
    bg: "var(--math-light)",
    features: [
      "Calculus and linear algebra",
      "Differential equations",
      "Tutorial and assignment help",
      "Test and exam preparation",
    ],
  },
  {
    title: "University Physical Science",
    level: "1st–3rd Year",
    price: "R420",
    accent: "var(--science)",
    bg: "var(--science-light)",
    features: [
      "Classical and modern physics",
      "Thermodynamics and optics",
      "Lab report guidance",
      "Exam revision sessions",
    ],
  },
];

export default function CoursesPage() {
  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10">
        <div className="text-center reveal-up">
          <span className="section-label">Courses</span>
          <h1 className="section-title">Programmes Built for Real Progress</h1>
          <p className="section-sub mx-auto">
            From Grade 8 to university level, our tutoring programmes are designed
            to strengthen understanding, improve marks, and build confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.title}
              className="surface-card hover-lift rounded-[1.75rem] overflow-hidden"
            >
              <div className="p-7">
                <div
                  className="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
                  style={{ background: course.bg, color: course.accent }}
                >
                  {course.level}
                </div>

                <h2 className="mt-5 text-3xl">{course.title}</h2>

                <ul className="mt-5 space-y-3">
                  {course.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[var(--muted)]">
                      <span style={{ color: course.accent }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] px-7 py-5">
                <div className="text-2xl font-bold text-[var(--navy)]">
                  {course.price}
                  <span className="ml-1 text-sm font-medium text-[var(--muted)]">/ session</span>
                </div>

                <Link href="/contact" className="btn-primary">
                  Enquire Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}