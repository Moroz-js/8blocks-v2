# Events Plan — раздел «События»

## 1. Purpose

ТЗ публичного раздела событий и админки Payload. Источник — мокапы списка, карточек, детальных страниц (офлайн/онлайн, предстоящие/прошедшие) и страницы представителя. Реализация в текущем стеке: Next.js App Router, FSD, Payload, SCSS Modules, токены 8Blocks (светлая/тёмная тема).

Мокапы задают **композицию и состояния** (сайдбар when, toggle format, чипы городов, карточки). Визуал — только стайлгайд проекта (`docs/styleguide.md`, `globals.scss`). Реф с тёмным фоном и pill-скруглениями **не копировать**: ни радиусы, ни инверсию «белый квадрат / чёрный текст», ни хедер с рефа.

## 2. Scope

**Входит**

- Архив `/events`: предстоящие / прошедшие, офлайн / онлайн, фильтр городов, таймлайн по месяцам, два типа карточек.
- Детальная `/events/[slug]`: сайдбар (постер, организаторы) + контент; набор блоков зависит от формата и того, прошло событие или нет.
- Страница представителя `/team/[slug]`: те же фильтры и карточки, но только события этого человека + блок его статей.
- CMS: коллекции Events, EventOrganizers, EventCities; расширение Authors.
- SEO, sitemap, JSON-LD Event, ICS-календарь.

**Не входит**

- Регистрация, билеты, RSVP, комментарии.
- Отдельный календарный вид (месячная сетка).
- Мультиязычные поля события в Payload (контент вводится как есть: EN/KR/RU в одном поле). UI-строки — как на сайте, ru/en в `shared/content`.

## 3. Состояния карточек и детальной

Предстоящие / прошедшие **не хранятся**. Считаются по `endsAt` (если нет — по `startsAt`) относительно сейчас.

### 3.1 Список

| Формат | Когда | На карточке |
|--------|-------|-------------|
| Офлайн | Предстоящие | Локация (venue + city/country). Бейджи ролей 8Blocks, если заданы. «Подробнее» |
| Офлайн | Прошедшие | То же + стек фото галереи справа внизу (`+N`). Если есть запись — «смотреть запись >» |
| Онлайн | Предстоящие | Площадка + хост стрима. Справа: «запись будет после {время endsAt}». «Подробнее» |
| Онлайн | Прошедшие | Площадка + хост. Если есть запись — «смотреть запись >» |

Бейджи на карточке — только **Спикер / Хост / Ко-хост**. Несколько сразу, если так выставлено у представителей. Других лейблов нет.

Чипы городов — только офлайн, с флагом страны. Featured-баннер — для крупных офлайн.

### 3.2 Детальная

| Формат | Когда | Контент-секция | Шапка |
|--------|-------|----------------|-------|
| Офлайн | Предстоящие | «О событии» = описание (`content`) | дата, место, сайт мероприятия |
| Офлайн | Прошедшие | саммари **вместо** описания; если саммари пустое — описание | запись / презентация, если есть; карта |
| Онлайн | Предстоящие | «О событии» = описание | календарь, площадка/хост |
| Онлайн | Прошедшие | саммари **вместо** описания; если саммари пустое — описание | запись, хост, презентация |

Саммари и описание на прошедшем **не показываются вместе**. Upcoming саммари игнорирует, даже если поле заполнено заранее.

## 4. Routing

| Путь | Тип | Назначение |
|------|-----|------------|
| `/events` | static shell, данные динамические | Архив. По умолчанию: предстоящие + офлайн |
| `/events/[slug]` | dynamic | Детальная. Unpublished / hidden → 404 |
| `/events/[slug]/calendar.ics` | route handler | Файл для «Добавить в календарь» |
| `/team/[slug]` | dynamic | Профиль автора с событиями и статьями |

Query архива и профиля (shareable):

- `when=upcoming \| past` (default `upcoming`)
- `format=offline \| online` (default `offline`)
- `city={slug}` — только при `format=offline`, город из справочника

Нав: пункт «События» в группе «О нас» (`src/shared/config/site.ts`). Футер: в `pageLinks`. Флаг `eventsEnabled` по аналогии с `blogEnabled`.

## 5. Архив `/events`

