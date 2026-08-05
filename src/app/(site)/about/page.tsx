import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { aboutMeta } from '@/shared/content/aboutPage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { AboutEn } from './AboutEn'
import { AboutRu } from './AboutRu'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/about', {
    title: aboutMeta.title,
    description: aboutMeta.description,
    alternates: { canonical: `${siteConfig.url}/about` },
    openGraph: {
      title: aboutMeta.ogTitle,
      description: aboutMeta.ogDescription,
      url: `${siteConfig.url}/about`,
    },
  })
}

export default function AboutPage() {
  return lang === 'en' ? <AboutEn /> : <AboutRu />
}
