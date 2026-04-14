# 8Blocks

Корпоративный сайт с блогом для 8Blocks — компании по разработке токеномики, аудиту токеномики и стратегическому консалтингу.

**Стек:** Next.js 16 (App Router) · TypeScript · SCSS Modules · Mantine · Framer Motion · Lenis · Payload CMS 3 · PostgreSQL

---

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` может понадобиться из-за peer dependency между Next.js 16 и Payload CMS 3.

### 2. Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

Минимально для запуска:

```env
DATABASE_URI=postgresql://user:password@localhost:5432/eightblocks
PAYLOAD_SECRET=your-random-secret-key
NEXT_PUBLIC_LANG=ru
```

### 3. База данных

```sql
CREATE DATABASE eightblocks;
```

### 4. Миграции

```bash
npm run payload:migrate
```

Если первый запуск с пустой БД:

```bash
npm run payload:migrate:create
npm run payload:migrate
```

### 5. Seed (опционально)

```bash
# RU-данные (категории, статьи, лиды)
npm run seed

# EN-данные
npm run seed:en

```

> ⚠️ Seed рассчитан на `NODE_ENV=development`. На production не запускайте без `SEED_ALLOWED=true`.

### 6. Запуск

```bash
npm run dev
```

- Сайт: [http://localhost:3000](http://localhost:3000)
- Админка: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Мультиязычность

Язык определяется **на этапе сборки** через переменную окружения `NEXT_PUBLIC_LANG`. Переключалки языка на сайте нет — каждый деплой рендерится строго на одном языке.

| `NEXT_PUBLIC_LANG` | Язык сайта |
|--------------------|------------|
| `ru` (по умолчанию) | Русский |
| `en` | English |

При смене языка пересобирать проект (`npm run build`).

---

## Структура проекта

```
src/
  app/                    # Next.js App Router
    (site)/               # Публичный сайт: главная, услуги, блог, privacy policy
    (payload)/            # Payload admin и API
    api/                  # Роуты API (contact, newsletter, просмотры статей)
  widgets/                # Крупные блоки UI (Header, Footer, HeroHome, секции услуг…)
  features/               # Сценарии (ContactForm, NewsletterForm, ShareBlock, ArticleView)
  entities/               # Сущности и типы (Article, Category, Tag, Lead, Newsletter)
  shared/
    i18n/                 # Утилита t() для build-time локализации
    config/               # site.ts — конфиг сайта, соцсети, адрес
    content/              # Тексты страниц (homePage.ts, casesPage.ts и др.)
    ui/                   # UI-kit

payload/
  collections/            # Коллекции Payload (Users, Articles, Categories, Leads, Media…)

migrations/               # SQL-миграции БД (Payload)
scripts/                  # seed.ts, seed-en.ts, migrate-legacy-blog.ts и др.
migration/                # migrate-sites.json (секреты), data/uploads + дамп
docs/                     # Документация: переводы, styleguide
public/
  uploads/                # Загруженные медиа (не в git)
```

---

## npm-скрипты

| Скрипт | Описание |
|--------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-сборка |
| `npm run start` | Запуск production-сервера |
| `npm run typecheck` | Проверка TypeScript |
| `npm run lint` | ESLint |
| `npm run validate` | typecheck + lint + build |
| `npm run payload:migrate` | Применить миграции |
| `npm run payload:migrate:create` | Создать новую миграцию |
| `npm run seed` | Seed БД — RU-данные |
| `npm run seed:en` | Seed БД — EN-данные |
| `npm run migrate:legacy` | Миграция старого Prisma-блога → Payload по `migration/migrate-sites.json` |

---

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `DATABASE_URI` | Строка подключения PostgreSQL |
| `PAYLOAD_SECRET` | Секрет Payload CMS |
| `ADMIN_EMAIL` | Email администратора (вход в /admin и seed) |
| `ADMIN_PASSWORD` | Пароль администратора (seed) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Отправка писем (SMTP, адрес отправителя) |
| `ADMIN_NOTIFY_EMAIL` | Ящик для админских уведомлений (заявки, подписки); один на все инстансы. Если не задан — используется `SMTP_FROM` |
| `NEXT_PUBLIC_SITE_URL` | Базовый URL сайта (canonical, OG) |
| `NEXT_PUBLIC_LANG` | Язык сборки: `ru` или `en` |
| `NEXT_PUBLIC_GTM_ID` | ID контейнера Google Tag Manager (опционально) |
| `NEXT_PUBLIC_REPLAIN_ID` | ID виджета Replain (опционально, скрыт если не задан) |
| `NEXT_PUBLIC_CALENDLY_URL` | URL Calendly-виджета (опционально, есть дефолт по языку) |

---

## CI/CD

- **Deploy to Production** (`.github/workflows/deploy.yml`) — `workflow_dispatch`, SSH на RU / EN / AE, на сервере выполняется `scripts/github-deploy-remote.sh`: `git reset` к `main`, запись `.env`, `npm ci`, миграции Payload, `npm run build`, PM2. Режим **hard** дополнительно запускает `npm run seed` (для EN-сайта при необходимости лучше править скрипт под `seed:en`).
- **Update .env** (`.github/workflows/update-env.yml`) — только перезапись `.env` и `pm2 reload`, без сборки и без смены пользователя в БД Payload.

Секреты — с префиксами `RU_*`, `EN_*`, `AE_*` (см. переменные в workflow-файлах). Дополнительно репозиторный секрет **`ADMIN_NOTIFY_EMAIL`** (без префикса): общий получатель админских писем для RU, EN и AE; добавьте его в GitHub → Settings → Secrets and variables → Actions.

---

## Страницы и возможности

- **Главная** — hero, о компании, услуги, преимущества, партнёры, CTA, рассылка.
- **Услуги** — индекс и лендинги: Strategic Consulting, Tokenomics, Tokenomics Audit (с FAQ).
- **Кейсы** — портфолио с фильтрацией по тегам (DeFi, RWA, GameFi, Finance).
- **Блог** — архив, категории, статья с rich text, ToC, счётчик просмотров, related articles.
- **Контакты** — форма обратной связи + Calendly-виджет.
- **Политика конфиденциальности** — отдельные компоненты для RU и EN.
- **Формы** — контакт и подписка на рассылку (сохранение в БД + email).
- **SEO** — метаданные, canonical, OG/Twitter, sitemap.xml, robots.txt, GTM.
