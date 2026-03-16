# Project Structure

## 1. Purpose

Описать целевую структуру репозитория: каталоги, ключевые файлы, конфигурации, переменные окружения. Документ дополняет 01-architecture.md конкретным деревом и файлами.

## 2. Scope

- Корень проекта и основные папки.
- Конфигурационные файлы (Next.js, TypeScript, Payload, PostgreSQL, env).
- Размещение стилей, публичных ресурсов, uploads.
- Точки входа и скрипты.

## 3. Inputs from requirements

- Next.js, TypeScript, SCSS Modules + global.scss, Mantine, Payload CMS, PostgreSQL.
- Медиа в `/public/uploads`.
- Admin по согласованной структуре; логин/пароль и SMTP из env.
- GTM ID из env.
- Миграции и seed-скрипт.

## 4. Breakdown: дерево репозитория

Целевая структура (без полного перечисления всех файлов внутри src):

```
8blocks-new/
  .env.example
  .env.local
  .gitignore
  next.config.js (или .ts)
  package.json
  tsconfig.json
  tailwind.config.js (если используется для Mantine/утилит)
  postcss.config.js

  public/
    favicon.ico
    ... (статика)
    uploads/              # загруженные файлы (gitignore кроме placeholder при необходимости)

  payload.config.ts       # или src/payload/config.ts — по решению из 01-architecture
  src/
    app/
      layout.tsx
      page.tsx             # главная
      not-found.tsx
      globals.scss
      (route groups при необходимости)
      blog/
        page.tsx
        [category]/
          page.tsx
        [...slug]/
          page.tsx         # статья по slug
      services/
        page.tsx
        strategic-consulting/
          page.tsx
        tokenomics/
          page.tsx
        audit/
          page.tsx
      privacy-policy/
        page.tsx
      admin/
        [[...segments]]/   # Payload admin UI
      api/
        ...                # при необходимости кастомные API (например просмотры статьи)
      sitemap.ts
      robots.ts

    pages/                 # композиции страниц (см. 01-architecture)
    widgets/
    features/
    entities/
    shared/
      ui/
      lib/
      config/
      api/
      render/
      seo/

  payload/                 # если Payload в корне
    collections/
    hooks/
    (или эквивалент в src/payload/)
  migrations/              # или в корне, по конвенции Payload/Drizzle/Prisma
  scripts/
    seed.ts
  docs/
    planning/              # этот набор документов
```

## 5. Ключевые конфигурации

### 5.1 next.config

- Поддержка Payload (если требуется плагин/rewrites для `/admin` и `/api`).
- Возможность указания домена для изображений, если позже появятся внешние CDN (сейчас не требуется по ТЗ).
- Переменные окружения при необходимости (NEXT_PUBLIC_* для GTM и т.д.).

### 5.2 TypeScript

- Строгий режим; пути (path aliases) при необходимости, например `@/shared`, `@/widgets`.
- Исключение папок миграций/seed из компиляции при необходимости.

### 5.3 Payload

- `payload.config.ts`: database adapter (PostgreSQL), secret, admin route (`/admin`), collections, upload (local, destination `public/uploads`).
- Коллекции: Articles, Categories, Tags, Media, Leads, NewsletterSubscriptions (имена по решению, см. 08-cms-plan, 09-data-models).

### 5.4 Стили

- `src/app/globals.scss` (или `global.scss`): глобальные переменные (design tokens), сброс, шрифты (Manrope).
- Стили компонентов: SCSS Modules (`.module.scss`) рядом с компонентами или в выделенной папке по решению (04-design-system).

### 5.5 Переменные окружения (.env.example)

Должны быть задокументированы (без реальных значений):

- `DATABASE_URI` — PostgreSQL connection string.
- `PAYLOAD_SECRET` — секрет Payload.
- `ADMIN_*` или аналог — логин/пароль админа (или встроенная авторизация Payload).
- `SMTP_*` — хост, порт, user, password, from (для отправки писем).
- `NEXT_PUBLIC_GTM_ID` или `GTM_ID` — идентификатор GTM.
- `NEXT_PUBLIC_SITE_URL` или `SITE_URL` — базовый URL для canonical, sitemap, OG (опционально, но рекомендуется).

## 6. public/uploads

- Директория создаётся при первой загрузке или через seed/скрипт.
- В `.gitignore`: `public/uploads/*` с возможностью хранить в репо пустой `.gitkeep` или не хранить uploads в git вообще.
- Доступ по URL: `/uploads/filename` (см. 12-media-uploads-plan).

## 7. Migrations и seed

- **Migrations**: в папке, заданной Payload/Drizzle/Prisma (например `migrations/` в корне или внутри `payload/`). Запуск через npm-скрипт или CLI адаптера.
- **Seed**: `scripts/seed.ts` (или `.js`) — запуск через `npx ts-node` или через `tsx`; в package.json скрипт `"seed": "..."`.
- Seed не должен перезаписывать продовые данные; только для локальной разработки и тестов (см. 14-seed-and-migrations-plan).

## 8. Dependencies

- Структура фиксируется в Phase 0–1; миграции и seed — после определения моделей (Phase 2, 09, 08).

## 9. Risks / open questions

- Единый ли layout для всего сайта (включая админку) или отдельный layout для `/admin` — уточнить по Payload best practices.
- Размещение `payload.config`: корень vs `src/payload` влияет на импорты и пути к коллекциям.

## 10. Deliverables

- Фактическое дерево каталогов в репозитории.
- `.env.example` с перечислением всех переменных.
- README с инструкцией по установке, env, миграциям и seed.

## 11. Acceptance criteria

- По дереву можно однозначно найти: роуты, страницы, виджеты, конфиг Payload, миграции, seed.
- Новый разработчик может поднять проект по README и .env.example.
- Uploads не попадают в git (кроме политики .gitkeep при необходимости).
