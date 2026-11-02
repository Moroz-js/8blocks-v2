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
| `$ds-block-gap-tablet` / `-mobile` | 120 / 80px | интерполяция |
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

### Ещё не сделано

- **Элементы:** IconButton (круглые стрелки карусели), Link со стрелкой, Badge/Pill, Eyebrow/Tag, Meta с иконкой, номер-маркер, Divider.
- **Блоки:** секция-заголовок, карточки (компактная, с кнопкой, иллюстрации, метрики, акцент, цитата), FAQ, форма, CTA (левый край, цена), Roadmap, список кейсов, таблицы. Карусели — на Framer Motion.
- **Иконки** — отложены (TBD): в Figma собственный набор 965 иконок 24px, способ доставки в код не выбран. Пока в `src/shared/ds/icons` только то, что нужно элементам (`circle-alert.svg`).
- **Светлая тема.**
