// Site navigation: header mega menu and footer columns (project 2 mockups).

export const siteNav = {
  contact: { label: 'Contact us', href: '/contact' },
  menu: { open: 'Open menu', close: 'Close menu', label: 'Menu', closeLabel: 'Close' },
  groups: [
    {
      id: 'tokenomics',
      label: 'Tokenomics',
      intro: {
        href: '/services/tokenomics',
        title: 'Build a working token economy',
        text: 'Design, validate and scale a sustainable token economy for your product.',
        more: 'Explore Tokenomics',
      },
      columns: [
        {
          heading: 'Services',
          links: [
            { label: 'Strategic Consulting', href: '/services/strategic-consulting' },
            { label: 'Tokenomics Design', href: '/services/tokenomics' },
            { label: 'Tokenomics Audit', href: '/services/audit' },
            { label: 'Workshop', href: '/product/workshop' },
            { label: 'Token Launch', href: '/product/token-launch' },
          ],
        },
        {
          heading: 'Tools',
          links: [
            { label: 'Calculator', href: '/product/calculator' },
            { label: 'Vesting Benchmarks', href: '/learn/token-vesting-benchmarks' },
            { label: 'Tokenomics AI', href: '/product/tokenomics-ai' },
          ],
        },
      ],
    },
    {
      id: 'assets',
      label: 'Digital Assets',
      intro: {
        href: '/product/digital-assets',
        title: 'Start with the business case',
        text: 'From strategy to implementation: turn real-world assets and financial instruments into digital products.',
        more: 'Explore Digital Assets',
      },
      columns: [
        {
          heading: 'Services',
          links: [{ label: 'Digital Assets Strategy', href: '/product/digital-assets' }],
        },
        {
          heading: 'Explore & Assess',
          links: [
            { label: 'Tokenization Readiness', href: '/product/tokenization-readiness' },
            { label: 'Tokenization Use Cases', href: '/product/tokenization-cases' },
          ],
        },
      ],
    },
    {
      id: 'media',
      label: 'Media',
      intro: {
        href: '/cases',
        title: 'Our work and insights',
        text: 'In-depth cases, audits, research and editorial insights from our team.',
        more: 'Explore Media',
      },
      columns: [
        {
          heading: 'Our work',
          links: [
            { label: 'Client Cases', href: '/cases' },
            { label: 'Public Audits', href: '/audits' },
          ],
        },
        {
          heading: 'Knowledge',
          links: [
            { label: 'Research', href: '/research' },
            { label: 'Blog', href: '/blog' },
          ],
        },
      ],
    },
    {
      id: 'company',
      label: 'Company',
      intro: {
        href: '/about',
        title: 'Meet 8Blocks',
        text: 'Meet the team, our approach and what drives 8Blocks.',
        more: 'About 8Blocks',
      },
      columns: [
        {
          heading: 'About 8Blocks',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Our Methodology', href: '/methodology' },
            { label: 'Events', href: '/events' },
            { label: 'Press', href: '/press' },
          ],
        },
      ],
    },
  ],
  footer: {
    subscribe: 'Subscribe',
    subscribeNote: 'A newsletter for those\nwho want to go deeper.',
    newsletter: {
      placeholder: 'Your email',
      submit: 'Subscribe',
      success: 'You’re subscribed. We’ll be in touch.',
      error: 'Failed to subscribe',
    },
    office: 'Office',
    mapTitle: '8BLOCKS FZCO on the map',
    mapEmbedSrc: 'https://www.google.com/maps?q=8BLOCKS+FZCO&ll=25.0607775%2C55.1412167&hl=en&z=15&output=embed',
    rights: 'All rights reserved.',
    legal: [
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
}
