import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { lang, t } from '@/shared/i18n'
import { PrivacyPolicyEn } from './PrivacyPolicyEn'
import { PrivacyPolicyRu } from './PrivacyPolicyRu'

export const metadata: Metadata = {
  title: t({ ru: 'Политика конфиденциальности', en: 'Privacy Policy' }),
  description: t({
    ru: 'Политика конфиденциальности 8Blocks — как мы собираем, используем и защищаем ваши персональные данные.',
    en: '8Blocks Privacy Policy — how we collect, use, and protect your personal data.',
  }),
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
  openGraph: {
    title: t({ ru: 'Политика конфиденциальности | 8Blocks', en: 'Privacy Policy | 8Blocks' }),
    description: t({
      ru: 'Как 8Blocks собирает, использует и защищает ваши персональные данные.',
      en: 'How 8Blocks collects, uses, and protects your personal data.',
    }),
    url: `${siteConfig.url}/privacy-policy`,
  },
}

export default function PrivacyPolicyPage() {
  return lang === 'en' ? <PrivacyPolicyEn /> : <PrivacyPolicyRu />
}