### 5.1 Страница — сетка

Контейнер `1280px`, горизонтальный паддинг `$container-padding` / mobile `$container-padding-mobile`. Вертикаль: сверху `$space-11`, снизу `$space-12`. Хедер/футер сайта без изменений.

**Desktop (`>1024`)** — две колонки, `align-items: start`, gap `$space-6`:

| Колонка | Ширина | Поведение |
|---------|--------|-----------|
| When | `160px`, не сжимается | `position: sticky`, `top` = высота хедера + `$space-4` |
| Main | `1fr`, `min-width: 0` | заголовок, фильтры, таймлайн |

```
┌─ 160px ─────────┬─ 1fr ──────────────────────────────────────────┐
│                 │  H1 События              [пин Офлайн|глобус Онлайн]
│  [календарь]    │
│  Предстоящие    │  [🇫🇷 Париж 1] [🇳🇱 Amsterdam 2] …   ← только офлайн
│                 │
│  [хлопушка]     │  • Сентябрь
│  Прошедшие      │  │  ┌ карточка / featured ─────────────────┐
│                 │  │  └──────────────────────────────────────┘
│                 │  • Октябрь
│                 │     ┌ featured или обычная ────────────────┐
│                 │     └──────────────────────────────────────┘
│                 │  [ Посмотреть прошедшие события ]  ← только upcoming
└─────────────────┴────────────────────────────────────────────┘
```

When: две кнопки столбиком, gap `$space-2`. Иконка 20px + лейбл `text-sm`. Активная — `filterBtnActive`. Клик меняет `?when=`, format и city не сбрасывать.

Шапка main: flex, H1 слева, format справа, `align-items: flex-end`, gap `$space-4`. H1 — section heading (56→40→32, weight 500). Format — две `filterBtn` в ряд; иконка 16px + текст.

Чипы городов: wrap, gap `$space-2`, под шапкой, отступ `$space-5`. Чип как `catChip` (`/press`): флаг 16px + `{name}` + счётчик `text-tertiary`. Нет городов или `format=online` — ряд не рендерить.

**Tablet (`≤1024`):** when уезжает из левой колонки — ряд из двух кнопок под H1. Таймлайн на всю ширину.

**Mobile (`≤640`):**

```
События
[Предстоящие] [Прошедшие]
[пин Офлайн] [глобус Онлайн]
[чипы → горизонтальный скролл, без wrap]
таймлайн
кнопка прошедших
```

When и format — на всю ширину, по две равные кнопки. Чипы: `overflow-x: auto`.

### 5.2 Таймлайн

Группы по календарному месяцу `startsAt` (локаль `lang`). Сортировка §10.2, featured не двигает карточку.

Слева от группы — вертикальная пунктирная линия `1px dashed` `$border-secondary`. У заголовка месяца — точка 8px на линии. Заголовок: `text-sm`, uppercase, letter-spacing, `text-tertiary` («Сентябрь» / «September»). Карточки в группе: колонка, gap `$space-4`. Между месяцами `$space-7`.

Линия тянется через все группы. На mobile — точка + заголовок, full-height track можно опустить.

Внизу upcoming: secondary `Button` на ширину main. Past: кнопки нет.

### 5.3 Карточка обычная

Поверхность: `card-surface` + corner-border. Padding `$space-4`. Кликабельны заголовок и «Подробнее» → `/events/[slug]`, не вся карточка.

**Desktop/tablet — горизонтальный ряд:**

```
┌─ 96×96 ─┬─ 1fr ──────────────────────────────────┬─ auto ─┐
│  cover  │  Title (24 / 500)                      │ Спикер │
│         │                                        │ Хост   │
│         │  [cal 40×40]  понедельник, 24 августа  │        │
│         │               19:00 – 21:00 GMT-4      │        │
│         │  [пин / лого площадки]                 │        │
│         │  venue ↗     ИЛИ     Host: name        │        │
│         │  City, Country                         │        │
│         │                                        │        │
│         │  Подробнее >          [слот справа]    │        │
└─────────┴────────────────────────────────────────┴────────┘
```

