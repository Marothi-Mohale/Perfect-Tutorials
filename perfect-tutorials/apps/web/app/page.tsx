import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="hero-bg relative">
        <div className="page-shell relative z-10 grid items-stretch gap-12 py-20 md:grid-cols-2 md:py-28">
          <div className="reveal-up">
            <span className="section-label">Trusted Maths & Science Support</span>

            <h1 className="section-title max-w-2xl">
              Master Maths and Science with confidence
            </h1>

            <p className="section-sub">
              Personalized tutoring that helps learners improve understanding,
              build confidence, and achieve stronger academic results.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses" className="btn-primary">
                Explore Courses
              </Link>
              <Link href="/contact" className="btn-secondary">
                Book a Session
              </Link>
            </div>
          </div>

          <div className="reveal-up relative h-full">
          <div className="relative min-h-[600px] h-full overflow-hidden rounded-[0.5rem]">
            <Image
              src="/hero-tutor1.jpg"
              alt="Tutor helping a student learn maths and science"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface-card hover-lift rounded-[1.5rem] p-6">
            <h3 className="text-2xl">Expert Guidance</h3>
            <p className="mt-3">
              Clear explanations and structured support for school and university learners.
            </p>
          </div>

          <div className="surface-card hover-lift rounded-[1.5rem] p-6">
            <h3 className="text-2xl">Flexible Learning</h3>
            <p className="mt-3">
              Online and guided tutoring options built around your academic goals.
            </p>
          </div>

          <div className="surface-card hover-lift rounded-[1.5rem] p-6">
            <h3 className="text-2xl">Real Results</h3>
            <p className="mt-3">
              Lessons focused on understanding, exam technique, and confidence building.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}