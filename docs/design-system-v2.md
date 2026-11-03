# Дизайн-система v2

> Источник истины — Figma «Design system (Copy)», страница **Elements** (`gmaUW6LoKd0jLh4MMuHjq4`, секция `60:3137`).
> Код: `src/shared/ds`. Глобальные стили: `src/app/globals-v2.scss`. Root layout: `src/app/(site-v2)/layout.tsx`.
> Живая витрина: `/staging-docs/design-system` (только staging, noindex).
>
> Текущая система (v1) описана в `docs/styleguide.md` и живёт параллельно.

---

## Как устроено сосуществование двух систем

| | v1 (текущая) | v2 (новая) |
|---|---|---|
| Страницы | `src/app/(site)/**` | `src/app/(site-v2)/**` |
| Root layout | `(site)/layout.tsx` + `globals.scss` | `(site-v2)/layout.tsx` + `globals-v2.scss` |
| Компоненты | `src/shared/ui` | `src/shared/ds/ui` |
| Стили | `src/shared/styles` (`$text-primary`, …) | `src/shared/ds/styles` (`$ds-text`, …) |
| CSS-переменные | `--text-primary`, `--bg-secondary`, … | `--ds-*` |
| Темы | dark + light (статьи, исследования, аудиты) | только dark, light — позже |

- **Два root layout.** Глобальные стили систем никогда не попадают на одну страницу. Общая обвязка (SEO, JSON-LD, аналитика, чат, хедер, футер, флаги разделов) — в `src/app/_site-shell/SiteShell.tsx`; `<html>` получает `data-ds="v1|v2"`.
- **Переход между системами — целыми страницами**: папка страницы переезжает из `(site)` в `(site-v2)`, URL не меняется. Переход по ссылке между страницами разных систем — полная перезагрузка (разные root layout), это нормально.
- **Хедер и футер общие.** Компоненты одни; внутри `[data-chrome]` `globals-v2.scss` переопределяет токены контракта значениями v2 (кнопка — pill 64px, белая; поля футера — радиус 10px). Контракт — в `docs/styleguide.md` → «Хедер и футер».
- **Границы импортов** — ESLint (`eslint.config.mjs`, `no-restricted-imports`):
  - `src/shared/ds/**` и `src/app/(site-v2)/**` не импортируют `@/shared/ui*` и `@/shared/styles*`;
  - `src/shared/ui/**`, `src/shared/styles/**` и `src/app/(site)/**` не импортируют `@/shared/ds*`.
  - `widgets`, `features`, `entities` нейтральны. SCSS `@use` линтер не проверяет: в модулях v2 подключать только `@use '@/shared/ds/styles' as *;`.
- **Когда все страницы переедут:** удалить `(site)`, `globals.scss`, `src/shared/ui`, `src/shared/styles`, переименовать `(site-v2)` → `(site)`, убрать контракт из `[data-chrome]`.

---

## Токены

Подключение в модуле: `@use '@/shared/ds/styles' as *;` (токены и миксины).

### Цвета — два слоя

**Примитивы** (`_tokens.scss`, из Figma Variables `Colors/*`) — используются только для задания семантики:

| Figma | Переменная | HEX |
|---|---|---|
| Colors/Black | `$ds-black` | `#000000` |
| Colors/Dark | `$ds-dark` | `#101113` |
| Colors/Charcoal | `$ds-charcoal` | `#1B1B1B` |
| Colors/Gray | `$ds-gray` | `#707172` |
| Colors/White | `$ds-white` | `#FFFFFF` |
| Colors/Pink | `$ds-pink` | `#CA005A` |
| Colors/Green | `$ds-green` | `#34C759` |
| Colors/Orange | `$ds-orange` | `#FF8D28` |
| Colors/Red | `$ds-red` | `#FF383C` |

**Семантика** — то, что используют компоненты (`$ds-x` → `var(--ds-x)`, значения в `globals-v2.scss`):

| Токен | Dark | Применение |
|---|---|---|
| `--ds-bg` | Black | Фон страницы |
| `--ds-surface` | Dark | Карточки, поля |
| `--ds-surface-raised` | Charcoal | Secondary-кнопка, таб off, hover поля |
| `--ds-surface-glass` | White 15% + blur 12 | Tertiary-кнопка поверх фото/градиента |
| `--ds-text` | White | Основной текст |
| `--ds-text-muted` | Gray | Описания, лейблы, плейсхолдеры |
| `--ds-text-inverse` | Black | Текст на светлой заливке |
| `--ds-border` | White 8% | Разделители, линии таблиц |
| `--ds-border-strong` | Gray | Рамка поля на hover |
| `--ds-accent` | Pink | Акцент |
| `--ds-danger` / `--ds-success` / `--ds-warning` | Red / Green / Orange | Статусы |
| `--ds-focus` / `--ds-focus-ring` | White / White 13% | Фокус полей |
| `--ds-overlay-darken` / `-soft` / `--ds-overlay-lighten` | Black 10% / 5%, White 3% | Hover-слой поверх заливки (как в Figma) |
| `--ds-shadow-xs` | Figma `shadows/xs` | Тень |

