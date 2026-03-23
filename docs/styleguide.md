# Стайлгайд — 8blocks / токеномика.рф

> Источник истины: `src/shared/styles/_variables.scss`, `_mixins.scss`, `src/app/globals.scss`

---

## Цвета

### Фон

| Токен | Значение | Применение |
|-------|----------|------------|
| `bg-primary` | `transparent` | Основной фон секций (сквозь него виден глобальный градиент) |
| `bg-secondary` | `rgba(255,255,255, 0.055)` | Карточки, поверхности |
| `bg-tertiary` | `rgba(255,255,255, 0.08)` | Выделенные карточки |
| `body` | `#050308` | Цвет страницы |

### Текст

| Токен | Значение | Применение |
|-------|----------|------------|
| `text-primary` | `#ffffff` | Заголовки, основной текст |
| `text-secondary` | `rgba(255,255,255, 0.5)` | Описания, параграфы |
| `text-tertiary` | `rgba(255,255,255, 0.4)` | Лейблы, метаданные |

### Границы

| Токен | Значение | Применение |
|-------|----------|------------|
| `border-primary` | `rgba(255,255,255, 0.2)` | Активные/hover границы |
| `border-secondary` | `rgba(255,255,255, 0.07)` | Тихие границы карточек |

### Акценты

| Токен | HEX | Применение |
|-------|-----|------------|
| `accent-purple` / `pal-magenta` | `#C24E88` | Основной акцент, CTA, focus ring |
| `pal-rose` | `#D9ADD0` | Светлый розово-сиреневый, градиент |
| `pal-purple` | `#8E4ABD` | Тёмный фиолетовый, тени, края |
| `pal-warm-white` | `#E3D0D5` | Блик / highlight |
| `accent-green` | `#75fb63` | Доп. акцент (редко) |
| `accent-blue` | `#638efb` | Доп. акцент (редко) |

### Градиенты

| Название | Значение |
|----------|----------|
| Акцентный текст | `135deg` → `#D9ADD0` → `#C24E88` → `#8E4ABD` |
| Горизонтальный декоративный | `90deg` → `#C24E88` → transparent |
| Широкий (лого, баннер) | `90deg` → `#D9ADD0` → `#C24E88` → `#8E4ABD` |

### Глобальный фоновый слой

`body::before` — фиксированный, `z-index: -1`. Четыре `radial-gradient` блума поверх сетки `32×32px`:

| Блум | Позиция | Цвет | Opacity |
|------|---------|------|---------|
| Центр-топ | 50vw −5vh | rose → magenta | 0.10 |
| Верх-лево | −15vw −5vh | purple | 0.07 |
| Право | 108vw 30vh | magenta → purple | 0.06 |
| Низ-право | 110vw 110vh | purple | 0.04 |

---

## Типографика

**Шрифт:** `Manrope` (Google Fonts, weights 400 / 500)  
**Моно:** `JetBrains Mono` (для кода и меток)

### Шкала размеров

| Токен | px |
|-------|----|
| `text-xs` | 12 |
| `text-sm` | 14 |
| `text-base` | 16 |
| `text-md` | 18 |
| `text-lg` | 20 |
| `text-xl` | 24 |
| `text-2xl` | 32 |
| `text-3xl` | 40 |
| `text-4xl` | 56 |
| `text-5xl` | 72 |

### Межстрочные интервалы

| Токен | Значение |
|-------|----------|
| `leading-tight` | 1.1 |
| `leading-snug` | 1.25 |
| `leading-normal` | 1.5 |
| `leading-relaxed` | 1.6 |

### Стили текста

| Роль | Размер | Weight | Line-height | Цвет |
|------|--------|--------|-------------|------|
| Hero заголовок | 72 → 56 → 40px | 500 | 1.1 | primary |
| Section заголовок | 56 → 40 → 32px | 500 | 1.1 | primary |
| Card заголовок | 24px | 500 | 1.25 | primary |
| Body | 16px | 400 | 1.6 | secondary |
| Label / Caption | 14px | 400 | 1.5 | tertiary, uppercase, +0.06em |
| Section label | 14px | 400 | 1.5 | tertiary, +0.08em |

> Стрелки → показывают адаптивное уменьшение: desktop → tablet → mobile

---

## Отступы

Шаг сетки — **8px**.

| Токен | px |
|-------|----|
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

**Паддинг секций по вертикали:**
- Desktop: `space-11` = 128px
- Tablet: `space-9` = 80px
- Mobile: `space-8` = 64px

---

## Контейнер

| Параметр | Значение |
|----------|----------|
| Макс. ширина | 1280px |
| Паддинг desktop | 24px |
| Паддинг mobile | 16px |

---

## Брейкпоинты

| Название | Условие | px |
|----------|---------|----|
| `mobile` | `max-width` | 640 |
| `tablet` | `max-width` | 768 |
| `desktop` | `max-width` | 1024 |
| `wide` | `max-width` | 1280 |

---

## Скругления

Проект использует **sharp / square** стиль — `border-radius: 0` везде. Скругления отсутствуют намеренно.

---

## Карточки

### Базовая поверхность
- Фон: `bg-secondary` (`rgba(255,255,255, 0.055)`)
- `backdrop-filter: blur(12px)`
- Граница: `1px solid border-secondary`

### Elevated
- Фон: `bg-tertiary` (`rgba(255,255,255, 0.08)`)
- Граница: `1px solid border-primary`

### Corner border effect
Анимированные уголки: в покое видны только углы (32px), при ховере граница раскрывается до 50% каждой стороны. `transition: 400ms ease`.

---

## Анимации / Transitions

| Токен | Значение |
|-------|----------|
| `transition-fast` | 150ms ease |
| `transition-base` | 250ms ease |
| `transition-slow` | 400ms ease |

---

## Прочее

| Элемент | Значение |
|---------|----------|
| Text selection | `rgba(197,61,255, 0.3)` фон |
| Focus ring | 2px solid `#C24E88`, offset 2px |
| Scrollbar width | 6px |
| Scrollbar thumb | `rgba(255,255,255, 0.2)` → hover `rgba(255,255,255, 0.35)` |
