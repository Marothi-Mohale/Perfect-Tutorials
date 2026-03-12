const removeTrailingSlash = (value: string) => value.replace(/\/$/, "");

export const publicEnv = {
  siteUrl: removeTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  apiBaseUrl: removeTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
  ),
  clerkPublishableKey:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  clerkSignInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in',
  clerkSignUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up',
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  cloudinaryCloudName:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
};

export const apiOrigin = new URL(publicEnv.apiBaseUrl).origin;
