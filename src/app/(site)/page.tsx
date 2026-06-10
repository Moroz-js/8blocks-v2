import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { homeMeta } from '@/shared/content/homePage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { HeroHome } from '@/widgets/HeroHome'
import { ServicesSection } from '@/widgets/ServicesSection'
import { AboutSection } from '@/widgets/AboutSection'
import { PartnersSection } from '@/widgets/PartnersSection'
import { BenefitsSection } from '@/widgets/BenefitsSection'
import { MethodologySection } from '@/widgets/MethodologySection'
import { BlogPreview } from '@/widgets/BlogPreview'
import { CtaSection } from '@/widgets/CtaSection'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/', {
    title: homeMeta.title,
    description: homeMeta.description,
    openGraph: {
      title: homeMeta.ogTitle,
      description: homeMeta.ogDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: homeMeta.ogTitle,
      description: homeMeta.ogDescription,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: siteConfig.url,
    },
  })
}

export default function HomePage() {
  return (
    <main>
      <HeroHome />
      <ServicesSection />
      <AboutSection />
      <PartnersSection />
      <BenefitsSection />
      {/* <MethodologySection /> */}
      {siteConfig.blogEnabled && <BlogPreview />}
      <CtaSection />
    </main>
  )
}
