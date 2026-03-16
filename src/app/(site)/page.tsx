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
  title: `${siteConfig.name} — Token economies that power the business`,
  description:
    'We help businesses turn tokens into working economic instruments. Strategic consulting, tokenomics design, and audit.',
  openGraph: {
    title: `${siteConfig.name} — Token economies that power the business`,
    description:
      'Strategic consulting, basic tokenomics, and tokenomics audit for Web3 projects and crypto businesses.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Token economies that power the business`,
    description: 'Strategic consulting, tokenomics design, and audit for Web3.',
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
