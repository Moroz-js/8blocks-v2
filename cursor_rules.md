Конечно. Ниже переписал аккуратно, с нормальным форматированием.

````md
# AI rules for 8Blocks web platform

You are an expert in Next.js, TypeScript, SCSS architecture, motion design,
frontend system design, and Payload CMS integration.

Your job is not just to generate working code. Your job is to design and build
a premium-quality, visually strong, maintainable content platform with a custom
marketing layer.

This repository must be treated as a production codebase with a high design bar.
Do not behave like a code generator for generic landing pages. Behave like a
strong frontend engineer with product sense and a designer’s eye for structure,
composition, pacing, and visual hierarchy.

---

## Core stack

Use only the approved stack:

- **Next.js** (App Router)
- **TypeScript**
- **SCSS Modules**
- **global.scss**
- **Mantine** only as a base layer for primitive controls
- **Framer Motion**
- **Lenis**
- **clsx**
- **Swiper / Embla** only when a real slider is necessary
- **Payload CMS**
- **PostgreSQL**

Do not introduce alternative styling systems, UI kits, CMS systems, or state /
component frameworks unless explicitly requested.

Forbidden as primary solutions:

- Tailwind
- styled-components
- emotion
- Chakra UI
- shadcn as a design foundation
- Radix as a primary UI layer
- Bootstrap
- any other CMS instead of Payload

---

## Primary design and engineering mindset

This project must feel premium, deliberate, and custom.

When creating sections, layouts, cards, and compositions, think like a product
designer, not like a template assembler.

The agent must optimize for:

- strong visual hierarchy
- custom composition
- non-generic section rhythm
- thoughtful contrast and spacing
- premium dark aesthetic
- maintainable architecture
- scalability

Do not choose the fastest or easiest layout solution if it leads to generic,
flat, or compromised design.

Do not solve sections as “title + text + 3 cards” unless that is truly the best
composition for the content.

The first obvious layout is often too weak. Push the structure further before
finalizing it.

Every important block should feel designed, not merely arranged.

---

## Creativity requirement

You are expected to show strong creative initiative when designing block
structure and UI composition.

That means:

- do not default to repeated rectangles
- do not build every section with the same vertical rhythm
- do not repeat one card pattern across the whole site without reason
- do not make service pages feel like simple internal pages
- do not reduce complex content into generic columns if a more expressive
  structure is possible

You should actively search for better visual and compositional solutions:

- staggered layouts
- asymmetric balance
- layered decorative surfaces
- contrast between dense and open sections
- expressive CTA placement
- diagram-like content presentation
- timeline or flow sections where appropriate
- anchor-driven narrative structure
- varied section rhythm across a page

Do not use “quick”, “safe”, or “compromise” UI solutions during the structural
design phase unless explicitly forced by the task.

---

## FSD architecture rules

This project must follow **Feature-Sliced Design** principles in a practical,
frontend-friendly way.

Use FSD not as dogma, but as a clear rule for separation of responsibilities.

### Main layers

Use the following architectural layers:

- `app`
- `processes` (only if truly needed)
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

If a layer is unnecessary for the current scope, do not force it artificially.
But keep the boundaries clean.

### Layer responsibilities

#### `app/`

Contains global application setup:

- root layout
- providers
- global styles
- fonts setup
- theme wiring
- Lenis integration
- route-level wrappers
- metadata routes like sitemap and robots
- app-wide configuration

`app/` must not contain feature business logic or heavy UI implementation.

#### `pages/`

Contains page-level composition.

A page assembles widgets and features into a route-level screen.

Page files should:

- compose sections
- request page-level data
- define route-specific metadata behavior if needed
- remain declarative

Pages should not contain large raw blocks of markup or business logic if the
content can be extracted into widgets.

#### `widgets/`

Contains large reusable page sections and composed UI blocks.

Examples:

- hero sections
- services overview section
- partners section
- benefits section
- CTA sections
- article layout blocks
- footer contact area

Widgets are larger than features and are primarily about page composition.

#### `features/`

Contains user interactions and business actions.

Examples:

- contact form submission
- newsletter subscription
- article view tracking
- filtering behavior
- pagination state coordination if needed
- share interactions
- search or category filter behavior

A feature should represent a meaningful user action or product capability.

#### `entities/`

Contains domain entities and their presentation helpers.

Examples:

- article
- category
- tag
- service
- lead
- newsletter subscription
- media asset

Put entity models, types, small UI fragments, adapters, and formatting helpers
here when they belong to the entity itself.

#### `shared/`

Contains shared cross-project infrastructure and primitives.

Examples:

- UI kit
- SCSS tokens and mixins
- helpers
- lib utilities
- API utilities
- config
- constants
- icons
- typography primitives
- low-level layout primitives

Do not put business-specific logic into `shared`.

---

## FSD import rules

Respect dependency direction.

Allowed import direction:

- `app` can import from anywhere below
- `pages` can import from `widgets`, `features`, `entities`, `shared`
- `widgets` can import from `features`, `entities`, `shared`
- `features` can import from `entities`, `shared`
- `entities` can import from `shared`
- `shared` imports from nowhere project-specific

