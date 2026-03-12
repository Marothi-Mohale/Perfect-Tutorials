import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { publicEnv } from "../lib/env";

const siteUrl = publicEnv.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Perfect Tutorials",
    template: "%s | Perfect Tutorials",
  },
  description:
    "Maths and science tutoring for high school and university students, with structured support built around confidence and measurable progress.",
  applicationName: "Perfect Tutorials",
  keywords: [
    "maths tutor",
    "science tutor",
    "online tutoring",
    "high school maths",
    "physical science support",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Perfect Tutorials",
    title: "Perfect Tutorials",
    description:
      "Maths and science tutoring for students who need clearer explanations, stronger exam technique, and steady academic progress.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Tutorials",
    description:
      "Maths and science tutoring for high school and university students.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
