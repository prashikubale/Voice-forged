# ============================================================
# Dockerfile — Voice Forge Backend (Production)
# ============================================================
# Multi-stage build: install deps → copy code → run
# Final image is ~150MB (node:22-alpine base)
# ============================================================

# ── Stage 1: Install production dependencies ─────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only package files first (Docker layer caching)
COPY package.json package-lock.json ./

# Install production-only deps (no devDependencies)
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# ── Stage 2: Production image ────────────────────────────────
FROM node:22-alpine AS runner

# Security: don't run as root
RUN addgroup -g 1001 -S voiceforge && \
    adduser -S voiceforge -u 1001

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Remove files that shouldn't be in the image
RUN rm -f .env .env.local .env.* 2>/dev/null || true

# Set ownership
RUN chown -R voiceforge:voiceforge /app

USER voiceforge

# Health check — hit the liveness probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "server.js"]
