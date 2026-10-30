# AGENTS.md

Единственный источник правил для агентов в этом репозитории. Внешняя память — `docs/agent/` (архитектура, состояние, решения, журнал сессий).

## Проект

Корпоративный сайт 8Blocks (токеномика, аудит токеномики, консалтинг) с блогом, аудитами, исследованиями, кейсами, событиями и интерактивными инструментами (калькулятор TokenLab, бенчмарки, диагностика).

Стек: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · SCSS Modules · Mantine · Framer Motion · Payload CMS 3 · PostgreSQL. Язык сайта задаётся при сборке через `NEXT_PUBLIC_LANG` (`ru` | `en`), переключателя языка нет.

## Команды

Проверены 2026-10-29:

| Команда | Что делает | Статус |
|---|---|---|
| `npm install` | Установка зависимостей | работает |
| `npm run dev` | Dev-сервер (порт 3000, при занятом — следующий свободный) | работает |
| `npm run typecheck` | `tsc --noEmit` | проходит |
| `npm run test:platform` | Vitest, `src/shared/lib/platform` (11 файлов, 82 теста) | проходит |
| `npm run build` | Production-сборка | проходит |
| `npm run lint` | ESLint | **падает**: 12 старых ошибок (см. `docs/agent/STATE.md`) |

Перед запуском: `cp .env.example .env` и заполнить `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_LANG`.

Если `typecheck` ругается на `.next/dev/types/...` от удалённой страницы — это устаревший кэш: остановить dev-сервер и удалить `.next/dev`.

## Процесс

- Один агент на сессию. Без ролей, без субагентов, без выбора моделей.
- Работать только в ветке `staging`. В `main` не коммитить и не пушить.
- Релиз в прод — только через PR `staging` → `main`.
- Деплой ручной, через GitHub Actions → **Deploy to Production** (`.github/workflows/deploy.yml`), параметр `deploy_target`: `all`, `ru`, `en`, `ae`, `staging`.
  - Три прода: RU, EN, AE — собираются из `main`.
  - Staging (EN на `staging.8blocks.io`, RU на `/ru`) — собирается из ветки `staging`.
- После завершения работы — проверка в браузере через Playwright MCP и сверка с макетами через Figma MCP. Если MCP не установлен или не подключён — установить/подключить (Figma MCP требует авторизации владельцем через `/mcp`).
- Перед концом сессии обновить `docs/agent/STATE.md` и добавить строку в `docs/agent/SESSIONS.md`. В `docs/agent/DECISIONS.md` писать только правила, одобренные владельцем.

## Правила кода

- Код по слоям FSD: `src/app` → `src/widgets` → `src/features` → `src/entities` → `src/shared`.
- Тексты — в `src/shared/content/{ru,en}/*.ts`, корневые `src/shared/content/*.ts` выбирают локаль.
- Клиентские компоненты (`'use client'`) не должны импортировать обе локали JSON/контента: выбирать локаль на server-странице и передавать пропсами.
- `src/app/(payload)/admin/importMap.js` генерируется Payload (`generate:importmap`), руками не править.
- Новые env-переменные — сразу в `.env.example` с комментарием, секреты деплоя — в `.env-github.example` и `.github/workflows/deploy-site.yml`.
