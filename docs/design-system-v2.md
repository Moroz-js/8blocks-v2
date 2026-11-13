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
- **Хедер и футер общие и уже на v2.** Компоненты одни для обеих систем и сами объявляют значения `--ds-*` (`@include ds-theme-dark`), поэтому одинаковы на v1-страницах; прежний контракт `[data-chrome]` больше не нужен.
- **Что на v2 (2026-11-13).** Все 25 страниц макетов `project 2/`: `/`, `/about`, `/contact`, `/methodology`, `/press`, `/blog` и `/blog/[slug]`, `/research` и `/research/[slug]`, `/audits`, `/cases` и `/cases/[slug]`, `/product/tokenization-cases`, `/learn/token-vesting-benchmarks`, `/product/tokenomics-ai`, `/product/token-launch`, услуги (`/services/tokenomics`, `/services/audit`, `/services/strategic-consulting`), `/product/workshop`, `/product/digital-assets`, `/product/tokenization-readiness` (+ result), `/product/calculator` (+ result). На v1 без макетов остаются `/events` и `/events/[slug]`, `/audits/[slug]`, `/team/[slug]`, `/services`, `/product/digital-assets/owners-guide`, `/terms`, `/privacy-policy` и 404 v1.
- **SEO-переопределения из админки** (глобал «Глобальное SEO») подхватываются для статических маршрутов обеих групп: `discover-static-route-paths.ts` обходит `(site)` и `(site-v2)`. Пути в нём — литералы, иначе Turbopack трассирует весь проект.
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
| — (HTML-макеты, ссылки в статьях) | `$ds-gray-light` | `#AAAAAC` |
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
| `--ds-text-faint` | White 40% | Вторичный текст на градиенте и фото |
| `--ds-text-link` | Gray light | Ссылки и источники в тексте статей (с подчёркиванием, offset 3px) |
| `--ds-border` | White 8% | Разделители, линии таблиц |
| `--ds-border-strong` | Gray | Рамка поля на hover |
| `--ds-accent` | Pink | Акцент |
| `--ds-danger` / `--ds-success` / `--ds-warning` | Red / Green / Orange | Статусы |
| `--ds-focus` / `--ds-focus-ring` | White / White 13% | Фокус полей |
| `--ds-overlay-darken` / `-soft` / `--ds-overlay-lighten` | Black 10% / 5%, White 3% | Hover-слой поверх заливки (как в Figma) |
| `--ds-shadow-xs` | Figma `shadows/xs` | Тень |

**Акцентный градиент** — `$ds-accent-stops` (Figma `110:6122`): `#120209` → `#C66993`, 8 стопов. Отдельно не используется — только через `AccentSurface` (см. «Элементы»).

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
| `ds-text-xs` | Text extra small | 12 / 16 | — |

Начертания: `$ds-weight` 500 (основное), `$ds-weight-regular` 400, `$ds-weight-bold` 700.

**Значения вне токенов.** Если в макете (Figma или HTML из `project/`) размер не совпадает с токеном — берётся ближайший существующий, новых значений не заводим. Согласовано: текст 15 → 16, 13 → 14, заголовок 48 → 40 (h3). Новые токены — только по решению владельца.

**Переносы в заголовках.** Ручные `\n` в заголовках рассчитаны на desktop-ширину; на mobile у `Section`, `ServiceHero`, `CoverCard`, `TeamCta` стоит `white-space: normal`, текст переносится сам.

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

Миксины: `ds-container` (колонка контента с полями), `ds-bleed` (фон внутри контейнера — на всю ширину экрана), `ds-block-spacing` (вертикальный ритм блока), `ds-tablet`, `ds-mobile`.

**Фоны на всю ширину.** Hero, фоновые фото, градиенты, глобусы и подложки секций не ограничиваются контейнером 1200 — тянутся на всю ширину экрана; в контейнере только контент. Два способа: секция без `ds-container`, а контент внутри неё в `ds-container` (как `ServiceHero`), или `@include ds-bleed` для фона внутри контейнера (как глобус юрисдикций). Образец — `/product/digital-assets`. Карточки (`$ds-radius-card`) остаются в контейнере.

### Форма и движение

| Токен | Значение | Где |
|---|---|---|
| `$ds-radius-pill` | 64px | Кнопки, табы, круглые контролы |
| `$ds-radius-field` | 10px | Поля ввода |
| `$ds-radius-card` | 10px | Карточки, панели, CTA |
| `$ds-radius-lg` | 15px | FAQ, выделение таблицы, превью кейсов, медиакарточки |
| `$ds-radius-badge` / `-step` | 12 / 5px | Плашка цены, номер шага |
| `$ds-radius-md` / `-sm` / `-xs` | 8 / 6 / 4px | Мелкие элементы |
| `$ds-duration` / `$ds-ease` | 160ms / `cubic-bezier(.2, 0, 0, 1)` | Переходы (`ds-transition`); длинные анимации — кратные `$ds-duration` |

