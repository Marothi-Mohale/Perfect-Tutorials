const removeTrailingSlash = (value: string) => value.replace(/\/$/, "");

const defaultSiteUrl = "http://localhost:3000";
const defaultApiBasePath = "/backend-api";

const resolveApiBaseUrl = () => {
  const configuredValue = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!configuredValue) {
    return defaultApiBasePath;
  }

  return removeTrailingSlash(configuredValue);
};

export const publicEnv = {
  siteUrl: removeTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl,
  ),
  apiBaseUrl: resolveApiBaseUrl(),
  clerkPublishableKey:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  clerkSignInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in',
  clerkSignUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up',
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  cloudinaryCloudName:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
};

export const apiOrigin = publicEnv.apiBaseUrl.startsWith("http")
  ? new URL(publicEnv.apiBaseUrl).origin
  : new URL(publicEnv.siteUrl).origin;
