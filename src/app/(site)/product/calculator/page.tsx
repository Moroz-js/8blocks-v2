import type { Metadata } from 'next'
import { tokenLabCalculator as content } from '@/shared/content/tokenLabCalculator'
import { TokenLabPage } from '@/widgets/TokenLab'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { siteConfig } from '@/shared/config/site'
import { withPayloadPageMetadata } from '@/shared/lib/site-seo'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>
}): Promise<Metadata> {
  const { m } = await searchParams
  const image = m
    ? `/api/og?t=calc&m=${encodeURIComponent(m)}`
    : '/api/og?t=calc'
  return withPayloadPageMetadata('/product/calculator', {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/product/calculator` },
    openGraph: {
      title: content.meta.ogTitle,
      description: content.meta.ogDescription,
      url: '/product/calculator',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.ogTitle,
      description: content.meta.ogDescription,
      images: [image],
    },
  })
}

export default function TokenLabRoute() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <TokenLabPage />
      <FaqAccordion
        headline={content.faq.title}
        items={content.faq.items}
        headingOrder={3}
      />
    </>
  )
}
