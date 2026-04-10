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
NODE_VERSION="22"
SSH_KEY_PATH="/root/.ssh/id_ed25519_deploy"

# ─────────────────────────────────────────────────────────────
section "Параметры сервера"
echo ""
prompt LANG_CODE    "Метка сервера (ru / en / ae ...)"        "ru"
prompt SITE_LANG    "Язык сайта NEXT_PUBLIC_LANG (ru / en)"  "ru"
prompt PROJECT_NAME "Имя проекта (папка + PM2)"               "8blocks-${LANG_CODE}"
prompt DOMAIN       "Домен сайта"                             "8blocks.ru"

PROJECT_DIR="/var/www/${PROJECT_NAME}"
PM2_APP_NAME="${PROJECT_NAME}"

# ─────────────────────────────────────────────────────────────
section "Переменные окружения (.env)"
echo ""
echo -e "  Заполни значения. Пустой ввод = значение по умолчанию."
echo ""

prompt        DB_URI          "DATABASE_URI"                        "postgresql://postgres:password@localhost:5432/${PROJECT_NAME}"
prompt_secret PAYLOAD_SECRET  "PAYLOAD_SECRET (случайная строка)"
prompt        ADMIN_EMAIL     "ADMIN_EMAIL"                         "admin@${DOMAIN}"
prompt_secret ADMIN_PASSWORD  "ADMIN_PASSWORD"
prompt        SMTP_HOST       "SMTP_HOST"                           "smtp.gmail.com"
prompt        SMTP_PORT       "SMTP_PORT"                           "587"
prompt        SMTP_SECURE     "SMTP_SECURE (true/false)"            "false"
prompt        SMTP_USER       "SMTP_USER"                           "hello@${DOMAIN}"
prompt_secret SMTP_PASSWORD   "SMTP_PASSWORD"
prompt        SMTP_FROM       "SMTP_FROM"                           "hello@${DOMAIN}"
prompt        SITE_URL        "NEXT_PUBLIC_SITE_URL"                "https://${DOMAIN}"
prompt        GTM_ID          "NEXT_PUBLIC_GTM_ID (пусто = выкл)"  ""
prompt        REPLAIN_ID      "NEXT_PUBLIC_REPLAIN_ID (пусто = выкл)" ""
prompt        CALENDLY_URL    "NEXT_PUBLIC_CALENDLY_URL (пусто = дефолт по языку)" ""

echo ""
success "Переменные собраны."

# ─────────────────────────────────────────────────────────────
section "Системные пакеты"
apt-get update -qq
apt-get install -y -qq curl git build-essential nginx certbot python3-certbot-nginx ufw
success "curl git nginx certbot ufw установлены"

# ─────────────────────────────────────────────────────────────
section "PostgreSQL"

# Извлекаем компоненты из DATABASE_URI
# postgresql://user:pass@host:port/dbname
DB_USER=$(echo "${DB_URI}" | sed -E 's|postgresql://([^:]+):.*|\1|')
DB_PASS=$(echo "${DB_URI}" | sed -E 's|postgresql://[^:]+:([^@]+)@.*|\1|')
DB_HOST=$(echo "${DB_URI}" | sed -E 's|.*@([^:/]+)[:/].*|\1|')
DB_PORT=$(echo "${DB_URI}" | sed -E 's|.*:([0-9]+)/.*|\1|')
DB_NAME=$(echo "${DB_URI}" | sed -E 's|.*/([^?]+).*|\1|')

if command -v psql &>/dev/null; then
  success "PostgreSQL уже установлен ($(psql --version | head -1))"
else
  apt-get install -y -qq postgresql postgresql-contrib
  systemctl enable postgresql
  systemctl start postgresql
  success "PostgreSQL установлен"
fi

# Создаём пользователя и БД если не существуют
info "Настраиваю пользователя и базу данных..."
sudo -u postgres psql -v ON_ERROR_STOP=0 << PGEOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER "${DB_USER}" WITH PASSWORD '${DB_PASS}';
    RAISE NOTICE 'User ${DB_USER} created';
  ELSE
    ALTER USER "${DB_USER}" WITH PASSWORD '${DB_PASS}';
    RAISE NOTICE 'User ${DB_USER} already exists, password updated';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE "${DB_NAME}" OWNER "${DB_USER}"'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')
