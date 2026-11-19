import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { homeMeta } from '@/shared/content/homePage'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'
import { HomePage } from '@/widgets/Home/HomePage'

export async function generateMetadata(): Promise<Metadata> {
  return withPayloadPageMetadata('/', {
    title: homeMeta.title,
    description: homeMeta.description,
    openGraph: {
      title: homeMeta.ogTitle,
      description: homeMeta.ogDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: homeMeta.ogTitle,
      description: homeMeta.ogDescription,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: siteConfig.url,
    },
  })
}

export default function Page() {
  return <HomePage blogEnabled={siteConfig.blogEnabled} />
}
