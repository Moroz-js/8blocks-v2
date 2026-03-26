import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { t } from '@/shared/i18n'
import { ContactPage } from '@/widgets/ContactPage'

export const metadata: Metadata = {
  title: t({ ru: 'Контакты', en: 'Contact' }),
  description: t({
    ru: 'Свяжитесь с 8Blocks: обсудим токен-экономику, консалтинг или аудит. Ответим в течение одного рабочего дня.',
    en: "Get in touch with 8Blocks: let's discuss token economics, consulting, or an audit. We'll respond within one business day.",
  }),
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/contact` },
  openGraph: {
    title: `${t({ ru: 'Контакты', en: 'Contact' })} | ${siteConfig.name}`,
    description: t({
      ru: 'Свяжитесь с нами — обсудим ваш проект.',
      en: "Get in touch — let's discuss your project.",
    }),
    url: '/contact',
  },
}

export default function ContactPageRoute() {
  return <ContactPage />
}
