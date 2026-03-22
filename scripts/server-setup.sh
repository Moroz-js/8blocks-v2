#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  8blocks — Interactive Server Setup
#  curl -fsSL https://raw.githubusercontent.com/Moroz-js/8blocks-v2/main/scripts/server-setup.sh | bash
# ─────────────────────────────────────────────────────────────
set -euo pipefail

# ── colours ──────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; RESET='\033[0m'

info()    { echo -e "${CYAN}  ▸ $*${RESET}"; }
success() { echo -e "${GREEN}  ✓ $*${RESET}"; }
warn()    { echo -e "${YELLOW}  ⚠  $*${RESET}"; }
error()   { echo -e "${RED}  ✗ $*${RESET}"; exit 1; }
section() { echo -e "\n${BOLD}━━━━  $*  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"; }
dim()     { echo -e "${DIM}     $*${RESET}"; }

# prompt VAR "Question" "default"
prompt() {
  local var="$1" msg="$2" default="${3:-}"
  local hint=""
  [ -n "$default" ] && hint=" ${DIM}[${default}]${RESET}"
  echo -ne "  ${CYAN}?${RESET}  ${msg}${hint}: "
  read -r input </dev/tty
  if [ -z "$input" ] && [ -n "$default" ]; then
    eval "$var=\"$default\""
  else
    eval "$var=\"$input\""
  fi
}

# prompt_secret VAR "Question"
prompt_secret() {
  local var="$1" msg="$2"
  echo -ne "  ${CYAN}?${RESET}  ${msg} ${DIM}(скрыто)${RESET}: "
  read -rs input </dev/tty
  echo ""
  eval "$var=\"$input\""
}

# prompt_multiline VAR "Question"
prompt_multiline() {
  local var="$1" msg="$2"
  echo -e "  ${CYAN}?${RESET}  ${msg}"
  echo -e "  ${DIM}  Вставь и нажми Enter, затем Ctrl+D:${RESET}"
  local content
  content=$(cat </dev/tty)
  eval "$var=\"$content\""
}

[ "$(id -u)" -eq 0 ] || error "Запустите от root: sudo bash или под root"

# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║     8blocks — Server Setup               ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo ""

# ── constants ────────────────────────────────────────────────
REPO_SSH="git@github.com:Moroz-js/8blocks-v2.git"
REPO_HTTPS="https://github.com/Moroz-js/8blocks-v2.git"
DEPLOY_BRANCH="main"
PROJECT_DIR="/var/www/site"
NODE_VERSION="22"
PM2_APP_NAME="site"
DOMAIN_PUNYCODE="xn--e1aah0aemh4k.xn--p1ai"
DOMAIN_DISPLAY="токеномика.рф"
DOMAIN_DEV_PUNYCODE="dev.xn--e1aah0aemh4k.xn--p1ai"
DOMAIN_DEV_DISPLAY="dev.токеномика.рф"
SSH_KEY_PATH="/root/.ssh/id_ed25519_deploy"

# ─────────────────────────────────────────────────────────────
section "Переменные окружения"
echo ""
echo -e "  Заполни значения для ${BOLD}.env${RESET}. Пустой ввод = значение по умолчанию."
echo ""

prompt     DB_URI         "DATABASE_URI"            "postgresql://postgres:password@localhost:5432/site"
prompt_secret PAYLOAD_SECRET "PAYLOAD_SECRET (случайная строка)"
prompt     ADMIN_EMAIL    "ADMIN_EMAIL"              "hello@8blocks.io"
prompt_secret ADMIN_PASSWORD "ADMIN_PASSWORD"
prompt     SMTP_HOST      "SMTP_HOST"                "smtp.gmail.com"
prompt     SMTP_PORT      "SMTP_PORT"                "587"
prompt     SMTP_SECURE    "SMTP_SECURE (true/false)" "false"
prompt     SMTP_USER      "SMTP_USER"                "hello@8blocks.io"
prompt_secret SMTP_PASSWORD  "SMTP_PASSWORD"
prompt     SMTP_FROM      "SMTP_FROM"                "hello@8blocks.io"
prompt     SITE_URL       "NEXT_PUBLIC_SITE_URL"     "https://${DOMAIN_DISPLAY}"
prompt     GTM_ID         "NEXT_PUBLIC_GTM_ID"       "GTM-KWVBDZ29"

echo ""
echo -e "${GREEN}  Переменные записаны.${RESET}"

# ─────────────────────────────────────────────────────────────
section "Системные пакеты"
apt-get update -qq
apt-get install -y -qq curl git build-essential nginx certbot python3-certbot-nginx ufw
success "curl git nginx certbot ufw установлены"

# ─────────────────────────────────────────────────────────────
section "Node.js ${NODE_VERSION}.x"
if command -v node &>/dev/null && node --version | grep -q "^v${NODE_VERSION}"; then
  success "Node $(node --version) уже установлен"
else
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash - >/dev/null
  apt-get install -y -qq nodejs
  success "Node $(node --version) установлен"
fi

# ─────────────────────────────────────────────────────────────
section "PM2"
if command -v pm2 &>/dev/null; then
  success "PM2 $(pm2 --version) уже установлен"
