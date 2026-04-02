import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { lang } from '@/shared/i18n'
import { privacyMeta } from '@/shared/content/privacyPage'
import { PrivacyPolicyEn } from './PrivacyPolicyEn'
import { PrivacyPolicyRu } from './PrivacyPolicyRu'

export const metadata: Metadata = {
  title: privacyMeta.title,
  description: privacyMeta.description,
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
  openGraph: {
    title: privacyMeta.ogTitle,
    description: privacyMeta.ogDescription,
    url: `${siteConfig.url}/privacy-policy`,
  },
}

export default function PrivacyPolicyPage() {
  return lang === 'en' ? <PrivacyPolicyEn /> : <PrivacyPolicyRu />
}
