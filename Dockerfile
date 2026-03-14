
# =============================================================================
# Optimized Multi-Stage Dockerfile for Next.js 15 + React 19
# Final image size: ~150MB (vs ~1GB unoptimized)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: deps - Install dependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Copy only package files first (better layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# -----------------------------------------------------------------------------
# Stage 2: builder - Build the application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Accept APP_ENV as build argument (default: production)
# This is used to distinguish between dev/prod deployments
ARG APP_ENV=production

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and config files
COPY package.json package-lock.json* ./
COPY next.config.ts tsconfig.json postcss.config.mjs ./
COPY components.json ./
COPY public ./public
COPY app ./app
COPY components ./components
COPY contexts ./contexts
COPY lib ./lib
COPY services ./services

# Build environment
# NODE_ENV must always be 'production' for next build
# Use NEXT_PUBLIC_APP_ENV to distinguish dev/prod in your app code
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_ENV=${APP_ENV}

# Build the standalone application
RUN npm run build

# Clean up build cache to reduce layer size
RUN rm -rf node_modules/.cache .next/cache

# -----------------------------------------------------------------------------
# Stage 3: runner - Minimal production image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Accept APP_ENV as build argument (default: production)
ARG APP_ENV=production

WORKDIR /app

# Runtime environment
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_ENV=${APP_ENV}
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

# Security: create non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set up .next directory with correct permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build (includes only required node_modules - ~80% smaller)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the optimized standalone server
CMD ["node", "server.js"]
