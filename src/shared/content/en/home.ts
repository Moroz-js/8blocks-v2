// Home page (project 2 «Home»). SEO texts stay in homePage.ts → homeMeta.

export const home = {
  hero: {
    title: 'Independent economists for tokens and tokenized assets',
    description:
      'We design, stress-test, and audit token economies for Web3 projects and asset owners, from the first model to post-launch.',
    action: { label: 'Get in touch', href: '/contact' },
  },
  tags: ['Strategic consulting', 'Tokenomics', 'Tokenomics audit', 'Token economy', 'Web3', 'RWA', 'DeFi', 'GameFi'],
  services: {
    title: 'Economics behind every token',
    more: 'Learn more',
    items: [
      {
        title: 'Tokenomics',
        description: 'We design token economies, stress-test them against real market behavior, and audit live tokens.',
        href: '/services/tokenomics',
        shape: 'coinfront',
      },
      {
        title: 'Asset Tokenization',
        description: 'We take real assets and cash flows from deal structure to tokenized launch, with the right partners at every step.',
        href: '/product/digital-assets',
        shape: 'housecube',
      },
    ],
  },
  about: {
    title: 'Our job is to make the economics work before anything goes onchain',
    stats: [
      { value: '$180M+', label: 'raised by clients before TGE' },
      { value: '9 years', label: 'building token economies' },
      { value: '30+', label: 'partners across exchanges, market making, security, and media' },
    ],
    offices: 'Offices in Zug, Dubai, and Berlin. Clients across Europe, the US, and MENA.',
  },
  partnersLabel: 'Partners',
  why: {
    title: 'Structure and economics, whatever goes onchain',
    items: [
      {
        lead: 'A structure built around the deal.',
        text: 'Token type, entity, jurisdiction, and payout terms follow the asset and its cash flow.',
      },
      {
        lead: 'The right partners for each deal.',
        text: 'We match registrars, platforms, and custody providers to the structure, jurisdiction, and investors.',
      },
      {
        lead: 'Real value behind every token.',
        text: 'Usage, revenue, or cash flow backs the price, so value rests on how the business performs.',
      },
      {
        lead: 'Stress-tested, then supported.',
        text: 'Every model meets selling pressure and low liquidity before launch, and payouts and reporting keep running after it.',
      },
    ],
  },
  blog: {
    title: 'Blog on token economics',
    all: { label: 'All articles', href: '/blog' },
  },
  cta: {
    title: 'Building a token or tokenizing an asset?',
    description: 'Tell us where you are and we’ll suggest the first step.',
    action: { label: 'Get in touch', href: '/contact' },
  },
}