else
  npm install -g pm2 --silent
  pm2 startup systemd -u root --hp /root 2>/dev/null || true
  success "PM2 установлен"
fi

# ─────────────────────────────────────────────────────────────
section "Deploy key для GitHub"

if [ ! -f "${SSH_KEY_PATH}" ]; then
  ssh-keygen -t ed25519 -C "deploy@site" -f "${SSH_KEY_PATH}" -N "" -q
  success "Ключ сгенерирован: ${SSH_KEY_PATH}"
else
  success "Ключ уже существует: ${SSH_KEY_PATH}"
fi

# Настраиваем SSH config для использования этого ключа с GitHub
mkdir -p /root/.ssh
cat > /root/.ssh/config << 'SSHEOF'
Host github.com
  HostName github.com
  User git
  IdentityFile /root/.ssh/id_ed25519_deploy
  StrictHostKeyChecking no
SSHEOF
chmod 600 /root/.ssh/config

echo ""
echo -e "${YELLOW}${BOLD}  ┌─────────────────────────────────────────────────────────┐${RESET}"
echo -e "${YELLOW}${BOLD}  │  Добавь этот публичный ключ в GitHub как Deploy Key:     │${RESET}"
echo -e "${YELLOW}${BOLD}  └─────────────────────────────────────────────────────────┘${RESET}"
echo ""
echo -e "${BOLD}$(cat "${SSH_KEY_PATH}.pub")${RESET}"
echo ""
echo -e "  Ссылка: ${CYAN}https://github.com/Moroz-js/8blocks-v2/settings/keys/new${RESET}"
dim "  Title: deploy@site"
dim "  Allow write access: НЕТ (read-only)"
echo ""
echo -ne "  ${YELLOW}Нажми Enter после того как добавил ключ...${RESET} "
read -r </dev/tty

info "Проверяю доступ к GitHub..."
# ssh -T всегда возвращает exit code 1, поэтому захватываем вывод и игнорируем код
SSH_CHECK=$(ssh -T git@github.com </dev/null 2>&1) || true
if echo "$SSH_CHECK" | grep -q "successfully authenticated"; then
  success "SSH доступ к GitHub работает"
else
  warn "Ответ GitHub: ${SSH_CHECK}"
  warn "Убедись что публичный ключ добавлен в репо → Deploy keys"
  echo -ne "  ${YELLOW}Продолжить всё равно? (y/N): ${RESET}"
  read -r answer </dev/tty
  [[ "$answer" =~ ^[Yy]$ ]] || error "Прервано"
fi

# ─────────────────────────────────────────────────────────────
section "Клонирование репозитория"

mkdir -p "${PROJECT_DIR}"
mkdir -p "${PROJECT_DIR}/public/uploads"

if [ -d "${PROJECT_DIR}/.git" ]; then
  info "Репо уже есть — делаю git pull"
  git -C "${PROJECT_DIR}" fetch --all
  git -C "${PROJECT_DIR}" reset --hard "origin/${DEPLOY_BRANCH}"
  success "Репо обновлено"
else
  # Папка может существовать без .git (незавершённый предыдущий запуск)
  if [ -d "${PROJECT_DIR}" ]; then
    info "Папка существует без .git — очищаю"
    rm -rf "${PROJECT_DIR}"
  fi
  info "Клонирую ${REPO_SSH}"
  GIT_SSH_ERR=$(git clone --branch "${DEPLOY_BRANCH}" "${REPO_SSH}" "${PROJECT_DIR}" </dev/null 2>&1) || {
    warn "SSH clone не сработал: ${GIT_SSH_ERR}"
    warn "Клоную по HTTPS"
    rm -rf "${PROJECT_DIR}"
    git clone --branch "${DEPLOY_BRANCH}" "${REPO_HTTPS}" "${PROJECT_DIR}" </dev/null
    git -C "${PROJECT_DIR}" remote set-url origin "${REPO_SSH}"
    success "Репо склонировано по HTTPS (remote → SSH)"
    return 0 2>/dev/null || true
  }
  success "Репо склонировано по SSH"
fi

chmod -R 775 "${PROJECT_DIR}/public/uploads"

# ─────────────────────────────────────────────────────────────
section "Запись .env"

umask 077
cat > "${PROJECT_DIR}/.env" << ENVEOF
NODE_ENV=production
DATABASE_URI=${DB_URI}
PAYLOAD_SECRET=${PAYLOAD_SECRET}
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_SECURE=${SMTP_SECURE}
SMTP_USER=${SMTP_USER}
SMTP_PASSWORD=${SMTP_PASSWORD}
SMTP_FROM=${SMTP_FROM}
NEXT_PUBLIC_SITE_URL=${SITE_URL}
NEXT_PUBLIC_GTM_ID=${GTM_ID}
ENVEOF

chmod 600 "${PROJECT_DIR}/.env"
success ".env записан (права 600)"

# ─────────────────────────────────────────────────────────────
section "Установка зависимостей"
cd "${PROJECT_DIR}"
npm ci --prefer-offline
success "npm ci завершён"

