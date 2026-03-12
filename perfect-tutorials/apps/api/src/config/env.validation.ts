type RawEnv = Record<string, unknown>;

const optionalKeys = [
  'FRONTEND_URL',
  'CORS_ORIGINS',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'RESEND_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

const requiredKeys = ['DATABASE_URL'] as const;

const ensureString = (env: RawEnv, key: string) => {
  const value = env[key];

  if (typeof value !== 'string') {
    throw new Error(`Environment variable ${key} must be a string.`);
  }

  return value;
};

export const validateEnv = (env: RawEnv) => {
  const port = env.PORT;

  if (port !== undefined) {
    if (typeof port !== 'string') {
      throw new Error('Environment variable PORT must be a string.');
    }

    const parsedPort = Number.parseInt(port, 10);

    if (Number.isNaN(parsedPort) || parsedPort <= 0) {
      throw new Error('Environment variable PORT must be a positive integer.');
    }
  }

  for (const key of requiredKeys) {
    const value = ensureString(env, key).trim();

    if (!value) {
      throw new Error(`Environment variable ${key} is required.`);
    }
  }

  for (const key of optionalKeys) {
    const value = env[key];

    if (value !== undefined && typeof value !== 'string') {
      throw new Error(`Environment variable ${key} must be a string.`);
    }
  }

  return env;
};
