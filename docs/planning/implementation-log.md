# Implementation Log

## 2026-03-15 (Phase 8 — Polish and QA)
### Key changes
- `src/app/privacy-policy/page.tsx` — полная Privacy Policy: все 7 блоков (вступление, определения, сбор данных, дети, сторонние ссылки, изменения, контакты); дата 9 февраля 2026; mailto: hello@8blocks.io; метаданные (title, description, canonical, OG)
- `src/app/privacy-policy/PrivacyPolicy.module.scss` — стилизация документа: типографика, grid-таблица определений, border-top на h2, адаптивность
- `src/app/not-found.tsx` — переведён на английский ("Page not found"), добавлен metadata с `robots: { index: false, follow: false }` (noindex), стиль соответствует сайту

### Decisions
- Контент Privacy Policy хранится непосредственно в файле страницы (константы LAST_UPDATED, COMPANY_ADDRESS), не выносился в CMS — как указано в плане (19)
- 404 не использует компонент `Button` из shared/ui — стиль применён inline для лаконичности, так как это единственная кнопка без зависимости от SCSS-модуля

### Next
- Phase 4 — Service Pages (деferred): /services index + 3 landing pages (strategic-consulting, tokenomics, audit)

## 2026-03-15 (Phase 7 — SEO, sitemap, robots, GTM)
### Key changes
- `src/app/sitemap.ts` — динамический sitemap: статические страницы + категории + опубликованные статьи; try/catch при недоступной БД во время билда
- `src/app/robots.ts` — robots.txt: Disallow /admin, /api; Sitemap URL
- `src/app/page.tsx` — JSON-LD Organization (Organization schema.org): name, url, description, email, logo, sameAs (все соц. ссылки)
- `src/app/blog/[slug]/page.tsx` — JSON-LD BlogPosting (BlogPosting schema.org): headline, description, datePublished, dateModified, author/publisher (Organization 8Blocks), url, image

### Decisions
- GTM был уже подключён в layout.tsx через GTMScript — не требовал изменений
- Metadata (canonical, OG, Twitter) на всех ключевых страницах уже присутствовала с прошлых фаз
- sitemap.ts падает gracefully (возвращает только статические страницы) если Payload недоступен при билде

### Next
- Phase 4 — Service Pages: /services index + 3 landing pages (strategic-consulting, tokenomics, audit)

## 2026-03-14 18:30
### Completed
- Phase 0 complete: project initialized with full dependency set
- Phase 1 complete: FSD architecture skeleton, routing stubs, layout, shared UI

