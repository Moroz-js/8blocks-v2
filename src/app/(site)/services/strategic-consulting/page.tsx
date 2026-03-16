import type { Metadata } from 'next'
import { strategicConsultingContent } from '@/shared/content/strategicConsulting'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { DeliverablesBlock } from '@/widgets/DeliverablesBlock'
import { ProcessSteps } from '@/widgets/ProcessSteps'
import { UseCasesBlock } from '@/widgets/UseCasesBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { siteConfig } from '@/shared/config/site'

const { hero, problem, solution, deliverables, process, useCases, faq, cta } =
  strategicConsultingContent

export const metadata: Metadata = {
  title: 'Strategic Consulting',
  description:
    'We design the economic strategy behind the system for Web3 projects and businesses entering tokenized ecosystems. From tokenomics to TGE.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/strategic-consulting` },
  openGraph: {
    title: 'Strategic Consulting | 8Blocks',
    description:
      'We design the economic strategy behind the system for Web3 projects and businesses entering tokenized ecosystems.',
    url: '/services/strategic-consulting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strategic Consulting | 8Blocks',
    description:
      'We design the economic strategy behind the system for Web3 projects and businesses entering tokenized ecosystems.',
  },
}

export default function StrategicConsultingPage() {
  return (
    <>
      <ServiceHero
        label={hero.label}
        headline={hero.headline}
        accentWord={hero.accentWord}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        variant="consulting"
      />
      <ProblemBlock headline={problem.headline} items={problem.items} />
      <SolutionBlock
        headline={solution.headline}
        description={solution.description}
        variant="flow"
        items={solution.items}
      />
      <DeliverablesBlock
        label={deliverables.label}
        headline={deliverables.headline}
        items={deliverables.items}
      />
      <ServiceCtaBlock
        headline={cta.headline}
        ctaLabel={cta.ctaLabel}
        ctaHref={cta.ctaHref}
      />
      <ProcessSteps headline={process.headline} steps={process.steps} />
      <UseCasesBlock headline={useCases.headline} items={useCases.items} />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
