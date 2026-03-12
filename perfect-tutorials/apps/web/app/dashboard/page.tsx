import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getAdminAccess } from "@/lib/admin";

export default async function DashboardPage() {
  const { authState, configuredAdminEmails, isAdmin, primaryEmail } =
    await getAdminAccess();

  if (!authState.userId) {
    return authState.redirectToSignIn();
  }

  const { userId } = authState;
  const user = await currentUser();

  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10">
        <div className="surface-card rounded-[1.8rem] p-8">
          <span className="section-label">Dashboard</span>
          <h1 className="section-title">Welcome back</h1>
          <p className="section-sub mt-4">
            This protected dashboard is the first authenticated surface for the
            MVP. The Clerk user ID below is the stable identifier to link with
            future backend user records.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-5">
              <h2 className="text-2xl">Profile</h2>
              <p className="mt-3">
                {user?.firstName ?? user?.username ?? "Student"}
                {user?.lastName ? ` ${user.lastName}` : ""}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {user?.primaryEmailAddress?.emailAddress ?? "No email available"}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-5">
              <h2 className="text-2xl">Backend Link Key</h2>
              <p className="mt-3 font-mono text-sm text-[var(--navy)]">
                {userId}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Persist this Clerk user ID in the API later when you create your
                application user table.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-5 md:col-span-2">
              <h2 className="text-2xl">Admin Tools</h2>
              <p className="mt-3">
                Access the enquiries inbox here when your Clerk account is marked
                as an admin.
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Signed-in email: {primaryEmail ?? "No email available"}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Admin access: {isAdmin ? "granted" : "not granted"}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Configured admin emails:{" "}
                {configuredAdminEmails.length > 0
                  ? configuredAdminEmails.join(", ")
                  : "none"}
              </p>
              <div className="mt-5">
                <Link href="/dashboard/inquiries" className="btn-primary">
                  Open Enquiries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
