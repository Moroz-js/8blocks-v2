// Tokenomics service page — single source of truth

const enObject = {
  hero: {
    label: 'Tokenomics',
    headline: 'Tokenomics',
    description:
      'We design token models for projects that need to connect business logic, user behavior, and technical systems into one coherent framework',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Why most token models fail after launch',
    description:
      "Because a polished diagram in a white paper doesn't mean the token will create value, sustain demand, or support the project's economics",
    items: [
      {
        title: 'The token is disconnected from\nthe product',
        description: 'It creates no real value\ninside the ecosystem',
      },
      {
        title: 'Demand has no mechanism\nbehind it',
        description: 'People buy the product,\nthen sell the token',
      },
      {
        title: 'Fast distribution\nkills the token',
        description: "Investors won't wait forever",
      },
      {
        title: "Giving out the token\nisn't enough",
        description: "It's not clear why anyone\nshould buy it",
      },
    ],
  },
  solution: {
    headline:
      "We don't design a token. We design the project's economic architecture",
    description:
      'We work on tokenomics at the level of product logic, user journeys, treasury, financial flows, and technical systems, so the model is built into the real economics of the project.',
    variant: 'tokenomics' as const,
    items: [
      {
        id: 'deep-dive',
        label: 'We go deep into the product',
        description:
          "We look beyond the token itself to understand the project's business logic, user roles, and usage scenarios",
      },
      {
        id: 'flows',
        label: 'We design flows across the ecosystem',
        description:
          'We map how the token moves across products, users, pools, and treasury',
      },
      {
        id: 'finance-tech',
        label: 'We account for financial and technical systems',
        description:
          'We connect tokenomics to on-chain and off-chain logic, liquidity, and the internal rules the system runs on',
      },
      {
        id: 'adaptive',
        label: 'We build for change',
        description:
          'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
      },
    ],
  },
  deliverables: {
    label: 'What goes into your tokenomics',
    headline:
      'This is not just a document. It is a working economic model built to support token sales, fundraising, strategic partnerships, and the long-term growth of the project',
    items: [
      {
        title: 'Optimal supply',
        description:
          'We define the total token supply and choose the right issuance model, whether fixed or uncapped',
      },
      {
        title: 'Issuance mechanics',
        description:
          'We determine how the token enters the system, whether through mining, purchase flows, or algorithmic distribution',
      },
      {
        title: 'Allocation structure',
        description:
          'We map out how tokens are distributed across sales, rewards, incentives, and other parts of the ecosystem',
      },
      {
        title: 'Pools, lockups, and vesting',
        description:
          'We break tokens into pools, set lockup periods, and design vesting schedules for different participant groups',
      },
      {
        title: 'Closed-loop ecosystem',
        description:
          'We design how tokens are used, accumulated in internal funds, redistributed, and brought back into circulation',
      },
      {
        title: 'Treasury, reserves, and hedging',
        description:
          'We build in mechanisms to protect the model from manipulation, large sell-offs, and scenarios that can quickly crush the price',
      },
      {
        title: 'Financial and utility mechanics',
        description:
          'We develop credit pools, derivatives, deflationary mechanics, as well as NFTs, services, and subscriptions that shift value toward the ecosystem',
      },
      {
        title: 'White paper visuals',
        description:
          'We prepare diagrams, charts, and tables that help translate the tokenomics into clear project documentation',
      },
    ],
  },
  process: {
    headline: 'How we work',
    steps: [
      {
        number: 1,
        title: 'We dive into the project',
        description:
          "We review the materials, goals, and context to understand the project's challenges and product logic",
      },
      {
        number: 2,
        title: 'We benchmark the market',
        description:
          'We analyze competing token models, compare approaches, and identify the strongest solutions',
      },
      {
        number: 3,
        title: 'We work closely with the team',
        description:
          'We run working sessions to capture product nuance and build a stronger model together',
      },
      {
        number: 4,
        title: 'We define how\nthe token is used',
        description:
          'We shape the utility mechanics, holder rights, and vesting structure inside the ecosystem',
      },
      {
        number: 5,
        title: 'We design the ecosystem\naround it',
        description:
          'We connect the token to the product, interfaces, and technical logic of the project',
      },
      {
        number: 6,
        title: 'We map token flows',
        description:
          'We build token flow scenarios across every part of the ecosystem',
      },
      {
        number: 7,
        title: 'We plan the sale structure',
        description:
          'We define the number of rounds, sale format, timing, and target ticket size',
      },
      {
        number: 8,
        title: 'We adapt the model as new mechanics appear',
        description:
          'We test new functions and adjust the model as the project evolves',
      },
      {
        number: 9,
        title: 'We finalize and defend the model',
        description:
          'We package the final tokenomics, prepare the presentation, and walk your team through the reasoning behind it',
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'Can we come to you with an existing tokenomics draft?',
        answer:
          "Yes. If you already have calculations, a white paper, a product deck, or a draft model, we don't start from scratch for no reason. We first look at what can be used, what needs refinement, and what makes more sense to rebuild so the final model works as one coherent system.",
      },
      {
        question: 'When do we need an audit instead of tokenomics development?',
        answer:
          "If you already have a model and the goal is to test it for mistakes, risks, and weak spots, then you need an audit. If the model is still taking shape, doesn't answer the core questions, or needs a deeper rebuild, then it makes more sense to go into full tokenomics development.",
      },
      {
        question: 'What do you need from us at the start?',
        answer:
          "Anything you already have on the project: a white paper, product deck, roadmap, token or NFT description, round data, team allocation structure, and any other working materials. Even if some of it isn't finalized yet, that's usually enough to get started.",
      },
      {
        question: 'Do you only work with utility tokens, or with NFTs as well?',
        answer:
          "Not just utility tokens. We also work with NFT models and more complex hybrid structures, as long as the asset is built into the product's economics and plays a real role in how the ecosystem works.",
      },
      {
        question: 'Does the engagement include token sale logic?',
        answer:
          "Yes. We work through the number of rounds, their structure, timing, and target check size so the model isn't built in isolation from the sale logic or the project's path to market.",
      },
      {
        question: 'Is modeling included in the scope of work?',
        answer:
          'No. Modeling is a separate service. It can be done in two formats: software-based Monte Carlo modeling in Python, or visual modeling in Machinations.',
      },
      {
        question: "What isn't included in tokenomics development?",
        answer:
          "This format doesn't include legal work, smart contract development, marketing production, or technical implementation by outside contractors. But if needed, we can bring in additional sessions with lawyers, market makers, and other specialized experts to go deeper on specific parts of the model.",
      },
      {
        question: 'How long does the work usually take?',
        answer:
          'Tokenomics development usually takes between 3 and 7 weeks. The exact timing depends on the amount of material available, the complexity of the model, how quickly the team communicates, and how deep the work needs to go.',
      },
      {
        question: 'Can the process be accelerated if timing is critical?',
        answer:
          'Yes, in some cases that can be discussed. The pace depends on how quickly the team provides input, signs off on decisions, and moves through each stage with us.',
      },
      {
        question: 'Can the tokenomics be updated later if the product changes?',
        answer:
          'Yes. If new mechanics, use cases, or additional products appear, the model can be adapted and expanded over time. That matters especially for projects where the economics need to evolve alongside the product.',
      },
      {
        question: 'What exactly will we get at the end?',
        answer:
          "You won't just get a token description. You'll get a full economic model built to support the token sale, fundraising, strategic partnerships, and the long-term growth of the ecosystem. It includes the core parameters around supply, issuance, allocation, vesting, treasury, protective mechanisms, and visuals for the white paper.",
      },
    ],
  },
  cta: {
    headline:
      "Sometimes a token doesn't need a bear market to die\nBad tokenomics will do the job just fine",
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
} as const

export const tokenomicsContent = enObject

export const tokenomicsMeta = {
  title: 'Tokenomics',
  description:
    'Token economy model: emission, distribution, and vesting — built to keep the system stable from day one.',
  ogTitle: 'Tokenomics | 8Blocks',
  ogDescription:
    'Token economy model: emission, distribution, and vesting — built to keep the system stable from day one.',
  twitterTitle: 'Tokenomics | 8Blocks',
  twitterDescription: 'Token economy model: emission, allocation, and vesting.',
} as const

export const tokenomicsCompositionContent = {
  ariaLabel: 'Tokenomics structure',
  items: [
    {
      title: 'Optimal supply',
      description:
        'We define the total token supply and choose the right issuance model, whether fixed or uncapped',
    },
    {
      title: 'Issuance mechanics',
      description:
        'We determine how the token enters the system, whether through mining, purchase flows, or algorithmic distribution',
    },
    {
      title: 'Allocation structure',
      description:
        'We map out how tokens are distributed across sales, rewards, incentives, and other parts of the ecosystem',
    },
    {
      title: 'Pools, lockups, and vesting',
      description:
        'We break tokens into pools, set lockup periods, and design vesting schedules for different participant groups',
    },
    {
      title: 'Closed-loop ecosystem',
      description:
        'We design how tokens are used, accumulated in internal funds, redistributed, and brought back into circulation',
    },
    {
      title: 'Treasury, reserves, and hedging',
      description:
        'We build in mechanisms to protect the model from manipulation, large sell-offs, and scenarios that can quickly crush the price',
    },
    {
      title: 'Financial and utility mechanics',
      description:
        'We develop credit pools, derivatives, deflationary mechanics, as well as NFTs, services, and subscriptions that shift value toward the ecosystem',
    },
    {
      title: 'White paper visuals',
      description:
        'We prepare diagrams, charts, and tables that help translate the tokenomics into clear project documentation',
    },
  ],
} as const

export const tokenomicsProcessContent = {
  ariaLabel: 'Work process',
  steps: [
    {
      num: '01',
      title: 'We dive into the project',
      description:
        "We review the materials, goals, and context to understand the project's challenges and product logic",
    },
    {
      num: '02',
      title: 'We benchmark the market',
      description:
        'We analyze competing token models, compare approaches, and identify the strongest solutions',
    },
    {
      num: '03',
      title: 'We work closely with the team',
      description:
        'We run working sessions to capture product nuance and build a stronger model together',
    },
    {
      num: '04',
      title: 'We define how\nthe token is used',
      description:
        'We shape the utility mechanics, holder rights, and vesting structure inside the ecosystem',
    },
    {
      num: '05',
      title: 'We design the ecosystem\naround it',
      description:
        'We connect the token to the product, interfaces, and technical logic of the project',
    },
    {
      num: '06',
      title: 'We map token flows',
      description: 'We build token flow scenarios across every part of the ecosystem',
    },
    {
      num: '07',
      title: 'We plan the sale structure',
      description:
        'We define the number of rounds, sale format, timing, and target ticket size',
    },
    {
      num: '08',
      title: 'We adapt the model as new mechanics appear',
      description:
        'We test new functions and adjust the model as the project evolves',
    },
    {
      num: '09',
      title: 'We finalize and defend the model',
      description:
        'We package the final tokenomics, prepare the presentation, and walk your team through the reasoning behind it',
    },
  ],
} as const
