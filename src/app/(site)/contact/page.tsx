import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { contactMeta } from '@/shared/content/contactPage'
import { ContactPage } from '@/widgets/ContactPage'

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/contact` },
  openGraph: {
    title: contactMeta.ogTitle,
    description: contactMeta.ogDescription,
    url: '/contact',
  },
}

export default function ContactPageRoute() {
  return <ContactPage />
}
