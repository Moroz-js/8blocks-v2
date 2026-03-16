// All homepage content — single source of truth (per 15-content-plan.md)
// Edit text here; never scatter copy across components

export const heroContent = {
  label: 'Tokenomics',
  headlineLine1: 'Token economies',
  headlineLine2: 'that power',
  headlineLine3: 'the business',
  description:
    'We help businesses turn tokens from one-time fundraising tools into working economic instruments. Tokens are embedded into products and operations, so usage and demand drive lasting value, not speculation.',
  serviceLinks: [
    { label: 'Strategic consulting', href: '#services' },
    { label: 'Tokenomics', href: '#services' },
    { label: 'Audit', href: '#services' },
  ],
  cta: {
    label: 'Talk to the team',
    href: '#contact',
  },
} as const

export const servicesContent = {
  label: 'Services',
  headline: 'How we design\nand fix broken economics',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Strategic consulting',
      description: 'We design the economic strategy behind the system. This includes defining token logic, incentives, and partner structure for Web3 projects and businesses entering tokenized ecosystems.',
      accentColor: 'purple',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Basic tokenomics',
      description: 'A foundational token economics model covering supply, emission, and distribution, built to keep the system stable from day one.',
      accentColor: 'green',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Tokenomics audit',
      description: 'A full assessment of an existing token economy, identifying structural risks, broken incentive loops, and scaling bottlenecks.',
      accentColor: 'blue',
    },
  ],
} as const

export const aboutContent = {
  label: 'About',
  attribution: '8Blocks Team',
  quote:
    '"A token should generate value for the project over its entire lifetime. And that only happens when you clearly understand why it exists and who needs it."',
  stats: [
    { value: '20+', label: 'token economies designed for products across multiple industries' },
    { value: '$500M+', label: 'combined capitalization of client projects' },
    { value: '6 weeks', label: 'average time to design a complete token economy model' },
    { value: '12', label: 'backed projects built on our economic models' },
  ],
} as const

export const partnersContent = {
  label: 'Partners',
  headline: 'Our partners',
  partners: [
    { name: 'Partner 1', logo: '/partners/1.svg' },
    { name: 'Partner 2', logo: '/partners/2.svg' },
    { name: 'Partner 3', logo: '/partners/3.svg' },
    { name: 'Partner 4', logo: '/partners/4.svg' },
    { name: 'Partner 5', logo: '/partners/5.svg' },
    { name: 'Partner 6', logo: '/partners/6.svg' },
    { name: 'Partner 7', logo: '/partners/7.svg' },
    { name: 'Partner 8', logo: '/partners/8.svg' },
    { name: 'Partner 9', logo: '/partners/9.svg' },
    { name: 'Partner 11', logo: '/partners/11.svg' },
    { name: 'Partner 12', logo: '/partners/12.svg' },
    { name: 'Partner 13', logo: '/partners/13.svg' },
    { name: 'Partner 14', logo: '/partners/14.svg' },
    { name: 'Partner 15', logo: '/partners/15.svg' },
    { name: 'Partner 16', logo: '/partners/16.svg' },
    { name: 'Partner 17', logo: '/partners/17.svg' },
  ],
} as const

export const benefitsContent = {
  label: 'Why 8Blocks',
  headlinePart1: 'When a business grows,',
  headlinePart2: "the token doesn't always follow.",
  headlinePart3: 'So we design economies\nwhere it has to.',
  items: [
    {
      id: 'business-tied',
      title: 'Business-linked economics',
      description:
        'Token value is structurally tied to usage, not market sentiment. When the business grows, demand has no choice but to follow.',
    },
    {
      id: 'usage-demand',
      title: 'Usage-driven demand',
      description:
        "Tokens are required to access products, rights, or advantages. People hold them because they're needed, not because they're promised.",
    },
    {
      id: 'stress-tested',
      title: 'Stress-tested circulation',
      description:
        'Models are tested against real behavior: selling pressure, churn, low liquidity, growth spikes. Because markets never follow best-case scenarios.',
    },
    {
      id: 'growth-mechanics',
      title: 'Controlled growth mechanics',
      description:
        'Supply, incentives, and circulation scale with operations, without handing control to speculation or market cycles.',
    },
  ],
} as const

export const teamContent = {
  members: [
    {
      name: 'Team member 1',
      role: '8Blocks Team',
      photo: '/team/team-1.png',
    },
    {
      name: 'Team member 2',
      role: '8Blocks Team',
      photo: '/team/team-2.png',
    },
    {
      name: 'Team member 3',
      role: '8Blocks Team',
      photo: '/team/team-3.png',
    },
    {
      name: 'Team member 4',
      role: '8Blocks Team',
      photo: '/team/team-4.png',
    },
    {
      name: 'Team member 5',
      role: '8Blocks Team',
      photo: '/team/team-5.png',
    },
  ],
} as const

export const ctaContent = {
  label: 'Next step',
  headline: 'If the token has no purpose,\nthe project has no future.',
  body: "We define the token's role and connect it directly to revenue and operations.",
  cta: {
    label: 'Talk to the team',
    href: '#contact',
  },
} as const
