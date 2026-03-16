# Routing and Pages

## 1. Purpose

Зафиксировать все маршруты приложения, тип страниц (статические/динамические), назначение, необходимые данные и метаданные. Служит основой для реализации app router и для SEO (11-seo-metadata-sitemap-robots-plan).

## 2. Scope

- Список route groups и URL-путей.
- Статические vs динамические страницы.
- Данные, необходимые каждой странице.
- Секции/виджеты по страницам.
- Требования к metadata и structured data по страницам.

## 3. Inputs from requirements

- Главная, блог, категория, статья, privacy policy, все услуги, конкретная услуга (3 шт.), 404.
- Статьи и категории — динамические по slug/category.
- SEO: title, description, canonical, openGraph, twitter, для статей — article, publishedTime, noindex.
- Structured data: Organization (главная), BlogPosting (статья).
- Sitemap: статика + блог + категории + статьи.
- Robots: запрет /admin, /api.

## 4. Route list

| Путь | Тип | Назначение |
|------|-----|------------|
| `/` | static | Главная страница |
| `/blog` | static (контент динамический) | Архив блога — список статей |
| `/blog/[category]` | dynamic | Страница категории по slug |
| `/blog/[...slug]` или `/blog/[slug]` | dynamic | Страница статьи по slug (одна статья — один slug) |
| `/privacy-policy` | static | Политика конфиденциальности |
| `/services` | static | Все услуги |
| `/services/strategic-consulting` | static | Strategic Consulting |
| `/services/tokenomics` | static | Tokenomics |
| `/services/audit` | static | Audit |
| `/admin`, `/admin/*` | Payload | Админ-панель Payload |
| `/api/*` | API | Payload API и при необходимости кастомные (просмотры и т.д.) |
| (любой неизвестный) | — | 404 |

Примечание: выбор между `/blog/[...slug]` и `/blog/[slug]` зависит от того, нужны ли вложенные пути (например категория в URL). По ТЗ: «страница статьи» и «страница категории» — отдельно; логично разделить так: `/blog` — архив, `/blog/category/[category]` — категория, `/blog/[slug]` — статья, чтобы slug статьи не пересекался с фиксированными путями. Альтернатива: категория как query или один сегмент `[param]` с определением по данным (статья или категория). Рекомендация: отдельные сегменты — например `/blog/c/[category]` и `/blog/[slug]` для статей, либо `/blog/[category]` только для категорий и статьи по `/blog/article/[slug]`. Упрощённый вариант: `/blog` — архив, `/blog/[slug]` — одна динамическая страница, где по slug ищем сначала категорию, потом статью (при уникальных slug по всей коллекции). В плане оставляем: **архив** `/blog`, **категория** `/blog/c/[category]`, **статья** `/blog/[slug]` при гарантии уникальности slug статей и отличии slug категорий от slug статей (например префикс или разные namespace). Либо категории по slug как `[category]`, а статьи — по другому пути, например `p/[slug]` или просто уникальные slug в одной коллекции и один route `[slug]` с resolve: если найден category — рендер категории, иначе статья. Для простоты и SEO лучше: **категория** `/blog/c/[categorySlug]`, **статья** `/blog/[articleSlug]` и резерв «не найдено» → 404.

Итоговая таблица (уточнённая):

| Путь | Тип | Назначение |
|------|-----|------------|
| `/` | static | Главная |
| `/blog` | static | Архив блога |
| `/blog/c/[category]` | dynamic | Категория блога |
| `/blog/[slug]` | dynamic | Статья (slug уникален среди статей) |
| `/privacy-policy` | static | Privacy policy |
| `/services` | static | Все услуги |
| `/services/strategic-consulting` | static | Strategic Consulting |
| `/services/tokenomics` | static | Tokenomics |
| `/services/audit` | static | Audit |
| 404 | — | not-found.tsx |

**Принятое решение**: раздельные пути во избежание коллизий slug: категория — `/blog/c/[category]`, статья — `/blog/[slug]`. Slug статей уникальны в коллекции статей; slug категорий уникальны в коллекции категорий. Ссылки из карточек блога ведут на `/blog/[slug]` для статей и на `/blog/c/[category]` для категорий.