---

## Элементы (`@/shared/ds`)

| Компонент | Figma | API |
|---|---|---|
| `Button` | Button Primary / Secondary / Tertiary (`63:3156–63:3158`) | `variant: 'primary' \| 'secondary' \| 'tertiary'`, `href?` (рендерит `Link`), `fullWidth?`, `icon?`, `iconPosition?`, `disabled?`. 56px, pill, Text small. Hover — слой поверх заливки |
| `Tabs` | Tab on / Tab off (`63:3169`, `63:3172`) | `items: { value, label, icon? }[]` (иконка 20px, инвертируется на выбранном), `value`, `onChange`, `label`, `panelIdPrefix?`, `variant: 'pill' \| 'ghost'`. 44px, pill. ARIA tabs, ← → Home End. `ghost` — табы без фона, выбранный подсвечивает одна белая плашка, которая «перетекает» к новому табу (ведущий край первым, хвост с задержкой `$ds-duration / 2`); до гидратации заливка у самого таба, при reduced-motion — без анимации |
| `AccentSurface` | акцентная карточка (`110:6122`) | Без пропсов (кроме `className`). Фоновый слой первым ребёнком блока с `position: relative; isolation: isolate; overflow: hidden`. Градиент `$ds-accent-stops`, угол `180° − atan(1.53·h/w)` по пропорциям блока; зерно (160px) медленно всплывает, светлые точки (240px) — быстрее с покачиванием; при reduced-motion статичен. Карточки внутри `data-accent-group` делят один градиент на всю группу. Заменяет картинки-фоны акцентных блоков из макетов |
| `Hint` / `HintTooltip` | подсказка «?» | `text`; Mantine Tooltip в портале, держится внутри viewport, работает на hover/focus/touch. `HintTooltip` оборачивает любой элемент |
| `TextField` | Поля / Текстовое поле (`52:407`) | `label`, `error?`, `hint?` + пропсы `<input>`. 56px, радиус 10. Состояния: default, hover, focus (рамка 1.5px + halo 3px) — CSS; «заполнено» — поле со значением; «ошибка» — `error` (красная рамка, иконка, текст) |
| `Textarea` | (поле формы, 145px) | как `TextField`, `rows` (по умолчанию 4) |
| `SelectField` | поле-список (формы project 2) | как `TextField` + `options: string[]`, `placeholder?` (неактивная первая опция, серым до выбора). Нативный `<select>` в той же рамке, шеврон `chevron-down` |
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
| `Section` | обёртка любого блока | `title?` (Heading 3; `\n` сохраняются), `description?` (Text small, 40%), `align: 'left' \| 'center'`, `sheen?` (белый перелив заголовка), `actions?` (слот справа), `narrow?` (колонка 720), `bleed?` (контент до правого края экрана). Даёт колонку 1200, ритм 180 и отступ 40 под заголовком |
| `FeatureCards` | Карточка - компактная (`38:978`), - кнопка (`38:1033`), Иллюстрация содержания (`38:1089`) | `variant: 'compact' \| 'action' \| 'illustrated'`, `items: { title, description, illustration?, action? }[]`, `columns?: 2 \| 3 \| 4`. Без `illustration` — плейсхолдер 5% белого, как в макете |
| `Metrics` | Карточка - крупная цифра (`38:964`) | `items: { value, label }[]`; 4 в ряд, Heading 3 |
| `Carousel` | Карточка - акцент (`54:2632`), - цитата (`54:2858`) | `title`, `description?`, `sheen?` (перелив заголовка; на страницах услуг выключен), `slideWidth` (394 / 450 / 823), дети — карточки, `toolbar?` (строка под заголовком, например табы; стрелки переезжают в неё), `footer?` (контент под лентой в колонке), `resetKey?` (смена значения возвращает ленту к первой карточке). Framer Motion: drag/свайп + стрелки, шаг — ширина карточки; `prefers-reduced-motion` без анимации. Карточки выходят за правый край колонки |
| `AccentCard` | контейнер `54:2646` | `title`, `text`, `source?: { label, href }`. Фон — `AccentSurface` |
| `QuoteCard` | контейнер `54:3074` | `logo?: { src, alt, width, height }`, `title`, `text`, `source?` |
| `Faq` | FAQ (`41:1069` = `47:2126`) | `items: { question, answer }[]`, `defaultOpen?` (по умолчанию первый), `footer?`. Аккордеон, можно открыть несколько; `aria-expanded` / `region`. Раскрытие плавное (`grid-template-rows` + прозрачность + сдвиг на 8px, `$ds-duration × 3`), шеврон поворачивается за то же время |
| `FormBlock` + `FormRow` | Форма (`54:2453`) | обёртка `<form>`: поля внутри, `FormRow` — пара полей в строку; `submitLabel`, `pending?`, `status?`. Только вёрстка — отправку подключает фича (по образцу существующих форм и `/api/contact`) |
| `Cta` | CTA - левый край (`40:549`), CTA - цена (`40:757`) | `variant: 'left' \| 'price' \| 'center'` (`center` — заголовок h4 и кнопки по центру, как на продуктовых страницах project 2), `title`, `description?`, `primary`, `secondary?` (tertiary-кнопка), `facts?` (плашка на верхней кромке), `size: 'lg' \| 'md' \| 'sm' \| 'xs'` (заголовок h3 / h4 / h5 в одну строку / Text L для узкой колонки), `image?` (фото вместо фона; `null` — простая подложка). Фон по умолчанию — `AccentSurface` |
| `Roadmap` | Roadmap (`45:2055`) | `steps: { title, description }[]`, `columns: 3 \| 4`, `numbering: 'plain' \| 'padded'` (`1` / `01`) |
| `ScorePetals` | «лепестки» оценки (калькулятор, readiness) | `petals: { id, label, value 0–1, tone, tip? }[]` (4 или 5), `label` (a11y), `bare?`, `hints?` (подсказки у подписей). Canvas, анимация заполнения 700ms; уровни колец `PETAL_LEVELS` и цвет `petalTone(value)` — в `petals.ts` (без `'use client'`, можно вызывать на сервере) |
| `CaseList` | Кейс (`43:1602`) | `items: { href, image, category, title, description, meta?, cta }[]`; на mobile кнопка уходит вниз карточки |
| `ComparisonTable` | Таблица (`42:1286`), с выделением сегмента (`43:1391`) | `columns`, `rows: { label, values }[]`, `highlight?` (индекс колонки), `accent?` (выделенная колонка на `AccentSurface` вместо подсветки, Tokenomics AI), `caption?`. Семантичная `<table>`; на mobile — горизонтальный скролл |

