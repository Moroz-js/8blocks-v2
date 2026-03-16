# Execution State

## Current phase
- Phase: 8 — Polish and QA DONE
- Workstream: QA / Polish
- Current task: complete — all phases finished except Phase 4 (Service Pages, deferred)

## Last completed
- Phase 0 + Phase 1: project setup, FSD structure, layout, shared UI, routing stubs (see implementation-log.md)
- Phase 2: All Payload collections created and registered
  - Users, Media, Categories, Tags, Articles, Leads, NewsletterSubscriptions
  - payload.config.ts updated with all collections, PostgreSQL adapter, upload config
  - src/entities/: Article, Category, Tag, Lead, Newsletter types
  - scripts/seed.ts: creates categories (4), tags (10), articles (5 published + 1 draft), leads (2), subscriptions (2)
  - README.md with setup instructions
  - migrations/ directory created
  - TypeScript: 0 errors
- Phase 3: Homepage — all 6 sections complete
  - src/shared/content/homePage.ts — single source of truth for all homepage content
  - src/widgets/HeroHome/ — full-height hero with headline, description, service pills, CTA, SVG diagram
  - src/widgets/ServicesSection/ — 3 service cards with SVG icons, links to service pages; id="services"
  - src/widgets/AboutSection/ — asymmetric split: quote + 4 stats in 2x2 grid
  - src/widgets/PartnersSection/ — placeholder grid 6 slots with fade masks; id="partners"
  - src/widgets/BenefitsSection/ — sticky headline col + 4 benefit cards 2x2
  - src/widgets/CtaSection/ — centered CTA block with glow, border frame, anchors to #contact
  - src/app/page.tsx — composed homepage with metadata
  - TypeScript: 0 errors
- Phase 3.2: Homepage polish — visual refinements, i18n, assets, mobile
  - Logo component (SVG) in header and footer; shared/ui/Logo
  - Favicon from public/favicon.ico → src/app/favicon.ico
  - Social icons from public/icons (X, Telegram, LinkedIn, Base.app); real hrefs in site.ts
  - Partner logos from public/partners rendered via next/image (filter: brightness invert)
  - Team photos from public/team rendered via next/image; no avatar border/shadow
  - All homepage texts translated to English incl. SEO metadata, marquee items, contact form
  - Hero headline "the business" accent color (rose/magenta gradient)
  - Global background gradients shifted from purple to rose/pink palette (_variables.scss $pal-*)
  - Cube colors/opacities centralized in HeroCanvas/cubeColors.ts
  - HeroCanvas: isometric cubes redesigned — rounded corners via facePath() with per-vertex radii, flat faces, bow=0; canvas extended 100px beyond .visual (PAD technique) to prevent hard clipping; glow/shadow removed; opacity raised
  - PartnersSection: real logos, marquee 120s, no fade masks
  - ServicesSection: cardBgIcon hidden; "Learn more" / "All services" translated
  - AboutSection: team photos, no box-shadow on avatars; hover purple ring via box-shadow
  - ContactForm: resize:none on textarea; all strings in English; API route translated
  - Footer: copyright "© {year} 8Blocks. All rights reserved."; watermark fully white
  - payload.config.ts: sharp imported and passed; nodemailerAdapter added (prod-only); @payloadcms/email-nodemailer installed
  - Header: converted to 'use client'; burger menu added (mobile ≤tablet) — full-screen overlay, stagger animation, animated ×, closes on route change
  - CtaSection: Telegram button centered on mobile (column layout)

## In progress
- Phase 5.1: Blog archive (/blog) — DONE
- Phase 5.2: Category page + Article page — DONE

## Next tasks
- Phase 6: Newsletter subscription widget + confirmation email
- Phase 4 (deferred): Service pages — Strategic Consulting, Tokenomics, Audit, /services index

## Blocking issues
- PostgreSQL must be running locally to run migrations and seed
- SMTP (Gmail) not reachable from local dev — nodemailerAdapter only active in NODE_ENV=production

## Decisions made
- Payload installed with --legacy-peer-deps (Next.js 16.x version range mismatch)
- SCSS Modules only — no Tailwind, no shadcn (per requirements.md and cursor_rules.md)
- Articles use Payload lexical editor with: Paragraph, Heading (h2/h3), Bold, Italic, Underline, InlineCode, OrderedList, UnorderedList, Blockquote, HorizontalRule, Link, Upload (images)
- Media collection: stores images in public/uploads with staticDir; mimeTypes: jpeg/png/webp/gif/svg; imageSizes: thumbnail/card/hero
- Views stored as number field on Article (read-only in admin), updated only via API
- Seed is idempotent: checks by slug/email before creating; runs only in development
- Leads access: public create, admin read/update/delete
- NewsletterSubscriptions: email unique, public create, admin read/update/delete
- Articles published only via status field; publishedAt auto-set on first publish
- Homepage content: all in src/shared/content/homePage.ts (single source of truth)
- Hero SVG diagram: decorative token-economy orbit diagram, no external assets
- Partners: placeholder grid for now, architecture supports logo swap later
- Framer Motion ease: using named strings ('easeOut') not bezier arrays (TypeScript compat)

## Files touched
### Phase 2 additions:
- payload.config.ts (updated with all collections)
- payload/collections/Users.ts
- payload/collections/Media.ts
- payload/collections/Categories.ts
- payload/collections/Tags.ts
- payload/collections/Articles.ts
- payload/collections/Leads.ts
- payload/collections/NewsletterSubscriptions.ts
- payload/collections/index.ts
- src/entities/article/{types.ts,index.ts}
- src/entities/category/{types.ts,index.ts}
- src/entities/tag/{types.ts,index.ts}
- src/entities/lead/{types.ts,index.ts}
- src/entities/newsletter/{types.ts,index.ts}
- src/entities/index.ts
- scripts/seed.ts
- migrations/ (directory)
- README.md

