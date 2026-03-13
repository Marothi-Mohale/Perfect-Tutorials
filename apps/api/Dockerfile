FROM node:22-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma

RUN pnpm install --frozen-lockfile --filter api...

COPY apps/api apps/api

RUN pnpm --filter api prisma generate
RUN pnpm --filter api build

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "apps/api/dist/main.js"]
