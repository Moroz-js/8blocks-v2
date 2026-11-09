import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

interface PageMeta {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  twitterTitle: string
  twitterDescription: string
}

export function servicePageMetadata(path: string, meta: PageMeta): Promise<Metadata> {
  return withPayloadPageMetadata(path, {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}${path}` },
    openGraph: { title: meta.ogTitle, description: meta.ogDescription, url: path },
    twitter: { card: 'summary_large_image', title: meta.twitterTitle, description: meta.twitterDescription },
  })
}
