import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { digitalAssets as content } from '@/shared/content/digitalAssets'
import { readiness } from '@/shared/content/readiness'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, serviceNode } from '@/shared/lib/page-schema'
import { DigitalAssetsPage } from '@/widgets/DigitalAssets/DigitalAssetsPage'

const path = '/product/digital-assets'

export async function generateMetadata(): Promise<Metadata> {
  if (!siteConfig.digitalAssetsEnabled) {
    return { title: 'Not Found', robots: { index: false, follow: false } }
  }
  const { title, description } = content.meta
  return withPayloadPageMetadata(path, {
    title,
    description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}${path}` },
    openGraph: { title, description, url: path, images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [siteConfig.ogImage] },
  })
}

export default function DigitalAssetsRoute() {
  if (!siteConfig.digitalAssetsEnabled) notFound()

  const { title, description } = content.meta
  const schema = buildPageGraph({
    path,
    name: title,
    description,
    crumbs: [{ name: lang === 'ru' ? 'Стратегия цифровых активов' : 'Digital Asset Strategy', path }],
    faq: content.faq.items,
    extra: [
      serviceNode(path, {
        name: lang === 'ru' ? 'Стратегия токенизации активов' : 'Asset Tokenization Strategy',
        serviceType: lang === 'ru' ? 'Консалтинг по токенизации активов' : 'Asset tokenization consulting',
        description,
        audience: lang === 'ru' ? 'Владельцы бизнеса и реальных активов' : 'Owners of established businesses and real assets',
      }),
    ],
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <DigitalAssetsPage content={content} paths={readiness.paths} />
    </>
  )
}
