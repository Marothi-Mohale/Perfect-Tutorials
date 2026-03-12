const removeTrailingSlash = (value: string) => value.replace(/\/$/, "");

export const publicEnv = {
  siteUrl: removeTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  apiBaseUrl: removeTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
  ),
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  clerkPublishableKey:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  cloudinaryCloudName:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
};

export const apiOrigin = new URL(publicEnv.apiBaseUrl).origin;
