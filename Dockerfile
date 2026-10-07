# Multi-tenant USDA Rural OS & 3FS Platform Container
FROM node:20-alpine AS runner

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Copy application assets and source code
COPY . .

# Expose HTTP port
EXPOSE 4080

# Environment defaults
ENV PORT=4080
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4080/ || exit 1

# Start server
CMD ["node", "server.js"]
