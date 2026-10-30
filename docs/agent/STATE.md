# Состояние

Обновлено: 2026-10-29.

## Проверено

- `npm run typecheck`, `npm run test:platform` (82/82), `npm run build` — проходят.
- Dev-сервер, через Playwright MCP:
  - `/learn/token-vesting-benchmarks`: 5 вкладок секторов, 7 вкладок аллокаций, 6 FAQ, ошибок в консоли нет.
  - `/product/tokenization-cases`: 19 кейсов, фильтр «Funds & Treasuries» оставляет 5.
  - Тема: на `/audits/*` при `8blocks-blog-theme=light` выставляется `light`, на обычных страницах — `dark`.
  - `/admin` и создание публичного аудита открываются без ошибок `importMap`.
  - `/`, `/services`, `/contact`, `/product/calculator`, `/product/tokenization-readiness` — 200; `/home-redesign` — 404 (страница удалена).
- Клиентские чанки сборки не содержат строк из JSON бенчмарков и кейсов ни на одной локали: данные идут пропсами через RSC.

## Заявлено, не проверено

- Деплой через новый `deploy-site.yml` (reusable workflow, секреты по префиксу) — не запускался.
- Staging-деплой из ветки `staging`: ветки `staging` на origin пока нет, деплой staging упадёт на `git reset --hard origin/staging`, пока её не запушат.
- Кастомные поля админки (ColorPicker, ChartPreview, ChartPointValues) внутри блока графика не открывались.
- Figma MCP: не подключён (`figma` ждёт авторизации через `/mcp`, `Figma_Desktop` не отвечает) — сверки с макетами не было.

## Открытые риски

- `npm run lint` падает на 12 ошибках, появившихся до 2026-10-29: `no-html-link-for-pages` (TermsEn, TermsRu, CasesShowcase), `react-hooks/set-state-in-effect` (MantineThemeBridge, useThemeColors, ThemeToggle, FooterMap), `react-hooks/immutability` (BenchmarkAllocation), `prefer-const` (form-sanitize), `react/no-unescaped-entities` (WorkshopTestimonial).
- Локальная база отстаёт по миграциям: `/blog` отдаёт 500 (`столбец articles.seo_alternate_slug не существует`) — нужен `npm run payload:migrate`.
- Инлайновые `t({ en, ru })` и корневые `src/shared/content/*.ts` в 41 клиентском компоненте тянут обе локали в бандл.
- `images.remotePatterns: hostname '**'` — открытый прокси оптимизатора.
- В локальном `.env` есть `*_SSH_PASSWORD` — пароли в открытом виде.
- Форма заявки (`fetch('/api/contact')`) продублирована в 5 компонентах.
- `ScrollRevealText` определяет мобильный экран через `window.innerWidth` в state.
- `key={index}` в 42 местах.
