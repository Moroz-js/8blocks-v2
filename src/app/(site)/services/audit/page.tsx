import type { Metadata } from 'next'
import { auditContent } from '@/shared/content/audit'
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

const { hero, problem, solution, faq, whatWeAnalyze, falseAssumptions, whatYouGet } = auditContent

export const metadata: Metadata = {
  title: 'Аудит токеномики',
  description:
    'Полная оценка существующей токен-экономики: структурные риски, нарушенные циклы стимулов, узкие места масштабирования.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/audit` },
  openGraph: {
    title: 'Аудит токеномики | 8Blocks',
    description:
      'Полная оценка существующей токен-экономики: структурные риски и узкие места масштабирования.',
    url: '/services/audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Аудит токеномики | 8Blocks',
    description: 'Полная оценка существующей токен-экономики.',
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
        headline={<>Перед запуском лучше услышать неудобные выводы от экспертов.<br />Чем потом от инвесторов и рынка.</>}
        ctaLabel="Записаться на консультацию"
        ctaHref="/contact"
      />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
