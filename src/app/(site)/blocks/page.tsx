import type { Metadata } from 'next'
import { auditContent } from '@/shared/content/audit'
import { tokenomicsContent } from '@/shared/content/tokenomics'
import { strategicConsultingContent } from '@/shared/content/strategicConsulting'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { DeliverablesBlock } from '@/widgets/DeliverablesBlock'
import { ProcessSteps } from '@/widgets/ProcessSteps'
import { WhenNeededBlock } from '@/widgets/WhenNeededBlock'
import { WhatYouGetBlock } from '@/widgets/WhatYouGetBlock'
import { FalseAssumptionsBlock } from '@/widgets/FalseAssumptionsBlock'
import { UseCasesBlock } from '@/widgets/UseCasesBlock'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { BlocksNav } from './BlocksNav'

export const metadata: Metadata = {
  title: 'UI Blocks',
  robots: 'noindex, nofollow',
}

const audit = auditContent
const tok = tokenomicsContent
const sc = strategicConsultingContent

export default function BlocksPage() {
  return (
    <>
      <BlocksNav />

      {/* ═══════════════════════════════════════════════════════════════
          1. ServiceHero × 3 variants
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="hero" title="ServiceHero" count={3} />

      <VariantLabel label="variant: audit" />
      <ServiceHero
        label={audit.hero.label}
        headline={audit.hero.headline}
        description={audit.hero.description}
        ctaLabel={audit.hero.ctaLabel}
        ctaHref={audit.hero.ctaHref}
        variant="audit"
      />

      <VariantLabel label="variant: tokenomics" />
      <ServiceHero
        label={tok.hero.label}
        headline={tok.hero.headline}
        description={tok.hero.description}
        ctaLabel={tok.hero.ctaLabel}
        ctaHref={tok.hero.ctaHref}
        variant="tokenomics"
      />

      <VariantLabel label="variant: consulting" />
      <ServiceHero
        label={sc.hero.label}
        headline={sc.hero.headline}
        description={sc.hero.description}
        ctaLabel={sc.hero.ctaLabel}
        ctaHref={sc.hero.ctaHref}
        variant="consulting"
      />

      {/* ═══════════════════════════════════════════════════════════════
          2. ProblemBlock × 2 variants
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="problem" title="ProblemBlock" count={2} />

      <VariantLabel label="без cta (аудит)" />
      <ProblemBlock
        variant="audit"
        headline={audit.problem.headline}
        description={audit.problem.description}
        items={audit.problem.items}
      />

      <VariantLabel label="с cta (консалтинг)" />
      <ProblemBlock
        variant="consulting"
        headline={sc.problem.headline}
        description={sc.problem.description}
        items={sc.problem.items}
        cta={sc.midCta}
      />

      {/* ═══════════════════════════════════════════════════════════════
          3. SolutionBlock × 2 variants
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="solution" title="SolutionBlock" count={2} />

      <VariantLabel label="variant: flow (консалтинг)" />
      <SolutionBlock
        headline={sc.solution.headline}
        description={sc.solution.description}
        variant="consulting"
        items={sc.solution.items}
      />

      <VariantLabel label="variant: principles (токеномика)" />
      <SolutionBlock
        headline={tok.solution.headline}
        description={tok.solution.description}
        variant="tokenomics"
        items={tok.solution.items}
      />

      {/* ═══════════════════════════════════════════════════════════════
          4. DeliverablesBlock × 4 variants
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="deliverables" title="DeliverablesBlock" count={4} />

      <VariantLabel label="default grid, 8 items + label (токеномика)" />
      <DeliverablesBlock
        label={tok.deliverables.label}
        headline={tok.deliverables.headline}
        items={tok.deliverables.items}
      />

      <VariantLabel label="default grid, 5 items + description (аудит)" />
      <DeliverablesBlock
        label={audit.whatWeAnalyze.label}
        headline={audit.whatWeAnalyze.headline}
        description={audit.whatWeAnalyze.description}
        items={audit.whatWeAnalyze.items}
      />

      <VariantLabel label='columns="two", 6 items (консалтинг results)' />
      <DeliverablesBlock
        headline={sc.results.headline}
        columns="two"
        items={sc.results.items}
      />

      <VariantLabel label="без items, с description + cta (консалтинг deliverables)" />
      <DeliverablesBlock
        label={sc.deliverables.label}
        headline={sc.deliverables.headline}
        description={sc.deliverables.description}
        ctaLabel={sc.deliverables.ctaLabel}
        ctaHref={sc.deliverables.ctaHref}
        items={sc.deliverables.items}
      />

      {/* ═══════════════════════════════════════════════════════════════
          5. WhenNeededBlock (аудит only)
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="when-needed" title="WhenNeededBlock" count={1} />
      <WhenNeededBlock
        headline={audit.whenNeeded.headline}
        description={audit.whenNeeded.description}
        items={audit.whenNeeded.items}
      />

      {/* ═══════════════════════════════════════════════════════════════
          6. WhatYouGetBlock (аудит only)
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="what-you-get" title="WhatYouGetBlock" count={1} />
      <WhatYouGetBlock
        headline={audit.whatYouGet.headline}
        description={audit.whatYouGet.description}
        ctaLabel={audit.whatYouGet.ctaLabel}
        ctaHref={audit.whatYouGet.ctaHref}
        items={audit.whatYouGet.items}
      />

      {/* ═══════════════════════════════════════════════════════════════
          7. FalseAssumptionsBlock (аудит only)
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="false-assumptions" title="FalseAssumptionsBlock" count={1} />
      <FalseAssumptionsBlock
        headline={audit.falseAssumptions.headline}
        description={audit.falseAssumptions.description}
        items={audit.falseAssumptions.items}
      />

      {/* ═══════════════════════════════════════════════════════════════
          8. UseCasesBlock (консалтинг only)
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="use-cases" title="UseCasesBlock" count={1} />
      <UseCasesBlock
        headline={sc.useCases.headline}
        items={sc.useCases.items}
      />

      {/* ═══════════════════════════════════════════════════════════════
          9. ProcessSteps × 2 variants
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="process" title="ProcessSteps" count={2} />

      <VariantLabel label="6 шагов (консалтинг)" />
      <ProcessSteps headline={sc.process.headline} steps={sc.process.steps} />

      <VariantLabel label="9 шагов (токеномика)" />
      <ProcessSteps headline={tok.process.headline} steps={tok.process.steps} />

      {/* ═══════════════════════════════════════════════════════════════
          10. ServiceCtaBlock × 3 variants
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="cta" title="ServiceCtaBlock" count={3} />

      <VariantLabel label="аудит" />
      <ServiceCtaBlock
        headline={audit.cta.headline}
        ctaLabel={audit.cta.ctaLabel}
        ctaHref={audit.cta.ctaHref}
      />

      <VariantLabel label="токеномика" />
      <ServiceCtaBlock
        headline={tok.cta.headline}
        ctaLabel={tok.cta.ctaLabel}
        ctaHref={tok.cta.ctaHref}
      />

      <VariantLabel label="консалтинг" />
      <ServiceCtaBlock
        headline={sc.cta.headline}
        ctaLabel={sc.cta.ctaLabel}
        ctaHref={sc.cta.ctaHref}
      />

      {/* ═══════════════════════════════════════════════════════════════
          11. FaqAccordion × 3 variants
      ═══════════════════════════════════════════════════════════════ */}
      <SectionLabel id="faq" title="FaqAccordion" count={3} />

      <VariantLabel label="аудит" />
      <FaqAccordion headline={audit.faq.headline} items={audit.faq.items} />

      <VariantLabel label="токеномика" />
      <FaqAccordion headline={tok.faq.headline} items={tok.faq.items} />

      <VariantLabel label="консалтинг" />
      <FaqAccordion headline={sc.faq.headline} items={sc.faq.items} />
    </>
  )
}

/* ── Helper label components ──────────────────────────────────── */

function SectionLabel({ id, title, count }: { id: string; title: string; count: number }) {
  return (
    <div
      id={id}
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '80px 24px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        scrollMarginTop: 80,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#fff' }}>{title}</h2>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
        {count} {count === 1 ? 'вариация' : 'вариации'}
      </span>
    </div>
  )
}

function VariantLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '24px 24px 8px',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: 'rgba(194,78,136,0.15)',
          border: '1px solid rgba(194,78,136,0.3)',
          borderRadius: 8,
          fontSize: 13,
          fontFamily: 'JetBrains Mono, monospace',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        {label}
      </span>
    </div>
  )
}