- Thumbnail: `96×96`, `object-fit: cover`. Нет cover — `bg-secondary`. `≤640`: `72×72`. `≤400`: картинка сверху на всю ширину, высота `200px`.
- Title + бейджи: flex; title `min-width: 0`, max 2 строки; бейджи вправо, `flex-shrink: 0`, gap `$space-2`. Нет ролей — title на всю ширину.
- Дата: мини-календарь 40×40 (число + короткий месяц) + две строки: день+дата `text-sm text-primary`; время+TZ `text-sm text-secondary`.
- Вторая мета-строка, тот же паттерн:
  - офлайн: пин; venue (+ стрелка, если `mapsUrl`/`eventUrl`); `{city}, {country}`. Всегда, upcoming и past.
  - онлайн: лого площадки 24px; имя площадки; `Host: {hostName}` (нет имени — только площадка).
- Футер: flex, `margin-top: $space-4`, `align-items: center`:

| Состояние | Слева | Справа |
|-----------|-------|--------|
| База | «Подробнее >» | — |
| Онлайн upcoming | «Подробнее >» | `text-tertiary` «запись будет после {HH:mm}» |
| Past + запись | «Подробнее >» | «смотреть запись >» |
| Офлайн past + gallery | «Подробнее >» | стек фото; если ещё и запись — запись левее стека |

Стек: до 3 квадратов 32×32 (не circle), overlap `-8px`, обводка `1px body-bg`. Справа square `+N` = длина gallery. Пустая gallery — стека нет. На узких футер столбиком.

### 5.4 Карточка featured

Та же позиция, что дала бы обычная. Min-height `280px` desktop / `220px` mobile. Cover/poster на фон, `object-fit: cover`, затемнение 50–60%.

Контент по центру, max-width ~640px, padding `$space-6`:

```
           Title (text-xl / text-2xl, 500)
           subtitle (text-sm, text-secondary)
           [cal] дата и время     [пин] локация
           Подробнее >
```

Дата и локация в ряд по центру, gap `$space-6`; mobile — столбик. Бейджи, стек фото и «смотреть запись» на featured нет.

### 5.5 Пустые состояния

Под шапкой: `text-secondary`, 1–2 строки. Upcoming — кнопка на прошедшие. Пустой пунктир таймлайна не показывать.

### 5.6 Данные для карточки

`title`, `slug`, `subtitle?`, `cover`, `featured`, `format`, `startsAt`, `endsAt?`, `timezone`, `city` (ref), `venueName?`, `mapsUrl?`, `platform?`, `hostName?`, `recording`, `badges[]`, `gallery[]`.

## 6. Детальная `/events/[slug]`

### 6.1 Страница — сетка

Контейнер 1280px. Breadcrumbs не обязательны; если есть: Главная → События → title, `text-sm`.

**Desktop `>1024`:** две колонки, gap `$space-8`, `align-items: start`.

| Колонка | Ширина | Содержимое |
|---------|--------|------------|
| Aside | `280px` (wide — `320px`) | постер, главный организатор, список организаторов |
| Main | `1fr` | H1, мета-слоты, представители, текст, место/медиа |

Aside не sticky. Нет постера и организаторов — aside не рендерить, main на всю ширину.

**`≤1024`:** одна колонка:

1. Постер (квадрат, max-width 360px)
2. H1 + мета-слоты
3. Представители
4. Текст + recap/gallery
5. Место / карта (офлайн)
6. Главный организатор + список организаторов

### 6.2 Aside

1. **Постер** — квадрат 1:1 на ширину колонки. `poster`, иначе `cover`. Нет обоих — блок не рендерить.
2. **Главный организатор** — `$space-6` сверху. Section-label. Строка: аватар 48×48 square + имя `text-md` 500. Под именем иконки 16px (instagram, x, website), gap `$space-3`. Нет главного — скрыть.
3. **Организаторы** — лейбл «Организатор». Gap `$space-3`. Строка: лого 32×32 + имя `text-sm` + иконки справа (`margin-left: auto`). Пустой список — скрыть.

### 6.3 Main — H1 и мета-слоты

H1 = `title`, section heading, `margin-bottom: $space-5`.

Четыре раскладки. Пустой слот не рендерить — дырок в сетке нет.

