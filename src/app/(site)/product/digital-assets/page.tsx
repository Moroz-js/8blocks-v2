import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { digitalAssetsMeta } from '@/shared/content/digitalAssets'
import {
  DigitalAssetsHero,
  DigitalAssetsPaths,
  DigitalAssetsJourney,
  DigitalAssetsContext,
  DigitalAssetsPackages,
  DigitalAssetsRisks,
  DigitalAssetsAbout,
  DigitalAssetsNext,
  DigitalAssetsFaq,
  DigitalAssetsFinalCta,
} from '@/widgets/DigitalAssets'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

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
    },
    twitter: {
      card: 'summary_large_image',
      title: digitalAssetsMeta.title,
      description: digitalAssetsMeta.description,
    },
  })
}

export default function DigitalAssetsPage() {
  if (!siteConfig.digitalAssetsEnabled) notFound()

  return (
    <>
      <DigitalAssetsHero />
      <DigitalAssetsPaths />
      <DigitalAssetsJourney />
      <DigitalAssetsContext />
      <DigitalAssetsPackages />
      <DigitalAssetsRisks />
      <DigitalAssetsAbout />
      <DigitalAssetsNext />
      <DigitalAssetsFaq />
      <DigitalAssetsFinalCta />
    </>
  )
}
