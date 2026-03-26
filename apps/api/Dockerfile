# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests (for caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json* ./apps/api/
COPY packages/shared-types/package.json* ./packages/shared-types/

RUN pnpm install --frozen-lockfile --filter api --filter @link-manager/shared-types

# Copy source
COPY tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages/shared-types ./packages/shared-types

# Build NestJS
RUN pnpm exec nx build api --configuration=production

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist/apps/api ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "main.js"]
