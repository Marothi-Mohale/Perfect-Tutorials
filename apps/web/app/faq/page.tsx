const faqs = [
  {
    question: "Are sessions online or in-person?",
    answer:
      "We offer both. You can join online via video call or attend in person, depending on availability.",
  },
  {
    question: "How many students are in each session?",
    answer:
      "Group sessions are kept small for personalized attention, and one-on-one support is also available.",
  },
  {
    question: "What if I miss a session?",
    answer:
      "Missed sessions can be rescheduled with notice and are not automatically forfeited.",
  },
  {
    question: "Do you follow the school curriculum?",
    answer:
      "Yes. Sessions are aligned to CAPS for school learners and adapted for university coursework where needed.",
  },
  {
    question: "When do sessions run?",
    answer:
      "Sessions are typically available on weekday afternoons and Saturdays, with flexible options where possible.",
  },
  {
    question: "How do I pay?",
    answer:
      "We’ll support secure online payments as part of the full platform build using Stripe.",
  },
];

export default function FaqPage() {
  return (
    <section className="py-20">
      <div className="page-shell">
        <div className="text-center reveal-up">
          <span className="section-label">FAQs</span>
          <h1 className="section-title">Common Questions</h1>
          <p className="section-sub mx-auto">
            Everything you need to know before enrolling.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="surface-card hover-lift rounded-[1.4rem] p-6">
              <h3 className="text-xl">{faq.question}</h3>
              <p className="mt-3">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}