### Phase 3 additions:
- src/shared/content/homePage.ts
- src/widgets/HeroHome/{HeroHome.tsx,HeroHome.module.scss,index.ts}
- src/widgets/ServicesSection/{ServicesSection.tsx,ServicesSection.module.scss,index.ts}
- src/widgets/AboutSection/{AboutSection.tsx,AboutSection.module.scss,index.ts}
- src/widgets/PartnersSection/{PartnersSection.tsx,PartnersSection.module.scss,index.ts}
- src/widgets/BenefitsSection/{BenefitsSection.tsx,BenefitsSection.module.scss,index.ts}
- src/widgets/CtaSection/{CtaSection.tsx,CtaSection.module.scss,index.ts}
- src/app/page.tsx (updated with full homepage)

### Phase 3.2 additions / modifications:
- src/shared/ui/Logo/{Logo.tsx,index.ts} — SVG logo component
- src/shared/ui/index.ts — exports Logo, ScrollRevealText
- src/shared/config/site.ts — translated nav labels, real social hrefs, icon paths
- src/shared/styles/_variables.scss — rose/pink palette ($pal-*), bloom opacities, gradient vars
- src/shared/content/homePage.ts — all content in English, real partner/team asset paths
- src/app/globals.scss — updated global gradients to rose/pink palette
- src/app/layout.tsx — favicon, lang="en", openGraph locale en_US
- src/app/page.tsx + all service/blog/privacy page.tsx — SEO metadata translated
- src/widgets/HeroHome/HeroHome.tsx — English headline & marquee items, accent on "the business"
- src/widgets/HeroHome/HeroHome.module.scss — .visual overflow:visible; .canvas PAD extension
- src/widgets/HeroHome/HeroCanvas.tsx — facePath() with per-vertex radii; PAD=100 canvas overflow; bow=0; cube positions adjusted; glow removed; opacity raised
- src/widgets/HeroHome/cubeColors.ts — CUBE_COLORS and CUBE_OPACITY constants
- src/widgets/ServicesSection/ServicesSection.tsx — "Learn more" / "All services" translated
- src/widgets/ServicesSection/ServicesSection.module.scss — cardBgIcon hidden; spacing adjusted
- src/widgets/AboutSection/AboutSection.tsx — next/image for team photos
- src/widgets/AboutSection/AboutSection.module.scss — no box-shadow; hover purple ring
- src/widgets/PartnersSection/PartnersSection.tsx — real logos via next/image, 4× duplication
- src/widgets/PartnersSection/PartnersSection.module.scss — 120s marquee, no fade masks
- src/widgets/Header/Header.tsx — 'use client'; burger menu; usePathname close on route change
- src/widgets/Header/Header.module.scss — burger button, mobile overlay menu styles
- src/widgets/Footer/Footer.tsx — Logo, next/image social icons, copyright text
- src/widgets/Footer/Footer.module.scss — watermark color: white; logo styles
- src/widgets/CtaSection/CtaSection.tsx — "Message us on Telegram" label
- src/widgets/CtaSection/CtaSection.module.scss — mobile: column layout, centered, glow hidden
- src/features/contactForm/ContactForm.tsx — all strings in English
- src/features/contactForm/ContactForm.module.scss — resize:none; spacing fixed
- src/app/api/contact/route.ts — error message in English
- payload.config.ts — sharp imported; nodemailerAdapter (prod-only); @payloadcms/email-nodemailer
- next.config.ts — localPatterns for /team/**, /partners/**, /icons/**

### Phase 5.2 additions:
- src/shared/lib/buildToc.ts
- src/shared/render/{RichText.tsx,RichText.module.scss,index.ts}
- src/app/api/articles/[slug]/view/route.ts
- src/features/articleView/{ArticleViewTracker.tsx,index.ts}
- src/widgets/Breadcrumbs/{Breadcrumbs.tsx,Breadcrumbs.module.scss,index.ts}
- src/widgets/BlogArchive/BlogArchive.tsx (updated: categoryTitle, paginationBase props)
- src/widgets/ArticlePage/{ArticlePage.tsx,ArticlePage.module.scss,ArticleToc.tsx,ArticleToc.module.scss,index.ts}
- src/app/blog/c/[category]/page.tsx (replaced stub)
- src/app/blog/[slug]/page.tsx (replaced stub)
- src/shared/lib/LenisProvider.tsx (fixed #hash scroll: hashchange + pathname useEffect)

## Notes for next session
- Phase 4 is next: Service pages
- Content for Strategic Consulting from requirements.md: Hero, Problem (4 cards), Solution (flow), Deliverables (6 cards), Process, Use Cases (DeFi/GameFi/Invest/RWA/MiniApp), FAQ (11 Q&A)
- Content for Tokenomics from requirements.md: Hero, Problem (4 cards), Solution (4 principles), Deliverables (8 cards), Process (9 steps), FAQ (11 Q&A)
- Content for Audit from requirements.md: Hero, Problem tezisy, When needed (7 scenarios), What we analyze (5 cards), What you get, False assumptions (кажется/на практике)
- Content constants go into src/shared/content/strategicConsulting.ts, tokenomics.ts, audit.ts
- Service pages at /services/strategic-consulting, /services/tokenomics, /services/audit
- Also need /services index page with all 3 cards
- Governing plan: docs/planning/06-services-plan.md
