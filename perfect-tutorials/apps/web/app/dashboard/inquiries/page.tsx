import Link from "next/link";
import { getAdminAccess } from "@/lib/admin";

type Inquiry = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  levelOfStudy: string;
  subject: string;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type InquiriesResponse = {
  success: true;
  message: string;
  data: {
    inquiries: Inquiry[];
  };
};

const internalApiBaseUrl =
  process.env.INTERNAL_API_BASE_URL ?? "http://127.0.0.1:3001/api";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

async function getInquiries() {
  const response = await fetch(`${internalApiBaseUrl}/inquiries`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load enquiries");
  }

  return (await response.json()) as InquiriesResponse;
}

export default async function DashboardInquiriesPage() {
  const { authState, configuredAdminEmails, isAdmin, primaryEmail } =
    await getAdminAccess();

  if (!authState.userId) {
    return authState.redirectToSignIn();
  }

  if (!isAdmin) {
    return (
      <section className="hero-bg relative py-20">
        <div className="page-shell relative z-10">
          <div className="surface-card rounded-[1.8rem] p-8">
            <span className="section-label">Admin Only</span>
            <h1 className="section-title">You do not have access to enquiries</h1>
            <p className="section-sub mt-4">
              Admin access is granted when the signed-in Clerk user has
              `publicMetadata.role = "admin"` or their primary email is listed in
              `ADMIN_EMAILS`.
            </p>
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white/80 p-5">
              <p className="text-sm text-[var(--navy)]">
                Signed-in email: {primaryEmail ?? "No primary email available"}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Configured admin emails:{" "}
                {configuredAdminEmails.length > 0
                  ? configuredAdminEmails.join(", ")
                  : "none"}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard" className="btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  let inquiries: Inquiry[] = [];
  let loadError = "";

  try {
    const response = await getInquiries();
    inquiries = response.data.inquiries;
  } catch {
    loadError =
      "The enquiries service is unavailable right now. Try again in a moment.";
  }

  return (
    <section className="hero-bg relative py-20">
      <div className="page-shell relative z-10">
        <div className="surface-card rounded-[1.8rem] p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-label">Admin</span>
              <h1 className="section-title">Enquiries</h1>
              <p className="section-sub mt-4">
                Review incoming enquiries, contact details, and recent messages
                from prospective students.
              </p>
            </div>
            <Link href="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white/80 p-5">
            <p className="text-sm text-[var(--muted)]">
              Showing {inquiries.length} enquiry{inquiries.length === 1 ? "" : "ies"}
            </p>
          </div>

          {loadError ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-red-700">{loadError}</p>
            </div>
          ) : null}

          {!loadError && inquiries.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white/80 p-8">
              <h2 className="text-2xl">No enquiries yet</h2>
              <p className="mt-3">
                New submissions from the contact form will appear here.
              </p>
            </div>
          ) : null}

          {!loadError && inquiries.length > 0 ? (
            <div className="mt-8 grid gap-5">
              {inquiries.map((inquiry) => (
                <article
                  key={inquiry.id}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white/85 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl">
                        {inquiry.firstName} {inquiry.lastName ?? ""}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Submitted {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                    <div className="inline-flex rounded-full bg-[var(--pale)] px-3 py-1 text-sm font-semibold text-[var(--navy)]">
                      {inquiry.status}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="label">Email</p>
                      <a href={`mailto:${inquiry.email}`} className="text-[var(--navy)] hover:underline">
                        {inquiry.email}
                      </a>
                    </div>
                    <div>
                      <p className="label">Phone</p>
                      <p>{inquiry.phone ?? "Not provided"}</p>
                    </div>
                    <div>
                      <p className="label">Level</p>
                      <p>{inquiry.levelOfStudy}</p>
                    </div>
                    <div>
                      <p className="label">Subject</p>
                      <p>{inquiry.subject}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="label">Message</p>
                    <p>{inquiry.message ?? "No message provided."}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
