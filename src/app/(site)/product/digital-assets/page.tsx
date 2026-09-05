import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { digitalAssetsMeta } from '@/shared/content/digitalAssets'
import {
  DigitalAssetsHero,
  DigitalAssetsPaths,
  DigitalAssetsJourney,
  DigitalAssetsContext,
  DigitalAssetsPackages,
  DigitalAssetsAbout,
  DigitalAssetsSelfServe,
  DigitalAssetsFaq,
  DigitalAssetsFinalCta,
  DigitalAssetsStickyCta,
} from '@/widgets/DigitalAssets'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, serviceNode } from '@/shared/lib/page-schema'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { lang } from '@/shared/i18n'

export async function generateMetadata(): Promise<Metadata> {
  if (!siteConfig.digitalAssetsEnabled) {
    return { title: 'Not Found', robots: { index: false, follow: false } }
  }
  return withPayloadPageMetadata('/product/digital-assets', {
    title: digitalAssetsMeta.title,
    description: digitalAssetsMeta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/product/digital-assets` },
    openGraph: {
      title: digitalAssetsMeta.title,
      description: digitalAssetsMeta.description,
      url: '/product/digital-assets',
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: digitalAssetsMeta.title,
      description: digitalAssetsMeta.description,
      images: [siteConfig.ogImage],
    },
  })
}

export default function DigitalAssetsPage() {
  if (!siteConfig.digitalAssetsEnabled) notFound()

  const path = '/product/digital-assets'
  const jsonLd = buildPageGraph({
    path,
    name: digitalAssetsMeta.title,
    description: digitalAssetsMeta.description,
    crumbs: [{ name: lang === 'ru' ? 'Стратегия цифровых активов' : 'Digital Asset Strategy', path }],
    faq: digitalAssetsContent.faq.items,
    extra: [
      serviceNode(path, {
        name: lang === 'ru' ? 'Стратегия токенизации активов' : 'Asset Tokenization Strategy',
        serviceType: lang === 'ru' ? 'Консалтинг по токенизации активов' : 'Asset tokenization consulting',
        description: digitalAssetsMeta.description,
        audience: lang === 'ru' ? 'Владельцы бизнеса и реальных активов' : 'Owners of established businesses and real assets',
      }),
    ],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DigitalAssetsHero />
      <DigitalAssetsPaths />
      <DigitalAssetsJourney />
      <DigitalAssetsContext />
      <DigitalAssetsPackages />
      <DigitalAssetsAbout />
      <DigitalAssetsSelfServe />
      <DigitalAssetsFaq />
      <DigitalAssetsFinalCta />
      <DigitalAssetsStickyCta />
    </>
  )
}
