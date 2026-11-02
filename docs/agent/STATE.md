# Состояние

Обновлено: 2026-11-02.

## Проверено

- `npm run typecheck`, `npm run test:platform` (82/82) — проходят (2026-11-02). `npm run build` — последний прогон 2026-10-29.
- `npm run lint` — 12 старых ошибок (список ниже), новых нет; ESLint-границы v1/v2 срабатывают (проверено пробными импортами).
- Дизайн-системы (dev-сервер, Playwright, 2026-11-02):
  - Эталонные скриншоты 26 страниц v1 (обе темы для статей/аудитов/исследований/витрины) на 1440/768/375 до и после уборки стилей и выноса `SiteShell` — различий нет, кроме сторонних (Calendly на `/contact`, ленивые картинки).
  - Компиляция SCSS до/после уборки литералов — CSS идентичен (только `#ffffff` → `#fff`).
  - `/staging-docs/styleguide` (v1) и `/staging-docs/design-system` (v2): рендер, консоль без ошибок, без горизонтального скролла на 375.
  - v2: кнопка хедера — pill 64px, белая; фокус поля — белая рамка + halo 3px; ошибка — красная рамка и иконка; H1 на 375 — 56px.
  - v2 блоки (`/staging-docs/design-system/blocks`): визуально сверены со скриншотами Figma на 1440; на 375 без горизонтального скролла, карусель листает на ширину карточки, FAQ раскрывается, в кейсе кнопка последней.
- Локальная БД: миграции применены до `20261030_000000_hreflang_alternate_slug`; `/blog`, `/events`, детальные страницы открываются.

## Заявлено, не проверено

- Деплой через новый `deploy-site.yml` (reusable workflow, секреты по префиксу) — не запускался.
- Staging-деплой из ветки `staging`: ветки `staging` на origin пока нет.
- Кастомные поля админки (ColorPicker, ChartPreview, ChartPointValues) внутри блока графика не открывались.
- `npm run build` после появления второго root layout `(site-v2)` не запускался.
- Сверка v2 с Figma — по скриншотам и значениям из `get_design_context`; пиксельного сравнения не было. Мобильный фрейм Figma `79:130` с блоками построчно не сверялся. Figma MCP на тарифе Starter упирается в лимит вызовов.

## Открытые риски

- `npm run lint` падает на 12 ошибках, появившихся до 2026-10-29: `no-html-link-for-pages` (TermsEn, TermsRu, CasesShowcase), `react-hooks/set-state-in-effect` (MantineThemeBridge, useThemeColors, ThemeToggle, FooterMap), `react-hooks/immutability` (BenchmarkAllocation), `prefer-const` (form-sanitize), `react/no-unescaped-entities` (WorkshopTestimonial).
- Два root layout: переход по ссылке между страницами `(site)` и `(site-v2)` — полная перезагрузка (ожидаемо).
- Turbopack не резолвит относительные `@forward` внутри `@/shared/ds/styles/index.scss` — пути внутри `ds/styles` только через `@/`.
- v2: радиус поля — 10px в компоненте, 15px в инстансах формы; в коде 10.
- v2: отступы для планшета и мобильного (поля 24/12, ритм 120/80) и уменьшение заголовков на mobile частично интерполированы — уточнить у дизайнера.
- v1: в светлой теме низкий контраст у `--success-fg` / `--accent-green` (`#75fb63`).
- Инлайновые `t({ en, ru })` и корневые `src/shared/content/*.ts` в 41 клиентском компоненте тянут обе локали в бандл.
- `images.remotePatterns: hostname '**'` — открытый прокси оптимизатора.
- В локальном `.env` есть `*_SSH_PASSWORD` — пароли в открытом виде.
- Форма заявки (`fetch('/api/contact')`) продублирована в 5 компонентах.
- `ScrollRevealText` определяет мобильный экран через `window.innerWidth` в state.
- `key={index}` в 42 местах.