**Светлая тема** добавится блоком `[data-theme='light'] { --ds-…: … }` в `globals-v2.scss`; компоненты менять не придётся.

### Типографика

Manrope Medium 500 во всех стилях. Body-стили — letter-spacing 1% (`0.01em`), заголовки — 0.

| Миксин | Figma | Desktop | Mobile ≤ 640 |
|---|---|---|---|
| `ds-h1` | Heading 1 | 72 / 80 | 56 / 64 |
| `ds-h2` | Heading 2 | 56 / 64 | 40 / 48 |
| `ds-h3` | Heading 3 | 40 / 48 | 32 / 40 |
| `ds-h4` | Heading 4 | 32 / 40 | 24 / 30 |
| `ds-h5` | Heading 5 | 24 / 30 | 24 / 30 |
| `ds-text-lg` | Text large | 18 / 25 | — |
| `ds-text-md` | Text normal | 16 / 22 | — |
| `ds-text-sm` | Text small | 14 / 20 | — |

Уменьшение заголовков на mobile на один уровень — по мобильному макету (заголовок блока H3 → 40px строки); при расхождении с макетами конкретных блоков — уточнить у дизайнера.

### Сетка и отступы

| Токен | Значение | Источник |
|---|---|---|
| `$ds-content` | 1200px, 8 колонок × 141, gutter `$ds-gutter` 10 | Figma |
| `$ds-margin` | 40px | Figma (1280 − 1200) / 2 |
| `$ds-margin-tablet` | 24px (≤ 1024) | интерполяция |
| `$ds-margin-mobile` | 12px (≤ 640) | Figma 375 → контент 351 |
| `$ds-block-gap` | 180px между блоками | Figma |
| `$ds-block-gap-tablet` / `-mobile` | 120 / 160px | планшет — интерполяция; мобильный интервал удвоен по решению владельца |
| `$ds-inner-gap` / `-mobile` | 40 / 24px — заголовок блока → контент | Figma / интерполяция |
| `$ds-space-1…8` | 4, 8, 12, 16, 24, 32, 40, 48 | шкала для внутренних отступов |

На экранах шире 1280 контент остаётся 1200 по центру («у большого растут уши»).

Миксины: `ds-container` (колонка контента с полями), `ds-block-spacing` (вертикальный ритм блока), `ds-tablet`, `ds-mobile`.

### Форма и движение

| Токен | Значение | Где |
|---|---|---|
| `$ds-radius-pill` | 64px | Кнопки, табы, круглые контролы |
| `$ds-radius-field` | 10px | Поля ввода |
| `$ds-radius-card` | 8px | Карточки, панели |
| `$ds-duration` / `$ds-ease` | 160ms / `cubic-bezier(.2, 0, 0, 1)` | Переходы (`ds-transition`) |

---

## Элементы (`@/shared/ds`)

| Компонент | Figma | API |
|---|---|---|
| `Button` | Button Primary / Secondary / Tertiary (`63:3156–63:3158`) | `variant: 'primary' \| 'secondary' \| 'tertiary'`, `href?` (рендерит `Link`), `fullWidth?`, `icon?`, `iconPosition?`, `disabled?`. 56px, pill, Text small. Hover — слой поверх заливки |
| `Tabs` | Tab on / Tab off (`63:3169`, `63:3172`) | `items`, `value`, `onChange`, `label`, `panelIdPrefix?`. 44px, pill. ARIA tabs, ← → Home End |
| `TextField` | Поля / Текстовое поле (`52:407`) | `label`, `error?`, `hint?` + пропсы `<input>`. 56px, радиус 10. Состояния: default, hover, focus (рамка 1.5px + halo 3px) — CSS; «заполнено» — поле со значением; «ошибка» — `error` (красная рамка, иконка, текст) |
| `Textarea` | (поле формы, 145px) | как `TextField`, `rows` (по умолчанию 4) |
| `IconButton` | Arrows / Button (`54:3039`) | `direction: 'prev' \| 'next'`, `label`. 48px, Charcoal, шеврон 32 |
| `ArrowLink` | ссылка-источник с ↗ | `href` (внешняя — новая вкладка), `tone: 'muted' \| 'light'` |
| `Pill` | плашка цены (`40:975`) | `items` — факты через точку; чёрная, радиус 12, Text large Pink |
| `Eyebrow` | «RWA · COMMODITIES» | Text small, uppercase, 40% белого |
| `Meta` | «⚡ Читать 12 минут» | иконка zap + Text normal, 40% |
| `StepNumber` | номер шага Roadmap (`47:2106`) | 32px, радиус 5, рамка Pink 50% |
| `Divider` | линия между строками | 1px `--ds-border` |

