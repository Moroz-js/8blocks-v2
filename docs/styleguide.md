# Стайлгайд — текущая дизайн-система 8blocks

> Источник истины — код:
> - `src/app/globals.scss` — CSS custom properties (семантические токены, обе темы), глобальные стили;
> - `src/shared/styles/_variables.scss` — SCSS-алиасы на `var(--*)`, бренд-палитра, фиксированная палитра, шкалы;
> - `src/shared/styles/_mixins.scss` — брейкпоинты, типографика, поверхности;
> - `src/shared/ui` — базовые компоненты.
>
> Живая витрина: `/staging-docs/styleguide` (только staging, noindex). Значения цветов там считываются из CSS и переключаются вместе с темой.
>
> Новая дизайн-система (по Figma) живёт отдельно — см. `docs/design-system-v2.md`. TokenomicsAI (`/product/tokenomics-ai`) и бенчмарки (`/learn/token-vesting-benchmarks`) свёрстаны в собственной стилистике и в этот гайд не входят.

---

## Правила

1. **Никаких литералов цвета в модулях.** В `*.module.scss` цвет берётся только из:
   - семантических токенов (`$text-primary`, `$border-secondary`, … → `var(--*)`) — для всего, что должно следовать теме;
   - бренд-палитры (`$pal-*`) — с прозрачностью через `rgba($pal-magenta, 0.2)`;
   - фиксированной палитры (`$white`, `$ink`, `$status-*`, …) — для блоков, которые тёмные в обеих темах, статусов и теней;
   - именованной локальной переменной модуля — для разового декора (свечение, фон конкретного hero).
2. **Скруглений нет.** `--card-radius: 0`, все поверхности и кнопки — прямоугольные.
3. **В custom properties** Sass-выражения интерполируются: `--x: #{rgba($pal-magenta, 0.3)};`.
4. Новый токен — сразу в обе темы (`:root, [data-theme='dark']` и `[data-theme='light']`), алиас — в `_variables.scss`.

---

## Темы

`data-theme="dark" | "light"` на `<html>`. По умолчанию — тёмная.

Переключатель (`ThemeToggle` в хедере) показывается **только** на страницах с `ThemeScopeMarker`: детальные статьи блога, исследования, аудиты и витрина стайлгайда. На остальных страницах тема принудительно тёмная. Выбор хранится в `localStorage['8blocks-blog-theme']`.

| Режим | `--body-bg` | `--text-primary` |
|---|---|---|
| dark | `#050308` | `#ffffff` |
| light | `#ebe7ee` | `#0d0a12` |

---

## Цвета

### Семантические токены (основные)

| Токен | dark | light | Применение |
|---|---|---|---|
| `--bg-primary` | `transparent` | — | Фон секций, сквозь него виден глобальный фон |
| `--bg-secondary` | `rgba(255,255,255,.055)` | `rgba(0,0,0,.04)` | Карточки, поверхности |
| `--bg-tertiary` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.06)` | Выделенные карточки |
| `--text-primary` | `#ffffff` | `#0d0a12` | Заголовки, основной текст |
| `--text-secondary` | `rgba(255,255,255,.66)` | `rgba(13,10,18,.86)` | Параграфы, описания |
| `--text-tertiary` | `rgba(255,255,255,.56)` | `rgba(13,10,18,.72)` | Лейблы, метаданные |
| `--border-primary` | `rgba(255,255,255,.2)` | `rgba(0,0,0,.14)` | Активные / hover границы |
| `--border-secondary` | `rgba(255,255,255,.07)` | `rgba(0,0,0,.06)` | Тихие границы карточек |
| `--accent` | `#C24E88` | `#C24E88` | Основной акцент |
| `--focus-accent` | magenta .5 | magenta .45 | Рамка поля в фокусе |
| `--selection-bg` | magenta .3 | magenta .25 | Выделение текста |

Полный список (кнопки, поля, статусы, хедер, оверлеи, плейсхолдеры, диаграммы) — в `globals.scss` и на витрине.

### Бренд-палитра (не зависит от темы)

| Переменная | HEX | Применение |
|---|---|---|
| `$pal-magenta` (`$accent-purple`, `$accent-pink-deep`) | `#C24E88` | Основной акцент, CTA, focus ring |
| `$pal-rose` | `#D9ADD0` | Градиенты |
| `$pal-purple` | `#8E4ABD` | Градиенты, тени |
| `$pal-warm-white` | `#E3D0D5` | Блик |
| `$accent-green` | `#75fb63` | Доп. акцент, редко |
| `$accent-blue` | `#638efb` | Доп. акцент, редко |

### Фиксированная палитра (не зависит от темы)

| Переменная | HEX | Применение |
|---|---|---|
| `$white` / `$black` | `#fff` / `#000` | Текст на медиа и тёмных блоках, тени |
| `$on-dark` | `#f4f1f8` | Текст на всегда-тёмных блоках (hero аудита) |
| `$ink` | `#08070a` | Всегда-тёмная панель (рейтинг аудита) |
| `$ink-soft` | `#111` | Фон `<option>` в тёмных select |
| `$ink-card` | `#141414` | Карточка исследования |
| `$accent-deep` | `#ad0b58` | Акцент аудитов: рейтинги, выводы, rich text |
| `$status-positive` / `-solid` | `#3ecf8e` / `#1f9d63` | Плюсы, галочки |
| `$status-negative` / `-solid` | `#e5484d` / `#b70003` | Минусы, крестики, предупреждающие callout |
| `$status-warning` / `-deep` | `#ffb74d` / `#d69e35` | Статусы «в процессе» |
| `$status-amber` | `#f59e0b` | Предупреждения TokenLab |

