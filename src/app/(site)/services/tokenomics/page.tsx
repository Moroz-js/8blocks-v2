import type { Metadata } from 'next'
import { tokenomicsContent } from '@/shared/content/tokenomics'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { TokenomicsCompositionBlock } from '@/widgets/TokenomicsCompositionBlock'
import { TokenomicsProcessWall } from '@/widgets/TokenomicsProcessWall'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { TokenomicsTestBlock } from '@/widgets/TokenomicsTestBlock'
import { siteConfig } from '@/shared/config/site'

const { hero, problem, solution, faq, deliverables, process, cta } = tokenomicsContent

export const metadata: Metadata = {
  title: 'Токеномика',
  description:
    'Базовая модель токен-экономики: эмиссия, распределение и вестинг — выстроены так, чтобы система была стабильной с первого дня.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/tokenomics` },
  openGraph: {
    title: 'Токеномика | 8Blocks',
    description:
      'Базовая модель токен-экономики: эмиссия, распределение и вестинг — выстроены так, чтобы система была стабильной с первого дня.',
    url: '/services/tokenomics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Токеномика | 8Blocks',
    description: 'Базовая модель токен-экономики: эмиссия, распределение и вестинг.',
  },
}

export default function TokenomicsPage() {
  return (
    <>
      <ServiceHero
        label={hero.label}
        headline={hero.headline}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        variant="tokenomics"
      />
      <ProblemBlock
        variant="tokenomics"
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
      <TokenomicsCompositionBlock
        headline={deliverables.label}
        description={deliverables.headline}
      />
      <TokenomicsProcessWall headline={process.headline} />
      <TokenomicsTestBlock />
      <ServiceCtaBlock
        headline={cta.headline}
        ctaLabel={cta.ctaLabel}
        ctaHref={cta.ctaHref}
      />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
