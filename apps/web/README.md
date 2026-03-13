## Perfect Tutorials Web

Marketing site for Perfect Tutorials, built with Next.js App Router.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

## Runtime Notes

- `NEXT_PUBLIC_SITE_URL` controls canonical and Open Graph URLs.
- Production builds use webpack because Turbopack is unstable in the current workspace sandbox.
- The contact page uses a mail client flow until a real enquiry backend is added.

## Deployment

The app is configured for standalone output and can be deployed behind a reverse proxy or container runtime.
