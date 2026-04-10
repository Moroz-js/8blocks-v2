#!/usr/bin/env bash
# Выполняется на сервере через appleboy/ssh-action; переменные — из envs workflow.
set -euo pipefail

error_exit() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ Deployment failed at line $1"
  echo "Last command: ${BASH_COMMAND}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
}
trap 'error_exit $LINENO' ERR

DEPLOY_MODE="${DEPLOY_MODE:-soft}"
PROJECT_DIR="/var/www/${PROJECT_NAME}"

# ── pre-flight ────────────────────────────────
[ -n "${PROJECT_NAME:-}" ] || { echo "❌ PROJECT_NAME not set"; exit 1; }
[ -d "${PROJECT_DIR}" ]    || { echo "❌ Project dir not found: ${PROJECT_DIR}"; exit 1; }
command -v node &>/dev/null || { echo "❌ Node.js not found"; exit 1; }
command -v npm &>/dev/null  || { echo "❌ npm not found"; exit 1; }
command -v pm2 &>/dev/null  || { echo "❌ PM2 not found (npm install -g pm2)"; exit 1; }

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Deploying ${PROJECT_NAME}  |  mode: ${DEPLOY_MODE}"
echo "Node: $(node --version)  |  npm: $(npm --version)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "${PROJECT_DIR}"

# ── pull latest code ──────────────────────────
echo "📥 Pulling latest changes from main"
git fetch --all
git reset --hard origin/main

# ── write .env ────────────────────────────────
echo "⚙️  Writing .env"
umask 077
printf '%s\n' \
  "NODE_ENV=production" \
  "DATABASE_URI=${DATABASE_URI}" \
  "PAYLOAD_SECRET=${PAYLOAD_SECRET}" \
  "ADMIN_EMAIL=${ADMIN_EMAIL}" \
  "ADMIN_PASSWORD=${ADMIN_PASSWORD}" \
  "SMTP_HOST=${SMTP_HOST}" \
  "SMTP_PORT=${SMTP_PORT}" \
  "SMTP_SECURE=${SMTP_SECURE}" \
  "SMTP_USER=${SMTP_USER}" \
  "SMTP_PASSWORD=${SMTP_PASSWORD}" \
  "SMTP_FROM=${SMTP_FROM}" \
  "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}" \
  "NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID}" \
  "NEXT_PUBLIC_LANG=${NEXT_PUBLIC_LANG}" \
  "NEXT_PUBLIC_REPLAIN_ID=${NEXT_PUBLIC_REPLAIN_ID}" \
  "NEXT_PUBLIC_CALENDLY_URL=${NEXT_PUBLIC_CALENDLY_URL}" \
  > .env
chmod 600 .env
echo "✓ .env written"

# ── install dependencies ──────────────────────
echo "📦 Installing dependencies"
npm ci --prefer-offline
echo "✓ Dependencies installed"

# ── run migrations ────────────────────────────
echo "🗄️  Running Payload migrations"
./node_modules/.bin/cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
  node --env-file=.env -r tsx/cjs \
  scripts/run-migrations.ts
echo "✓ Migrations applied"

# ── build ─────────────────────────────────────
echo "🏗️  Building application"
npm run build
echo "✓ Build complete"

# ── restart via PM2 ───────────────────────────
echo "🔄 Restarting with PM2"
if pm2 describe "${PROJECT_NAME}" &>/dev/null; then
  pm2 reload "${PROJECT_NAME}" --update-env
else
  pm2 start npm --name "${PROJECT_NAME}" -- start
fi
pm2 save
echo "✓ PM2 process updated"

# ── ensure uploads dir ────────────────────────
mkdir -p "${PROJECT_DIR}/public/uploads"
chmod -R 775 "${PROJECT_DIR}/public/uploads" 2>/dev/null || true
echo "✓ Uploads directory ready"

# ── seed (hard only) ─────────────────────────
if [ "$DEPLOY_MODE" = "hard" ]; then
  echo "🌱 Seeding database"
  npm run seed || echo "⚠️  Seed failed (non-fatal)"
fi

# ── health check ─────────────────────────────
sleep 5
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null || echo "000")
if echo "$HTTP_CODE" | grep -qE "^(200|301|302|307|308)$"; then
  echo "✅ Health check passed (HTTP $HTTP_CODE)"
else
  echo "⚠️  Health check returned HTTP $HTTP_CODE"
  pm2 logs "${PROJECT_NAME}" --lines 50 --nostream || true
fi

# ── summary ──────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 list
echo ""
echo "✅ Deployment done  |  mode: ${DEPLOY_MODE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
