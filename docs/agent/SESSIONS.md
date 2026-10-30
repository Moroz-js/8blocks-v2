# Сессии

## Активный бриф

Нет активной задачи. Ближайшие кандидаты (из `STATE.md`): починить 12 ошибок lint, прогнать миграции на локальной БД, запушить ветку `staging` и проверить staging-деплой новым workflow.

## Журнал

- 2026-10-29 — Чистка: `.env.example`, удалены мёртвые виджеты/коллекция/скрипты/доки, `deploy.yml` → reusable `deploy-site.yml` (prod из `main`, staging из `staging`), удалён `update-env.yml`, фикс ключей темы, одна локаль JSON в клиенте бенчмарков и кейсов; удалён локальный каталог `migration/` (дамп БД, аплоады, SSH-конфиг; бэкап у владельца); удалён сид кейсов (`scripts/seed-cases.ts`, `seed:cases`, шаг в деплое, данные `cases`/`allTags` в `content/{ru,en}/casesPage.ts`); добавлены `AGENTS.md`, `docs/agent/`. Пути: `.github/workflows/`, `src/widgets/Benchmarks/`, `src/shared/lib/ThemeProvider.tsx`, `.env.example`.
