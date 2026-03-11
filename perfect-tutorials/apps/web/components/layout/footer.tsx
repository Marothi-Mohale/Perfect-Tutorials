import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer-theme mt-16">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h3 className="text-2xl">Perfect Tutorials</h3>
          <p className="mt-4">
            Helping learners master Maths and Science with confidence, clarity,
            and consistent support.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">Quick Links</h4>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/about">About</Link>
            <Link href="/courses">Courses</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">Contact</h4>
          <div className="mt-4 space-y-3">
            <p>Cape Town, South Africa</p>
            <p>info@perfecttutorials.co.za</p>
            <p>+27 00 000 0000</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © 2026 Perfect Tutorials. All rights reserved.
      </div>
    </footer>
  );
}