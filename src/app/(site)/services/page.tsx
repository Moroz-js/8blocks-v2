import type { Metadata } from 'next'
import { ServicesShowcase } from '@/widgets/ServicesShowcase'
import { ServicesPageHero } from '@/widgets/ServicesPageHero'
import { ServiceHero } from '@/widgets/ServiceHero'
import { TokenEconomyBlock } from '@/widgets/TokenEconomyBlock'
import { TokenFilterBlock } from '@/widgets/TokenFilterBlock'
import { TokenomicsTestBlock } from '@/widgets/TokenomicsTestBlock'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { Container } from '@/shared/ui'
import { servicesPageContent, servicesFaqContent, servicesMeta } from '@/shared/content/homePage'

export const metadata: Metadata = {
  title: servicesMeta.title,
  description: servicesMeta.description,
  alternates: { canonical: '/services' },
  openGraph: {
    title: `${servicesMeta.title} | 8Blocks`,
    description: servicesMeta.ogDescription,
    url: '/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${servicesMeta.title} | 8Blocks`,
    description: servicesMeta.ogDescription,
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
