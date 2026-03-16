# Architecture Planning

## 1. Purpose

Зафиксировать архитектуру приложения: использование FSD-подобной структуры, границы слоёв, размещение Payload-конфигов, утилит, правил импортов и именования. Документ — источник истины для структуры `src/` и границ модулей.

## 2. Scope

- Структура каталогов под FSD.
- Назначение слоёв: app, pages, widgets, features, entities, shared.
- Размещение: Payload, формы, SEO, rich text, ToC, просмотры, email.
- Import boundaries и naming conventions.
- Co-location правил.

## 3. Inputs from requirements

- Next.js + TypeScript; Payload CMS интегрирован в Next.js.
- Публичный сайт + админка в одном приложении.
- Блог, статьи, категории, теги, медиа, заявки, подписки в CMS.
- Формы, email, SEO, sitemap/robots — часть приложения.
- Rich text, ToC из контента, учёт просмотров через API.

## 4. FSD-слои и структура src/

Рекомендуемая структура (с возможностью адаптации под принятый в проекте вариант FSD):

```
src/
  app/                    # Next.js App Router: роуты, layouts, loading, error
  pages/                  # Состав страниц: композиция секций для каждого route
  widgets/                # Крупные блоки UI: Header, Footer, ArticleContent, ServiceHero, ...
  features/               # Пользовательские сценарии: contactForm, newsletterForm, ...
  entities/               # Бизнес-сущности: Article, Category, Tag, Lead, Subscription, Media
  shared/                 # UI-kit, утилиты, константы, API-клиенты, конфиги
```

### 4.1 app (Next.js App Router)

- **Назначение**: роутинг, layout, metadata, loading/error.
- **Содержит**: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, route groups, динамические сегменты `[slug]`, `[category]`.
- **Граница**: не содержит бизнес-логики и тяжёлой вёрстки; делегирует в `pages/` и `widgets/`.
- **Payload**: точка входа Payload (`/admin` и API) конфигурируется в app или в отдельном модуле, подключаемом из app (см. ниже).

### 4.2 pages

- **Назначение**: композиция страницы из widgets и features; одна «страница» = один модуль в `pages/`.
- **Примеры**: `HomePage`, `AllServicesPage`, `StrategicConsultingPage`, `TokenomicsPage`, `AuditPage`, `BlogArchivePage`, `BlogCategoryPage`, `ArticlePage`, `PrivacyPolicyPage`, `NotFoundPage`.
- **Граница**: только композиция и передача данных вниз; минимум собственной логики.
- **Данные**: получает данные через props или через вызовы из app (getData в server component), не тянет shared/напрямую для данных, кроме через явные слойки (например, getArticleBySlug в shared/api или features).

### 4.3 widgets

- **Назначение**: крупные самостоятельные блоки: шапка, футер, hero, секции услуг, партнёры, benefits, CTA, карточки статей, контент статьи с ToC, FAQ-аккордеон, блоки страниц услуг (Problem, Solution, Process, Use cases и т.д.).
- **Граница**: могут использовать entities, features, shared; не импортируют другие widgets (кроме явно общих под-виджетов).
- **Примеры**: `Header`, `Footer`, `FooterContactForm`, `HeroHome`, `ServicesSection`, `AboutSection`, `PartnersSection`, `BenefitsSection`, `CtaSection`, `ArticleRichContent`, `ArticleToc`, `ArticleCard`, `FaqAccordion`, `ServiceHero`, `ProblemBlock`, `DeliverablesBlock`, `ProcessSteps`, `UseCasesBlock`.

### 4.4 features

- **Назначение**: сценарии: отправка формы обратной связи, подписка на рассылку, учёт просмотра статьи, построение ToC из HTML, генерация metadata для статьи/категории.
- **Граница**: могут использовать entities и shared; не содержат разметку страниц (это pages/widgets).
- **Примеры**: `submitContactForm`, `submitNewsletter`, `recordArticleView`, `buildTocFromHtml`, `getArticleMetadata`, `getCategoryMetadata`, `sendContactEmails`, `sendNewsletterEmails`.

### 4.5 entities

- **Назначение**: типы и минимальная логика сущностей: Article, Category, Tag, Media, Lead, NewsletterSubscription. Типы полей, валидаторы (если не в Payload), маппинг из API/CMS.
- **Граница**: без UI; без прямого доступа к БД (доступ через Payload API или shared/api).
- **Примеры**: типы `Article`, `Category`, `Tag`; константы статусов; helpers типа `getReadingTimeMinutes(content)`.

### 4.6 shared

