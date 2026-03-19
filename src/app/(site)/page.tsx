import type { Metadata } from 'next'
import Script from 'next/script'
import { siteConfig, socialLinks } from '@/shared/config/site'
import { HeroHome } from '@/widgets/HeroHome'
import { ServicesSection } from '@/widgets/ServicesSection'
import { AboutSection } from '@/widgets/AboutSection'
import { PartnersSection } from '@/widgets/PartnersSection'
import { BenefitsSection } from '@/widgets/BenefitsSection'
import { BlogPreview } from '@/widgets/BlogPreview'
import { CtaSection } from '@/widgets/CtaSection'

export const metadata: Metadata = {
  title: `${siteConfig.name} — Токен-экономики, которые усиливают бизнес`,
  description:
    'Мы превращаем токены из разового способа привлечь деньги в работающие экономические механики. Они встроены в продукт и операционную логику, поэтому ценность формируется за счет спроса и использования, а не спекуляций.',
  openGraph: {
    title: `${siteConfig.name} — Токен-экономики, которые усиливают бизнес`,
    description:
      'Современная веб-разработка и блокчейн решения. Стратегический консалтинг, дизайн токеномики и техническая экспертиза для Web3 проектов.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Токен-экономики, которые усиливают бизнес`,
    description: 'Современная веб-разработка и блокчейн решения. Стратегический консалтинг, дизайн токеномики и техническая экспертиза для Web3 проектов.',
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.email,
  logo: `${siteConfig.url}/og-image.png`,
  sameAs: socialLinks.map((s) => s.href),
}

export default function HomePage() {
  return (
    <main>
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroHome />
      <ServicesSection />
      <AboutSection />
      <PartnersSection />
      <BenefitsSection />
      {siteConfig.blogEnabled && <BlogPreview />}
      <CtaSection />
    </main>
  )
}
