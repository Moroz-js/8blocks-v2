import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { aboutMeta } from '@/shared/content/aboutPage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { aboutOrganizationNode, buildPageGraph } from '@/shared/lib/page-schema'
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
  const path = '/about'
  const jsonLd = buildPageGraph({
    path,
    name: aboutMeta.title,
    description: aboutMeta.description,
    pageType: 'AboutPage',
    crumbs: [{ name: lang === 'ru' ? 'О компании' : 'About', path }],
    extra: [aboutOrganizationNode()],
  })
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {lang === 'en' ? <AboutEn /> : <AboutRu />}
    </>
  )
}
