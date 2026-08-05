import type { Metadata } from 'next'
import { OwnersGuide } from '@/widgets/OwnersGuide/OwnersGuide'
import { ownersGuideMeta } from '@/shared/content/ownersGuide'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

const path = '/product/digital-assets/owners-guide'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata(path, {
    title: ownersGuideMeta.title,
    description: ownersGuideMeta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}${path}` },
    openGraph: {
      title: ownersGuideMeta.title,
      description: ownersGuideMeta.description,
      url: path,
    },
  })
}

export default function OwnersGuidePage() {
  return <OwnersGuide />
}
