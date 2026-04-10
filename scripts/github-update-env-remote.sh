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

# Скрипт мог появиться в репо позже последнего полного deploy — подтягиваем с origin (без reset всего проекта).
SYNC_SCRIPT="scripts/sync-admin-from-env.ts"
mkdir -p scripts
if git rev-parse --git-dir &>/dev/null; then
  echo "📥 Обновляю ${SYNC_SCRIPT} из git"
  git fetch origin --prune 2>/dev/null || git fetch origin 2>/dev/null || true
  REF="${SYNC_ADMIN_GIT_REF:-origin/main}"
  if ! git rev-parse --verify "$REF" &>/dev/null; then
    REF="origin/main"
  fi
  TMP="${SYNC_SCRIPT}.tmp.$$"
  if git show "${REF}:${SYNC_SCRIPT}" >"$TMP" 2>/dev/null && [ -s "$TMP" ]; then
    mv "$TMP" "$SYNC_SCRIPT"
    echo "✓ ${SYNC_SCRIPT} ← ${REF}"
  else
    rm -f "$TMP"
    if [ ! -f "$SYNC_SCRIPT" ]; then
      echo "❌ Нет ${SYNC_SCRIPT} на диске и не вышло взять из ${REF}:${SYNC_SCRIPT}"
      echo "   Запушьте скрипт в main и повторите, либо сделайте полный deploy."
      exit 1
    fi
    echo "⚠️  Не удалось обновить с ${REF}, используется локальный ${SYNC_SCRIPT}"
  fi
elif [ ! -f "$SYNC_SCRIPT" ]; then
  echo "❌ Нет ${SYNC_SCRIPT} и каталог не git — нужен полный deploy."
  exit 1
fi

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

echo "👤 Recreate admin from .env: удаление всех users, создание одного (остальная БД без изменений)"
./node_modules/.bin/cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
  node --env-file=.env -r ./scripts/patch-next-env.cjs -r tsx/cjs \
  scripts/sync-admin-from-env.ts

echo "🔄 Reloading PM2 with new env"
pm2 describe "${PROJECT_NAME}" &>/dev/null || { echo "❌ PM2 process not found: ${PROJECT_NAME}"; exit 1; }
pm2 reload "${PROJECT_NAME}" --update-env
pm2 save
echo "✅ Done"
