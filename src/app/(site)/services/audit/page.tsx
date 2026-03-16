import type { Metadata } from 'next'
import { auditContent } from '@/shared/content/audit'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { WhenNeededBlock } from '@/widgets/WhenNeededBlock'
import { DeliverablesBlock } from '@/widgets/DeliverablesBlock'
import { FalseAssumptionsBlock } from '@/widgets/FalseAssumptionsBlock'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { WhatYouGetBlock } from '@/widgets/WhatYouGetBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { siteConfig } from '@/shared/config/site'

const {
  hero,
  problem,
  whenNeeded,
  whatWeAnalyze,
  whatYouGet,
  falseAssumptions,
  faq,
  cta,
} = auditContent

export const metadata: Metadata = {
  title: 'Tokenomics Audit',
  description:
    'A full assessment of an existing token economy, identifying structural risks, broken incentive loops, and scaling bottlenecks.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/audit` },
  openGraph: {
    title: 'Tokenomics Audit | 8Blocks',
    description:
      'A full assessment of an existing token economy, identifying structural risks and scaling bottlenecks.',
    url: '/services/audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tokenomics Audit | 8Blocks',
    description: 'A full assessment of an existing token economy.',
  },
}

export default function AuditPage() {
  return (
    <>
      <ServiceHero
        label={hero.label}
        headline={hero.headline}
        accentWord={hero.accentWord}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        variant="audit"
      />
      <ProblemBlock headline={problem.headline} items={problem.items} />
      <WhenNeededBlock headline={whenNeeded.headline} items={whenNeeded.items} />
      <DeliverablesBlock
        label={whatWeAnalyze.label}
        headline={whatWeAnalyze.headline}
        items={whatWeAnalyze.items}
      />
      <WhatYouGetBlock headline={whatYouGet.headline} items={whatYouGet.items} />
      <FalseAssumptionsBlock
        headline={falseAssumptions.headline}
        items={falseAssumptions.items}
      />
      <FaqAccordion headline={faq.headline} items={faq.items} />
      <ServiceCtaBlock
        headline={cta.headline}
        ctaLabel={cta.ctaLabel}
        ctaHref={cta.ctaHref}
      />
    </>
  )
}
