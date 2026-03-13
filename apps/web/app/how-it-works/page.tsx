const steps = [
  {
    num: "1",
    title: "Sign Up",
    text: "Tell us your grade level, subject, and the kind of support you need.",
  },
  {
    num: "2",
    title: "Choose a Plan",
    text: "Pick a session package that fits your goals, schedule, and budget.",
  },
  {
    num: "3",
    title: "Attend Sessions",
    text: "Join structured tutoring sessions online or in person with focused guidance.",
  },
  {
    num: "4",
    title: "Track Progress",
    text: "Receive feedback, practise consistently, and improve your academic performance.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="py-20">
      <div className="page-shell">
        <div className="text-center reveal-up">
          <span className="section-label">The Process</span>
          <h1 className="section-title">How It Works</h1>
          <p className="section-sub mx-auto">
            Getting started is simple. A clear process that helps students move from
            uncertainty to confidence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="surface-card hover-lift rounded-[1.5rem] p-7 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pale)] text-xl font-bold text-[var(--sky)]">
                {step.num}
              </div>
              <h3 className="mt-5 text-2xl">{step.title}</h3>
              <p className="mt-3">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}