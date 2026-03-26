#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  8blocks — Quick Redeploy (no prompts)
#  Запускать вручную по SSH на сервере из папки проекта:
#
#    bash /var/www/<project>/scripts/redeploy.sh
#
#  Или скачать и запустить напрямую:
#    curl -fsSL https://raw.githubusercontent.com/Moroz-js/8blocks-v2/main/scripts/redeploy.sh | bash
# ─────────────────────────────────────────────────────────────
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'
BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}  ▸ $*${RESET}"; }
success() { echo -e "${GREEN}  ✓ $*${RESET}"; }
warn()    { echo -e "${YELLOW}  ⚠  $*${RESET}"; }
section() { echo -e "\n${BOLD}━━━━  $*  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"; }

# ── определяем папку проекта ──────────────────────────────────
# Если запущен через pipe (curl | bash), SCRIPT_DIR будет пустым —
# пытаемся найти проект по наличию package.json в /var/www/*
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-/dev/null}")" 2>/dev/null && pwd || echo "")"

if [ -f "${SCRIPT_DIR}/../package.json" ]; then
  PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
elif [ -f "$(pwd)/package.json" ]; then
  PROJECT_DIR="$(pwd)"
else
  # ищем первый /var/www/* с package.json
  PROJECT_DIR=$(find /var/www -maxdepth 2 -name "package.json" ! -path "*/node_modules/*" -printf "%h\n" 2>/dev/null | head -1)
  [ -n "${PROJECT_DIR}" ] || { echo "❌ Не найдена папка проекта. Запусти из корня проекта."; exit 1; }
fi

# ── определяем PM2-имя из папки ──────────────────────────────
PM2_APP_NAME=$(basename "${PROJECT_DIR}")

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║     8blocks — Redeploy                   ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo ""
info "Проект: ${PROJECT_DIR}"
info "PM2:    ${PM2_APP_NAME}"
echo ""

cd "${PROJECT_DIR}"

# ─────────────────────────────────────────────────────────────
section "Git pull"
git fetch --all
git reset --hard origin/main
success "Код обновлён"

# ─────────────────────────────────────────────────────────────
section "Зависимости"
npm ci --prefer-offline
success "npm ci завершён"

# ─────────────────────────────────────────────────────────────
section "Миграции"
./node_modules/.bin/cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
  node --env-file=.env -r ./scripts/patch-next-env.cjs -r tsx/cjs \
  scripts/run-migrations.ts \
  && success "Миграции применены" \
  || warn "Миграции не применены — запусти вручную: npm run payload:migrate"

# ─────────────────────────────────────────────────────────────
section "Сборка"
npm run build
success "Сборка завершена"

# ─────────────────────────────────────────────────────────────
section "PM2 restart"
if pm2 describe "${PM2_APP_NAME}" &>/dev/null; then
  pm2 reload "${PM2_APP_NAME}" --update-env
else
  pm2 start npm --name "${PM2_APP_NAME}" -- start
fi
pm2 save
success "PM2 '${PM2_APP_NAME}' перезапущен"

# ─────────────────────────────────────────────────────────────
section "Проверка"
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null || echo "000")
if echo "$HTTP_CODE" | grep -qE "^(200|301|302|307|308)$"; then
  success "Приложение отвечает (HTTP ${HTTP_CODE})"
else
  warn "HTTP ${HTTP_CODE} — проверь: pm2 logs ${PM2_APP_NAME}"
fi

echo ""
echo -e "${GREEN}${BOLD}  ✅ Redeploy завершён${RESET}"
echo ""