Иконка слота слева 40×40. Текст: строка 1 `text-sm` 500, строка 2 `text-sm text-secondary`. Action-слоты (сайт, календарь, запись, презентация) — текстовая ссылка с иконкой и внешней стрелкой, не primary CTA.

#### A. Офлайн upcoming — один ряд, до 3 колонок

```
[cal дата/время]   [пин venue / city]   [глобус Открыть сайт] ← если eventUrl
```

Tablet wrap по 2, mobile столбик. Пин якорит на `#location`.

#### B. Офлайн past

```
[cal дата/время]   [play Смотреть запись]   [download Скачать презентацию]
[пин venue / city]
```

Верх: дата + заполненные действия. Пин — вторая строка. Нет записи и презентации — только дата + пин.

#### C. Онлайн upcoming

```
[cal дата/время]   [календарь Добавить в календарь]   [лого Host: name]
```

ICS всегда. Нет host/platform — слот хоста скрыт.

#### D. Онлайн past — 2×2, gap `$space-5`

```
[cal дата/время]              [play Смотреть запись]
[лого площадки  Host: name]   [download Скачать презентацию]
```

Пустая ячейка не рисуется, сетка схлопывается. Mobile — столбец: дата, хост, запись, презентация.

### 6.4 Представители

`$space-8` сверху. Секция, если есть хотя бы один. Лейбл «Представитель 8Blocks». Список вертикальный, gap `$space-6`.

```
┌─ 120×120 photo ─┬─ имя + бейджи Спикер/Хост/Ко-хост
│                 │  bio (text-sm, text-secondary)
│                 │  иконки: instagram, x, telegram, email, linkedIn
└─────────────────┴─
```

Имя — ссылка на `/team/[slug]` только при `showProfile`. Нет фото — `bg-secondary`. Mobile: фото `160×160` сверху, текст ниже.

### 6.5 Текст

`$space-8` сверху. Лейбл + `contentTitle` как H2 (`text-xl` 500), если есть. Тело — тот же `RichText`, что кейсы, ширина main.

- Upcoming → «О событии» + `content`
- Past + summary → «Саммари встречи» + `summary`, `content` скрыт
- Past без summary → «О событии» + `content`

`recapMedia` (past): 16:9 на ширину main, `$space-6` после текста.

`gallery`: после текста/recap. Desktop 3 колонки, tablet 2, mobile 1, gap `$space-3`. Lightbox в v1 не обязателен.

### 6.6 Место (только офлайн)

`id="location"`. Лейбл «Место». `venueName` (`text-md` 500) + `address` (`text-sm text-secondary`). Дальше:

- `mapsEmbedUrl` — iframe `240px` / mobile `200px`, ширина 100%, без radius;
- иначе `mapsUrl` — «Открыть карту ↗».

Нет venue, адреса и карты — секцию скрыть.

## 7. Страница представителя `/team/[slug]`

Только `showProfile`, иначе 404.

### 7.1 Шапка профиля

Контейнер 1280px, на всю ширину (ещё не сетка архива).

```
┌─ 200×200 photo ─┬─ H1 имя
│                 │  bio (max-width 640px)
│                 │  иконки соцсетей, gap $space-3
└─────────────────┴─
```

Gap `$space-6`. Mobile: фото `160×160` сверху.

### 7.2 События с {Имя}

`$space-10` сверху. H2 «События с {Имя}». Дальше **тот же лейаут §5.1** (when, format, города, таймлайн, карточки), выборка `representatives.person = this author`. Query те же. Пусто — текст без таймлайна.

### 7.3 Статьи

`$space-10` сверху. H2 «Статьи от {Имя}». Сетка как блог: 3 / 2 / 1 колонка, gap `$space-6`, `ArticleCard`. Нет статей — секцию не рендерить.

На детальной события ссылка на профиль только при `showProfile`.

## 8. Модель данных

### 8.1 Хранится vs считается

| Данные | Где |
|--------|-----|
| Upcoming / past | Считается: `now > endsAt` (или `startsAt`) → past |
| Чипы городов и счётчики | Агрегация по текущей выборке, имена из EventCities |
| Бейджи карточки | OR по representatives: isSpeaker / host / cohost |
| Стек фото | Только offline + past + непустой gallery |
| Слот записи | past и (recordingFile или recordingUrl) |
| GMT-смещение в UI | Из IANA `timezone` на дату старта |
| ICS | Генерируется из полей события |
| Порядок | Только дата: от ближайшего к дальнему, группы по месяцу. `featured` не двигает карточку |