## Блоки страниц (`src/widgets/ServicePages/blocks`)

Общие секции новых страниц (услуги, workshop, калькулятор, readiness, digital assets). Собраны из элементов `@/shared/ds` и токенов; используются на нескольких страницах, поэтому живут вне конкретного виджета.

| Компонент | Где | API / заметки |
|---|---|---|
| `ServiceHero` | все страницы | `scene?` (бинарная сцена) или `image?` (фото на всю ширину), `artTop?` / `artLeft?` (смещение сцены; со сдвигом сцена гаснет слева), `eyebrow?` (строка над заголовком), `title`, `description?`, `titleSize: 'lg' \| 'md' \| 'sm'` (h2 / h3 / h4), `layout: 'center' \| 'spread'`, `aside?`, `footnote?`, `corner?` + `cornerAlign: 'left' \| 'right'` (логотипы партнёров, факты у нижнего края), дети — кнопки. Помечен `data-under-header` — заезжает под хедер |
| `HeroBadge` | Tokenization Cases, Token Launch | `accent` (розовая плашка, ссылка при `href`), `title?`, дети — факт. Рамка-пилюля на `$ds-surface-raised` |
| `FitCards` | Token Launch, бенчмарки | `good` / `bad: { title, items }` — две карточки «подходит / не подходит», розовые галочки и серые крестики |
| `SplitList` + `IndexedRows` / `LabeledRows` | главная, About, услуги, Token Launch, бенчмарки | `IndexedRows`: `items: { label?, lead, text, body? }[]` (`label` — розовая строка над текстом, `body` — данные и ссылки под ним), `size: 'sm' \| 'lg'` (`lg` — Text L, вопрос и ответ на разных строках). Заголовок `SplitList` сохраняет `\n` |
| `PartnersMarquee` | главная, Token Launch | `label`, `className?` (для встраивания в `Section`) |
| `GlyphCards` | услуги, readiness | карточки с `BinaryGlyph`: `columns`, `height`, `glyph: { top?, height }`, `text: 'bottom' \| 'under'`, `align`; на mobile глиф в потоке над текстом |
| `CallSteps` | результаты калькулятора и readiness | заголовок, фото звонка с градиентом, 3 шага, кнопка; `imageFirst?` — заголовок под фото |
| `CoverCard` | калькулятор, readiness, DA | `layout: 'stack' \| 'row'`, `art: { width, height, right, bottom? }`. Иллюстрация поднимается над карточкой и обрезается её краем; на планшете и mobile — в потоке под текстом |
| `TeamCta` | readiness, DA | `title`, `description`, `primary`, `secondary`, `people[]` — аватары 234px (сейчас инициалы, фото нет) |
| `SituationTabs` | readiness, DA | `label`, `labels`, `items` (`situationItems()` из `Readiness/art.ts`), `tabsVariant?`. Фото под `HeroDigits`, четыре карточки с «глитч»-сменой текста (`useScramble`) |
| `ServiceFaq` | все страницы | `Faq` в узкой колонке + строка «Есть вопросы?» |
| `ChecklistRows`, `ExpandingCards`, `StepsCarousel`, `StrategyDiagram`, `UseCases`, `MiniApp` | страницы услуг и workshop | по комментарию в файле компонента |