## Блоки (`@/shared/ds`)

Витрина: `/staging-docs/design-system/blocks` — каждый блок на демо-данных из Figma с подписью фрейма.

| Компонент | Figma | API / заметки |
|---|---|---|
| `Section` | обёртка любого блока | `title?` (Heading 3), `align: 'left' \| 'center'`, `sheen?` (белый перелив заголовка), `actions?` (слот справа), `narrow?` (колонка 720), `bleed?` (контент до правого края экрана). Даёт колонку 1200, ритм 180 и отступ 40 под заголовком |
| `FeatureCards` | Карточка - компактная (`38:978`), - кнопка (`38:1033`), Иллюстрация содержания (`38:1089`) | `variant: 'compact' \| 'action' \| 'illustrated'`, `items: { title, description, illustration?, action? }[]`, `columns?: 2 \| 3 \| 4`. Без `illustration` — плейсхолдер 5% белого, как в макете |
| `Metrics` | Карточка - крупная цифра (`38:964`) | `items: { value, label }[]`; 4 в ряд, Heading 3 |
| `Carousel` | Карточка - акцент (`54:2632`), - цитата (`54:2858`) | `title`, `slideWidth` (394 / 450), дети — карточки. Framer Motion: drag/свайп + стрелки, шаг — ширина карточки; `prefers-reduced-motion` без анимации. Карточки выходят за правый край колонки |
| `AccentCard` | контейнер `54:2646` | `title`, `text`, `source?: { label, href }`. Фон — экспорт градиента из Figma (`assets/accent-card.webp`) |
| `QuoteCard` | контейнер `54:3074` | `logo?: { src, alt, width, height }`, `title`, `text`, `source?` |
| `Faq` | FAQ (`41:1069` = `47:2126`) | `items: { question, answer }[]`, `defaultOpen?` (по умолчанию первый), `footer?`. Аккордеон, можно открыть несколько; `aria-expanded` / `region` |
| `FormBlock` + `FormRow` | Форма (`54:2453`) | обёртка `<form>`: поля внутри, `FormRow` — пара полей в строку; `submitLabel`, `pending?`, `status?`. Только вёрстка — отправку подключает фича (по образцу существующих форм и `/api/contact`) |
| `Cta` | CTA - левый край (`40:549`), CTA - цена (`40:757`) | `variant: 'left' \| 'price'`, `title`, `description?`, `primary`, `secondary?`, `facts?` (плашка на верхней кромке). Фон — экспорт «Astro Gradient» из Figma (`assets/cta-gradient.webp`) |
| `Roadmap` | Roadmap (`45:2055`) | `steps: { title, description }[]`; 3 в ряд |
| `CaseList` | Кейс (`43:1602`) | `items: { href, image, category, title, description, meta?, cta }[]`; на mobile кнопка уходит вниз карточки |
| `ComparisonTable` | Таблица (`42:1286`), с выделением сегмента (`43:1391`) | `columns`, `rows: { label, values }[]`, `highlight?` (индекс колонки), `caption?`. Семантичная `<table>`; на mobile — горизонтальный скролл |

Картинки фонов подключаются статическим импортом через `next/image` — так они работают и под `basePath` (RU-staging). Демо-картинки витрины лежат рядом с ней, в `src/app/(site-v2)/staging-docs/design-system/demo`.

### Расхождения в макете (уточнить у дизайнера)

- **Радиус поля:** в компоненте «Поля / Текстовое поле» — 10px, в инстансах формы (`54:2453`) — 15px. В коде 10px, по компоненту.
- **Мобильные версии блоков** (фрейм `79:130`) построчно не сверялись; на mobile блоки перестраиваются в одну колонку по логике сетки, таблица скроллится.
- **Отступы для планшета** (поля 24, ритм 120) и уменьшение заголовков на mobile — интерполированы. Мобильный ритм между блоками — 160px по решению владельца.

### Ещё не сделано

- **Иконки** — отложены (TBD): в Figma собственный набор 965 иконок 24px. В `src/shared/ds/icons` только иконки из макетов блоков (как экспортированы из Figma).
- **Светлая тема.**
