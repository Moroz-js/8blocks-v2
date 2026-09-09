import type { Metadata } from 'next'
import { OwnersGuide } from '@/widgets/OwnersGuide/OwnersGuide'
import { ownersGuideContent, ownersGuideMeta } from '@/shared/content/ownersGuide'
import { buildPageGraph } from '@/shared/lib/page-schema'
import { lang } from '@/shared/i18n'
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
  const path = '/product/digital-assets/owners-guide'
  const jsonLd = buildPageGraph({
    path,
    name: ownersGuideContent.title,
    description: ownersGuideMeta.description,
    crumbs: [
      { name: lang === 'ru' ? 'Стратегия цифровых активов' : 'Digital Asset Strategy', path: '/product/digital-assets' },
      { name: ownersGuideContent.label, path },
    ],
    faq: ownersGuideContent.questions.map(([question, answer]) => ({ question, answer })),
  })
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OwnersGuide />
    </>
  )
}
