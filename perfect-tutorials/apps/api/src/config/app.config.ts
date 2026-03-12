import { registerAs } from '@nestjs/config';

const DEFAULT_API_PORT = 3001;
const DEFAULT_FRONTEND_URL = 'http://localhost:3000';

const parsePort = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? `${DEFAULT_API_PORT}`, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_API_PORT;
  }

  return parsed;
};

const parseCsv = (value: string | undefined, fallback: string[]): string[] => {
  const entries = value
    ?.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return entries?.length ? entries : fallback;
};

const parseBoolean = (value: string | undefined): boolean =>
  value?.toLowerCase() === 'true';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(process.env.PORT),
  frontendUrl: process.env.FRONTEND_URL ?? DEFAULT_FRONTEND_URL,
  corsOrigins: parseCsv(process.env.CORS_ORIGINS, [
    process.env.FRONTEND_URL ?? DEFAULT_FRONTEND_URL,
    'http://127.0.0.1:3000',
  ]),
  databaseUrl: process.env.DATABASE_URL ?? '',
  integrations: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY ?? '',
    clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL ?? '',
    resendInquiryToEmail: process.env.RESEND_INQUIRY_TO_EMAIL ?? '',
    resendSendStudentConfirmation: parseBoolean(
      process.env.RESEND_SEND_STUDENT_CONFIRMATION,
    ),
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
}));
