// All homepage content — single source of truth (per 15-content-plan.md)
// Edit text here; never scatter copy across components

export const heroContent = {
  label: 'Token economy',
  headlineLine1: 'Token economies',
  headlineLine2: 'that power',
  headlineLine3: 'the business',
  description:
    'We help businesses turn tokens from one-time fundraising tools into working economic instruments. Tokens are embedded into products and operations, so usage and demand drive lasting value, not speculation.',
  serviceLinks: [
    { label: 'Strategic consulting', href: '#services' },
    { label: 'Tokenomics', href: '#services' },
    { label: 'Tokenomics audit', href: '#services' },
  ],
  cta: {
    label: 'Talk to the team',
    href: '/contact',
  },
} as const

export const servicesPageContent = {
  hero: {
    label: 'Services',
    headline: 'Strategy, tokenomics, and audits\nfor Web3 and Web2 projects',
    description:
      'We step in at the key moments: when you need to build a model from scratch, review an existing token economy, or shape the path from idea to listing',
    ctaLabel: 'Discuss your case',
    ctaHref: '/contact',
  },
  transition: {
    headline: 'Not every project needs tokenomics development right away',
    description:
      'Sometimes the right next step is an audit of an existing model. Sometimes it’s a new one. And sometimes you first need to figure out what role a token should play in the business at all.',
  },
} as const

export const servicesContent = {
  label: 'Services',
  headline: 'How we design and fix broken economics',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Strategic consulting',
      description:
        'We design the economic strategy behind the system. This includes defining token logic, incentives, and partner structure for Web3 projects and businesses entering tokenized ecosystems.',
      accentColor: 'purple',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Tokenomics',
      description:
        'A foundational token economics model covering supply, emission, and distribution, built to keep the system stable from day one.',
      accentColor: 'green',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Tokenomics audit',
      description:
        'A full assessment of an existing token economy, identifying structural risks, broken incentive loops, and scaling bottlenecks.',
      accentColor: 'blue',
    },
  ],
} as const

export const servicesShowcaseContent = {
  headline: 'Where we come in',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Strategic consulting',
      description:
        'When tokenomics alone is not enough, and the project needs a full strategy, from product logic and economic design to TGE preparation and go-to-market planning.',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Tokenomics',
      description:
        'A full token model built around the product, demand, and growth logic.',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Tokenomics audit',
      description:
        'A deep review of an existing model to pressure-test it, uncover weak spots, and validate it before the next step.',
    },
  ],
} as const

export const aboutContent = {
  label: 'About',
  attribution: '8Blocks Team',
  quote:
    'A token should generate value for the project over its entire lifetime. And that only happens when you clearly understand why it exists and who needs it.',
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
    { name: 'Lodes.tech', logo: '/partners/4.svg', href: 'https://lodestech.ru' },
    { name: 'Partner 5', logo: '/partners/5.svg' },
    { name: 'Partner 6', logo: '/partners/6.svg' },
    { name: 'Fibonacci', logo: '/partners/7.svg', href: 'https://fibonacci.market/' },
    { name: 'Partner 8', logo: '/partners/8.svg' },
    { name: 'Partner 9', logo: '/partners/9.svg' },
    { name: 'Partner 11', logo: '/partners/11.svg' },
    { name: 'Partner 12', logo: '/partners/12.svg' },
    { name: 'D&A', logo: '/partners/13.svg', href: 'https://dna.partners/' },
    { name: 'Partner 14', logo: '/partners/14.svg' },
    { name: 'Listing Help', logo: '/partners/15.svg', href: 'https://listing.help/' },
    { name: 'Cicada', logo: '/partners/16.svg', href: 'https://www.cicada-mm.com/' },
    { name: 'Anogem', logo: '/partners/17.svg', href: 'https://anogem.io' },
  ],
} as const

