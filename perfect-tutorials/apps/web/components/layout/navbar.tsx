import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const { userId } = await auth();

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="nav-shell flex items-center justify-between gap-4 py-2 md:gap-5">
        <BrandLogo className="shrink-0" imageClassName="h-8 w-auto md:h-9" priority />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--navy)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {userId ? (
            <>
              <Link href="/dashboard" className="btn-primary navbar-cta shrink-0">
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="btn-secondary navbar-cta shrink-0">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary navbar-cta shrink-0">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
