# Delivery Phases

## 1. Purpose

Зафиксировать поэтапный roadmap реализации: цели фаз, входные зависимости, конкретные deliverables, критерии завершения и риски. План для управления реализацией, а не высокоуровневый список.

## 2. Scope

Фазы 0–8: от setup до polish/QA. Для каждой фазы: objective, входные зависимости, deliverables, что должно быть готово перед переходом дальше, риски, критерии завершения.

---

## Phase 0 — Project setup

**Objective**: Инициализировать проект, зависимости, конфигурации, design tokens, env-шаблон.

**Входные зависимости**: Нет (старт проекта).

**Deliverables**:
- Next.js проект (TypeScript), package.json с зависимостями: next, react, mantine, framer-motion, lenis, clsx, payload, pg (или адаптер Payload для PostgreSQL).
- next.config, tsconfig, .env.example (DATABASE_URI, PAYLOAD_SECRET, ADMIN_*, SMTP_*, NEXT_PUBLIC_GTM_ID, SITE_URL).
- SCSS: globals.scss с design tokens (цвета, шрифты из ТЗ); подключение Manrope.
- Папка public/uploads (и .gitignore для содержимого).
- README с шагами установки и запуска.

**Готовность к переходу**: Запуск `npm run dev` поднимает Next.js; стили применяются; env описан.

**Риски**: Несовместимость версий Payload и Next.js — проверить совместимость до начала Phase 2.

**Критерии завершения**: Проект собирается; токены и шрифты подключены; .env.example полный.

---

## Phase 1 — Architecture skeleton

**Objective**: Каркас FSD (или принятой структуры), роутинг, корневой layout, базовые компоненты shared/ui, границы импортов.

**Входные зависимости**: Phase 0 выполнен.

**Deliverables**:
- Структура src/: app, pages, widgets, features, entities, shared (01-architecture, 02-project-structure).
- app/layout.tsx: общий layout, подключение Lenis (опционально), глобальные стили, Header/Footer-заглушки при необходимости.
- Маршруты-заглушки: главная, услуги, блог, privacy-policy, 404 (not-found.tsx) — страницы с минимальным контентом.
- Базовые shared/ui: Button, Container/Section (по 04); при необходимости Card, Input-обёртки.
- Документ или комментарии с правилами импортов (01).

**Готовность к переходу**: Навигация по всем заложенным путям работает; layout единый; новый виджет можно добавить по шаблону.

**Риски**: Переусложнение FSD для небольшой команды — сохранить баланс (04, 01).

**Критерии завершения**: Все маршруты из 03 доступны; структура папок соответствует 01–02; импорты не нарушают границ.

---

## Phase 2 — CMS foundation

**Objective**: Payload подключён, коллекции созданы, БД и миграции работают, seed создаёт тестовые данные.

**Входные зависимости**: Phase 1; принята схема данных (09, 08).

**Deliverables**:
- payload.config.ts с PostgreSQL; коллекции Media, Categories, Tags, Articles, Leads, NewsletterSubscriptions (08-cms-plan).
- Миграции применены; таблицы созданы.
- Админка доступна по /admin; авторизация через env.
- Seed: категории, теги, статьи (published + draft), при необходимости медиа и заявки (14).
- Валидация загрузок медиа: тип, размер, имя (12).

**Готовность к переходу**: В админке можно создавать/редактировать статью, категорию, тег; загружать медиа; seed заполняет блог для разработки.

**Риски**: Формат rich text Payload (lexical/slate) — убедиться, что seed и рендерер используют один формат.

**Критерии завершения**: Все коллекции работают; seed выполняется без ошибок; загрузка медиа валидируется.

---

## Phase 3 — Homepage

**Objective**: Главная страница в сборе: все секции, тексты из ТЗ, якоря, footer с областью под форму (форма пока без отправки — заглушка или базовая разметка).

**Входные зависимости**: Phase 1 (layout, UI); Phase 2 не обязательна для статического контента главной.

