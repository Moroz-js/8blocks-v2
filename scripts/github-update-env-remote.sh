#!/usr/bin/env bash
# Только .env + синхронизация админа из .env + перезапуск PM2 (без git pull, build, seed, миграций).
set -euo pipefail

error_exit() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ Update env failed at line $1"
  echo "Last command: ${BASH_COMMAND}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
}
trap 'error_exit $LINENO' ERR

PROJECT_DIR="/var/www/${PROJECT_NAME}"

[ -n "${PROJECT_NAME:-}" ] || { echo "❌ PROJECT_NAME not set"; exit 1; }
[ -d "${PROJECT_DIR}" ]    || { echo "❌ Project dir not found: ${PROJECT_DIR}"; exit 1; }
command -v node &>/dev/null || { echo "❌ Node.js not found"; exit 1; }
command -v npm &>/dev/null  || { echo "❌ npm not found"; exit 1; }
command -v pm2 &>/dev/null  || { echo "❌ PM2 not found"; exit 1; }

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Update .env + admin creds  |  ${PROJECT_NAME}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "${PROJECT_DIR}"

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

echo "👤 Syncing admin user from .env (DB content otherwise unchanged)"
./node_modules/.bin/cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
  node --env-file=.env -r ./scripts/patch-next-env.cjs -r tsx/cjs \
  scripts/sync-admin-from-env.ts

echo "🔄 Reloading PM2 with new env"
pm2 describe "${PROJECT_NAME}" &>/dev/null || { echo "❌ PM2 process not found: ${PROJECT_NAME}"; exit 1; }
pm2 reload "${PROJECT_NAME}" --update-env
pm2 save
echo "✅ Done"
