import type { Metadata } from 'next'
import { tokenLabCalculator as content } from '@/shared/content/tokenLabCalculator'
import { CalculatorV2Page } from '@/widgets/TokenomicsCalculator/CalculatorV2Page'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/product/calculator', {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/product/calculator` },
    openGraph: {
      title: content.meta.ogTitle,
      description: content.meta.ogDescription,
      url: '/product/calculator',
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.ogTitle,
      description: content.meta.ogDescription,
      images: [siteConfig.ogImage],
    },
  })
}

// Design system v2 (Figma «Website», 3608:10888). The calculator logic is
// wired in later; until then the tool block is the design's picture.
export default function TokenLabRoute() {
  return <CalculatorV2Page />
}
