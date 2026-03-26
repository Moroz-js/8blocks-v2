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
import { t } from '@/shared/i18n'

const { hero, problem, solution, faq, whatWeAnalyze, falseAssumptions, whatYouGet } = auditContent

export const metadata: Metadata = {
  title: t({ ru: 'Аудит токеномики', en: 'Tokenomics Audit' }),
  description: t({
    ru: 'Полная оценка существующей токен-экономики: структурные риски, нарушенные циклы стимулов, узкие места масштабирования.',
    en: 'Full assessment of an existing token economy: structural risks, broken incentive loops, and scaling bottlenecks.',
  }),
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/audit` },
  openGraph: {
    title: `${t({ ru: 'Аудит токеномики', en: 'Tokenomics Audit' })} | 8Blocks`,
    description: t({
      ru: 'Полная оценка существующей токен-экономики: структурные риски и узкие места масштабирования.',
      en: 'Comprehensive token economy assessment with structural risks and growth bottlenecks.',
    }),
    url: '/services/audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${t({ ru: 'Аудит токеномики', en: 'Tokenomics Audit' })} | 8Blocks`,
    description: t({
      ru: 'Полная оценка существующей токен-экономики.',
      en: 'Comprehensive review of your existing token economy.',
    }),
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
        headline={
          t({
            ru: <>Перед запуском лучше услышать неудобные выводы от экспертов.<br />Чем потом от инвесторов и рынка.</>,
            en: <>It is better to hear hard truths from experts before launch.<br />Than later from investors and the market.</>,
          })
        }
        ctaLabel={t({ ru: 'Записаться на консультацию', en: 'Book a consultation' })}
        ctaHref="/contact"
      />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
