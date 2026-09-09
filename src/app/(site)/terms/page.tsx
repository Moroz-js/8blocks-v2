import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { termsMeta } from '@/shared/content/termsPage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph } from '@/shared/lib/page-schema'
import { TermsEn } from './TermsEn'
import { TermsRu } from './TermsRu'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/terms', {
    title: termsMeta.title,
    description: termsMeta.description,
    alternates: { canonical: `${siteConfig.url}/terms` },
    openGraph: {
      title: termsMeta.ogTitle,
      description: termsMeta.ogDescription,
      url: `${siteConfig.url}/terms`,
    },
  })
}

export default function TermsPage() {
  const path = '/terms'
  const jsonLd = buildPageGraph({
    path,
    name: termsMeta.title,
    description: termsMeta.description,
    crumbs: [{ name: termsMeta.title, path }],
  })
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {lang === 'en' ? <TermsEn /> : <TermsRu />}
    </>
  )
}
