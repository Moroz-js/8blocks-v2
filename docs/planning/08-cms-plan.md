# CMS Plan (Payload)

## 1. Purpose

Описать конфигурацию Payload CMS: коллекции, поля, поведение админки, статусы, SEO-поля, медиа, заявки и подписки. Без production-кода — только спецификация для реализации.

## 2. Scope

- Коллекции: Articles, Categories, Tags, Media, Leads (заявки), NewsletterSubscriptions.
- Поля каждой коллекции, типы, валидация.
- Админ-поведение: списки, фильтры, редактирование, публикация/снятие с публикации.
- Rich text editor: возможности (заголовки, цитаты, ссылки, изображения, alt, базовое форматирование).
- Динамическая генерация sitemap/robots — средствами Next.js, но данные для sitemap берутся из Payload (описано в 11).

## 3. Inputs from requirements

- Payload интегрирован в Next.js; админка и API в одном приложении.
- Управление: статьи (создание, редактирование, публикация/снятие); категории; теги; медиа; заявки с формы обратной связи; подписки на рассылку.
- Rich text: заголовки, цитаты, ссылки, изображения, alt, базовое форматирование.
- ToC на странице статьи генерируется автоматически (на фронте из контента).
- Категории и теги; базовая фильтрация статей.
- SEO-поля для статьи; хранение и просмотр заявок и подписок в админке.
- Sitemap и robots — Next.js (metadata route); данные из Payload.

## 4. Collections

### 4.1 Media (Uploads)

- **Назначение**: хранение загруженных файлов (обложки статей, изображения в rich text).
- **Поля**: файл (file), alt (текст), подпись (опционально). Стандартная конфигурация Payload для upload: destination `public/uploads`, статический URL `/uploads/...`.
- **Валидация**: тип файла (например image/*), размер, безопасное имя (см. 12-media-uploads-plan).
- **Админка**: список загрузок, просмотр, удаление; при загрузке — валидация на сервере.

### 4.2 Categories

- **Поля**: title (string), slug (string, unique), description (text, опционально), seoTitle (string), seoDescription (text). При необходимости meta для расширенного SEO.
- **Валидация**: slug уникален; формат slug (lowercase, дефисы).
- **Админка**: CRUD; в списке статей — выбор категории.

### 4.3 Tags

- **Поля**: name (string), slug (string, unique).
- **Валидация**: уникальность slug.
- **Админка**: CRUD; множественный выбор в статье.

### 4.4 Articles

- **Поля**:
  - title (string, required)
  - slug (string, required, unique)
  - excerpt (text)
  - richText (rich text block — Payload lexical/slate)
  - cover (relationship → Media, optional)
  - category (relationship → Category, optional)
  - tags (relationship → Tags, multiple, optional)
  - status (select: draft | published)
  - publishedAt (date, optional; заполняется при published)
  - author (string, default "8Blocks" или константа; можно не хранить и выводить статично)
  - seoTitle (string)
  - seoDescription (text)
  - noindex (boolean, default false)
  - createdAt, updatedAt (timestamps, auto)
- **Rich text**: включить ноды — heading (h2, h3), paragraph, blockquote, link, upload (image с alt), list (если нужно), bold/italic (базовое форматирование). Ограничить только нужными по ТЗ.
- **Валидация**: slug уникален; при status=published можно требовать publishedAt и минимум контента.
- **Админка**: список с колонками (title, category, status, publishedAt); фильтр по статусу, категории, тегу; редактирование; переключение draft/published. Просмотры (если хранятся в Article или отдельно) — read-only поле или отдельный блок.
- **Поведение**: на фронте отдаём только status=published; draft видны только в админке.

### 4.5 Leads (заявки с формы обратной связи)

- **Поля**: name, email, phone (опционально), message (text), createdAt (auto). Состав полей — по 10-forms-and-email-plan.
- **Админка**: только просмотр списка и деталей; без редактирования или с минимальным (например заметка). Список с сортировкой по дате.
- **Заполнение**: только через API при отправке формы (не создаются вручную в админке как основной сценарий).

### 4.6 NewsletterSubscriptions

- **Поля**: email (unique), createdAt (auto). Опционально: source, consent.
- **Валидация**: email формат; уникальность email.
- **Админка**: просмотр списка; экспорт при необходимости.
- **Заполнение**: через API при подписке на рассылку.

## 5. Admin behavior (общее)

- Доступ: логин/пароль из env; роуты по согласованной структуре (/admin).
- Навигация: пункты меню по коллекциям (Статьи, Категории, Теги, Медиа, Заявки, Подписки).
- Для статей: явная кнопка «Опубликовать» / «Снять с публикации» или переключение status; при первом published — установка publishedAt.
- Локализация админки: по умолчанию можно оставить английский; лейблы полей при необходимости на русском.

## 6. SEO fields

- **Article**: seoTitle, seoDescription, noindex. Используются в generateMetadata (11).
- **Category**: seoTitle, seoDescription — для страницы категории.
- Остальные сущности без отдельных SEO-полей; главная и статические страницы — метаданные из кода (11).

## 7. Rich text editor (Payload)

- Выбор редактора: Lexical или Slate (по версии Payload). Настроить блоки/ноды:
  - heading (levels 2, 3 — для ToC достаточно h2/h3)
  - paragraph
  - blockquote
  - link
  - upload (image) с полем alt
  - list (если в ТЗ нужно)
  - bold, italic (inline)
- Ограничить загрузку изображений только через Media (один upload-тип); валидация размера и типа на уровне Media.

## 8. Publishing flow

- Статья создаётся в статусе draft. Редактор заполняет контент, SEO, выбирает категорию/теги, обложку. При готовности переключает на published; при первом published фиксируется publishedAt. Снять с публикации — переключение в draft; на фронте статья больше не отображается (и исключается из sitemap).

## 9. What is editable vs static

- **В CMS (редактируемо)**: статьи (контент, SEO, категория, теги, обложка, статус), категории, теги, медиа; заявки и подписки только просмотр.
- **Статично (код/константы)**: тексты главной страницы, страниц услуг, privacy policy (если не вынесены в CMS); автор статей «8Blocks»; конфигурация форм (какие поля) может быть в коде.

## 10. Dependencies

- База данных и миграции (09, 14); Payload использует адаптер PostgreSQL.
- Медиа и валидация загрузок (12).
- Формы пишут в Leads и NewsletterSubscriptions (10).

## 11. Risks / open questions

- Версия Payload и формат rich text: при обновлении Payload проверить совместимость рендерера на фронте.
- Ограничение размера rich text и числа медиа в одной статье — при необходимости лимиты в админке или в валидации.

## 12. Deliverables

- payload.config.ts с подключением всех коллекций и upload.
- Коллекции: Media, Categories, Tags, Articles, Leads, NewsletterSubscriptions с полями и валидацией.
- Админка доступна по /admin; авторизация через env.
- Документация для редактора: как публиковать статью, как заполнять SEO, как загружать медиа.

## 13. Acceptance criteria

- Все перечисленные сущности доступны в админке; статьи можно создавать, редактировать, публиковать и снимать с публикации.
- Rich text поддерживает заголовки, цитаты, ссылки, изображения с alt и базовое форматирование.
- Заявки и подписки сохраняются и отображаются в админке.
- Медиа загружаются в public/uploads с валидацией по типу и размеру.