### 8.2 EventCities (новая коллекция)

Справочник городов для select в событии и чипов на архиве. Группа «События». `useAsTitle: name`.

| Поле | Тип | Обязательно |
|------|-----|-------------|
| name | text | да (`Amsterdam`, `Austin`) |
| slug | text unique | да, авто из name |
| country | text | нет (`France`, `Canada`) |
| countryCode | text | да для чипов: ISO 3166-1 alpha-2 (`FR`, `CA`) |

Новый город — запись в справочнике, не свободный ввод в событии. `countryCode` — два латинских символа. Restrict delete, если на город ссылаются события. Флаг: SVG `/icons/flags/{code}.svg` или emoji из кода, без сторонней библиотеки.

### 8.3 EventOrganizers (новая коллекция)

Группа админки: «События». `useAsTitle: name`.

| Поле | Тип | Обязательно | Комментарий |
|------|-----|-------------|-------------|
| name | text | да | |
| slug | text unique | да | авто из name |
| logo | upload → media | нет | аватар 32–48px, square |
| instagram | text URL | нет | |
| x | text URL | нет | |
| website | text URL | нет | |
| extraLinks | array { label, url } | нет | |

Один организатор переиспользуется на многих событиях (пример с мокапов: WEN? Altseason).

### 8.4 Authors — расширение

Существующая коллекция, не дублировать «команду».

Добавить:

| Поле | Тип | Зачем |
|------|-----|--------|
| slug | text unique | `/team/[slug]` |
| bio | textarea | профиль и карточка представителя |
| instagram, telegram, email, website | text | иконки с мокапов; email — `mailto:` |
| showProfile | checkbox default false | публичная страница только при true |

`linkedIn`, `x`, `photo`, `name`, `position` уже есть.

### 8.5 Events (новая коллекция)

Группа «События». `useAsTitle: title`. Колонки: title, format, startsAt, city, status, hidden, featured. Поиск: title, slug, venueName.

Access публичного чтения: `status=published` и `hidden ≠ true` (как кейсы).

Вкладки: Основное · Расписание · Офлайн/онлайн · Люди · Контент · Материалы · SEO.

#### Основное

| Поле | Тип | Required | Примечание |
|------|-----|----------|------------|
| title | text | да | H1 и карточка |
| slug | text unique | да | хук нормализации как у Cases |
| subtitle | text | нет | featured-карточка, подзаголовок баннера |
| contentTitle | text | нет | «Cursor Seoul Hackathon: …» внутри секции |
| format | select `offline` \| `online` | да | |
| featured | checkbox | нет | только большая карточка, **не** сортировка |
| cover | upload media | нет | thumbnail списка |
| poster | upload media | нет | квадрат на детальной; fallback cover |
| status | draft \| published | да | default draft |
| hidden | checkbox | нет | sidebar, как Cases |
| publishedAt | date | нет | авто при первой публикации |

#### Расписание

| Поле | Тип | Required | Примечание |
|------|-----|----------|------------|
| startsAt | date (day + time) | да | |
| endsAt | date (day + time) | нет | если пусто — считаем момент `startsAt` |
| timezone | text | да | IANA, напр. `Asia/Seoul`, `America/Toronto`. Select из справочника + «другое» |

Валидация: если `endsAt` задан — `endsAt >= startsAt`.

#### Офлайн (admin.condition: format === offline)

| Поле | Тип | Required если offline |
|------|-----|------------------------|
| city | relationship → event-cities | да, select из справочника |
| venueName | text | нет |
| address | textarea | нет |
| mapsUrl | text URL | нет |
| mapsEmbedUrl | text URL | нет, iframe src |
| gallery | upload media, hasMany | нет; фотостек на прошедшей карточке и лента на детальной |

Страна берётся из города (`city.country`), отдельным полем на событии не дублировать.

#### Онлайн (condition: format === online)

| Поле | Тип | Required если online |
|------|-----|----------------------|
| platform | select | да: `youtube` \| `x` \| `zoom` \| `other` |
| platformLabel | text | если `other` |
| platformUrl | text URL | нет |
| hostName | text | нет |

