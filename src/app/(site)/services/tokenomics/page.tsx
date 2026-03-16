import type { Metadata } from 'next'
import { tokenomicsContent } from '@/shared/content/tokenomics'
import { ServiceHero } from '@/widgets/ServiceHero'
import { ProblemBlock } from '@/widgets/ProblemBlock'
import { SolutionBlock } from '@/widgets/SolutionBlock'
import { DeliverablesBlock } from '@/widgets/DeliverablesBlock'
import { ProcessSteps } from '@/widgets/ProcessSteps'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { ServiceCtaBlock } from '@/widgets/ServiceCtaBlock'
import { siteConfig } from '@/shared/config/site'

const { hero, problem, solution, deliverables, process, faq, cta } = tokenomicsContent

export const metadata: Metadata = {
  title: 'Basic Tokenomics',
  description:
    'A foundational token economics model covering supply, emission, and distribution, built to keep the system stable from day one.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/services/tokenomics` },
  openGraph: {
    title: 'Basic Tokenomics | 8Blocks',
    description:
      'A foundational token economics model covering supply, emission, and distribution, built to keep the system stable from day one.',
    url: '/services/tokenomics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basic Tokenomics | 8Blocks',
    description:
      'A foundational token economics model covering supply, emission, and distribution.',
  },
}

export default function TokenomicsPage() {
  return (
    <>
      <ServiceHero
        label={hero.label}
        headline={hero.headline}
        accentWord={hero.accentWord}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
        variant="tokenomics"
      />
      <ProblemBlock headline={problem.headline} items={problem.items} />
      <SolutionBlock
        headline={solution.headline}
        description={solution.description}
        variant="principles"
        items={solution.items}
      />
      <DeliverablesBlock
        label={deliverables.label}
        headline={deliverables.headline}
        items={deliverables.items}
      />
      <ProcessSteps headline={process.headline} steps={process.steps} />
      <ServiceCtaBlock
        headline={cta.headline}
        ctaLabel={cta.ctaLabel}
        ctaHref={cta.ctaHref}
      />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