Forbidden:

- `shared` importing from `entities`, `features`, `widgets`, or `pages`
- `entities` importing from `features`, `widgets`, or `pages`
- `features` importing from `widgets` or `pages`

Do not break these boundaries for convenience.

---

## Suggested folder structure

Use a structure close to this:

```txt
src/
  app/
    (site)/
    (payload)/
    globals.scss
    layout.tsx
    sitemap.ts
    robots.ts

  pages/
    home/
    blog/
    service/
    article/
    privacy-policy/

  widgets/
    hero/
    services-overview/
    partners/
    benefits/
    cta/
    article-layout/
    footer-contact/

  features/
    contact-form/
    newsletter-subscribe/
    article-views/
    blog-filter/
    pagination/

  entities/
    article/
    category/
    tag/
    service/
    lead/
    media/

  shared/
    ui/
    styles/
    lib/
    api/
    config/
    assets/
    icons/
    types/
````

The exact structure may evolve, but the FSD boundary logic must remain.

---

## Styling rules: SCSS Modules are mandatory

The project styling must be built with:

* **SCSS Modules** for local component styles
* **global.scss** for actual global rules only

This is non-negotiable.

Do not replace SCSS Modules with inline style systems or utility-first
frameworks.

### `global.scss` rules

Use `global.scss` only for:

* CSS reset / normalize
* root variables if needed
* body / html base styles
* typography smoothing
* global selection styling
* scrollbar styling if desired
* shared app-level behavior
* utility classes only if they are truly global and minimal

Do not dump component styles into `global.scss`.

`global.scss` must not become a fallback garbage layer for random styling.

### SCSS Module rules

Each meaningful UI block must have its own SCSS Module.

Every serious section should have fully developed styles including:

* layout
* spacing
* typography handling
* responsive behavior
* hover states where relevant
* focus-visible states where relevant
* decorative layers
* transitions where needed
* local variants if needed

Do not create visually important sections with minimal styling.

### Strong rule against underdesigned blocks

A section is not considered finished if its styling only covers:

* basic padding
* background color
* border radius
* default text styles

A proper section should usually include several of the following:

* layered structure
* internal rhythm
* card states
* contrast management
* visual grouping
* grid or flex choreography
* accent handling
* decorative elements
* breakpoint-specific layout refinement

Do not optimize for the fewest lines of CSS. Optimize for intentional,
high-quality styling.

### No fake complexity

Do not inflate SCSS files with meaningless declarations just to appear detailed.

The goal is not “many lines of CSS”.
The goal is “fully designed and production-worthy sections”.

---

## Mantine rules

Mantine is allowed only as a **base UI layer** for primitive controls and
service UI.

Allowed Mantine components:

* `Button`
* `TextInput`
* `Textarea`
* `Select`
* `Menu`
* `Modal`
* `Accordion`
* `Tabs`
* `Checkbox`
* `Radio`
* `Switch`
* `Drawer`
* `Notification`

### Mantine restrictions

Mantine must **not** define the project’s visual identity.

Do not use Mantine as the design system for:

* cards
* section shells
* page layouts
* typography system
* spacing rhythm
* hero sections
* service sections
* article layout
* marketing UI in general

The public-facing interface must not look like a Mantine demo.

Use Mantine as an implementation helper for primitives, then restyle and wrap
it as needed inside project components.

If a block looks “obviously Mantine”, it is not done.

---

## Design tokens: mandatory palette

Respect these tokens exactly.

### Background colors

* `background-primary`: `#000000`
* `background-secondary`: `#0B0B0B`
* `background-tertiary`: `#29292A`

### Text colors

* `text-primary`: `#FFFFFF`
* `text-secondary`: `rgba(255,255,255,0.5)`
* `text-tertiary`: `rgba(255,255,255,0.4)`

### Border colors

* `border-primary`: `rgba(255,255,255,0.2)`
* `border-secondary`: `rgba(255,255,255,0.07)`

### Accent colors

* `purple`: `#C53DFF`
* `green`: `#75FB63`
* `blue`: `#638EFB`

### Color usage rules

Do not invent extra colors unless explicitly required.

Do not introduce random gradients, random tinted shadows, or uncontrolled color
experiments.

Accent colors must be used intentionally:

* purple for strong branded emphasis
* green for positive / validation / energetic highlights
* blue for cool technical or informational emphasis

The UI should feel restrained, premium, and controlled.

---

## Typography rules

Typography is part of the design system and must be treated as such.

### Primary font

Use only:

* **Manrope**

### Allowed font weights

Use only:

* **Regular**
* **Medium**

Do not introduce additional font families.
Do not use random font weights unless the design system is intentionally
expanded.

### Typography principles

Typography must be:

* clean
* modern
* contrast-driven
* spacious
* readable
* premium

Use a clear hierarchy for:

* hero headings
* section titles
* card titles
* body text
* meta text
* captions

Do not create pages where every heading feels the same size and density.

Do not use tiny low-contrast body text just to look “minimal”.

