import { lang, t } from '@/shared/i18n'

/** Canonical и metadataBase всегда с https, даже если в env указан http:// */
function siteUrlWithHttps(raw: string): string {
  const trimmed = raw.trim() || 'https://8blocks.io'
  if (/^http:\/\//i.test(trimmed)) {
    return `https://${trimmed.slice(7)}`
  }
  return trimmed
}

const siteUrl = siteUrlWithHttps(process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io')
const isAe = /8blocks\.ae/i.test(siteUrl)

export const siteConfig = {
  name: t({ ru: 'А8А9 токеномика.рф', en: '8Blocks' }),
  description: t({
    ru: 'Токен-экономики, которые усиливают бизнес',
    en: 'Token economies that power the business',
  }),
  url: siteUrl,
  email: isAe
    ? 'hello@8blocks.ae'
    : t({ ru: 'hi@токеномика.рф', en: 'hello@8blocks.io' }),
  legalName: t({ ru: 'ООО «Инерция Мысли»', en: '8BLOCKS FZCO' }),
  phone: t({ ru: '8 918 253 79 69', en: '+971 56 286 5188' }),
  address: t({
    ru: 'Москва, Ленинский проспект, 15а',
    en: 'UT-12-CO-372, DMCC Business Centre, Level No 12, Uptown Tower, Dubai, United Arab Emirates',
  }),
  addressUrl:
    lang === 'en'
      ? 'https://www.google.com/maps/search/?api=1&query=25.0606875%2C55.1415625'
      : 'https://yandex.ru/maps/-/CHeBrV0g',
  ogImage: '/og-image.png',
  /** When false, /services and /services/* return 404 (links stay visible). */
  servicesEnabled: true,
  /** When false, /blog and /blog/* return 404 (links stay visible). */
  blogEnabled: true,
  /** When false, /product/digital-assets returns 404 and nav links are hidden. */
  digitalAssetsEnabled: true,
} as const

export interface NavItem {
  label: string
  href: string
  /** Пункт ещё не готов — рендерится как неактивный с бейджем «скоро». */
  soon?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: t({ ru: 'Услуги', en: 'Services' }),
    items: [
      { label: t({ ru: 'Стратегический консалтинг', en: 'Consulting' }), href: '/services/strategic-consulting' },
      { label: t({ ru: 'Базовая токеномика', en: 'Tokenomics' }), href: '/services/tokenomics' },
      { label: t({ ru: 'Аудит токеномики', en: 'Audit' }), href: '/services/audit' },
      { label: t({ ru: 'Воркшоп по токеномике', en: 'Workshop' }), href: '/product/workshop' },
    ],
  },
  {
    label: t({ ru: 'Продукты', en: 'Products' }),
    items: [
      { label: t({ ru: 'Запуск токена с Fibonacci и BingX', en: 'Token launch with Fibonacci & BingX' }), href: '/product/token-launch' },
      { label: t({ ru: 'Калькулятор токеномики', en: 'Calculator' }), href: '/product/calculator' },
      { label: t({ ru: 'Стратегия цифровых активов', en: 'Digital Asset Strategy' }), href: '/product/digital-assets' },
      { label: t({ ru: 'Готовность к токенизации', en: 'Tokenization Readiness' }), href: '/product/tokenization-readiness' },
      { label: t({ ru: 'Кейсы токенизации', en: 'Tokenization Cases' }), href: '/product/tokenization-cases' },
      { label: 'Tokenomics AI', href: '/product/tokenomics-ai' },
    ],
  },
  {
    label: t({ ru: 'Обучение', en: 'Learn' }),
    items: [
      { label: t({ ru: 'Бенчмарки вестинга токенов', en: 'Token Vesting Benchmarks' }), href: '/learn/token-vesting-benchmarks' },
    ],
  },
  {
    label: t({ ru: 'Медиа', en: 'Media' }),
    items: [
      { label: t({ ru: 'Блог', en: 'Blog' }), href: '/blog' },
      { label: t({ ru: 'Исследования', en: 'Research' }), href: '/research' },
      { label: t({ ru: 'Публичные аудиты', en: 'Public audits' }), href: '/audits' },
    ],
  },
  {
    label: t({ ru: 'О нас', en: 'About us' }),
    items: [
      { label: t({ ru: 'Кейсы', en: 'Cases' }), href: '/cases' },
      { label: t({ ru: 'Пресса', en: 'Press' }), href: '/press' },
      { label: t({ ru: 'Контакты', en: 'Contacts' }), href: '/contact' },
    ],
  },
]

const ruSocialLinks = [
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/eightblocksio8', icon: '/icons/tg-icon.svg' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@8BlocksLabs', icon: '/icons/yt-icon.svg' },
  { id: 'vc', label: 'VC.ru', href: 'https://vc.ru/id4926495', icon: '/icons/vc-icon.svg' },
  { id: 'dzen', label: 'Дзен', href: 'https://dzen.ru/eightblocks', icon: '/icons/dzen-icon.svg' },
  { id: 'clutch', label: 'Clutch', href: 'https://clutch.co/profile/8blocks-fzco', icon: '/icons/clutch-icon.svg' },
] as const

const enSocialLinks = [
  { id: 'x', label: 'X (Twitter)', href: 'https://x.com/8BlocksLabs', icon: '/icons/x-icon.svg' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/8blocksio', icon: '/icons/ln-icon.svg' },
  { id: 'telegram', label: 'Telegram', href: 'https://t.me/eightblocks', icon: '/icons/tg-icon.svg' },
  { id: 'base', label: 'Base', href: 'https://base.app/profile/8blocks', icon: '/icons/base-icon.svg' },
  { id: 'clutch', label: 'Clutch', href: 'https://clutch.co/profile/8blocks-fzco', icon: '/icons/clutch-icon.svg' },
  // { id: 'medium', label: 'Medium', href: 'https://medium.com/@8blocks', icon: '/icons/yt-icon.svg' },
] as const

export const socialLinks = lang === 'ru' ? ruSocialLinks : enSocialLinks
