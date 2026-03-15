# ============================================================
# PROTEX — Dockerfile
# Multi-stage: build → serve with nginx
# ============================================================

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .

ARG VITE_OPENROUTER_API_KEY
ARG VITE_HERMES_MODEL=nousresearch/hermes-4-70b
ARG VITE_APP_ENV=production

ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY
ENV VITE_HERMES_MODEL=$VITE_HERMES_MODEL
ENV VITE_APP_ENV=$VITE_APP_ENV

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
