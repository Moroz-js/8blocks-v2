# Архитектура

## Карта кода

| Путь | Что там |
|---|---|
| `src/app/(site)/` | Публичный сайт: страницы App Router, `layout.tsx` — общий layout (хедер, футер, тема, аналитика) |
| `src/app/(payload)/` | Админка и REST API Payload (`/admin`, `/api/[...slug]`), `admin/importMap.js` — генерируемый |
| `src/app/api/` | Свои роуты: `contact`, `newsletter`, `articles/[slug]/view`, `audits/[slug]/pdf`, `og` |
| `src/app/sitemap.ts`, `robots.txt/`, `llms.txt/` | SEO-роуты |
| `src/proxy.ts` | Middleware: `x-pathname` header, 404 для `/staging-docs` вне staging |
| `src/widgets/` | Крупные секции страниц (Header, Footer, TokenLab, Benchmarks, TokenomicsAi, Platform…) |
| `src/features/` | Формы и сценарии: ContactForm, NewsletterForm, ShareBlock, ArticleView |
| `src/entities/` | Типы и карточки сущностей (article, public-audit, research, event…) |
| `src/shared/content/` | Тексты: `ru/*.ts`, `en/*.ts`, корневые файлы выбирают локаль по `lang` |
| `src/shared/lib/platform/` | Логика инструментов: `tokenlab/` (калькулятор, скоринг, URL-состояние), `benchmarks/`, `cases/`, `diagnostic/` (JSON-данные `*.json` / `*.ru.json`) |
| `src/shared/lib/site-seo/` | Метаданные, hreflang, robots, llms.txt из глобала `SiteSeo` |
| `src/shared/i18n/` | `lang`, `t({ ru, en })` — build-time локализация |
| `payload/` | Коллекции, блоки rich text, глобал `SiteSeo` |
| `migrations/` | Миграции БД Payload |
| `scripts/` | `run-migrations.ts`, `github-deploy-remote.sh`, `payload-next-env-shim.cjs` |
| `.github/workflows/` | `deploy.yml` (ручной запуск, 5 целей) → reusable `deploy-site.yml` |

## Точки входа

- Сайт: `src/app/(site)/layout.tsx` + страницы в `src/app/(site)/**/page.tsx`.
- CMS: `payload.config.ts` (коллекции из `payload/collections/index.ts`, глобалы, Postgres, SMTP только в production).
- Деплой: `.github/workflows/deploy.yml` → `deploy-site.yml` (сборка в CI, архив `.next` по scp) → `scripts/github-deploy-remote.sh` на сервере (git reset к ветке, `.env`, `npm ci`, миграции, PM2).

## Потоки данных

- Контент CMS: server-компоненты вызывают `getPayload({ config })` → `payload.find(...)` с where-фильтрами из `src/shared/lib/visible-*-where.ts`.
- Флаги разделов (блог, исследования, аудиты, события, пресса) — `src/shared/lib/get*Enabled.ts`, кэш в памяти на 60 с.
- Статические тексты: `src/shared/content/*` (выбор локали при сборке).
- Данные инструментов: JSON в `src/shared/lib/platform/*`; server-страница выбирает локаль и передаёт данные клиентским компонентам пропсами.
- Формы: клиент → `POST /api/contact` или `/api/newsletter` → запись в коллекции `leads` / `newsletter-subscriptions` + письмо через SMTP.
- PDF аудитов: `/api/audits/[slug]/pdf` → puppeteer открывает страницу аудита по `PDF_INTERNAL_BASE_URL` → кэш в `AUDIT_PDF_CACHE_DIR`.
- Тема: `ThemeProvider` (начальная тема по пути и `localStorage['8blocks-blog-theme']`) + `ThemeController`/`ThemeScopeMarker` (переключатель только на детальных страницах блога, исследований, аудитов).

## Опасные зависимости

- `scripts/payload-next-env-shim.cjs` перехватывает `Module._load` ради `@next/env.default` — нужен Payload CLI; проверять после обновления Payload или Next.
- `@mantine/core` требует peer `@mantine/hooks` — не удалять, при `--legacy-peer-deps` peer сам не поставится.
- `puppeteer` — тяжёлый, вынесен в `serverExternalPackages`; на сервере Chrome кэшируется в `PUPPETEER_CACHE_DIR`.
- `next.config.ts` → `images.remotePatterns` с `hostname: '**'`: открытый прокси оптимизатора картинок.
- Staging RU и EN делят базу EN-прода (`EN_DATABASE_URI`): миграции на staging применяются к продовой EN-базе.
- `importMap.js` должен совпадать с компонентами в конфиге Payload; CI регенерирует его, при ошибке использует закоммиченный.
