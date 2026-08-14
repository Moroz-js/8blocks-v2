// Footer content — single source of truth

export const footerContent = {
  subscribeLabel: 'Subscribe',
  subscribeNote: 'A newsletter for those who want to go deeper.',
  navHeading: 'Navigation',
  servicesHeading: 'Services',
  productsHeading: 'Products',
  mapTitle: 'Map',
  copyright: 'All rights reserved.',
  privacyPolicy: 'Privacy policy',
  mapEmbedSrc:
    'https://www.google.com/maps?q=8BLOCKS+FZCO&ll=25.0607775%2C55.1412167&hl=en&z=15&output=embed',
  pageLinks: [
    { label: 'Cases', href: '/cases' },
    { label: 'Blog', href: '/blog' },
    { label: 'Research', href: '/research' },
    { label: 'Press', href: '/press' },
    { label: 'Public audits', href: '/audits' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Token vesting benchmarks', href: '/learn/token-vesting-benchmarks' },
  ],
  serviceLinks: [
    { label: 'Strategic consulting', href: '/services/strategic-consulting' },
    { label: 'Tokenomics', href: '/services/tokenomics' },
    { label: 'Tokenomics audit', href: '/services/audit' },
    { label: 'Tokenomics workshop', href: '/product/workshop' },
    { label: 'Digital Assets Strategy', href: '/product/digital-assets' },
  ],
  productLinks: [
    {
      label: 'Token launch with Fibonacci & BingX',
      href: '/product/token-launch',
    },
    {
      label: 'Tokenomics calculator',
      href: '/product/calculator',
    },
    {
      label: 'Tokenization readiness',
      href: '/product/tokenization-readiness',
    },
    {
      label: 'Tokenization cases',
      href: '/product/tokenization-cases',
    },
    {
      label: 'Tokenomics AI',
      href: '/product/tokenomics-ai',
    },
  ],
} as const
