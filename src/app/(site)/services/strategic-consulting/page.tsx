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
import { t } from '@/shared/i18n'

const { hero, problem, solution, midCta, faq, results, deliverables, process, useCases } = strategicConsultingContent

export const metadata: Metadata = {
  title: t({ ru: 'Стратегический консалтинг', en: 'Strategic Consulting' }),
  description: t({
    ru: 'Помогаем Web3 и Web2 командам выстроить экономику проекта, подготовиться к инвестициям и пройти путь до выхода токена на рынок.',
    en: "We help Web3 and Web2 teams build a project's economy, prepare for investment, and navigate the path to token market launch.",
  }),
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/strategic-consulting` },
  openGraph: {
    title: `${t({ ru: 'Стратегический консалтинг', en: 'Strategic Consulting' })} | 8Blocks`,
    description: t({
      ru: 'Помогаем Web3 и Web2 командам выстроить экономику проекта, подготовиться к инвестициям и пройти путь до выхода токена на рынок.',
      en: "We help Web3 and Web2 teams build a project's economy, prepare for investment, and navigate the path to token market launch.",
    }),
    url: '/services/strategic-consulting',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${t({ ru: 'Стратегический консалтинг', en: 'Strategic Consulting' })} | 8Blocks`,
    description: t({
      ru: 'Помогаем Web3 командам выстроить экономику проекта и подготовиться к TGE.',
      en: 'We help Web3 teams shape project economics and prepare for TGE.',
    }),
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
