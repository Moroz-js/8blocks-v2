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
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/services', {
    title: servicesMeta.title,
    description: servicesMeta.description,
    alternates: { canonical: '/services' },
    openGraph: {
      title: `${servicesMeta.title} | ${siteConfig.name}`,
      description: servicesMeta.ogDescription,
      url: '/services',
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${servicesMeta.title} | ${siteConfig.name}`,
      description: servicesMeta.ogDescription,
      images: [siteConfig.ogImage],
    },
  })
}

export default function ServicesPage() {
  return (
    <>
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
    </>
  )
}
