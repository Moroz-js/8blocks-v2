# Data Models and Database Plan

## 1. Purpose

Описать сущности данных, связи между ними, требования к PostgreSQL, стратегию миграций и то, что хранится в БД vs вычисляется на лету. Дополняет 08-cms-plan уровнем модели и БД.

## 2. Scope

- Сущности: Article, Category, Tag, Media, Lead, NewsletterSubscription.
- Связи и ограничения уникальности.
- Индексы для запросов.
- Миграции и seed — общая стратегия (детали в 14).
- Хранимое vs производное (просмотры, время чтения).

## 3. Inputs from requirements

- PostgreSQL — основная БД.
- Структура через миграции; seed для моков (статьи, категории, теги, SEO, связи).
- Статья: slug уникален; категория и теги — связи; просмотры учитываются через API (отдельно от постоянного поля в CMS); время чтения не хранится, вычисляется.
- Заявки и подписки хранятся в БД.

## 4. Entity overview

| Entity | Table/Collection | Назначение |
|--------|-------------------|------------|
| Article | articles | Статьи блога |
| Category | categories | Категории статей |
| Tag | tags | Теги статей |
| Media | media / uploads | Файлы (обложки, rich text images) |
| Lead | leads | Заявки с формы обратной связи |
| NewsletterSubscription | newsletter_subscriptions | Подписки на рассылку |

Payload при использовании PostgreSQL создаёт таблицы по коллекциям; имена таблиц могут быть в множественном числе или в формате Payload (уточнить по документации адаптера).

## 5. Articles

- **Поля (логические)**: id, title, slug (unique), excerpt, richText (JSON/structured), coverId (FK → Media), categoryId (FK → Category), status (draft|published), publishedAt, seoTitle, seoDescription, noindex, createdAt, updatedAt. author — константа "8Blocks" (можно не хранить).
- **Связи**: many-to-one Category; many-to-many Tags; one-to-one или many-to-one Cover → Media.
- **Уникальность**: slug в рамках коллекции статей (уникален глобально).
- **Индексы**: slug (unique), status, publishedAt (для выборки опубликованных и сортировки), categoryId (для фильтра по категории). Составной (status, publishedAt) для списков.
- **Просмотры**: по ТЗ «не хранится как постоянное поле в CMS и учитывается отдельно через API». Варианты: (A) отдельная таблица article_views (articleId, count или записи по сессиям); (B) поле views в articles, обновляемое только API (не редактируется в CMS). Для простоты — поле views (integer, default 0), обновление только через API; в админке отображать read-only.

## 6. Categories

- **Поля**: id, title, slug (unique), description, seoTitle, seoDescription, createdAt, updatedAt.
- **Индексы**: slug (unique).
- **Связи**: статьи ссылаются на категорию; обратная связь one-to-many (статьи в категории).

## 7. Tags

- **Поля**: id, name, slug (unique), createdAt, updatedAt.
- **Связи**: many-to-many с Articles (через join-таблицу payload_tags_rels или аналог).
- **Индексы**: slug (unique).

## 8. Media

- **Поля**: id, filename, path/url, mimeType, size, alt, createdAt. Точная схема — по Payload upload adapter; файлы на диске в public/uploads.
- **Связи**: статьи (cover, изображения в rich text) ссылаются на Media по id.

## 9. Leads

- **Поля**: id, name, email, phone (optional), message, createdAt. Состав полей — по форме (10).
- **Индексы**: createdAt для сортировки списка в админке.
- **Уникальность**: не требуется на email (один пользователь может отправить несколько заявок).

## 10. NewsletterSubscriptions

- **Поля**: id, email (unique), createdAt. Опционально: source.
- **Индексы**: email (unique).
- **Валидация**: формат email; при дубликате — не создавать новую запись или вернуть корректный ответ (10).

## 11. Stored vs derived

| Данные | Хранится | Примечание |
|--------|----------|------------|
| Контент статьи, SEO, slug, category, tags | Да | Payload/PostgreSQL |
| Время чтения | Нет | Вычисляется по контенту (слов/символов) в shared/lib или на фронте |
| Просмотры статьи | Да (поле или отдельная таблица) | Обновляется только через API при просмотре |
| Автор статьи | Не хранить / константа | 8Blocks — выводить статично |
| Количество статей в категории | Нет | Считается по запросу или кэш при необходимости |

## 12. Migration strategy

- Payload с PostgreSQL adapter генерирует миграции при изменении коллекций (если используется встроенный механизм). Либо отдельный инструмент (Drizzle, Prisma) — тогда синхронизация схемы с коллекциями Payload вручную.
- Рекомендация: использовать миграции Payload (если есть) для согласованности с коллекциями; все изменения схемы — через миграции, не только через админку.
- Порядок: сначала базовые коллекции (Media, Categories, Tags), затем Articles (с FK), затем Leads и NewsletterSubscriptions. Seed выполняется после применения миграций (14).

## 13. Seed strategy (кратко)

- Seed создаёт: категории, теги, тестовые статьи (published и draft), связи, SEO-поля, при необходимости тестовые медиа и заявки/подписки. Детали — в 14-seed-and-migrations-plan.
- Уникальность slug при seed: явно заданные slug для тестовых сущностей.

## 14. Dependencies

- 08-cms-plan: поля коллекций должны совпадать с описанной моделью.
- 10-forms-and-email: структура Leads и NewsletterSubscriptions.
- 07-blog: требования к полям статьи для архива, категории и страницы статьи.

## 15. Risks / open questions

- Join-таблица для Articles–Tags: формат Payload (полиморфные или явная relation); индексы на FK в join-таблице.
- Большие rich text: размер поля (TEXT/JSONB); лимиты не заданы в ТЗ.

## 16. Deliverables

- Схема БД (миграции), соответствующая коллекциям Payload.
- Документ или комментарии с описанием сущностей и связей (этот план).
- Решение по хранению просмотров (поле vs отдельная таблица) зафиксировано в коде/конфиге.

## 17. Acceptance criteria

- Все сущности имеют нужные поля и связи; slug уникальны где требуется.
- Миграции применяются без ошибок; seed создаёт моковые данные для разработки.
- Просмотры и время чтения реализованы согласно «stored vs derived».
