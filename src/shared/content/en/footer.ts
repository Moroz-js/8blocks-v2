// Footer content — single source of truth

export const footerContent = {
  subscribeLabel: 'Subscribe',
  subscribeNote: 'A newsletter for those who want to go deeper.',
  navHeading: 'Navigation',
  servicesHeading: 'Services',
  productsHeading: 'Products',
  mapTitle: 'Map',
  copyright: 'All rights reserved.',
  privacyPolicy: 'Privacy Policy',
  mapEmbedSrc:
    'https://www.google.com/maps?q=25.0606875%2C55.1415625&ll=25.0606875%2C55.1415625&hl=en&z=14&output=embed',
  pageLinks: [
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'In the media', href: '/media' },
    { label: 'Contact', href: '/contact' },
  ],
  serviceLinks: [
    { label: 'Strategic consulting', href: '/services/strategic-consulting' },
    { label: 'Tokenomics', href: '/services/tokenomics' },
    { label: 'Tokenomics audit', href: '/services/audit' },
  ],
  productLinks: [
    {
      label: 'Tokenomics Calculator',
      href: '/product/calculator',
    },
    {
      label: 'Tokenomics Workshop',
      href: '/product/workshop',
    },
  ],
} as const