## 5. Данные по страницам

- **Главная**: статический контент (тексты из 15-content-plan); данные партнёров — статика или из CMS (см. 05-homepage-plan). Форма в footer — виджет формы.
- **Архив блога**: список статей (published), пагинация, фильтрация; категории/теги для фильтров. Данные: Payload API или getPayload + limit/sort.
- **Категория**: одна категория по slug, список статей категории, пагинация. Данные: категория + статьи по relation или по полю category.
- **Статья**: одна статья по slug; breadcrumbs (главная → блог → категория → статья). Данные: статья с полями rich text, обложка, категория, теги, SEO, noindex.
- **Privacy policy**: статический контент (15-content-plan, 19-privacy-policy-plan).
- **Услуги**: статический контент по каждой странице (06-services-plan); CTA ведут на якорь формы в footer или на контактную форму.
- **404**: статическая вёрстка в общем стиле сайта.

## 6. Секции по страницам (кратко)

- **Главная**: Hero, Services, About, Partners, Benefits, CTA; footer с формой (05-homepage-plan).
- **Все услуги**: заголовок, описание, карточки услуг, ссылки (06-services-plan).
- **Strategic Consulting**: Hero, Problem, Solution, Deliverables, CTA, Process, Use cases, FAQ (06-services-plan).
- **Tokenomics**: Hero, Problem, Solution, Deliverables, Process, Mini App/Demo block, CTA, FAQ (06-services-plan).
- **Audit**: Hero, Problem, When audit is needed, What we analyze, What you get, False assumptions, Mini App/Demo, CTA; FAQ опционально в будущем (06-services-plan).
- **Блог (архив)**: заголовок, сетка карточек статей, пагинация, фильтры (07-blog-and-article-system-plan).
- **Категория**: название категории, список статей, пагинация (07).
- **Статья**: breadcrumbs, заголовок, дата/автор, обложка, rich text, ToC (07).
- **Privacy policy**: блоки по 19-privacy-policy-plan.

## 7. Metadata и structured data по страницам

| Страница | title | description | canonical | OG/Twitter | Structured data | noindex |
|----------|-------|-------------|-----------|------------|-----------------|--------|
| Главная | site title / default | default meta | / | default | Organization | no |
| Блог | Blog / список | default или отдельный | /blog | default | — | no |
| Категория | Category name + site | category excerpt/description | /blog/c/[category] | from category | — | no |
| Статья | article title + site | excerpt | /blog/[slug] | article image, publishedTime | BlogPosting | по флагу |
| Privacy | Политика конфиденциальности | краткое | /privacy-policy | default | — | no |
| Услуги | service title + site | описание услуги | соответствующий path | default | — | no |
| 404 | 404 + site | — | не задавать | — | — | yes |

Детализация — в 11-seo-metadata-sitemap-robots-plan.

## 8. Dependencies

- Роутинг и layout зависят от 01-architecture и 02-project-structure.
- Динамические страницы (статья, категория) зависят от Payload и моделей данных (08, 09).
- Metadata зависят от shared/seo и от данных статей/категорий.

## 9. Risks / open questions

- Конфликт slug: статья и категория с одинаковым slug — не допускать (уникальность в своей коллекции и разные пути: категория `/blog/c/...`, статья `/blog/...`).
- Локали: при добавлении [locale] все пути станут под префиксом; sitemap и canonical нужно будет учитывать.

## 10. Deliverables

- Реализованные маршруты в app router.
- Для каждой страницы — соответствующий layout/page и при необходимости generateMetadata.
- Sitemap и robots (11) включают перечисленные пути.

## 11. Acceptance criteria

- Все URL из ТЗ доступны и ведут на правильную страницу.
- Динамические страницы отдают 404 при отсутствии сущности.
- Metadata и structured data соответствуют 11-seo-metadata-sitemap-robots-plan.
- 404 отображается в общем дизайне сайта.
