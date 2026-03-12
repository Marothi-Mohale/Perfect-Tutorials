# Perfect Tutorials

Monorepo for the Perfect Tutorials marketing site and API.

## Apps

- `apps/web`: Next.js marketing site
- `apps/api`: NestJS API

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

## Environment

Copy values from `.env.example` into your deployment platform or local shell.

## Deploying To Vercel

Deploy this monorepo as two separate Vercel projects:

- `apps/web`: Next.js site
- `apps/api`: NestJS API

### 1. Create the API project

In Vercel:

- Import this repository
- Set the Root Directory to `apps/api`
- Let Vercel detect NestJS automatically

Add these required environment variables to the API project:

- `DATABASE_URL`
- `FRONTEND_URL=https://<your-web-domain>`
- `CORS_ORIGINS=https://<your-web-domain>`
- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_INQUIRY_TO_EMAIL`
- `RESEND_SEND_STUDENT_CONFIRMATION`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

After the first deploy, run Prisma migrations against the production database:

```bash
pnpm --filter api db:migrate:deploy
```

### 2. Create the web project

In Vercel:

- Import the same repository again
- Set the Root Directory to `apps/web`
- Let Vercel detect Next.js automatically

Add these required environment variables to the web project:

- `NEXT_PUBLIC_SITE_URL=https://<your-web-domain>`
- `NEXT_PUBLIC_API_BASE_URL=/backend-api`
- `INTERNAL_API_BASE_URL=https://<your-api-domain>/api`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `ADMIN_EMAILS`

### 3. Verify

Once both projects are deployed:

- open the web URL and test the contact form
- verify sign-in/sign-up with Clerk
- open `/dashboard/inquiries` with an admin account
- verify the API health endpoint at `https://<your-api-domain>/api/health`