\gexec

GRANT ALL PRIVILEGES ON DATABASE "${DB_NAME}" TO "${DB_USER}";
PGEOF

# Разрешаем подключение по паролю (md5) если хост локальный
if [ "${DB_HOST}" = "localhost" ] || [ "${DB_HOST}" = "127.0.0.1" ]; then
  PG_HBA=$(sudo -u postgres psql -t -c "SHOW hba_file;" | tr -d '[:space:]')
  if ! grep -q "^host.*${DB_NAME}.*${DB_USER}" "${PG_HBA}" 2>/dev/null; then
    echo "host    ${DB_NAME}    ${DB_USER}    127.0.0.1/32    md5" >> "${PG_HBA}"
    echo "host    ${DB_NAME}    ${DB_USER}    ::1/128          md5" >> "${PG_HBA}"
    systemctl reload postgresql
    info "pg_hba.conf обновлён"
  fi
fi

success "БД '${DB_NAME}' и пользователь '${DB_USER}' готовы"

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
  ssh-keygen -t ed25519 -C "deploy@${PROJECT_NAME}" -f "${SSH_KEY_PATH}" -N "" -q
  success "Ключ сгенерирован: ${SSH_KEY_PATH}"
else
  success "Ключ уже существует: ${SSH_KEY_PATH}"
fi

mkdir -p /root/.ssh
cat > /root/.ssh/config << 'SSHEOF'
Host github.com
  HostName github.com
  User git
  IdentityFile /root/.ssh/id_ed25519_deploy
  StrictHostKeyChecking no
SSHEOF
chmod 600 /root/.ssh/config

touch /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
if ! grep -qF "$(cat "${SSH_KEY_PATH}.pub")" /root/.ssh/authorized_keys 2>/dev/null; then
  cat "${SSH_KEY_PATH}.pub" >> /root/.ssh/authorized_keys
  success "Публичный ключ добавлен в authorized_keys (для GitHub Actions)"
else
  success "Ключ уже есть в authorized_keys"
fi

echo ""
echo -e "${YELLOW}${BOLD}  ┌─────────────────────────────────────────────────────────┐${RESET}"
echo -e "${YELLOW}${BOLD}  │  Добавь этот публичный ключ в GitHub как Deploy Key:     │${RESET}"
echo -e "${YELLOW}${BOLD}  └─────────────────────────────────────────────────────────┘${RESET}"
echo ""
echo -e "${BOLD}$(cat "${SSH_KEY_PATH}.pub")${RESET}"
echo ""
echo -e "  Ссылка: ${CYAN}https://github.com/Moroz-js/8blocks-v2/settings/keys/new${RESET}"
dim "  Title: deploy@${PROJECT_NAME}"
dim "  Allow write access: НЕТ (read-only)"
echo ""
echo -ne "  ${YELLOW}Нажми Enter после того как добавил ключ...${RESET} "
read -r </dev/tty

info "Проверяю доступ к GitHub..."
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
  }
  success "Репо склонировано"
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
NEXT_PUBLIC_LANG=${SITE_LANG}
NEXT_PUBLIC_GTM_ID=${GTM_ID}
NEXT_PUBLIC_REPLAIN_ID=${REPLAIN_ID}
NEXT_PUBLIC_CALENDLY_URL=${CALENDLY_URL}
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
./node_modules/.bin/cross-env NODE_ENV=production PAYLOAD_CONFIG_PATH=payload.config.ts \
  node --env-file=.env -r tsx/cjs \
  scripts/run-migrations.ts \
  && success "Миграции применены" \
  || warn "Миграции не применены — запусти вручную: npm run payload:migrate"

# ─────────────────────────────────────────────────────────────
section "Сборка приложения"
npm run build
success "Сборка завершена"

# ─────────────────────────────────────────────────────────────
section "Seed базы данных"
if [ "${SITE_LANG}" = "ru" ]; then
  SEED_CMD="seed"