**Анимации — общий движок `src/widgets/BinaryArt`.** `BinaryScene` (сцены из `Binary *.dc.html`: рендер в Web Worker через OffscreenCanvas, запасной путь — Canvas 2D на основном потоке; сцены project 2 — `profiles`, `gold-coin`, `bulb`, `briefcase`, `broken-coin`, `way-*`, `brain`, `shuttle`, `city-coins`, `office`, `unicorn`), `BinaryGlyph` (иконки из бинарных цифр, `shape`/`ox`/`oy`/`os`, `deep` по умолчанию; если `shape` есть в реестре `engine/illustrations.ts` — рисует движок project 2 `engine/binaryEngine.js` по WebP-источнику, иначе процедурный глиф), `HeroDigits` (фото с наложением цифр по hover). Общий тикер, пауза вне экрана и при скрытой вкладке, статичный кадр при `prefers-reduced-motion`. `useScramble` (`src/shared/lib`) — смена текста с «глитчем».

## Каркас и шаблоны страниц (project 2)

- **Хедер** `src/widgets/Header`: sticky, 92px (64 на планшете и mobile), стекло; четыре мегаменю — Tokenomics, Digital Assets, Media, Company — с карточкой-вступлением на `AccentSurface` и колонками ссылок; на mobile — бургер. Хедер заезжает на hero только если на странице есть `[data-under-header]` (`ServiceHero`, hero калькулятора). Ссылки выключенных в CMS разделов скрывает `filterNav`; пустая группа исчезает целиком. Тексты и группы — `src/shared/content/{en,ru}/siteNav.ts`.
- **Футер** `src/widgets/Footer`: подписка, колонки из тех же групп `siteNav`, офис с картой, контакты из `siteConfig`, юридические ссылки. Хедер и футер сами объявляют токены (`ds-theme-dark`), поэтому одинаковы на v1-страницах.
- **Листинги** `src/widgets/Posts`: `ListingPage`, `ListingHeader`, `FilterChips`, `Pagination`, `ListingEmpty`; `PostCard` (с обложкой или текстовый) и `PostGrid` (3 или 2 колонки). На них блог, research, press, audits; карточки аудитов — `AuditCards` из `src/widgets/AuditsArchive` (оценка и балл), данные — `getPublicAudits()`.
- **Статья** `src/widgets/ArticlePage`: шапка по центру, обложка 770, оглавление 233 + колонка 595 (без оглавления колонка по центру и сжимается на mobile). Для `RichText` v1 в области статьи переопределены переменные `--text-*` на токены v2. Тот же шаблон у research article и детального кейса (`CaseDetailPage`: блоки обзора, вызова, решения и результата).
- **404 v2** — `src/app/(site-v2)/not-found.tsx` (те же метаданные, что у v1: `Page not found`, noindex).

Картинки фонов подключаются статическим импортом через `next/image` — так они работают и под `basePath` (RU-staging). Демо-картинки витрины лежат рядом с ней, в `src/app/(site-v2)/staging-docs/design-system/demo`.

### Расхождения в макете (уточнить у дизайнера)

- **Радиус поля:** в компоненте «Поля / Текстовое поле» — 10px, в инстансах формы (`54:2453`) — 15px. В коде 10px, по компоненту.
- **Мобильные версии блоков** (фрейм `79:130`) построчно не сверялись; на mobile блоки перестраиваются в одну колонку по логике сетки, таблица скроллится.
- **Отступы для планшета** (поля 24, ритм 120) и уменьшение заголовков на mobile — интерполированы. Мобильный ритм между блоками — 160px по решению владельца.

### Ещё не сделано

- **Иконки** — отложены (TBD): в Figma собственный набор 965 иконок 24px. В `src/shared/ds/icons` только иконки из макетов блоков (как экспортированы из Figma).
- **Светлая тема.**