### Files
- package.json — added all deps: Mantine, Framer Motion, Lenis, clsx, Payload CMS (with legacy peer deps), nodemailer, sass, cross-env, tsx
- tsconfig.json — added path aliases for FSD layers + @payload-config
- next.config.ts — withPayload wrapper, image localPatterns for /uploads
- .env.example — all required vars: DATABASE_URI, PAYLOAD_SECRET, SMTP_*, GTM, SITE_URL
- .gitignore — added public/uploads/* except .gitkeep, payload-types.ts
- payload.config.ts — base config with PostgreSQL adapter, lexical editor
- src/app/globals.scss — design tokens as CSS vars, Manrope font, reset, scrollbar, selection
- src/app/layout.tsx — MantineProvider, LenisProvider, GTMScript, Header, Footer, metadata
- src/app/page.tsx — homepage stub
- src/app/not-found.tsx — 404 stub with link back to home
- All route stubs: /services, /services/strategic-consulting, /services/tokenomics, /services/audit, /blog, /blog/[slug], /blog/c/[category], /privacy-policy
- src/app/(payload)/admin/[[...segments]]/page.tsx — Payload admin
- src/app/(payload)/api/[...slug]/route.ts — Payload REST API
- src/shared/styles/_variables.scss + _mixins.scss — SCSS tokens and mixins
- src/shared/ui/Button, Container, Section — base shared UI components
- src/shared/config/site.ts — siteConfig, navLinks
- src/shared/lib/LenisProvider.tsx — smooth scroll provider
- src/shared/lib/GTMScript.tsx — GTM integration
- src/widgets/Header/{Header.tsx, Header.module.scss} — sticky header with nav
- src/widgets/Footer/{Footer.tsx, Footer.module.scss} — footer with brand, nav, contact

### Decisions
- Payload installed with --legacy-peer-deps (Next.js 16.1.6 not in Payload's declared peer range)
- SCSS Modules only — no Tailwind, no shadcn
- Manrope via Google Fonts import in globals.scss
- LenisProvider is 'use client' component, wrapped around layout content

### Next
- Phase 2: Create Payload collections (Articles, Categories, Tags, Media, Leads, NewsletterSubscriptions), run migrations, seed script

---

## 2026-03-14 19:30
### Completed
- Phase 2 complete: all Payload collections defined and registered

### Files
- payload/collections/Users.ts — auth collection for admin access
- payload/collections/Media.ts — upload collection (public/uploads, image mimetypes, thumbnail/card/hero sizes)
- payload/collections/Categories.ts — blog categories with slug auto-sanitize and SEO group
- payload/collections/Tags.ts — blog tags with slug auto-sanitize
- payload/collections/Articles.ts — articles with lexical editor (h2/h3, bold/italic/underline, blockquote, links, image uploads); status/publishedAt hooks; views read-only; SEO group
- payload/collections/Leads.ts — contact form submissions (public create, admin read)
- payload/collections/NewsletterSubscriptions.ts — email subscriptions (unique email, public create)
- payload/collections/index.ts — barrel export
- payload.config.ts — updated: all collections registered, migrationDir set
- src/entities/article/types.ts — Article, ArticleCard, estimateReadingTime
- src/entities/category/types.ts — Category
- src/entities/tag/types.ts — Tag
- src/entities/lead/types.ts — Lead, ContactFormData
- src/entities/newsletter/types.ts — NewsletterSubscription, NewsletterFormData
- src/entities/index.ts — barrel export
- scripts/seed.ts — idempotent seed: 4 categories, 10 tags, 5 published articles + 1 draft, 2 leads, 2 subscriptions
- migrations/ — directory for Payload-generated migrations
- README.md — full setup instructions

### Decisions
- Articles: no Payload versions/drafts system (simpler status field approach)
- QuoteFeature was incorrect; used BlockquoteFeature (correct export name in @payloadcms/richtext-lexical)
- Media.upload.staticURL doesn't exist in Payload v3; only staticDir needed
- Seed checks by slug/email before creating — idempotent, safe to re-run in development

### Next
- Phase 3: Homepage sections (HeroHome, ServicesSection, AboutSection, PartnersSection, BenefitsSection, CtaSection)

---

## 2026-03-14 (Phase 3 complete)
### Completed
- Phase 3 complete: all 6 homepage sections implemented, page composed

### Files
- src/shared/content/homePage.ts — single source of truth for all homepage texts (heroContent, servicesContent, aboutContent, partnersContent, benefitsContent, ctaContent)
- src/widgets/HeroHome/{HeroHome.tsx,.module.scss,index.ts} — full-height hero: label, 3-line headline with accent, description, service anchor pills, CTA button, decorative SVG token-economy orbit diagram (no external assets)
- src/widgets/ServicesSection/{ServicesSection.tsx,.module.scss,index.ts} — 3 service cards with inline SVG icons, hover effects, accent top borders, links to /services/*; id="services"
- src/widgets/AboutSection/{AboutSection.tsx,.module.scss,index.ts} — asymmetric split: sticky quote column with large decorative quotation mark + attribution, stats 2x2 grid with gradient numbers
- src/widgets/PartnersSection/{PartnersSection.tsx,.module.scss,index.ts} — placeholder grid 6 slots with SVG placeholder logos, fade masks, grayscale treatment; id="partners"
- src/widgets/BenefitsSection/{BenefitsSection.tsx,.module.scss,index.ts} — sticky headline column (3-part) + 4 benefit cards 2x2 with icon + title + description
- src/widgets/CtaSection/{CtaSection.tsx,.module.scss,index.ts} — centered CTA block with radial glow, border frame, 2-line headline, body text, CTA anchor #contact
- src/app/page.tsx — full homepage with generateMetadata (OG, Twitter), 6 sections composed

### Decisions
- Framer Motion ease: use named strings ('easeOut') instead of bezier arrays — TypeScript compatibility with current Framer Motion types
- Hero SVG diagram: drawn inline in TSX, no asset dependencies; represents token orbit concept
- Partners: 6 placeholder slots, architecture ready for logo swap (logo prop on each item)
- All content stored in shared/content/homePage.ts per 15-content-plan.md requirement
- Anchor #contact pointed to footer; #services points to ServicesSection id

### Next
- Phase 4: Service pages — Strategic Consulting, Tokenomics, Audit + /services index

---

## 2026-03-14 (Phase 3 enhancement)
### Completed
- Homepage UI significantly enhanced per reference.md quality bar

### Files
- src/shared/ui/ScrollRevealText/{ScrollRevealText.tsx,index.ts} — new: word-by-word opacity fill on scroll (useScroll + useTransform per word)
- src/shared/ui/index.ts — exports ScrollRevealText
- src/features/contactForm/{ContactForm.tsx,ContactForm.module.scss,index.ts} — new: client form with name/email/message, loading/success/error states
- src/app/api/contact/route.ts — new: POST handler saves to Payload Leads collection
- src/widgets/Footer/Footer.tsx — rebuilt: contact form section (2-col: headline/meta + form), brand watermark "8BLOCKS" outline, bottom nav grid (4 columns: brand, pages, services, legal), copyright bar
- src/widgets/Footer/Footer.module.scss — full rebuild
- src/widgets/HeroHome/HeroHome.tsx — enhanced: CSS background grid (72px cells, masked), dual glow layers, larger SVG diagram with more detail, marquee strip at bottom (scrolling services/keywords), reordered actions (CTA first then pills)
- src/widgets/HeroHome/HeroHome.module.scss — full rebuild with grid, glow, marquee
- src/widgets/ServicesSection/ServicesSection.tsx — enhanced: numbered cards (01/02/03), "view all" link, borderless grid with 1px gap bg technique, animated top accent border on hover
- src/widgets/ServicesSection/ServicesSection.module.scss — full rebuild
- src/widgets/BenefitsSection/BenefitsSection.tsx — ScrollRevealText on headline, card header row with number+icon
- src/widgets/BenefitsSection/BenefitsSection.module.scss — cards now borderless grid with 1px gap bg
- src/widgets/CtaSection/CtaSection.tsx — ScrollRevealText on headline, background grid, centered layout
- src/widgets/CtaSection/CtaSection.module.scss — full rebuild

### Decisions
- ScrollRevealText: `as any` cast for useScroll options (Framer Motion offset type is too strict for string literals)
- Marquee: pure CSS animation, respects prefers-reduced-motion
- Footer watermark: outline text "-webkit-text-stroke", very low opacity
- ServicesSection: used CSS border-collapse technique (1px gap background) for unified card grid
- ContactForm: client component with fetch to /api/contact; success/error states inline

### Next
- Phase 3.2: Visual polish, assets, i18n, mobile

---

## 2026-03-15 (Phase 3.2 — Homepage polish)
### Completed
- Full visual polish pass on homepage: assets, i18n, design system, mobile, Canvas cubes, burger menu

### Key changes
- **Logo**: shared SVG Logo component (src/shared/ui/Logo); used in Header + Footer
- **Favicon**: public/favicon.ico → src/app/favicon.ico (Next.js App Router convention)
- **Social icons**: real SVGs from public/icons via next/image; real hrefs (X, Telegram, LinkedIn, Base.app)
- **Partners**: real logos from public/partners via next/image; filter:brightness(0)invert(1); 4× duplicate for seamless loop; 120s marquee; fade masks removed
- **Team photos**: public/team via next/image; no border/shadow; hover: purple ring via box-shadow
- **i18n**: all homepage text, SEO metadata, contact form strings, API error messages translated to English
- **Accent color**: hero headline "the business" — rose/magenta gradient; footer headline same
- **Global gradients**: purple → rose/pink palette; centralized in _variables.scss ($pal-rose, $pal-magenta, $pal-purple, $pal-warm-white, $bloom-* opacities)
- **HeroCanvas**: isometric cubes completely rewritten — facePath() helper with per-vertex corner radii (r=s*0.13), interior `mid` vertex always r=0 (no face gaps); PAD=100 canvas overflow technique (canvas 200px wider/taller than container, offset via ctx.setTransform); glow/shadow removed; face opacities raised; colors centralized in cubeColors.ts
- **ServicesSection**: "Learn more" / "All services" (translated); cardBgIcon hidden; spacing tightened
- **ContactForm**: textarea resize:none; all strings English; API route error in English
- **Header**: 'use client'; mobile burger menu — animated ×, full-screen dark overlay, stagger nav links, closes on route change / body scroll lock
- **CtaSection mobile**: column layout, icon centered, tgGlow hidden on mobile
- **payload.config.ts**: sharp installed and passed; nodemailerAdapter (@payloadcms/email-nodemailer) — prod-only (NODE_ENV=production && SMTP_HOST); local dev falls back to console

### Decisions
- PAD canvas technique: canvas extends 100px on all sides beyond .visual; ctx.setTransform offsets origin by PAD so cube coordinates remain in logical space; .visual gets overflow:visible
- facePath() per-vertex radii: shared vertices (`mid`, `left`, `right`, `bot`) use r=0 to ensure adjacent faces meet at exact same inset point → no visual gaps between faces
- cubeColors.ts: separates cube visual constants from rendering logic; easy to retheme
- nodemailerAdapter: conditional on production to avoid ETIMEDOUT in local dev (Gmail SMTP not reachable)
- Burger menu: z-index 99 (below header at 100); padding-top = header height; stagger via CSS --i variable

### Next
- Phase 5: Blog system — archive, category page, article page

---

## 2026-03-15 (Phase 5.1 — Blog archive)
### Completed
- Blog archive page (/blog) fully implemented with real Payload data

### Files
- `src/entities/article/ArticleCard.tsx` — translated to English (formatDate locale en-US, "Read", "min read")
- `src/widgets/BlogArchive/BlogArchive.tsx` — new: page header (label + headline + article count), category filter chips (→ /blog/c/[slug]), 3-col responsive article grid, smart pagination (buildPageRange with ellipsis), empty state
- `src/widgets/BlogArchive/BlogArchive.module.scss` — new: full SCSS module; catChip/catChipActive; responsive grid 3→2→1; pagination with arrows + page numbers
- `src/widgets/BlogArchive/index.ts` — barrel export
- `src/app/blog/page.tsx` — replaced stub: server component, getPayload(), fetches published articles (paginated, 9/page) + categories; maps Payload docs to ArticleCard type; passes to BlogArchive

### Decisions
- BlogArchive is a pure presentational widget; all data fetching in page.tsx (server component)
- Categories shown as horizontal chip filter (not sidebar) for better mobile UX; clicking navigates to /blog/c/[slug]
- ArticleCard already existed in entities/article — reused as ArticleCardUI
- readingTime computed via estimateReadingTime(doc.content) — not stored in CMS
- Pagination: smart buildPageRange() with ellipsis for large page counts; URL-based (?page=N)
- cover.url fallback: doc.cover.url ?? `/uploads/${doc.cover.filename}` (Payload may omit full URL)

### Next
- Phase 5.2: /blog/c/[category] — category archive page
- Phase 5.3: /blog/[slug] — full article page with RichText renderer + ToC + view counter

---

## 2026-03-15 (Phase 5.2 — Category page + Article page)

### Key changes
- `src/shared/lib/buildToc.ts` — new: parses Payload lexical root.children for heading nodes (h2/h3), builds TocItem[] with slugified IDs (dedup-safe)
- `src/shared/render/RichText.tsx` — new: server-side Payload lexical renderer; handles: text (bold/italic/underline/strikethrough/inline-code via format bitmask), heading (h2/h3 with auto-generated scroll-target IDs), paragraph, ul/ol/listitem, blockquote, horizontalrule, link/autolink (external vs internal), upload (media images with next/image), linebreak
- `src/shared/render/RichText.module.scss` — new: article body typography styles (headings, paragraphs, lists with magenta bullets, blockquote with left border, hr, links, inline code, figures)
- `src/shared/render/index.ts` — barrel export
- `src/app/api/articles/[slug]/view/route.ts` — new: POST handler; finds published article by slug, increments views field via payload.update(); returns { views }
- `src/features/articleView/ArticleViewTracker.tsx` — new: client component; fires POST /api/articles/[slug]/view once per session (sessionStorage key); renders null
- `src/features/articleView/index.ts` — barrel export
- `src/widgets/Breadcrumbs/Breadcrumbs.tsx` — new: reusable breadcrumbs (Home / Blog / Category / Title); last crumb has aria-current="page"
- `src/widgets/Breadcrumbs/Breadcrumbs.module.scss` + `index.ts` — styles + export
- `src/widgets/BlogArchive/BlogArchive.tsx` — updated: added `categoryTitle`, `paginationBase` props; pageHref() helper for DRY pagination links; conditional label "Category" vs "Blog"; headline shows category name when set
- `src/widgets/ArticlePage/ArticleToc.tsx` — new: client component; IntersectionObserver tracks active heading; renders sticky sidebar list with active-link highlight
- `src/widgets/ArticlePage/ArticleToc.module.scss` — sticky sidebar, active link with left border accent
- `src/widgets/ArticlePage/ArticlePage.tsx` — new: server-side widget; category chip, h1, excerpt, meta (author/date/reading time), cover image (next/image), RichText body, optional sidebar ToC (≥2 headings); embeds ArticleViewTracker
- `src/widgets/ArticlePage/ArticlePage.module.scss` — two-column layout (content + sidebar) at ≥desktop; responsive header font sizes
- `src/widgets/ArticlePage/index.ts` — barrel export
- `src/app/blog/c/[category]/page.tsx` — replaced stub: resolves category by slug (404 on miss), fetches filtered published articles + all categories, renders Breadcrumbs + BlogArchive with activeCategory + paginationBase; generateMetadata with canonical/og/twitter
- `src/app/blog/[slug]/page.tsx` — replaced stub: fetches published article by slug (404 on miss or draft), maps Payload doc to Article type, renders Breadcrumbs (with category crumb) + ArticlePage; generateMetadata with noindex support + og article type + cover image

### Decisions
- Article page is server component; view tracking delegated to client ArticleViewTracker (avoids 'use client' on page)
- ToC built server-side by buildToc(), passed to ArticleToc (client) for IntersectionObserver
- ToC shown only when ≥2 headings; hidden on mobile/tablet (< $bp-desktop)
- RichText renders IDs on headings using same slugify + dedup logic as buildToc() → IDs always match ToC anchors
- Lenis #hash scrolling already fixed in LenisProvider (hashchange + pathname useEffect)
- Category page reuses BlogArchive widget with categoryTitle + paginationBase props

### Next
- Phase 5.3 (was 5.3 = merged into 5.2): Done
- Phase 6: Newsletter subscription widget + confirmation email
- Phase 4 (deferred): Service pages
