import { auth, currentUser } from "@clerk/nextjs/server";

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const getConfiguredAdminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeEmail);

const getUserRole = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : null;

export async function getAdminAccess() {
  const authState = await auth();
  const user = authState.userId ? await currentUser() : null;
  const primaryEmail = user?.primaryEmailAddress?.emailAddress
    ? normalizeEmail(user.primaryEmailAddress.emailAddress)
    : null;
  const configuredAdminEmails = getConfiguredAdminEmails();
  const publicRole = getUserRole(user?.publicMetadata?.role);
  const isAdmin =
    publicRole === "admin" ||
    (primaryEmail !== null && configuredAdminEmails.includes(primaryEmail));

  return {
    authState,
    user,
    primaryEmail,
    configuredAdminEmails,
    isAdmin,
  };
}
