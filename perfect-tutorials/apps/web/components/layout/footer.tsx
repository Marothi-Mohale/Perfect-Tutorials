import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer-theme mt-16">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Image
            src="/CEO.jpg"
            alt="Perfect Tutorials founder portrait"
            width={460}
            height={460}
            sizes="(min-width: 768px) 22rem, 100vw"
            className="mt-6 h-auto w-full max-w-[260px] rounded-[1.5rem] object-cover"
          />
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
            <p>50 Durban Road, Cape Town, Western Cape, 7700</p>
            <p>
              <a href="mailto:mohalemarothi@gmail.com">
                mohalemarothi@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:0720697425">0720697425</a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © 2026 Perfect Tutorials. All rights reserved.
      </div>
    </footer>
  );
}
