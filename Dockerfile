// syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
ENV NODE_ENV=production
WORKDIR /app

FROM base AS deps
# Install dependencies only when needed
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM deps AS builder
COPY . .
RUN npm run build

FROM base AS runner
# Create non-root user
RUN useradd -m -u 1001 nodeuser
WORKDIR /app

# Copy Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER 1001
EXPOSE 3000
CMD ["node", "server.js"]