Логотипы youtube/x — из `/icons`, не грузить в CMS.

#### Люди

| Поле | Тип | Примечание |
|------|-----|------------|
| mainOrganizer | relationship → event-organizers | один |
| organizers | relationship → event-organizers, hasMany | без дубля главного |
| representatives | array | см. ниже |

Представителей несколько. Элемент `representatives`:

- `person` — relationship → authors, required
- `isSpeaker` — checkbox, «Спикер: да/нет»
- `hostRole` — select: `none` \| `host` \| `cohost` (Хост **или** ко-хост, не оба сразу у одного человека)
- `bioOverride` — textarea, подменяет bio автора на этом событии

Комбинации на одном человеке: спикер; хост; ко-хост; спикер+хост; спикер+ко-хост. На карточке бейджи = объединение флагов всех представителей, без дублей. Человек без спикера и без hostRole допустим (карточка на детальной есть, бейджа нет).

#### Контент

- `content` — richText Lexical (как Cases). Описание, секция «О событии».
- `summary` — richText. На прошедшем **заменяет** `content`. Если пусто — на прошедшем всё равно показываем `content`.
- `recapMedia` — upload media (картинка или видео), past.

#### Материалы

| Поле | Тип | UI |
|------|-----|-----|
| eventUrl | text URL | «Открыть сайт мероприятия» |
| recordingUrl | text URL | «Смотреть запись», внешняя ссылка |
| recordingFile | upload media (видео) | «Смотреть запись», наш файл |
| presentation | upload media **или** presentationUrl | «Скачать презентацию» |

Запись: достаточно ссылки, или файла, или обоих (на сайте приоритет у файла). Нет ни того ни другого — слот скрыт. Презентация: файл предпочтительнее URL.

#### SEO (group, как Cases)

`seoTitle`, `seoDescription`, `ogTitle`, `ogDescription`, `ogImage`, `noindex`.

### 8.6 Индексы

- unique slug
- `(status, hidden, startsAt)`
- `format`, `city`, `featured`, `endsAt`

### 8.7 Связи

```
EventCity 1──* Event
Author 1──* EventRepresentative *──1 Event
Event *──1 EventOrganizer (main)
Event *──* EventOrganizer (organizers)
Event *──* Media (cover, poster, recap, presentation, recordingFile, gallery)
Author 1──* Article (уже есть)
```

## 9. Админка — поведение

