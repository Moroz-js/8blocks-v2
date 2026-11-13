import type { Metadata } from 'next'
import { methodologyContent } from '@/shared/content/methodology'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { MethodologyPage } from '@/widgets/MethodologyPage'

const path = '/methodology'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata(path, {
    title: methodologyContent.metaTitle,
    description: methodologyContent.metaDescription,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}${path}` },
    openGraph: {
      type: 'article',
      title: methodologyContent.metaTitle,
      description: methodologyContent.metaDescription,
      url: path,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
      publishedTime: methodologyContent.publishedAt,
      modifiedTime: methodologyContent.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: methodologyContent.metaTitle,
      description: methodologyContent.metaDescription,
      images: [siteConfig.ogImage],
    },
  })
}

export default function MethodologyRoute() {
  return <MethodologyPage />
}
