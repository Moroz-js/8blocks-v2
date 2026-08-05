import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { termsMeta } from '@/shared/content/termsPage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
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
  return lang === 'en' ? <TermsEn /> : <TermsRu />
}
