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

PROJECT_DIR="/var/www/${PROJECT_NAME}"
BUILD_ARCHIVE="${BUILD_ARCHIVE:-}"
export PORT="${PORT:-3000}"
HEALTH_PATH="${HEALTH_PATH:-/}"
NEXT_PUBLIC_STAGING="${NEXT_PUBLIC_STAGING:-false}"
NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-}"
NEXT_PUBLIC_STAGING_EN_URL="${NEXT_PUBLIC_STAGING_EN_URL:-}"
NEXT_PUBLIC_STAGING_RU_URL="${NEXT_PUBLIC_STAGING_RU_URL:-}"
NEXT_PUBLIC_BUILD_AT="${NEXT_PUBLIC_BUILD_AT:-}"
SKIP_DATABASE_MAINTENANCE="${SKIP_DATABASE_MAINTENANCE:-false}"

# Детерминированная кэш-директория Chrome для Puppeteer. Один и тот же путь
# используется при установке браузера и в рантайме (через .env), чтобы не
# зависеть от $HOME пользователя ssh-сессии vs процесса pm2.
export PUPPETEER_CACHE_DIR="${PROJECT_DIR}/.puppeteer"

# ── pre-flight ────────────────────────────────
[ -n "${PROJECT_NAME:-}" ] || { echo "❌ PROJECT_NAME not set"; exit 1; }
[ -d "${PROJECT_DIR}" ]    || { echo "❌ Project dir not found: ${PROJECT_DIR}"; exit 1; }
[ -n "${BUILD_ARCHIVE}" ]  || { echo "❌ BUILD_ARCHIVE not set"; exit 1; }
[ -f "${BUILD_ARCHIVE}" ]  || { echo "❌ Build archive not found: ${BUILD_ARCHIVE}"; exit 1; }
command -v node &>/dev/null || { echo "❌ Node.js not found"; exit 1; }
command -v npm &>/dev/null  || { echo "❌ npm not found"; exit 1; }
command -v pm2 &>/dev/null  || { echo "❌ PM2 not found (npm install -g pm2)"; exit 1; }

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Deploying ${PROJECT_NAME}"
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
  "PORT=${PORT}" \
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
  "ADMIN_NOTIFY_EMAIL=${ADMIN_NOTIFY_EMAIL}" \
  "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}" \
  "NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID}" \
  "NEXT_PUBLIC_LANG=${NEXT_PUBLIC_LANG}" \
  "NEXT_PUBLIC_REPLAIN_ID=${NEXT_PUBLIC_REPLAIN_ID}" \
  "NEXT_PUBLIC_CALENDLY_URL=${NEXT_PUBLIC_CALENDLY_URL}" \
  "NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY}" \
  "NEXT_PUBLIC_STAGING=${NEXT_PUBLIC_STAGING}" \
  "NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH}" \
  "NEXT_PUBLIC_STAGING_EN_URL=${NEXT_PUBLIC_STAGING_EN_URL}" \
  "NEXT_PUBLIC_STAGING_RU_URL=${NEXT_PUBLIC_STAGING_RU_URL}" \
  "NEXT_PUBLIC_BUILD_AT=${NEXT_PUBLIC_BUILD_AT}" \
  "PUPPETEER_CACHE_DIR=${PUPPETEER_CACHE_DIR}" \
  > .env
chmod 600 .env
echo "✓ .env written"

# ── install dependencies ──────────────────────
# PUPPETEER_SKIP_DOWNLOAD: не качаем Chrome в postinstall (хрупко: нужен unzip,
# сеть и т.д.). Браузер ставим отдельным управляемым шагом ниже.
echo "📦 Installing dependencies"
PUPPETEER_SKIP_DOWNLOAD=true npm ci --prefer-offline
echo "✓ Dependencies installed"

