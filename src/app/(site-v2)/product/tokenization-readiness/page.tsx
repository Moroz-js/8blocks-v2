import type { Metadata } from 'next'
import { readiness as content } from '@/shared/content/readiness'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, webAppNode } from '@/shared/lib/page-schema'
import { ReadinessCheckPage } from '@/widgets/Readiness/ReadinessCheckPage'
import { CHECK_PATH } from '@/widgets/Readiness/paths'

export function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata(CHECK_PATH, {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}${CHECK_PATH}` },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: CHECK_PATH,
      images: [{ url: '/api/og', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.title,
      description: content.meta.description,
      images: ['/api/og'],
    },
  })
}

export default function TokenizationReadinessRoute() {
  const schema = buildPageGraph({
    path: CHECK_PATH,
    name: content.meta.title,
    description: content.meta.description,
    crumbs: [{ name: content.meta.title, path: CHECK_PATH }],
    faq: content.faq.items,
    extra: [webAppNode(CHECK_PATH, { name: content.meta.title, description: content.meta.description, price: 0 })],
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ReadinessCheckPage content={content} />
    </>
  )
}
