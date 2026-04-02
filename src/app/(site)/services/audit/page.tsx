import type { Metadata } from 'next'
import { auditContent, auditMeta } from '@/shared/content/audit'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { AuditZonesBlock } from '@/widgets/AuditZonesBlock'
import { AuditAssumptionsBlock } from '@/widgets/AuditAssumptionsBlock'
import { AuditOutputBlock } from '@/widgets/AuditOutputBlock'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { TokenomicsTestBlock } from '@/widgets/TokenomicsTestBlock'
import { siteConfig } from '@/shared/config/site'

const { hero, problem, solution, faq, whatWeAnalyze, falseAssumptions, whatYouGet, cta } = auditContent

export const metadata: Metadata = {
  title: auditMeta.title,
  description: auditMeta.description,
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/audit` },
  openGraph: {
    title: auditMeta.ogTitle,
    description: auditMeta.ogDescription,
    url: '/services/audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: auditMeta.twitterTitle,
    description: auditMeta.twitterDescription,
  },
}

export default function AuditPage() {
  return (
    <>
      <ServiceHero
        label={hero.label}
        headline={hero.headline}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        variant="audit"
      />
      <ProblemBlock
        variant="audit"
        headline={problem.headline}
        description={problem.description}
        items={problem.items}
      />
      <SolutionBlock
        variant={solution.variant}
        headline={solution.headline}
        description={solution.description}
        items={solution.items}
      />
      <AuditZonesBlock
        headline={whatWeAnalyze.headline}
        description={whatWeAnalyze.description}
      />
      <AuditOutputBlock
        headline={whatYouGet.headline}
        description={whatYouGet.description}
        ctaLabel={whatYouGet.ctaLabel}
        ctaHref={whatYouGet.ctaHref}
      />
      <AuditAssumptionsBlock
        headline={falseAssumptions.headline}
        items={falseAssumptions.items}
      />
      <TokenomicsTestBlock />
      <ServiceCtaBlock
        headline={<>{cta.headlineLine1}<br />{cta.headlineLine2}</>}
        ctaLabel={cta.ctaLabel}
        ctaHref={cta.ctaHref}
      />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