# ─────────────────────────────────────────────────────────────
section "Миграции базы данных"
info "Проверяю подключение к PostgreSQL..."
if node -e "
const { Client } = require('pg'); // eslint-disable-line
" 2>/dev/null || true; then : ; fi

cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
  node -r ./scripts/patch-next-env.cjs -r tsx/cjs \
  node_modules/payload/dist/bin/index.js migrate && success "Миграции применены" \
  || warn "Миграции не применены — запусти вручную: npm run payload:migrate"

# ─────────────────────────────────────────────────────────────
section "Сборка приложения"
npm run build
success "Сборка завершена"

# ─────────────────────────────────────────────────────────────
section "PM2 — запуск приложения"
if pm2 describe "${PM2_APP_NAME}" &>/dev/null; then
  pm2 reload "${PM2_APP_NAME}" --update-env
else
  pm2 start npm --name "${PM2_APP_NAME}" -- start
fi
pm2 save
success "PM2 процесс '${PM2_APP_NAME}' запущен"

# ─────────────────────────────────────────────────────────────
section "Nginx"
NGINX_CONF="/etc/nginx/sites-available/site"

if [ ! -f "${NGINX_CONF}" ]; then
  cat > "${NGINX_CONF}" << NGINXEOF
server {
    listen 80;
    server_name ${DOMAIN_PUNYCODE} www.${DOMAIN_PUNYCODE} ${DOMAIN_DEV_PUNYCODE};

    client_max_body_size 20M;

    location /uploads/ {
        alias ${PROJECT_DIR}/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade           \$http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
NGINXEOF

  ln -sf "${NGINX_CONF}" /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
  nginx -t && systemctl reload nginx
  success "Nginx настроен для ${DOMAIN_DISPLAY} + ${DOMAIN_DEV_DISPLAY}"
else
  success "Nginx конфиг уже существует"
fi

# ─────────────────────────────────────────────────────────────
section "Firewall"
ufw allow OpenSSH    2>/dev/null || true
ufw allow "Nginx Full" 2>/dev/null || true
ufw --force enable   2>/dev/null || true
success "UFW: SSH + HTTP/HTTPS открыты"

# ─────────────────────────────────────────────────────────────
section "Проверка"
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ 2>/dev/null || echo "000")
if echo "$HTTP_CODE" | grep -qE "^(200|301|302|307|308)$"; then
  success "Приложение отвечает (HTTP ${HTTP_CODE})"
else
  warn "HTTP ${HTTP_CODE} — приложение может ещё стартовать"
fi

# ─────────────────────────────────────────────────────────────
section "Готово"
echo ""
echo -e "${GREEN}${BOLD}  Сервер настроен и приложение запущено!${RESET}"
echo ""
echo -e "  ${BOLD}Следующие шаги:${RESET}"
echo ""
echo -e "  1. Настрой DNS: A-запись ${BOLD}${DOMAIN_DISPLAY}${RESET} → IP этого сервера"
  echo -e "  2. Выпусти SSL:"
  echo -e "     ${CYAN}certbot --nginx -d ${DOMAIN_PUNYCODE} -d www.${DOMAIN_PUNYCODE} -d ${DOMAIN_DEV_PUNYCODE}${RESET}"
echo ""
echo -e "  3. Добавь секреты в GitHub Actions"
echo -e "     ${DIM}(Settings → Secrets → Actions):${RESET}"
echo ""
echo -e "     ${DIM}SSH_HOST${RESET}              = IP сервера"
echo -e "     ${DIM}SSH_USER${RESET}              = root"
echo -e "     ${DIM}SSH_PORT${RESET}              = 22"
echo -e "     ${DIM}SSH_KEY${RESET}               = приватный ключ (см. ниже)"
echo -e "     ${DIM}PROJECT_NAME${RESET}          = site"
echo -e "     ${DIM}DOMAIN${RESET}                = ${DOMAIN_PUNYCODE}"
echo -e "     ${DIM}DATABASE_URI${RESET}          = (как в .env)"
echo -e "     ${DIM}PAYLOAD_SECRET${RESET}        = (как в .env)"
echo -e "     ${DIM}ADMIN_EMAIL / PASSWORD${RESET} = (как в .env)"
echo -e "     ${DIM}SMTP_*${RESET}                = (как в .env)"
echo -e "     ${DIM}NEXT_PUBLIC_SITE_URL${RESET}  = (как в .env)"
echo -e "     ${DIM}NEXT_PUBLIC_GTM_ID${RESET}    = (как в .env)"
echo -e "     ${DIM}DEPLOY_MODE${RESET}           = soft"
echo ""
echo -e "  4. Приватный ключ для ${BOLD}SSH_KEY${RESET} секрета:"
echo ""
echo -e "${DIM}$(cat "${SSH_KEY_PATH}")${RESET}"
echo ""
echo -e "  5. После настройки DNS + SSL: пуш в ${BOLD}main${RESET} → автодеплой"
echo ""
echo -e "${BOLD}  Сайт:  http://127.0.0.1:3000 (локально сейчас работает)${RESET}"
echo ""