- **Назначение**: переиспользуемый код: UI-компоненты (Button, Card, Input из design system), утилиты (clsx, formatDate), константы (design tokens), API-хелперы (fetch для статей/категорий), конфиги (env), рендерер rich text, парсер заголовков для ToC.
- **Структура внутри shared (пример)**:
  - `ui/` — кнопки, инпуты, карточки, иконки (в т.ч. обёртки над Mantine где нужно).
  - `lib/` — utils, formatDate, readingTime, api helpers.
  - `config/` — env, routes, site config.
  - `api/` — вызовы к Payload/local API для статей, категорий, sitemap data и т.д.
  - `render/` — rich text renderer (React-компоненты по типам нод).
  - `seo/` — metadata builders (default meta, article meta, category meta, canonical).

## 5. Payload CMS: где живут конфиги

- **Вариант A**: отдельная папка `src/payload/` (или `payload/` в корне) с `payload.config.ts`, коллекциями, хуками. В `src/app` только подключение Payload (admin route, API).
- **Вариант B**: коллекции рядом с доменом в `entities/` или в `src/cms/` с явным re-export в payload.config.
- **Рекомендация**: один модуль `src/payload/` (или корневой `payload/`) со всеми коллекциями и конфигом, чтобы админка и миграции были в одном месте. Импорты из app — только для инициализации.

## 6. Разделение по зонам ответственности

| Зона | Где живёт |
|------|------------|
| Публичный сайт | app (routes), pages, widgets, features, entities, shared |
| CMS (Payload) | payload/ или src/payload/ |
| Формы (UI + submit) | widgets (форма), features (submit, email) |
| SEO (metadata, sitemap, robots) | shared/seo, app route handlers или generateMetadata в app/pages |
| Uploads | Payload media collection + shared/lib или payload hooks для валидации |
| Rich text renderer | shared/render или shared/lib |
| ToC parser | shared/lib или features (buildTocFromHtml) |
| Article views API | app route (API) + features (recordArticleView) |
| Email layer | shared/lib или отдельный модуль; вызов из features при submit форм |

## 7. Import boundaries

- **app** → pages, widgets, shared, (payload только для инициализации).
- **pages** → widgets, features, entities, shared. Не импортирует другие pages.
- **widgets** → features, entities, shared. Не импортирует pages и другие widgets (кроме под-виджетов, явно выделенных).
- **features** → entities, shared. Не импортируют widgets/pages.
- **entities** → shared (только типы/константы). Не импортируют features/widgets.
- **shared** → не импортирует pages, widgets, features, entities (только внешние зависимости: next, payload, node libs).

## 8. Naming conventions

- **Компоненты**: PascalCase.
- **Файлы компонентов**: PascalCase или kebab-case в зависимости от принятого в проекте (единообразие обязательно).
- **Страницы (pages/)**: суффикс Page, например `HomePage.tsx`.
- **Виждеты**: по смыслу блока, например `ServicesSection`, `ArticleToc`.
- **Features**: глагол или глагол+сущность, например `submitContactForm`, `recordArticleView`.
- **API/коллекции**: существительное в единственном числе для коллекций (Article, Category), множественное для API-путей по соглашению Next.js/Payload.

## 9. Co-location

- Стили: рядом с компонентом (например `WidgetName.module.scss`) или в общей папке стилей в shared — по решению проекта; важно единообразие.
- Типы сущности: в entities; типы пропсов виджета — в файле виджета или в отдельном `types.ts` рядом.
- Константы текстов секций (если статичны): можно в `constants` рядом с виджетом или в shared/content.

## 10. Dependencies

- Архитектура должна быть согласована до массовой разработки виджетов (Phase 1).
- Payload и БД (Phase 2) должны быть готовы до страниц, зависящих от контента (блог, статья) и до форм (Lead, Subscription).

## 11. Risks / open questions

- **Локали (i18n)**: ТЗ — без мультиязычности. Если позже появится locale, потребуется решить размещение переводов и роутов (например `[locale]`) без поломки текущей структуры.
- **Размер FSD**: строгий FSD может быть избыточен для небольшой команды; допустимо упрощение до app + pages + components + lib при сохранении границ (например, не тащить API-вызовы в виджеты).

## 12. Deliverables

- Репозиторий с фактической структурой `src/` и при необходимости корневой `payload/`.
- README или внутренний doc с правилами импортов и примером размещения нового виджета/фичи.
- Конфиг Payload и коллекции в выбранном месте (см. раздел 5).

## 13. Acceptance criteria

- Все перечисленные слои имеют чёткое назначение и не дублируют друг друга.
- Импорты не нарушают указанных границ.
- Новый виджет/страница/фича может быть добавлены по одному и тому же шаблону.
- Payload-конфиг и коллекции находятся в одном предсказуемом месте.
