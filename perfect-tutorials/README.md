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

## Deploying To Render

Render is the simplest deployment target for this repo because it can provision the web app, API, and Postgres from one Blueprint file.

Use [render.yaml](/workspaces/Perfect-Tutorials/render.yaml) with Render Blueprints.

### 1. Create the Blueprint

In Render:

- connect this GitHub repository
- create a new Blueprint
- select [render.yaml](/workspaces/Perfect-Tutorials/render.yaml)

This Blueprint creates:

- `perfect-tutorials-web`
- `perfect-tutorials-api`
- `perfect-tutorials-db`

The current Blueprint uses Render `free` plans so you can get the stack up quickly. For production, change those plans in [render.yaml](/workspaces/Perfect-Tutorials/render.yaml) or in the Render dashboard.

### 2. Fill in the prompted environment variables

Render will prompt for every `sync: false` value during initial Blueprint creation.

Set these for the web service:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLERK_SECRET_KEY`
- `ADMIN_EMAILS`

Set these for the API service:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_INQUIRY_TO_EMAIL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 3. First deploy and URL assumptions

The Blueprint assumes these default Render service URLs:

- `https://perfect-tutorials-web.onrender.com`
- `https://perfect-tutorials-api.onrender.com`

If you rename either service, or later attach a custom domain, update these settings in Render and trigger a rebuild of the web service:

- `NEXT_PUBLIC_SITE_URL`
- `INTERNAL_API_BASE_URL`
- `FRONTEND_URL`
- `CORS_ORIGINS`

The frontend uses Docker build-time variables for `NEXT_PUBLIC_*`, which Render supports automatically for Docker services through service environment variables.

### 4. Run Prisma migrations

After the database and API are created, run:

```bash
cd perfect-tutorials
pnpm --filter api db:migrate:deploy
```

Use the `DATABASE_URL` from the `perfect-tutorials-db` Render Postgres instance.

### 5. Verify

- open the web URL and test the contact form
- verify sign-in/sign-up with Clerk
- open `/dashboard/inquiries` with an admin account
- verify the API health endpoint at `https://perfect-tutorials-api.onrender.com/api/health`

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

## Deploying To Azure App Service

Deploy the frontend and API as separate Linux App Services backed by custom containers.

### 1. Create Azure resources

- Create an Azure Container Registry (ACR)
- Create one Linux Web App for `web`
- Create one Linux Web App for `api`
- Provision PostgreSQL separately, for example Azure Database for PostgreSQL

Set `WEBSITES_PORT=8080` on both App Services.
Configure each App Service to pull from ACR before the first deployment, either by enabling a managed identity with the `AcrPull` role or by setting the `DOCKER_REGISTRY_SERVER_URL`, `DOCKER_REGISTRY_SERVER_USERNAME`, and `DOCKER_REGISTRY_SERVER_PASSWORD` app settings.

### 2. Configure GitHub secrets and variables

Add these GitHub Actions secrets:

- `AZURE_CONTAINER_REGISTRY_LOGIN_SERVER`
- `AZURE_CONTAINER_REGISTRY_USERNAME`
- `AZURE_CONTAINER_REGISTRY_PASSWORD`
- `AZURE_WEB_APP_PUBLISH_PROFILE`
- `AZURE_API_APP_PUBLISH_PROFILE`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `ADMIN_EMAILS`

Add these GitHub Actions variables:

- `AZURE_WEB_APP_NAME`
- `AZURE_API_APP_NAME`
- `AZURE_WEB_SITE_URL=https://<your-web-domain>`
- `AZURE_WEB_PUBLIC_API_BASE_URL=/backend-api`
- `AZURE_WEB_INTERNAL_API_BASE_URL=https://<your-api-domain>/api`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>`

The deployment workflow is [azure-app-service.yml](/workspaces/Perfect-Tutorials/.github/workflows/azure-app-service.yml).

### 3. Configure App Service settings

Set these app settings on the API App Service:

- `PORT=8080`
- `FRONTEND_URL=https://<your-web-domain>`
- `CORS_ORIGINS=https://<your-web-domain>`
- `DATABASE_URL`
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

Set these app settings on the web App Service:

- `PORT=8080`
- `NEXT_PUBLIC_SITE_URL=https://<your-web-domain>`
- `NEXT_PUBLIC_API_BASE_URL=/backend-api`
- `INTERNAL_API_BASE_URL=https://<your-api-domain>/api`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `ADMIN_EMAILS`

The `NEXT_PUBLIC_*` values for the frontend are also passed during Docker build in GitHub Actions so the client bundle is generated with the correct production URLs and keys.

### 4. Run database migrations

After the API image is deployed, run Prisma migrations against the production database:

```bash
cd perfect-tutorials
pnpm --filter api db:migrate:deploy
```

Use the production `DATABASE_URL` when running that command.

### 5. Verify

- open the web URL and test the contact form
- verify sign-in/sign-up with Clerk
- open `/dashboard/inquiries` with an admin account
- verify the API health endpoint at `https://<your-api-domain>/api/health`