else
  SEED_CMD="seed:en"
fi
info "Запускаю npm run ${SEED_CMD}..."
SEED_ALLOWED=true npm run "${SEED_CMD}" \
  && success "Seed выполнен (${SEED_CMD})" \
  || warn "Seed не выполнен — запусти вручную: npm run ${SEED_CMD}"

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
NGINX_CONF="/etc/nginx/sites-available/${PROJECT_NAME}"

if [ ! -f "${NGINX_CONF}" ]; then
  cat > "${NGINX_CONF}" << NGINXEOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

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
  success "Nginx настроен для ${DOMAIN}"
else
  success "Nginx конфиг уже существует"
fi

# ─────────────────────────────────────────────────────────────
section "Firewall"
ufw allow OpenSSH      2>/dev/null || true
ufw allow "Nginx Full" 2>/dev/null || true
ufw --force enable     2>/dev/null || true
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
echo -e "  1. Настрой DNS: A-запись ${BOLD}${DOMAIN}${RESET} → IP этого сервера"
echo -e "  2. Выпусти SSL:"
echo -e "     ${CYAN}certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${RESET}"
echo ""
echo -e "  3. Добавь секреты в GitHub Actions"
echo -e "     ${DIM}(Settings → Secrets → Actions):${RESET}"
echo ""
LANG_UPPER=$(echo "${LANG_CODE}" | tr '[:lower:]' '[:upper:]')
echo -e "     ${DIM}DEPLOY_TARGETS${RESET}                    += ${LANG_CODE}"
echo -e "     ${DIM}${LANG_UPPER}_SSH_HOST${RESET}                  = $(curl -s ifconfig.me 2>/dev/null || echo '<IP сервера>')"
echo -e "     ${DIM}${LANG_UPPER}_SSH_USER${RESET}                  = root"
echo -e "     ${DIM}${LANG_UPPER}_SSH_PORT${RESET}                  = 22"
echo -e "     ${DIM}${LANG_UPPER}_SSH_KEY${RESET}                   = (приватный ключ — см. ниже)"
echo -e "     ${DIM}${LANG_UPPER}_LANG${RESET}                      = ${LANG_CODE}"
echo -e "     ${DIM}${LANG_UPPER}_PROJECT_NAME${RESET}              = ${PROJECT_NAME}"
echo -e "     ${DIM}${LANG_UPPER}_DATABASE_URI${RESET}              = ${DB_URI}"
echo -e "     ${DIM}${LANG_UPPER}_PAYLOAD_SECRET${RESET}            = (как в .env)"
echo -e "     ${DIM}${LANG_UPPER}_ADMIN_EMAIL${RESET}               = ${ADMIN_EMAIL}"
echo -e "     ${DIM}${LANG_UPPER}_ADMIN_PASSWORD${RESET}            = (как в .env)"
echo -e "     ${DIM}${LANG_UPPER}_SMTP_*${RESET}                    = (как в .env)"
echo -e "     ${DIM}${LANG_UPPER}_NEXT_PUBLIC_SITE_URL${RESET}      = ${SITE_URL}"
echo -e "     ${DIM}${LANG_UPPER}_NEXT_PUBLIC_GTM_ID${RESET}        = ${GTM_ID}"
echo -e "     ${DIM}${LANG_UPPER}_NEXT_PUBLIC_REPLAIN_ID${RESET}    = ${REPLAIN_ID}"
echo -e "     ${DIM}${LANG_UPPER}_NEXT_PUBLIC_CALENDLY_URL${RESET}  = ${CALENDLY_URL}"
echo ""
echo -e "  4. Приватный ключ для ${BOLD}${LANG_UPPER}_SSH_KEY${RESET}:"
echo ""
echo -e "${DIM}$(cat "${SSH_KEY_PATH}")${RESET}"
echo ""
echo -e "  5. После настройки DNS + SSL: пуш в ${BOLD}main${RESET} → автодеплой"
echo ""
echo -e "${BOLD}  Сайт:  http://127.0.0.1:3000 (локально сейчас работает)${RESET}"
echo ""
