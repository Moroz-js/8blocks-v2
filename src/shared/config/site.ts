import { lang, t } from '@/shared/i18n'

export const siteConfig = {
  name: '8Blocks',
  description: t({
    ru: 'Токен-экономики, которые усиливают бизнес',
    en: 'Token economies that power the business',
  }),
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io',
  email: t({ ru: 'hi@токеномика.рф', en: 'hi@8blocks.io' }),
  legalName: '8BLOCKS FZCO',
  phone: '+971 56 286 5188',
  address: t({
    ru: 'Москва, Ленинский проспект, 15а',
    en: 'UT-12-CO-372, DMCC Business Centre, Level No 12, Uptown Tower, Dubai, United Arab Emirates',
  }),
  addressUrl:
    lang === 'en'
      ? 'https://maps.google.com/?q=DMCC+Business+Centre+Uptown+Tower+Dubai'
      : 'https://yandex.ru/maps/-/CHeBrV0g',
  ogImage: '/og-image.png',
  /** When false, /services and /services/* return 404 (links stay visible). */
  servicesEnabled: true,
  /** When false, /blog and /blog/* return 404 (links stay visible). */
  blogEnabled: true,
} as const

export const navLinks = [
  { label: t({ ru: 'Услуги', en: 'Services' }), href: '/services' },
  { label: t({ ru: 'Кейсы', en: 'Cases' }), href: '/cases' },
  { label: t({ ru: 'Блог', en: 'Blog' }), href: '/blog' },
  { label: t({ ru: 'Контакты', en: 'Contact' }), href: '/contact' },
] as const

const ruSocialLinks = [
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/eightblocksio8', icon: '/icons/tg-icon.svg' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@8BlocksLabs', icon: '/icons/yt-icon.svg' },
  { id: 'vc', label: 'VC.ru', href: 'https://vc.ru/id4926495', icon: '/icons/vc-icon.svg' },
  { id: 'dzen', label: 'Дзен', href: 'https://dzen.ru/eightblocks', icon: '/icons/dzen-icon.svg' },
] as const

const enSocialLinks = [
  { id: 'x', label: 'X (Twitter)', href: 'https://x.com/8BlocksLabs', icon: '/icons/x-icon.svg' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/8blocksio', icon: '/icons/ln-icon.svg' },
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/Eight_Blocks', icon: '/icons/tg-icon.svg' },
  { id: 'base', label: 'Base', href: 'https://base.app/profile/8blocks', icon: '/icons/base-icon.svg' },
  // { id: 'medium', label: 'Medium', href: 'https://medium.com/@8blocks', icon: '/icons/yt-icon.svg' },
  // { id: 'clutch', label: 'Clutch', href: 'https://clutch.co/profile/8blocks-fzco', icon: '/icons/vc-icon.svg' },
] as const

export const socialLinks = lang === 'ru' ? ruSocialLinks : enSocialLinks