export const benefitsContent = {
  ariaLabel: 'Why 8Blocks',
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
    { photo: '/team/team-1.png' },
    { photo: '/team/team-2.png' },
    { photo: '/team/team-3.png' },
    { photo: '/team/team-4.png' },
    { photo: '/team/team-5.png' },
  ],
} as const

export const tokenEconomyContent = {
  headline: "We don't tack a token onto a business.\nWe build it into the economy",
  accentWords: ['tack', 'build'],
  description:
    'A strong model makes the token part of the system. It strengthens the economics of the project, drives user engagement, and answers one question: why does this business need a token in the first place?',
  cards: [
    {
      title: "Revenue shouldn't end with the token sale",
      description:
        'A strong model creates a cycle of usage, accumulation, and recurring demand',
    },
    {
      title: "Loyalty shouldn't be cheap",
      description:
        'We design mechanics that deepen the user experience instead of falling back on basic discounting',
    },
    {
      title: "If the model takes too long to explain, it's already losing",
      description:
        'An investor should understand right away what the token does for the business and where its value comes from',
    },
    {
      title: 'Working in token economies since 2017',
      description:
        'Over that time, we have studied thousands of models and built dozens ourselves',
    },
    {
      title: 'Grounded in traditional finance',
      description:
        'That background helps us move quickly through complex business models and find solutions that strengthen the economics instead of complicating them',
    },
  ],
} as const

export const tokenFilterContent = {
  headline: 'Not every token should exist',
  subtitle: 'And not every model should make it to market',
  ctaLabel: 'Discuss your case',
  ctaHref: '/contact',
} as const

export const tokenomicsTestContent = {
  headline: 'Pressure-test your tokenomics',
  description:
    'In our mini app, you can quickly build a basic model, set up vesting, review unlock schedules, and spot the first risks in your tokenomics.',
  cards: [
    {
      title: 'Base model',
      description:
        'Enter token supply, price, circulating supply, and allocations to get a quick read on the overall structure of your tokenomics',
    },
    {
      title: 'Vesting and unlocks',
      description:
        "Set unlock schedules for each pool, review the unlock chart, spot possible spikes, and assess the model's overall condition",
    },
    {
      title: 'Final score',
      description:
        'Get a model snapshot with a short summary of tokenomics quality and key risk areas',
    },
    {
      title: 'Daily practice',
      description:
        'Come back to the app every day, answer short questions, and build a stronger understanding of tokenomics step by step',
    },
  ],
  ctaLabel: 'Open the app',
  ctaHref: 'https://8blocks-token-lab.vercel.app/calculator',
} as const

