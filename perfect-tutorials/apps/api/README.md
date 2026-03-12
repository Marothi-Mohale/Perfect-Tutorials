## Perfect Tutorials API

NestJS API for operational endpoints and future tutoring workflows.

## Scripts

```bash
pnpm postinstall
pnpm prisma:generate
pnpm db:migrate:deploy
pnpm start:dev
pnpm start
pnpm start:prod
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

## Runtime Notes

- Default port: `3001`
- Global route prefix: `/api`
- Health endpoint: `GET /api/health`
- `CORS_ORIGINS` accepts a comma-separated allowlist. If unset, the API falls back to the configured frontend origin plus `http://127.0.0.1:3000`.

## Production Notes

Run behind a reverse proxy and set `CORS_ORIGINS` to the deployed web origin instead of leaving it open.

## Prisma Deploy Workflow

Use this order in hosted environments:

```bash
pnpm install --frozen-lockfile
pnpm --filter api prisma:generate
pnpm --filter api db:migrate:deploy
pnpm --filter api build
pnpm --filter api start
```

- `postinstall` already runs `prisma generate`, so explicit `prisma:generate` is mainly useful for debugging.
- Use `prisma migrate deploy` in production, not `prisma migrate dev`.

## Railway Checklist

1. Set the service root to the repository root and deploy the `apps/api` package through pnpm workspace commands.
2. Add environment variables:
   - `NODE_ENV=production`
   - `PORT` supplied by Railway
   - `DATABASE_URL`
   - `FRONTEND_URL`
   - `CORS_ORIGINS`
   - any live provider secrets you are actively using
3. Build command:
   - `pnpm install --frozen-lockfile && pnpm --filter api db:migrate:deploy && pnpm --filter api build`
4. Start command:
   - `pnpm --filter api start`
5. Health check path:
   - `/api/health`

## Render Checklist

1. Create a Web Service from the repo root.
2. Set environment variables:
   - `NODE_ENV=production`
   - `PORT` supplied by Render
   - `DATABASE_URL`
   - `FRONTEND_URL`
   - `CORS_ORIGINS`
   - any live provider secrets you are actively using
3. Build command:
   - `pnpm install --frozen-lockfile && pnpm --filter api db:migrate:deploy && pnpm --filter api build`
4. Start command:
   - `pnpm --filter api start`
5. Health check path:
   - `/api/health`

## Minimal Deploy Checklist

- Confirm `PORT` is not hardcoded. The API reads `process.env.PORT` through Nest config.
- Confirm `DATABASE_URL` points to the production PostgreSQL instance.
- Confirm `FRONTEND_URL` and `CORS_ORIGINS` match the deployed web app origin.
- Run production migrations with `pnpm --filter api db:migrate:deploy`.
- Verify `GET /api/health` returns `200` after deploy.