# ── Chromium system libs for Puppeteer (PDF export) ──
# Идемпотентно: ставим один раз (маркер-файл), чтобы не гонять apt на каждом деплое.
# v2: добавлен unzip (нужен @puppeteer/browsers для распаковки архива Chrome).
CHROMIUM_DEPS_MARKER="/var/lib/8blocks-chromium-deps-v2.installed"
if [ ! -f "${CHROMIUM_DEPS_MARKER}" ]; then
  echo "🧩 Installing Chromium system libraries for Puppeteer"
  if command -v apt-get &>/dev/null; then
    apt-get update -qq || true
    apt-get install -y -qq \
      ca-certificates unzip fonts-liberation fonts-noto-core fonts-noto-cjk \
      libasound2t64 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 \
      libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libglib2.0-0 libgtk-3-0 \
      libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
      libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
      libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
      2>/dev/null \
      || apt-get install -y -qq \
        ca-certificates unzip fonts-liberation fonts-noto-core fonts-noto-cjk \
        libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 \
        libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libglib2.0-0 libgtk-3-0 \
        libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
        libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
        libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
        2>/dev/null \
      || echo "⚠️  Could not install some Chromium libs (PDF may need manual deps)"
    mkdir -p /var/lib && touch "${CHROMIUM_DEPS_MARKER}" 2>/dev/null || true
    echo "✓ Chromium libraries ready"
  else
    echo "⚠️  apt-get not found — skip Chromium libs (install manually for PDF export)"
  fi
else
  echo "✓ Chromium libraries already installed"
fi

# ── Puppeteer browser (Chrome) ────────────────
# Ставим управляемый Puppeteer Chrome в фиксированный кэш ${PUPPETEER_CACHE_DIR}.
# Идемпотентно: если нужная версия уже есть — быстрый no-op. Не валим деплой,
# если скачать не удалось (сайт поднимется, не сработает только экспорт PDF).
echo "🌐 Ensuring Puppeteer Chrome is installed (cache: ${PUPPETEER_CACHE_DIR})"
mkdir -p "${PUPPETEER_CACHE_DIR}"
npx --yes puppeteer browsers install chrome \
  || echo "⚠️  Puppeteer Chrome install failed (PDF export may not work)"
if [ -d "${PUPPETEER_CACHE_DIR}/chrome" ]; then
  echo "✓ Chrome present: $(find "${PUPPETEER_CACHE_DIR}/chrome" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | head -n1)"
else
  echo "⚠️  Chrome not found in ${PUPPETEER_CACHE_DIR} (PDF export may not work)"
fi

if [ "${SKIP_DATABASE_MAINTENANCE}" = "true" ]; then
  echo "⏭️  Skipping migrations and seed (shared staging database)"
else
  # ── run migrations ──────────────────────────
  echo "🗄️  Running Payload migrations"
  ./node_modules/.bin/cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
    node --env-file=.env -r ./scripts/payload-next-env-shim.cjs -r tsx/cjs \
    scripts/run-migrations.ts
  echo "✓ Migrations applied"

  # ── seed legacy cases ────────────────────────
  # The seed is idempotent: it creates missing mini-cases by slug and only fills
  # an empty category on existing legacy mini-cases. It never deletes content.
  echo "🌱 Seeding missing legacy mini-cases"
  npm run seed:cases
  echo "✓ Cases seed complete"
fi

# ── regenerate Payload import map ─────────────
# Гарантируем, что src/app/(payload)/admin/importMap.js соответствует текущим
# блокам/кастомным компонентам редактора. Иначе новые виджеты могут не
# подхватываться в админке без полного рефреша. Не валим деплой при ошибке —
# в репозитории уже есть закоммиченный importMap.js.
echo "🧭 Regenerating Payload import map"
./node_modules/.bin/cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
  node --env-file=.env -r ./scripts/payload-next-env-shim.cjs -r tsx/cjs \
  node_modules/payload/dist/bin/index.js generate:importmap \
  || echo "⚠️  Import map generation failed (using committed importMap.js)"
echo "✓ Import map ready"

# ── install GitHub-built application ──────────
echo "📦 Installing application build from GitHub Actions"
BUILD_STAGING_DIR=$(mktemp -d "${PROJECT_DIR}/.next-staging.XXXXXX")
tar -xzf "${BUILD_ARCHIVE}" -C "${BUILD_STAGING_DIR}"
[ -f "${BUILD_STAGING_DIR}/.next/BUILD_ID" ] \
  || { echo "❌ Invalid build archive: missing .next/BUILD_ID"; exit 1; }

rm -rf "${PROJECT_DIR}/.next.previous"
if [ -d "${PROJECT_DIR}/.next" ]; then
  mv "${PROJECT_DIR}/.next" "${PROJECT_DIR}/.next.previous"
fi
mv "${BUILD_STAGING_DIR}/.next" "${PROJECT_DIR}/.next"
rm -rf "${BUILD_STAGING_DIR}" "${PROJECT_DIR}/.next.previous"
rm -f "${BUILD_ARCHIVE}"
echo "✓ GitHub build installed"

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

# ── health check ─────────────────────────────
sleep 5
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}${HEALTH_PATH}" 2>/dev/null || echo "000")
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
echo "✅ Deployment done"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