### Градиенты

| Название | Значение |
|---|---|
| `--gradient-accent` | `135deg`: `#D9ADD0` → `#C24E88` → `#8E4ABD` — акцентный текст |
| `$gradient-accent-wide` | `90deg`: `#D9ADD0` → `#C24E88` 40% → `#8E4ABD` — лого, баннеры |
| `$gradient-accent-h`, `$gradient-card-border` | `90deg`: `#C24E88` → transparent 80% — декоративные линии |

### Глобальный фоновый слой

`body::before` — фиксированный, `z-index: -1`: сетка 32×32px (`--grid-line`) и четыре `radial-gradient`-блума.

| Блум | Позиция | Цвета | Интенсивность, dark |
|---|---|---|---|
| Центр-верх | 50vw −5vh | rose → magenta | `--bloom-top-center` 0.10 |
| Лево-верх | −15vw −5vh | purple | `--bloom-top-left` 0.07 |
| Право | 108vw 30vh | magenta → purple | `--bloom-right` 0.06 |
| Низ-право | 110vw 110vh | purple | `--bloom-bottom` 0.04 |

В светлой теме интенсивность умножена на 1.35–1.5.

---

## Типографика

**Шрифт:** Manrope, self-hosted через `next/font/local` (`src/app/fonts`), начертания 400 / 500 / 800. Переменная `--font-base`.
**Моно:** `$font-mono` — стек `'JetBrains Mono', 'Fira Mono', monospace`; отдельно не загружается, берётся системный.

### Шкала размеров

| Переменная | px |
|---|---|
| `$text-xs` | 12 |
| `$text-sm` | 14 |
| `$text-base` | 16 |
| `$text-md` | 18 |
| `$text-lg` | 20 |
| `$text-xl` | 24 |
| `$text-2xl` | 32 |
| `$text-3xl` | 40 |
| `$text-4xl` | 56 |
| `$text-5xl` | 72 |

### Межстрочные интервалы

| Переменная | Значение |
|---|---|
| `$leading-tight` | 1.1 |
| `$leading-snug` | 1.25 |
| `$leading-normal` | 1.5 |
| `$leading-relaxed` | 1.6 |

### Роли (миксины)

| Миксин | Размер (desktop → tablet → mobile) | Weight | Line-height | Цвет |
|---|---|---|---|---|
| `heading-hero` | 72 → 56 → 40 | 500 | 1.1 | primary |
| `heading-section` | 56 → 40 → 32 | 500 | 1.1 | primary |
| `heading-card` | 24 | 500 | 1.25 | primary |
| `body-text` | 16 | 400 | 1.6 | secondary |
| `label-small` | 14, uppercase, +0.06em | 400 | 1.5 | tertiary |
| `section-label` | 14, +0.08em | 400 | 1.5 | tertiary |

---

## Отступы

Шаг 4 / 8px. Есть и SCSS (`$space-N`), и CSS (`--space-N`) версии.

| Токен | px |
|---|---|
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 24 |
| `space-6` | 32 |
| `space-7` | 48 |
| `space-8` | 64 |
| `space-9` | 80 |
| `space-10` | 96 |
| `space-11` | 128 |
| `space-12` | 160 |

**Вертикаль секций** (`Section`, `spacing`): `sm` 48 → 32; `md` 80 → 48; `lg` (по умолчанию) 128 → 64 (tablet) → 48 (mobile); `xl` 160 → 96 → 64.

---

## Контейнер

`Container` / `$container-max`.

| Параметр | Значение |
|---|---|
| Макс. ширина | 1280px (`size="narrow"` — 840, `size="wide"` — 1440) |
| Паддинг desktop | 24px (`$container-padding`) |
| Паддинг mobile (≤ 640) | 16px (`$container-padding-mobile`) |

---

## Брейкпоинты

Desktop-first, все миксины — `max-width`.

| Миксин | Переменная | Условие |
|---|---|---|
| `@include mobile` | `$bp-mobile` | ≤ 640px |
| `@include tablet` | `$bp-tablet` | ≤ 768px |
| `@include desktop` | `$bp-desktop` | ≤ 1024px |

---

## Кнопки

`Button` / `ButtonLink` из `@/shared/ui`.

| Проп | Значения |
|---|---|
| `variant` | `primary` (заливка `--button-primary-bg`), `secondary` (обводка `--border-primary`), `ghost` (без обводки) |
| `size` | `sm` 36px / 14px, `md` 44px / 16px, `lg` 52px / 18px |
| прочее | `icon` + `iconPosition`, `fullWidth`, `loading`, `disabled` (opacity .4) |

---

## Поверхности и карточки

| Миксин | Описание |
|---|---|
| `card-surface` | `--bg-secondary`, `backdrop-filter: blur(12px)`, рамка `--border-secondary` |
| `card-surface-elevated` | `--bg-tertiary`, рамка `--border-primary` |
| `card-corner-border($color, $corner: 32px, $width: 1px)` | В покое видны только уголки, на hover рамка раскрывается целиком (маска, 0.4s) |

Плюс токены `--card-panel-bg` / `--card-panel-bg-hover` для полупрозрачных панелей.

---

## Анимации

| Переменная | Значение |
|---|---|
| `$transition-fast` | 150ms ease |
| `$transition-base` | 250ms ease |
| `$transition-slow` | 400ms ease |

---

## Прочее

| Элемент | Значение |
|---|---|
| Выделение текста | `--selection-bg`: magenta .3 (dark) / .25 (light) |
| Focus ring | `@include focus-ring`: 2px solid `#C24E88`, offset 2px |
| Скроллбар | 6px, thumb `--border-primary` → hover `--scrollbar-thumb-hover` |