**Deliverables**:
- Виджеты: HeroHome, ServicesSection, AboutSection, PartnersSection, BenefitsSection, CtaSection; Footer с блоком под форму (05).
- Контент из 15-content-plan размещён в секциях.
- Якоря: Hero → #services; CTA → #contact (или #footer-form). Плавный скролл при использовании Lenis.
- Ссылки с карточек услуг на /services/*.
- Адаптивность секций (04).

**Готовность к переходу**: Главная визуально и по контенту соответствует ТЗ; якоря и ссылки работают. Форма может быть статичной (кнопка «Отправить» без бэкенда).

**Риски**: Партнёры без контента — использовать плейсхолдеры (05, 15).

**Критерии завершения**: Все 6 секций + footer на месте; тексты из ТЗ; дизайн по токенам; ссылки и якоря работают.

---

## Phase 4 — Services pages

**Objective**: Страница всех услуг и три лендинга (Strategic Consulting, Tokenomics, Audit) с полной структурой секций, FAQ где нужно, CTA к форме.

**Входные зависимости**: Phase 1 (layout, UI); контент из 15.

**Deliverables**:
- /services: заголовок, описание, три карточки со ссылками (06).
- /services/strategic-consulting: Hero, Problem, Solution, Deliverables, CTA, Process, Use cases, FAQ (11 пунктов) (06).
- /services/tokenomics: Hero, Problem, Solution, Deliverables, Process, Mini App/Demo (placeholder), CTA, FAQ (11 пунктов) (06).
- /services/audit: Hero, Problem, When audit needed, What we analyze, What you get, False assumptions, Mini App (placeholder), CTA; место под FAQ (06).
- Переиспользуемые виджеты: ServiceHero, ProblemBlock, DeliverablesBlock, ProcessSteps, FaqAccordion, CtaBlock и др. (06).
- CTA на всех страницах ведут к #contact (форма в footer).

**Готовность к переходу**: Все четыре страницы услуг соответствуют ТЗ по структуре и контенту; FAQ отображаются в аккордеоне.

**Риски**: Недостающий контент для Audit (What you get, False assumptions) — заполнить минимально (15).

**Критерии завершения**: Услуги не шаблонные; все секции и FAQ из ТЗ на месте; единый дизайн (04).

---

## Phase 5 — Blog system

**Objective**: Архив блога, страница категории, страница статьи с rich text, ToC, просмотрами, метаданными; данные из Payload.

**Входные зависимости**: Phase 2 (Payload, статьи, категории, теги); Phase 1 (layout, UI).

**Deliverables**:
- /blog: список статей (published), пагинация, ссылки на категории и на статью (07). ArticleCard.
- /blog/c/[category]: категория по slug, список статей категории, пагинация, breadcrumbs (07).
- /blog/[slug]: статья по slug; breadcrumbs, заголовок, дата, автор 8Blocks, время чтения (вычисляемое), обложка, rich text, ToC с якорями (07). Rich text renderer в shared/render; buildToc из структуры контента.
- API учёта просмотров: один раз за сессию (07); хранилище по 09.
- generateMetadata для архива, категории, статьи; noindex для статей с флагом (11 — частично).
- 404 при отсутствии статьи/категории или draft.

**Готовность к переходу**: Блог полностью работает на данных из CMS; ToC и просмотры функционируют; метаданные заданы.

**Риски**: Несовпадение формата rich text при рендере — тестировать на seed-статьях (07).

**Критерии завершения**: Архив, категория, статья работают; rich text и ToC корректны; просмотры считаются; только published на фронте.

---

## Phase 6 — Forms and email

**Objective**: Форма обратной связи и подписка на рассылку: сохранение в БД, отправка писем пользователю и админу, шаблоны, SMTP.

**Входные зависимости**: Phase 2 (Leads, NewsletterSubscriptions); Phase 3 (footer с формой).

**Deliverables**:
- API: POST /api/contact (или через Payload create Lead); POST /api/newsletter (или аналог) (10).
- Валидация на сервере; сохранение в Leads и NewsletterSubscriptions; при дубликате email подписки — корректное поведение (10).
- Отправка email через SMTP (nodemailer или аналог): 4 шаблона (contact user/admin, newsletter user/admin) (10).
- Виджеты форм: отправка, отображение успеха/ошибки (10).
- .env.example: SMTP_*, ADMIN_EMAIL.

**Готовность к переходу**: Отправка формы и подписки сохраняет данные и отправляет письма; в админке видны заявки и подписки.

**Риски**: SMTP в production — доставка и лимиты; при сбое сохранять заявку и логировать (10, 17).

**Критерии завершения**: Обе формы работают end-to-end; письма приходят; админка отображает данные.

---

## Phase 7 — SEO, sitemap, robots, GTM

**Objective**: Полная метаданная стратегия, structured data, динамические sitemap и robots, подключение GTM.

**Входные зависимости**: Phase 5 (статьи, категории для sitemap); Phase 1 (layout для GTM).

**Deliverables**:
- Модуль shared/seo: buildDefaultMetadata, buildArticleMetadata, buildCategoryMetadata (11).
- generateMetadata на всех публичных страницах с canonical, OG, Twitter; для статей — article, noindex (11).
- JSON-LD: Organization на главной, BlogPosting на статье (11).
- app/sitemap.ts: статика + категории + опубликованные статьи (11).
- app/robots.ts: Disallow /admin, /api; Sitemap URL (11).
- GTM: подключение в layout при наличии NEXT_PUBLIC_GTM_ID (13).
- SITE_URL в .env.example и в билдерах.

**Готовность к переходу**: Метаданные и structured data на месте; sitemap и robots генерируются; GTM загружается при настройке ID.

**Риски**: SITE_URL не задан в production — canonical и sitemap будут неверны (11, 17).

**Критерии завершения**: Все страницы с title, description, canonical, OG/Twitter; Organization и BlogPosting в коде; sitemap и robots корректны; GTM подключается по env.

---

## Phase 8 — Polish and QA

**Objective**: Privacy policy, 404 в общем дизайне, финальная проверка по DoD, исправление багов и недочётов.

**Входные зависимости**: Все предыдущие фазы.

**Deliverables**:
- Страница /privacy-policy: все блоки контента из ТЗ (19, 15); метаданные (11).
- 404: not-found.tsx в общем стиле сайта; noindex (11).
- Проверка по 18-definition-of-done: страницы, CMS, формы, блог, SEO, услуги, UI.
- Исправления по результатам QA; доступность (контраст, фокус) по 04.
- Документация: README, контент-гайд (где править тексты), env-описание.

**Готовность к переходу**: Проект готов к приёмке; DoD выполнен по всем пунктам.

**Риски**: Неучтённые краевые случаи (пустой блог, все статьи draft) — проверить в QA.

**Критерии завершения**: Privacy policy и 404 готовы; DoD выполнен; известные баги исправлены; документация актуальна.

---

## Summary: order and parallelization

- **Последовательно**: 0 → 1 → 2; затем 3 и 4 можно вести параллельно (главная и услуги не зависят от блога); 5 после 2; 6 после 2 и 3; 7 после 5; 8 в конце.
- **Критический путь**: 0 → 1 → 2 → 5 (блог) → 7 (SEO) → 8. Формы (6) можно начинать после 2 и 3. Главная (3) и услуги (4) — параллельно после 1.
- Зависимости между документами отражены в 00-overview и в разделах Dependencies каждого плана.