export const servicesFaqContent = {
  headline: 'FAQ',
  items: [
    {
      question: 'How do we know which service is right for us?',
      answer:
        'It depends on where you are in the process and what the real task is. If you already have a model but there are questions around it, an audit is usually the right place to start. If the tokenomics need to be built from scratch, that is a tokenomics engagement. If the scope is broader and includes strategy, TGE preparation, investor readiness, and go-to-market planning, then strategic consulting makes more sense. If you are unsure, that is exactly what the consultation is for.',
    },
    {
      question: 'Can we come to you with an existing model?',
      answer:
        "Absolutely. We often step into projects that already have tokenomics, a white paper, spreadsheets with calculations, or other working materials. In those cases, we don't start from scratch for no reason. We look at what can be kept, what needs refining, and what makes more sense to rebuild.",
    },
    {
      question: 'Do you only work with Web3 projects?',
      answer:
        'No. We work not only with Web3 projects, but also with Web2 teams that already have a live business or product and want to enter Web3 through token economics.',
    },
    {
      question: 'Can we start with an audit and then move into development or strategy?',
      answer:
        'Yes, that is a very common path. An audit often shows whether the model only needs a few targeted fixes or whether the project is already at the point where it needs a deeper tokenomics rebuild or broader strategic work.',
    },
    {
      question: 'What does the first conversation with you look like?',
      answer:
        'We usually start with a short call to understand your project, the task in front of you, and the broader context. Even at that stage, it is usually clear which format makes sense, how deep the work needs to go, and what the next step should be.',
    },
    {
      question: 'What should we prepare before the first call?',
      answer:
        'Anything you already have: presentations, a white paper, a tokenomics deck, Excel files, a roadmap, a product overview, current calculations, or simply a clear description of the task. Even if the materials are still limited, that is usually enough to have a focused conversation.',
    },
    {
      question: "Does it still make sense to come to you if we don't have the full picture yet?",
      answer:
        'Yes. The earlier we get involved, the lower the risk of making costly mistakes at the start. Quite often, teams come to us not with a full set of materials, but with a short, still unstructured idea and no detailed write-up yet. In those cases, we help clarify what is missing, where the weak spots are, and what the right starting point should be.',
    },
    {
      question: 'Can we come just for a consultation, without committing to a larger engagement right away?',
      answer:
        'Yes. If what you need first is an outside perspective and an honest read on the situation, a consultation is a good place to start. Sometimes it makes the next step obvious. Sometimes it shows that the project is not ready for a larger engagement yet.',
    },
    {
      question: 'Do you only get involved at the start of a project, or later as well?',
      answer:
        'Later as well. We work with projects at very different stages: when the token is still just being discussed, when the model is already in place, when the team is preparing for a token sale, or when it becomes clear that the current economics need to be revisited.',
    },
    {
      question: 'Can you simply tell us whether our model is strong or not?',
      answer:
        'We can, but that question almost always calls for a deeper review. For us, it is not just about giving a general verdict. It is about understanding what actually makes the model strong, where the risks are built in, and how confidently you can rely on it going forward.',
    },
    {
      question: 'How are you different from teams that just produce a tokenomics document?',
      answer:
        "We don't look at the token as a standalone model component. We look at it as part of the business economy. That is why we care about more than tables, charts, and allocations. What matters to us is how the token fits into the product, demand, user experience, investment logic, and the project's growth.",
    },
  ],
} as const

export const ctaContent = {
  label: 'Next step',
  headline: 'If the token has no purpose, the project has no future',
  body: "We define the token's role and connect it directly to revenue and operations.",
  cta: {
    label: 'Talk to the team',
    href: '/contact',
  },
} as const

export const homeMeta = {
  title: '8Blocks — Token economies that power the business',
  description:
    'We turn tokens from one-time fundraising tools into real economic mechanics embedded in product and operations.',
  ogTitle: '8Blocks — Token economies that power the business',
  ogDescription:
    'Strategic consulting, tokenomics design, and technical expertise for Web3 projects.',
} as const

export const servicesMeta = {
  title: 'Services',
  description:
    'Strategic consulting, tokenomics design and audit. We help Web3 projects build and fix working token economies.',
  ogDescription: 'Strategic consulting, tokenomics design, and audits.',
} as const

export const heroMarqueeItems = [
  'Strategic consulting',
  'Tokenomics',
  'Tokenomics audit',
  'Token economy',
  'RWA',
] as const

export const tokenomicsTestScreens = [
  {
    src: '/img/miniapp-1.png',
    alt: 'Token Lab — base model',
    title: 'Base model',
    description:
      'Enter token supply, price, circulating supply, and allocations to get a quick read on the overall structure of your tokenomics',
  },
  {
    src: '/img/miniapp-3.png',
    alt: 'Vesting and unlocks',
    title: 'Vesting and unlocks',
    description:
      "Set unlock schedules for each pool, review the unlock chart, spot possible spikes, and assess the model's overall condition",
  },
  {
    src: '/img/miniapp-4.png',
    alt: 'Final score',
    title: 'Final score',
    description:
      'Get a model snapshot with a short summary of tokenomics quality and key risk areas',
  },
  {
    src: '/img/miniapp-2.png',
    alt: 'Daily practice',
    title: 'Daily practice',
    description:
      'Come back to the app every day, answer short questions, and build a stronger understanding of tokenomics step by step',
  },
] as const

export const tokenomicsTestAriaLabel = 'Tokenomics test' as const
