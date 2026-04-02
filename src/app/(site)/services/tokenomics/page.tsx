import type { Metadata } from 'next'
import { tokenomicsContent, tokenomicsMeta } from '@/shared/content/tokenomics'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { TokenomicsCompositionBlock } from '@/widgets/TokenomicsCompositionBlock'
import { ProcessHorizontalSlider } from '@/widgets/ProcessHorizontalSlider'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { TokenomicsTestBlock } from '@/widgets/TokenomicsTestBlock'
import { siteConfig } from '@/shared/config/site'

const { hero, problem, solution, faq, deliverables, process, cta } = tokenomicsContent

export const metadata: Metadata = {
  title: tokenomicsMeta.title,
  description: tokenomicsMeta.description,
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/tokenomics` },
  openGraph: {
    title: tokenomicsMeta.ogTitle,
    description: tokenomicsMeta.ogDescription,
    url: '/services/tokenomics',
  },
  twitter: {
    card: 'summary_large_image',
    title: tokenomicsMeta.twitterTitle,
    description: tokenomicsMeta.twitterDescription,
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
