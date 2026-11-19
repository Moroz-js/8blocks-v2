// About page (project 2 «About»). SEO texts stay in aboutPage.ts → aboutMeta.

export const about = {
  hero: {
    title: "Digital asset strategy\nfor businesses that don't\nhave time to get it wrong",
    description:
      '8Blocks designs the financial and strategic architecture behind digital assets for companies that treat this as a capital-allocation decision, not an experiment. We have been building token economies and onchain strategy since 2017 for teams that answer to investors, boards, and shareholders.',
    primary: { label: 'Talk to the team', href: '/contact' },
    secondary: { label: 'What we do', href: '#areas' },
  },
  statement: {
    muted: 'Most of the market\ntreats a token as a fundraising event.',
    bright: 'We treat it as a financial instrument.',
  },
  principles: [
    {
      title: 'A token has to work inside a real business, the way any other financial instrument would',
      text: 'That is why established companies, RWA and finance projects, and family offices bring us in before they bring in anyone else.',
    },
    {
      title: 'We are not here to help you launch a token',
      text: 'We are here to tell you, with the rigor you would expect from a financial advisor, whether a token is the right structure for what you are building — and, if it is, how to build it for investors, regulators, and the market.',
    },
    {
      title: 'The work starts with the business, not the whitepaper.',
      text: 'We look at the balance sheet, capital structure, and growth model before deciding whether a digital asset belongs in that picture.',
    },
    {
      title: 'About a third of our first conversations end with us recommending against a token',
      text: 'We have turned down work that would have paid us well and damaged the client. That honesty is why the rest trust us.',
    },
  ],
  areas: {
    title: 'Four areas. Most engagements touch more than one.',
    items: [
      {
        title: 'Digital Asset Strategy & Market Entry',
        text: 'We determine whether a digital asset makes sense for your business and, if it does, what form it should take. This strategic layer needs to be right before anything else is built.',
        links: [{ label: 'Asset Tokenization', href: '/product/digital-assets' }],
      },
      {
        title: 'RWA Structuring & Tokenization',
        text: 'We turn illiquid assets — from real estate and commodities to receivables and funds — into structured instruments. RWA tokenization requires legal and jurisdictional structuring, not just a token contract.',
        links: [{ label: 'See RWA cases', href: '/cases' }],
      },
      {
        title: 'Treasury & Digital Asset Allocation',
        text: 'For corporates and family offices evaluating digital assets in a broader portfolio, we build allocation, custody, and risk-exposure frameworks grounded in financial modelling, not market sentiment.',
        links: [{ label: 'Talk to us', href: '/contact' }],
      },
      {
        title: 'Token Economy Design & Audits',
        text: 'Where a token is the right answer, we build the full economic model: supply, incentives, vesting, and mechanisms tied to real usage. We also audit existing models to find what is broken and confirm what is strong.',
        links: [
          { label: 'Tokenomics', href: '/services/tokenomics' },
          { label: 'Audit', href: '/services/audit' },
        ],
      },
    ],
  },
  clients: {
    title: 'Three kinds of clients. Increasingly, the same client at different stages.',
    text: 'What unites them is not the sector. It is that they are accountable to someone: a board, an investment committee, or a shareholder base. They need a partner who understands that a digital asset strategy has to survive that scrutiny.',
    items: [
      {
        title: 'Established businesses',
        text: 'Web2 companies, RWA platforms, financial institutions, and asset managers evaluating whether digital assets belong in their strategy and how to move without unnecessary risk.',
      },
      {
        title: 'Family offices and treasuries',
        text: 'Assessing digital asset allocation as part of a diversified portfolio, with custody and risk frameworks that hold up in front of an investment committee.',
      },
      {
        title: 'Web3-native teams',
        text: 'The projects we have supported since 2017, many of whom are now our longest-standing relationships.',
      },
    ],
  },
  track: {
    title: 'The market matured. So did we.',
    text: '8Blocks was founded in 2017, when token economy design was still a niche discipline inside crypto. We built our practice through multiple market cycles, shifting regulatory regimes, and a steady stream of projects that got the fundamentals wrong before they came to us. Today, our approach looks less like a crypto shop and more like a strategy firm that specializes in digital assets.',
    action: { label: 'See our cases →', href: '/cases' },
    stats: [
      { value: '$180M+', label: 'raised by clients before TGE' },
      { value: '9 years', label: 'building token economies' },
      { value: '30+', label: 'partners across exchanges, market making, security, and media' },
    ],
    offices: 'Offices in Zug, Dubai, and Berlin. Clients across Europe, the US, and MENA.',
  },
  ways: {
    title: 'Like a financial advisory firm,\nnot a crypto agency',
    description: 'And we stay involved past the point most consultancies exit. Strategy that is not implemented is just a document.',
    items: [
      { title: 'Diligence first', text: 'Every engagement starts with the business itself, before any model gets built.' },
      {
        title: 'Built for scrutiny',
        text: 'Deliverables are prepared to withstand investor and regulatory review, alongside vetted legal partners.',
      },
      {
        title: 'Vetted partners only',
        text: 'Market making, security, smart contracts, listings: every partner is selected against our standards, not referral fees.',
      },
    ],
  },
  proof: {
    title: 'Most of our work is under NDA.\nSo we prove our expertise in public.',
    description:
      'The models we build belong to our clients, so we cannot show them. Confidentiality is part of the service, and we are comfortable staying invisible in our clients’ success. We publish public audits, research, and articles that show exactly how we reason. Judge for yourself.',
    items: [
      {
        title: 'Public Audits',
        text: 'Reviews of live token economies with a rating, risks, and fixes. Actual analysis, published in full.',
        action: { label: 'Browse public audits →', href: '/audits' },
      },
      {
        title: 'Research',
        text: 'Studies of token models, incentives, and market behaviour. Data and mechanics, not narratives.',
        action: { label: 'Read the research →', href: '/research' },
      },
      {
        title: 'Blog',
        text: 'Articles on token economics: from audit methodology to breakdowns of why tokens underperform their protocols.',
        action: { label: 'Read the blog →', href: '/blog' },
      },
    ],
  },
  clutch: {
    alt: 'Clutch 5.0/5.0',
    text: 'When clients can speak publicly, they do.',
    action: { label: 'Verified 5.0 rating on Clutch →', href: 'https://clutch.co/profile/8blocks-fzco' },
  },
  cta: {
    title: 'Let’s talk about your situation',
    description:
      'Evaluating whether digital assets fit your business, structuring a real-world asset, or reviewing a token model that is not working? We will look at the specifics before telling you what we think you should do.',
    action: { label: 'Get in touch', href: '/contact' },
  },
}
