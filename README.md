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

Скопируйте `.env.example` в `.env` (или `.env.local`) и заполните значения:

```bash
cp .env.example .env
```

Минимально для запуска:

```env
DATABASE_URI=postgresql://user:password@localhost:5432/8blocks
PAYLOAD_SECRET=your-random-secret-key
```

### 3. База данных

Создайте базу PostgreSQL и при необходимости пользователя:

```sql
CREATE DATABASE eightblocks;
```

### 4. Миграции

Примените миграции для создания схемы Payload:

```bash
npm run payload:migrate
```

Если миграций ещё нет (первый запуск с пустой БД):

```bash
npm run payload:migrate:create
npm run payload:migrate
```

### 5. Seed (опционально)

Для локальной разработки можно заполнить БД тестовыми данными:

```bash
npm run seed
```

Создаёт категории, теги и статьи для блога. Для расширенного seed блога:

```bash
npm run seed:blog
```

> ⚠️ Seed рассчитан на `NODE_ENV=development`. На production не запускайте без явного разрешения (например `SEED_ALLOWED=true`).

### 6. Запуск

```bash
npm run dev
```

- Сайт: [http://localhost:3000](http://localhost:3000)
- Админка Payload: [http://localhost:3000/admin](http://localhost:3000/admin)

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
  shared/                 # UI-kit, конфиги, контент, стили, утилиты

payload/
  collections/           # Коллекции Payload (Users, Articles, Categories, Leads, Media…)

migrations/               # SQL-миграции БД (Payload)
scripts/                  # seed.ts, seed-blog.ts и др.
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
| `npm run seed` | Seed БД (категории, теги, статьи) |
| `npm run seed:blog` | Расширенный seed блога |

---

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `DATABASE_URI` | Строка подключения PostgreSQL |
| `PAYLOAD_SECRET` | Секрет Payload CMS |
| `ADMIN_EMAIL` | Email первого администратора (при seed) |
| `ADMIN_PASSWORD` | Пароль первого администратора (при seed) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Отправка писем (формы, уведомления) |
| `ADMIN_NOTIFY_EMAIL` | Куда слать уведомления о заявках |
| `NEXT_PUBLIC_SITE_URL` | Базовый URL сайта (canonical, OG) |
| `NEXT_PUBLIC_GTM_ID` | ID контейнера Google Tag Manager |

---

## Страницы и возможности

- **Главная** — hero, о компании, услуги, преимущества, партнёры, CTA, рассылка.
- **Услуги** — индекс и лендинги: Strategic Consulting, Tokenomics, Tokenomics Audit (с FAQ).
- **Блог** — архив, категории, статья с rich text, ToC, счётчик просмотров, related articles.
- **Формы** — контакт и подписка на рассылку (сохранение в БД + email).
- **SEO** — метаданные, canonical, OG/Twitter, sitemap.xml, robots.txt, GTM.
