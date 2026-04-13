import type { Metadata } from 'next'
import { tokenLabContent, tokenLabMeta } from '@/shared/content/tokenLabPage'
import { TokenLabPage } from '@/widgets/TokenLabPage'
import { FaqAccordion } from '@/widgets/FaqAccordion'
import { siteConfig } from '@/shared/config/site'

const { faq } = tokenLabContent

export const metadata: Metadata = {
  title: tokenLabMeta.title,
  description: tokenLabMeta.description,
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/product/calculator` },
  openGraph: {
    title: tokenLabMeta.ogTitle,
    description: tokenLabMeta.ogDescription,
    url: '/product/calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: tokenLabMeta.twitterTitle,
    description: tokenLabMeta.twitterDescription,
  },
}

export default function TokenLabRoute() {
  return (
    <>
      <TokenLabPage />
      <FaqAccordion headline={faq.headline} items={faq.items} />
    </>
  )
}
