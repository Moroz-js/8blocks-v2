import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { TokenomicsAiPage as TokenomicsAiExperience } from '@/widgets/TokenomicsAi/TokenomicsAiPage'
import { platformPagesContent } from '@/shared/content/platformPages'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { buildPageGraph, webAppNode } from '@/shared/lib/page-schema'
const geist = Geist({ subsets: ['latin', 'cyrillic'], weight: '400', display: 'swap', variable: '--font-tokenomics-geist' })

const copy = platformPagesContent.ai

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/product/tokenomics-ai', {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${siteConfig.url.replace(/\/$/, '')}/product/tokenomics-ai`,
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: '/product/tokenomics-ai',
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [siteConfig.ogImage],
    },
  })
}

export default function TokenomicsAiPage() {
  const path = '/product/tokenomics-ai'
  const jsonLd = buildPageGraph({
    path,
    name: copy.title,
    description: copy.description,
    crumbs: [{ name: 'Tokenomics AI', path }],
    extra: [
      webAppNode(path, {
        type: 'SoftwareApplication',
        name: 'Tokenomics AI',
        description: copy.description,
        price: 299,
        currency: 'USD',
        availability: 'PreOrder',
      }),
    ],
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TokenomicsAiExperience fontClass={geist.variable} />
    </>
  )
}
