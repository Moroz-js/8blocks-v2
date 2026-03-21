export const siteConfig = {
  name: '8Blocks',
  description: 'Токен-экономики, которые усиливают бизнес',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io',
  email: 'hi@токеномика.рф',
  phone: '+971 (55) 000-0000',
  address: 'DMCC I5 Premium Business Centre, Dubai, UAE',
  addressUrl: 'https://maps.app.goo.gl/nyfXSL3xFF9K9YgW7',
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
    id: 'x',
    label: 'X (Twitter)',
    href: 'https://x.com/8BlocksLabs',
    icon: '/icons/x-icon.svg',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/eightblocks',
    icon: '/icons/tg-icon.svg',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/8blocksio',
    icon: '/icons/ln-icon.svg',
  },
  {
    id: 'base',
    label: 'Base.app',
    href: 'https://base.app/profile/8blocks',
    icon: '/icons/base-icon.svg',
  },
] as const
