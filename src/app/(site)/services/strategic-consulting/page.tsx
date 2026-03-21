import type { Metadata } from 'next'
import { strategicConsultingContent } from '@/shared/content/strategicConsulting'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { ConsultingDeliverablesWall } from '@/widgets/ConsultingDeliverablesWall'
import { ProcessHorizontalSlider } from '@/widgets/ProcessHorizontalSlider'
import { UseCasesTabs } from '@/widgets/UseCasesTabs'
import { TokenomicsTestBlock } from '@/widgets/TokenomicsTestBlock'
import { siteConfig } from '@/shared/config/site'

const { hero, problem, solution, midCta, faq, results, deliverables, process, useCases } = strategicConsultingContent

export const metadata: Metadata = {
  title: 'Стратегический консалтинг',
  description:
    'Помогаем Web3 и Web2 командам выстроить экономику проекта, подготовиться к инвестициям и пройти путь до выхода токена на рынок.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/strategic-consulting` },
  openGraph: {
    title: 'Стратегический консалтинг | 8Blocks',
    description:
      'Помогаем Web3 и Web2 командам выстроить экономику проекта, подготовиться к инвестициям и пройти путь до выхода токена на рынок.',
    url: '/services/strategic-consulting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Стратегический консалтинг | 8Blocks',
    description: 'Помогаем Web3 командам выстроить экономику проекта и подготовиться к TGE.',
  },
}

export default function StrategicConsultingPage() {
  return (
    <>
      <ServiceHero
        label={hero.label}
        headline={hero.headline}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        variant="consulting"
      />
      <ProblemBlock
        variant="consulting"
        headline={problem.headline}
        description={problem.description}
        items={problem.items}
        cta={midCta}
      />
      <SolutionBlock
        variant={solution.variant}
        headline={solution.headline}
        description={solution.description}
        items={solution.items}
      />
      <ConsultingDeliverablesWall
        headline={results.headline}
        ctaHeadline={deliverables.headline}
        ctaDescription={deliverables.description}
        ctaLabel={deliverables.ctaLabel}
        ctaHref={deliverables.ctaHref}
      />
      <ProcessHorizontalSlider
        headline={process.headline}
        steps={process.steps}
      />
      <UseCasesTabs
        headline={useCases.headline}
        items={useCases.items}
      />
      <TokenomicsTestBlock />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