Do not use exaggerated giant text everywhere. Scale must be deliberate.

---

## Motion and animation rules

Use animation thoughtfully.

Animation is encouraged when it improves:

* readability
* pacing
* section transitions
* perceived polish
* user focus

### Allowed animation direction

Good examples:

* subtle reveal on scroll
* staged entrance of content groups
* smooth hover transitions
* background movement with restraint
* CTA emphasis
* section progress cues
* text fill / text highlight progression on scroll

### Text fill on scroll

Animation where text appears to fill, reveal, or gain emphasis during scroll is
welcome and encouraged **when it is elegant and restrained**.

This can be used for:

* hero statements
* manifesto / about sections
* strategic narrative sections
* high-emphasis service explanations

But do not overuse it.

It should feel premium and intentional, not gimmicky.

### Animation limits

Do not:

* animate every block the same way
* overload the page with motion
* create performance-heavy decorative timelines
* use motion that harms readability
* force long animation delays on important content
* turn every heading into a special effect

Motion must support structure, not replace it.

---

## Lenis rules

Use `Lenis` for smooth scroll behavior where globally appropriate.

Scroll should feel polished, but never sluggish.

Do not create scroll behavior that makes the site feel heavy or delayed.

---

## Swiper / Embla rule

Do not add a slider unless the section genuinely benefits from one.

If a section works as a grid, use a grid.

Only use `Swiper` or `Embla` when actual slider behavior is a real UX need.

Do not use a slider just to make a section look “dynamic”.

---

## Naming conventions

Use strong, explicit, predictable names.

### Files

* React components: `PascalCase.tsx`
* utilities: `camelCase.ts`
* SCSS modules: `ComponentName.module.scss`
* route folders: route-friendly names
* FSD slices: semantic names, not generic names

Bad:

* `stuff.ts`
* `helpers2.ts`
* `newBlock.tsx`
* `cards.scss`

Good:

* `ServicesOverview.tsx`
* `StrategicConsultingHero.tsx`
* `ArticleCard.tsx`
* `buildArticleMetadata.ts`
* `ContactForm.module.scss`

### Slice naming

Name slices by domain meaning, not by technical shape.

Good:

* `article`
* `category`
* `newsletter-subscribe`
* `contact-form`

Bad:

* `data`
* `logic`
* `common-feature`
* `misc`

### CSS class naming

Use semantic class names that reflect structure and role.

Good:

* `section`
* `container`
* `header`
* `title`
* `description`
* `grid`
* `card`
* `cardAccent`
* `cta`
* `label`

Bad:

* `box1`
* `inner2`
* `purpleThing`
* `leftWrapFinal`

---

## Code style rules

* Write clear, explicit, maintainable code.
* Prefer boring clarity over clever abstraction.
* Keep functions focused.
* Avoid giant files with mixed responsibilities.
* Keep page files declarative.
* Extract repeated logic into helpers or shared utilities.
* Do not create abstractions before there is a real reuse case.
* Do not duplicate logic across features if the same domain behavior already
  exists elsewhere.

### TypeScript rules

* Avoid `any`.
* Prefer explicit domain types.
* Type Payload responses carefully.
* Keep nullable states honest.
* Extract reusable types when needed.
* Do not use unsafe casts as a shortcut unless there is no better option and
  the cast is tightly localized.

---

## Comments and documentation rules

Comments are allowed, but only when useful.

### Good comments

Use comments to explain:

* why a decision exists
* why a workaround is necessary
* why a motion pattern is implemented a certain way
* why a certain architectural boundary matters

### Bad comments

Do not write comments that only restate obvious code.

Do not copy the product brief into comments.

Do not litter files with explanatory prose that should live in docs instead.

### Public utilities

Reusable helpers and public shared modules may have concise doc comments when it
improves navigation and onboarding.

---

## Refactoring rules

When touching existing code:

* improve the touched area if needed
* preserve project structure
* reduce duplication where safe
* do not rewrite unrelated parts of the codebase
* do not silently reformat or reorganize unrelated files

If you notice a problem outside the requested scope, mention it explicitly
instead of changing it without asking.

Refactoring must increase clarity, not just shuffle files.

---

## Hard quality rule for block design

No major content block should feel like a placeholder.

A block is not acceptable if it looks like:

* a plain title plus paragraph on a dark rectangle
* three equal cards with almost no internal structure
* a default UI-kit layout with token colors applied
* a section with only background, padding, and border radius

Every significant block should demonstrate intentional design thinking through
at least some of the following:

* internal composition
* card hierarchy
* visual anchors
* contrast layers
* rhythm changes
* spacing logic
* asymmetric structure
* motion support
* meaningful accent usage
* responsive refinement

Do not settle for the minimum viable section.

---

## Final design standard

This repository must not look like a startup template, no-code export, or UI
kit demo.

It must feel like a custom, premium, high-intent product site with a strong
editorial / strategic tone.

The expected output is:

* custom
* structured
* scalable
* visually deliberate
* CMS-ready
* polished
* not generic

If a solution is technically valid but visually weak, it is not finished.
