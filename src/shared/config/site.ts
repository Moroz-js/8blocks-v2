export const siteConfig = {
  name: '8Blocks',
  description: 'Токен-экономики, которые усиливают бизнес',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io',
  email: 'hi@токеномика.рф',
  legalName: '8BLOCKS FZCO',
  phone: '+971 56 286 5188',
  address: 'Москва, Ленинский проспект, 15а',
  addressUrl: 'https://yandex.ru/maps/-/CHeBrV0g',
  ogImage: '/og-image.png',
  /** When false, /services and /services/* return 404 (links stay visible). */
  servicesEnabled: true,
  /** When false, /blog and /blog/* return 404 (links stay visible). */
  blogEnabled: true,
} as const

export const navLinks = [
  { label: 'Услуги', href: '/services' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contact' },
] as const

export const socialLinks = [
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/eightblocksio8',
    icon: '/icons/tg-icon.svg',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@8BlocksLabs',
    icon: '/icons/yt-icon.svg',
  },
  {
    id: 'vc',
    label: 'VC.ru',
    href: 'https://vc.ru/id4926495',
    icon: '/icons/vc-icon.svg',
  },
  {
    id: 'dzen',
    label: 'Дзен',
    href: 'https://dzen.ru/eightblocks',
    icon: '/icons/dzen-icon.svg',
  },
] as const
