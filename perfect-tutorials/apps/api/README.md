## Perfect Tutorials API

NestJS API for operational endpoints and future tutoring workflows.

## Scripts

```bash
pnpm start:dev
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
- `CORS_ORIGINS` accepts a comma-separated allowlist. If unset, CORS is open.

## Production Notes

Run behind a reverse proxy and set `CORS_ORIGINS` to the deployed web origin instead of leaving it open.
