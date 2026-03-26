import type { Metadata } from 'next'
import { ServicesShowcase } from '@/widgets/ServicesShowcase'
import { ServicesPageHero } from '@/widgets/ServicesPageHero'
import { ServiceHero } from '@/widgets/ServiceHero'
import { TokenEconomyBlock } from '@/widgets/TokenEconomyBlock'
import { TokenFilterBlock } from '@/widgets/TokenFilterBlock'
import { TokenomicsTestBlock } from '@/widgets/TokenomicsTestBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { Container } from '@/shared/ui'
import { servicesPageContent, servicesFaqContent } from '@/shared/content/homePage'
import { t } from '@/shared/i18n'

export const metadata: Metadata = {
  title: t({ ru: 'Услуги', en: 'Services' }),
  description: t({
    ru: 'Стратегический консалтинг, проектирование и аудит токеномики. Помогаем Web3-проектам создавать и восстанавливать работающие токен-экономики.',
    en: 'Strategic consulting, tokenomics design and audit. We help Web3 projects build and fix working token economies.',
  }),
  alternates: { canonical: '/services' },
  openGraph: {
    title: `${t({ ru: 'Услуги', en: 'Services' })} | 8Blocks`,
    description: t({
      ru: 'Стратегический консалтинг, проектирование и аудит токеномики.',
      en: 'Strategic consulting, tokenomics design, and audits.',
    }),
    url: '/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${t({ ru: 'Услуги', en: 'Services' })} | 8Blocks`,
    description: t({
      ru: 'Стратегический консалтинг, проектирование и аудит токеномики.',
      en: 'Strategic consulting, tokenomics design, and audits.',
    }),
  },
}

export default function ServicesPage() {
  return (
    <main>
      <ServiceHero
        label={servicesPageContent.hero.label}
        headline={servicesPageContent.hero.headline}
        description={servicesPageContent.hero.description}
        ctaLabel={servicesPageContent.hero.ctaLabel}
        ctaHref={servicesPageContent.hero.ctaHref}
      />
      <Container>
        <ServicesPageHero
          headline={servicesPageContent.transition.headline}
          description={servicesPageContent.transition.description}
        />
      </Container>
      <ServicesShowcase />
      <TokenEconomyBlock />
      <TokenFilterBlock />
      <TokenomicsTestBlock />
      <FaqAccordion headline={servicesFaqContent.headline} items={servicesFaqContent.items} />
    </main>
  )
}
