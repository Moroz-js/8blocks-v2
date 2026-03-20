import type { Metadata } from 'next'
import { siteConfig } from '@/shared/config/site'
import { ContactPage } from '@/widgets/ContactPage'

export const metadata: Metadata = {
  title: 'Контакты',
  description:
    'Свяжитесь с 8Blocks: обсудим токен-экономику, консалтинг или аудит. Ответим в течение одного рабочего дня.',
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, '')}/contact` },
  openGraph: {
    title: `Контакты | ${siteConfig.name}`,
    description: 'Свяжитесь с нами — обсудим ваш проект.',
    url: '/contact',
  },
}

export default function ContactPageRoute() {
  return <ContactPage />
}
