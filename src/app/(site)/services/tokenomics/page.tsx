import type { Metadata } from 'next'
import { tokenomicsContent } from '@/shared/content/tokenomics'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { TokenomicsCompositionBlock } from '@/widgets/TokenomicsCompositionBlock'
import { ProcessHorizontalSlider } from '@/widgets/ProcessHorizontalSlider'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { TokenomicsTestBlock } from '@/widgets/TokenomicsTestBlock'
import { siteConfig } from '@/shared/config/site'
import { t } from '@/shared/i18n'

const { hero, problem, solution, faq, deliverables, process, cta } = tokenomicsContent

export const metadata: Metadata = {
  title: t({ ru: 'Токеномика', en: 'Tokenomics' }),
  description: t({
    ru: 'Базовая модель токен-экономики: эмиссия, распределение и вестинг — выстроены так, чтобы система была стабильной с первого дня.',
    en: 'Token economy model: emission, distribution, and vesting — built to keep the system stable from day one.',
  }),
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/tokenomics` },
  openGraph: {
    title: `${t({ ru: 'Токеномика', en: 'Tokenomics' })} | 8Blocks`,
    description: t({
      ru: 'Базовая модель токен-экономики: эмиссия, распределение и вестинг — выстроены так, чтобы система была стабильной с первого дня.',
      en: 'Token economy model: emission, distribution, and vesting — built to keep the system stable from day one.',
    }),
    url: '/services/tokenomics',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${t({ ru: 'Токеномика', en: 'Tokenomics' })} | 8Blocks`,
    description: t({
      ru: 'Базовая модель токен-экономики: эмиссия, распределение и вестинг.',
      en: 'Token economy model: emission, allocation, and vesting.',
    }),
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
      <ProcessHorizontalSlider
        headline={process.headline}
        steps={process.steps}
      />
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
