# SEO, Metadata, Sitemap and Robots Plan

## 1. Purpose

Зафиксировать стратегию метаданных (title, description, canonical, OG, Twitter, article), структурированных данных, генерации sitemap.xml и robots.txt. Избежание дублирования и ошибок индексации.

## 2. Scope

- generateMetadata для всех публичных страниц.
- Общие билдеры метаданных (shared/seo или аналог).
- Canonical, Open Graph, Twitter cards.
- Статья: type article, publishedTime, noindex.
- Structured data: Organization (главная), BlogPosting (статья).
- Динамическая генерация sitemap.xml и robots.txt (Next.js).

## 3. Inputs from requirements

- Next.js generateMetadata.
- Базово: title, description, alternates.canonical, openGraph, twitter (card, title, description, image).
- Статья: type article, publishedTime, noindex при флаге.
- Structured data: Organization на главной, BlogPosting на статье.
- Sitemap: статические страницы, блог, категории, опубликованные статьи; динамическая генерация Next.js.
- Robots: базовые правила, запрет /admin и /api.

## 4. Metadata strategy

### 4.1 Default / site-wide

- **title**: шаблон «{pageTitle} | 8Blocks» или «8Blocks — {pageTitle}»; для главной — «8Blocks» или полное название без суффикса.
- **description**: общее описание сайта для главной и страниц без своего description; длина 150–160 символов.
- **canonical**: абсолютный URL страницы (SITE_URL + pathname). Обязательно для всех страниц во избежание дублирования.
- **openGraph**: type website (или article для статьи); title, description, url (canonical), image (default image для сайта), siteName.
- **twitter**: card summary_large_image; title, description, image.
- **robots**: по умолчанию index, follow; для статьи с noindex — noindex, follow (или noindex, nofollow по решению).

### 4.2 Per-page rules

| Страница | title | description | canonical | OG/Twitter image | noindex |
|----------|-------|-------------|-----------|------------------|--------|
| Главная | Site name / default | default | / | default image | no |
| /blog | Блог \| 8Blocks | default или отдельный | /blog | default | no |
| /blog/c/[category] | category.seoTitle \|\| category.title | category.seoDescription \|\| … | /blog/c/[slug] | default или first article | no |
| /blog/[slug] | article.seoTitle \|\| article.title | article.seoDescription \|\| article.excerpt | /blog/[slug] | article.cover или default | по полю noindex |
| /privacy-policy | Политика конфиденциальности \| 8Blocks | краткое | /privacy-policy | default | no |
| /services | Услуги \| 8Blocks | описание раздела | /services | default | no |
| /services/strategic-consulting | Strategic Consulting \| 8Blocks | описание услуги | /services/strategic-consulting | default | no |
| /services/tokenomics | Tokenomics \| 8Blocks | описание | /services/tokenomics | default | no |
| /services/audit | Audit \| 8Blocks | описание | /services/audit | default | no |
| 404 | 404 \| 8Blocks | — | не задавать | — | yes (noindex) |

### 4.3 Article-specific

- **openGraph.type**: article.
- **openGraph.publishedTime**: article.publishedAt (ISO string).
- **openGraph.images**: обложка статьи или default.
- **noindex**: если article.noindex === true, в metadata задать robots: { index: false } (и при необходимости nofollow).

## 5. Shared metadata builders

- **buildDefaultMetadata({ title, description, path, image? })**: возвращает объект для generateMetadata (Next.js 13+ формат).
- **buildArticleMetadata(article)**: title, description, canonical, OG с type article, publishedTime, image, noindex.
- **buildCategoryMetadata(category, path)**: title, description, canonical.
- Использование: в layout или в каждой page вызывать соответствующий билдер; canonical всегда собирать из SITE_URL + path (env NEXT_PUBLIC_SITE_URL или SITE_URL).

## 6. Structured data (JSON-LD)

### 6.1 Organization (главная)

- Тип: Organization. Поля: name, url, logo (URL), опционально sameAs (соцсети). Размещение: в layout главной или в page компоненте в <script type="application/ld+json">.

### 6.2 BlogPosting (статья)

- Тип: BlogPosting. Поля: headline, description, image (обложка), datePublished, dateModified, author (name «8Blocks»), publisher (Organization). Размещение на странице статьи в <script type="application/ld+json">.

### 6.3 Избежание дублирования

- Один JSON-LD блок на страницу для сущности; не дублировать Organization на каждой странице (достаточно главной и в publisher внутри BlogPosting).

## 7. Sitemap

- **Метод**: Next.js App Router — файл app/sitemap.ts (или route sitemap.xml), возвращающий массив URL с lastModified, changeFrequency, priority.
- **Включать**: 
  - Статические: /, /blog, /privacy-policy, /services, /services/strategic-consulting, /services/tokenomics, /services/audit.
  - Динамические: /blog/c/[category] для каждой категории; /blog/[slug] для каждой опубликованной статьи.
- **Данные**: категории и статьи — запрос к Payload (getPayload()) или к API; только published статьи и существующие категории.
- **Частота обновления**: статика — monthly или yearly; блог/категории/статьи — weekly или monthly. Приоритет: главная 1; услуги и блог 0.8; статьи 0.6–0.7.

## 8. Robots.txt

- **Метод**: Next.js app/robots.ts (или route robots.txt).
- **Содержимое**: User-agent: *; Allow: /; Disallow: /admin; Disallow: /api (и при необходимости другие служебные пути). Sitemap: абсолютный URL sitemap (SITE_URL/sitemap.xml).
- Генерация средствами Next.js metadata route.

## 9. Noindex logic

- Статья: если noindex === true — в generateMetadata для этой страницы задать robots: { index: false }. Страница всё равно в sitemap может не включаться (рекомендация: не включать noindex-статьи в sitemap).
- Черновики (draft) не отображаются на фронте и не попадают в sitemap.
- 404: noindex (через metadata или X-Robots-Tag).

## 10. Dependencies

- Данные статей и категорий из Payload (07, 08); SITE_URL из env.
- Роутинг (03) для путей canonical и sitemap.

## 11. Risks / open questions

- SITE_URL в production должен быть задан корректно; иначе canonical и sitemap будут с неправильным доменом.
- Большой объём статей: sitemap может потребовать разбиения на несколько файлов (sitemap index); Next.js поддерживает массив; при тысячах URL проверить лимиты.

## 12. Deliverables

- Модуль shared/seo (или аналог): buildDefaultMetadata, buildArticleMetadata, buildCategoryMetadata.
- generateMetadata во всех публичных страницах (главная, блог, категория, статья, privacy, услуги).
- JSON-LD Organization на главной и BlogPosting на статье.
- app/sitemap.ts: статика + категории + статьи из Payload.
- app/robots.ts: Disallow /admin, /api; Sitemap URL.
- .env.example: NEXT_PUBLIC_SITE_URL или SITE_URL.

## 13. Acceptance criteria

- У каждой публичной страницы есть title, description, canonical, OG и Twitter; у статей — article-мета и noindex при флаге.
- Organization на главной и BlogPosting на статье присутствуют в коде страницы.
- Sitemap генерируется динамически и включает статику, категории и опубликованные статьи; noindex-статьи не включать.
- Robots.txt запрещает /admin и /api и ссылается на sitemap.