- Создать событие: draft → format + startsAt + timezone → published.
- Город только из справочника EventCities (select). Новый город — сначала запись в «Города», потом выбор в событии.
- Представитель: чекбокс «Спикер» + select «не хост / хост / ко-хост». Можно несколько представителей.
- Запись: URL и/или загрузка файла.
- Фильтры списка Payload: format, status, city, featured, hidden.
- Не сохранять online без platform; offline без city.
- Restrict delete: город, организатор, автор, на которых ссылаются события.
- Медиа: правила 12-media-uploads-plan; для `recordingFile` — video/*, разумный лимит размера.

Лейблы полей на русском. Группа меню: «События».

## 10. Frontend — правила отображения

### 10.1 Формат даты

Локаль `lang` сайта. Примеры ru:

- Короткий месяц на иконке: `авг 24` / `сент. 9`
- Полная: `понедельник, 24 августа`
- Время: `19:00 – 21:00 GMT-4` (offset на дату старта, не «сейчас»)
- Два календарных дня: дата старта + время старта – дата конца + время конца + TZ

Библиотека: `Intl.DateTimeFormat`, без нового тяжёлого пакета, если не понадобится IANA-polyfill.

### 10.2 Фильтры

Клиентские на уже загруженном списке **или** server `searchParams` + `getPayload` where. Предпочтение: **server** (SEO чипов не критичен, но нет мигания пустого списка). ISR/revalidate как у `/cases`.

Where upcoming: `endsAt >= now` OR (`endsAt` empty AND `startsAt >= now`).
Where past: обратное.
Сортировка **только по дате**, `featured` не участвует. От ближайшего к текущему моменту — к дальнему, с группировкой по месяцу `startsAt`:

- Upcoming: `startsAt asc` (ближайшее сверху; сентябрь → октябрь).
- Past: `startsAt desc` (только что прошедшее сверху; октябрь → сентябрь).

Внутри месяца тот же порядок. Featured-баннер рендерится на своём месте в этом списке.

### 10.3 ICS

`BEGIN:VCALENDAR` с `DTSTART`/`DTEND` в UTC из startsAt/endsAt+timezone, `SUMMARY=title`, `LOCATION=venue или platformUrl`, `URL=канонический URL события`.

### 10.4 UI-копирайт (код, не CMS)

Файл `src/shared/content/{ru,en}/eventsPage.ts`: заголовки, лейблы фильтров, «Подробнее», «запись будет после {time}», «смотреть запись», кнопки детальной, пустые состояния, «Главный организатор», «О событии», «Саммари встречи», «Место», «Представитель 8Blocks».

Бейджи: `speaker` → Спикер / Speaker, `host` → Хост / Host, `cohost` → Ко-хост / Co-host.

### 10.5 Визуал: реф → стайлгайд

Реф фиксирует иерархию блоков. Цвета, радиусы, хедер и инверсия «белая плашка» с рефа запрещены.

| С рефа | В 8Blocks |
|--------|-----------|
| Чёрный `#000`, белый текст | Тема сайта: `body-bg` / `text-primary`. Light-тема тоже обязательна |
| Pill / большой radius | `--card-radius: 0`. Никаких скруглений на кнопках, чипах, сайдбаре |
| Активный when: белый квадрат, чёрный текст | Как `catChipActive` / `filterBtnActive`: `border-color: $focus-accent`, `background: $focus-accent-bg`, `color: text-primary`. Hover — `$border-primary` |
| Неактивный when | `text-secondary`, прозрачный фон, `border-secondary` или без рамки |
| Toggle офлайн/онлайн pill | Две square-кнопки в ряд, как фильтры кейсов (`filterBtn`). Активная — magenta border + tint. Иконки пина/глобуса оставляем |
| Чипы «Париж 1» pill + флаг | Square chip как `/press` (`catChip`): высота 32px, `border-secondary`, padding `$space-4`. Внутри: флаг 16px + имя + счётчик `text-tertiary`. Активный — `catChipActive` |
| Карточки событий | `@include card-surface` + corner-border как кейсы |
| Бейджи Спикер/Хост | Как теги индустрии на кейсах: square, `text-xs` |
| Хедер «Services / Talk to the team» | Игнор. Живой `Header` / `Footer` |
| Иконки | Линейные stroke `currentColor`, 16–20px, как соцсети в `site.ts` |

Фон страницы не заливать `#000`: работает глобальный `body::before`. Секция прозрачная (`bg-primary`).

Кнопки: `shared/ui/Button`. Ссылки «Подробнее >», «смотреть запись >» — текстовые, `text-sm`, `text-secondary` → hover `text-primary` / accent.

## 11. Компоненты (FSD)

| Слой | Что |
|------|-----|
| `entities/event` | типы, map Payload → Event / EventCard, EventCard, FeaturedEventCard, RoleBadges |
| `entities/event-organizer` | типы организатора |
| `widgets/EventsPage` | архив: sidebar, toggle, city chips, timeline |
| `widgets/EventPage` | детальная |
| `widgets/TeamMemberPage` | профиль + переиспользуемый архив |
| `features/eventFilters` | sync query `when/format/city` |
| `shared/content/.../eventsPage.ts` | строки UI |
| `app/(site)/events/page.tsx` | fetch + metadata |
| `app/(site)/events/[slug]/page.tsx` | generateStaticParams published |
| `app/(site)/events/[slug]/calendar.ics/route.ts` | ICS |
| `app/(site)/team/[slug]/page.tsx` | профиль |
| `payload/collections/Events.ts`, `EventOrganizers.ts`, `EventCities.ts` | CMS |

Дизайн — §5–7 и §10.5. Кнопки и ссылки только из `shared/ui`. Чипы копировать с `/press` и `/cases`.

## 12. SEO

- Архив: title/description из `eventsMeta` + `withPayloadPageMetadata('/events')`.
- Детальная: `seo.*` fallback title/excerpt из title + даты + города; OG image = ogImage \|\| poster \|\| cover.
- `noindex` с поля события.
- JSON-LD `Event`: name, startDate, endDate, eventAttendanceMode (OfflineEventAttendanceMode / OnlineEventAttendanceMode), location (Place или VirtualLocation), image, organizer, url, eventStatus (EventScheduled / EventCompleted).
- Sitemap: `/events` + все published not hidden `/events/[slug]`. Профили `showProfile` — `/team/[slug]`.
- Canonical без лишних query; фильтры архива не индексировать отдельно (`robots` или canonical на `/events`).

## 13. Аналитика

`trackPlatformEvent` по аналогии с кейсами:

- `event_filter_selected` { when, format, city }
- `event_card_click` { slug, featured }
- `event_outbound_click` { type: site \| recording \| presentation \| platform \| maps }
- `event_calendar_click` { slug }

## 14. Seed

Минимум для сверки с мокапами:

1. Офлайн upcoming, город из справочника, локация, спикер+хост на одном человеке.
2. Офлайн upcoming featured.
3. Офлайн upcoming, другой город, только ко-хост.
4. Офлайн past, gallery ≥ 4 фото (стек +N), запись файлом, саммари заполнено.
5. Офлайн past без саммари (на детальной — описание), без галереи.
6. Онлайн upcoming, YouTube + hostName, endsAt с явным временем (проверка «запись будет после HH:mm»).
7. Онлайн past, recordingUrl, саммари, презентация.
8. Онлайн past без саммари и без записи (описание, слот записи скрыт).
9. Несколько representatives на одном событии.
10. Author с `showProfile`; города с `countryCode` (FR, CA, US) в справочнике.

Статусы: seed published + один draft (не на сайте).

## 15. Порядок работ

1. Расширить Authors (slug, bio, socials, showProfile) + миграция.
2. EventCities + EventOrganizers + Events, валидация, миграция, seed.
3. Entity + мапперы + архив `/events` (фильтры, таймлайн, две карточки).
4. Детальная: все условные слоты, ICS, карта.
5. `/team/[slug]` + статьи автора.
6. Нав, футер, sitemap, JSON-LD, GTM-события.
7. ru/en UI-строки, light/dark, мобиле.

## 16. Acceptance

- [ ] На сайте только published и не hidden.
- [ ] Список: от ближайшего к дальнему, группы по месяцу. Featured не меняет позицию.
- [ ] Офлайн: локация на карточке; чипы городов из справочника; онлайн — без чипов.
- [ ] Бейджи только Спикер / Хост / Ко-хост; комбинации спикер+хост и спикер+ко-хост работают.
- [ ] Офлайн past: стек фото, если gallery не пустая; без галереи стека нет.
- [ ] Онлайн upcoming: «запись будет после {время endsAt}»; past: «смотреть запись» только если есть файл или URL.
- [ ] Запись можно задать ссылкой, файлом или обоими.
- [ ] Past: саммари заменяет описание; пустая саммари → описание. Upcoming всегда описание.
- [ ] Детальная: 4 мета-раскладки (офлайн/онлайн × upcoming/past), пустые слоты не оставляют дырок.
- [ ] Город в админке — select, свободного текста нет.
- [ ] Представителей несколько на одном событии.
- [ ] «Добавить в календарь» скачивает валидный ICS.
- [ ] Представитель кликабелен, если `showProfile`; его страница фильтрует события и статьи.
- [ ] Черновик и hidden → 404, нет в sitemap.
- [ ] Админ: offline без города / online без platform не сохраняется.
- [ ] Светлая и тёмная тема. Никаких pill-скруглений. Чипы/фильтры как на `/press` и `/cases`. Хедер сайта без изменений.

## 17. Открытые вопросы (не блокируют v1)

1. **Профили команды** — через Authors+`showProfile`. Отдельная коллекция Team не нужна.
2. **Локализация контента события** — не делаем.
3. **Карта** — URL embed руками в админке.
4. **Регистрация / Luma** — нет в мокапах; `eventUrl` достаточно.
5. **Блок ближайших событий на главной** — не входит.
6. **Лимит размера recordingFile** — зафиксировать при реализации (ориентир: как прочие upload, либо отдельный потолок для видео).
