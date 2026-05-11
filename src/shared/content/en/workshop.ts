// Workshop product page — English content

const enObject = {
  hero: {
    label: 'Workshop',
    stat: '85% of tokens trade below their TGE price',
    statSource: 'Memento Research, State of 2025 Token Launches',
    statSourceUrl: 'https://mementoresearch.com/state-of-2025-token-launches-year-in-review',
    headline: 'Who needs your token?\nAnd why should anyone buy it?',
    description:
      'An interactive workshop with an individual scenario. Leave with concrete tokenomics concepts — not theory, but a foundation for real design.',
    price: '$2,500',
    duration: '1–3 hours',
    audience: 'full team',
    cta1Label: 'Book a workshop',
    cta1Href: '/contact',
    cta2Label: 'See what failure looks like',
    cta2Href: '#pain',
  },
  pain: {
    headline: 'Two people. One mistake.',
    description:
      'Tokenomics gets skipped — not because teams don\'t know about it — but because everyone assumes someone else already handled it.',
    personas: [
      {
        role: 'CEO / Co-founder',
        quote: '"Once we launch the token, investors will come on their own."',
        story:
          'The round is closed, the listing is agreed. But the question — why would anyone hold the token for more than two weeks — has no answer. Within a month of TGE, the dump begins. Investors lose confidence. The team blames the market.',
      },
      {
        role: 'CPO / Product Lead',
        quote: '"We\'ll integrate the token into the product later."',
        story:
          'The architecture is ready, users are there. Then it turns out the token doesn\'t fit into the product logic without rewriting half the mechanics. Two months of refactoring, a delayed TGE, and competitors move ahead.',
      },
    ],
    timeline: {
      headline: 'Typical trajectory without tokenomics work',
      stages: [
        {
          label: 'TGE + Listing',
          description: 'Hype, volume, price rise. The team thinks: "everything is working."',
        },
        {
          label: 'Week 2–3',
          description: 'No real demand-side. Early investors take profits. Price starts to fall.',
        },
        {
          label: 'Month 2',
          description:
            'Team is "working on utility." Community is waiting. Price at −70% from ATH.',
        },
        {
          label: 'Month 4+',
          description:
            'Retokenomics. A new round of consultants, lost time, and reputational damage.',
        },
      ],
    },
  },
  explainer: {
    headline: 'What is a tokenomics workshop',
    subtitle:
      'A structured session with your project team: in 1–3 hours you surface the key assumptions in your token design and shape 2–3 working concepts to build on.',
    cards: [
      {
        title: 'Where we focus',
        body: 'Not on building the full model end-to-end, but on the strategic foundation: why the token matters to the product, who creates demand, and how the token fits into product logic.',
      },
      {
        title: 'Who it is for',
        body: 'Teams planning a TGE in the next 3–6 months, and projects that have already seen a post-launch token drawdown and need a path to redesign the model.',
      },
      {
        title: 'Why it matters',
        body: 'In our experience, 95% of teams that skip this step come back to it within 2–4 months after TGE — when the cost of mistakes is higher: time is gone and community trust is damaged.',
      },
    ],
  },
  audience: {
    headline: 'Who is this for?',
    description: 'Teams before a token launch — or facing retokenomics',
    items: [
      '60–180 minutes · brainstorm format',
      '1–3 days from first call to workshop',
      'Individual scenario tailored to your product',
    ],
  },
  deliverables: {
    headline: 'Three concrete results',
    description:
      'Everything you need to move to full tokenomics design — or to make an informed decision not to.',
    items: [
      {
        title: 'Session recording',
        description: 'Rewatch and share with your team and investors at any time.',
      },
      {
        title: 'Insights document',
        description: 'What works for your model, what doesn\'t, and exactly why.',
      },
      {
        title: '2–3 tokenomics concepts',
        description: 'Described concepts ready to serve as the foundation for full design.',
      },
    ],
  },
  upsell: {
    headline: '$2,500 is credited toward the full project',
    description:
      'If you continue with full tokenomics design at 8Blocks, the workshop fee is deducted from the project cost. This is not an expense — it\'s a deposit.',
    ctaLabel: 'Learn about full tokenomics design',
    ctaHref: '/services/tokenomics',
  },
  process: {
    headline: 'Three steps to ready concepts',
    steps: [
      {
        number: 1,
        title: 'First call · 30 min, free',
        description:
          'You tell us about the product, the team, and your plans. We decide if the workshop is right for you — and if so, we schedule a date and send the invoice.',
      },
      {
        number: 2,
        title: 'Scenario prep · 1–2 days',
        description:
          'We study your product, market, and competitors. We build a custom scenario for your case — no templates.',
      },
      {
        number: 3,
        title: 'Workshop · 60–180 min',
        description:
          'Your team + our experts. We work through the scenario, surface assumptions, and form concepts. Afterwards: recording, insights, tokenomics concepts.',
      },
    ],
  },
  questions: {
    headline: '15 questions that change everything',
    description:
      'The real scenario is built for you — but these questions run through every case.',
    items: [
      'What is your product?',
      'Who is your user?',
      'Who else interacts with the product?',
      'Why does your project need a token?',
      'How does the token interact with the product?',
      'Will the token trade on an exchange?',
      'How will the token reach customers?',
      'How can customers use the token?',
      'What do customers get from using it?',
      'Who will create the most demand?',
      'What if customers don\'t come?',
      'What if people only sell the token?',
      'What happens when strong competitors appear?',
      'What if customers don\'t use the token?',
      'Why should anyone buy your token?',
    ],
    accentQuestion: 'Why should anyone buy your token?',
  },
  comparison: {
    headline: 'Workshop vs alternatives',
    columns: ['Workshop 8blocks', 'Full consulting', 'Template solutions', 'Self-managed'],
    rows: [
      {
        param: 'Timeline',
        workshop: '1–3 hours',
        consulting: '4–12 weeks',
        templates: 'Instant',
        solo: '1–6 months',
      },
      {
        param: 'Price',
        workshop: '$2,500',
        consulting: '$30,000–$150,000',
        templates: '$0–$5,000',
        solo: 'Team time',
      },
      {
        param: 'Customization',
        workshop: 'Full',
        consulting: 'Full',
        templates: 'Zero',
        solo: 'Full',
      },
      {
        param: 'Depth',
        workshop: 'Concepts',
        consulting: 'Full model',
        templates: 'Basic',
        solo: 'Varies',
      },
      {
        param: 'Risk of failure',
        workshop: 'Low',
        consulting: 'Minimal',
        templates: 'High',
        solo: 'Very high',
      },
      {
        param: 'Best for',
        workshop: 'Pre-TGE, retokenomics',
        consulting: 'Pre-TGE with budget',
        templates: 'Hackathons, MVP',
        solo: 'In-house expert',
      },
    ],
  },
  specialists: {
    headline: 'The experts behind every workshop',
    description:
      'Real practitioners who have designed token economies for DeFi, GameFi, RWA, and infrastructure projects across three continents.',
    items: [
      {
        name: 'Daniel Hartmann',
        role: 'Token Design Lead',
        tags: ['Token Design', 'DeFi', 'Mechanism Design'],
        bio: 'Over 7 years in crypto economics. Has led token model development for more than 30 projects, including multiple top-50 DeFi protocols. Regular speaker at Token2049, Consensus, and DMCC events.',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
      {
        name: 'Claire Bennett',
        role: 'Product Economics',
        tags: ['GameFi', 'Token Design', 'RWA'],
        bio: 'Former product lead at a $200M GameFi protocol. Specialises in integrating token mechanics into product loops and user journeys. Co-authored the 8Blocks tokenomics research methodology.',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
    ],
  },
  testimonial: {
    quote:
      '"Their suggestions were practical and actionable, not just theoretical observations."',
    date: 'Apr 28, 2026',
    dateIso: '2026-04-28',
    roleLead: 'Brand & Communications Lead',
    clientName: 'EarnPark',
    clientUrl: 'https://earnpark.com/',
    author: 'Vera Yurkova',
  },
  trust: {
    slots: {
      headline: 'Maximum 6 workshops per month.',
      descriptionPrefix:
        'Each one requires a custom scenario — that takes real time.',
    },
    stats: [
      { value: '2017', label: 'Building token economies' },
      { value: '$180M+', label: 'Raised by clients before TGE' },
      { value: '100%', label: 'Token as part of the product' },
      { value: '5', label: 'Verticals: DeFi, GameFi, RWA, infrastructure, finance' },
    ],
    geo: 'Offices in Dubai and Berlin. Clients across the US, Europe, and MENA.',
    partnersLabel: 'Partners',
    partners: [
      'BingX',
      'MEXC',
      'Certik',
      'Fibonacci',
      'EasyMM',
      'Listing Help',
      'Cicada',
      'Pessimistic',
      'BeInCrypto',
      'DMCC',
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'What is a tokenomics workshop and how is it different from consulting?',
        answer:
          'A workshop is a 1–3 hour structured session focused on strategic foundations: who needs your token and why. Unlike full consulting — which produces a complete economic model over 4–12 weeks — the workshop surfaces core assumptions and delivers 2–3 ready concepts. It is ideal when you need direction quickly rather than a finished document.',
      },
      {
        question: 'How much does the workshop cost?',
        answer:
          'The workshop costs $2,500. This fee is fully credited toward full tokenomics design if you continue with 8Blocks. The first discovery call is free and takes about 30 minutes — no commitment required.',
      },
      {
        question: 'How long does the process take from first contact to results?',
        answer:
          'Typically 3–5 days: one day to confirm fit on a free call, 1–2 days for us to prepare your custom scenario, and 1–3 hours for the workshop. You receive the recording, insights document, and concept descriptions within 24 hours after the session.',
      },
      {
        question: 'Who should attend from our team?',
        answer:
          'The workshop is designed for the full founding or core team: CEO, CPO, CTO, and anyone responsible for product economics or community. The more context participants bring, the more concrete the resulting concepts.',
      },
      {
        question: 'Is the workshop suitable if we already launched our token?',
        answer:
          'Yes. Retokenomics is one of the main use cases. If your token is trading significantly below TGE price or community demand is stalling, the workshop identifies the structural gaps and gives you viable paths forward — without months of additional consulting.',
      },
    ],
  },
  cta: {
    headline: 'Book a workshop',
    description: 'First call is free and non-binding. We respond within 24 hours.',
    cta1Label: 'Apply',
    cta2Label: 'Ask a question',
    formFields: {
      name: 'Name',
      company: 'Company / Project',
      email: 'Email',
      stage: 'Project stage',
    },
    successMessage: 'Application received. We will contact you within 24 hours.',
    priceNote: 'Workshop price — $2,500. Applied toward the full project. First call is free.',
  },
} as const

export const workshopContent = enObject

export const workshopMeta = {
  title: 'Tokenomics Workshop — 8Blocks',
  description:
    'A 1–3 hour structured session that surfaces your token\'s core assumptions and delivers 2–3 working concepts. $2,500. First call free.',
  ogTitle: 'Tokenomics Workshop — 8Blocks',
  ogDescription:
    'Find out who needs your token and why. Interactive workshop with an individual scenario. $2,500 · 1–3 hours · full team.',
  twitterTitle: 'Tokenomics Workshop — 8Blocks',
  twitterDescription:
    '85% of tokens trade below their TGE price. Find out why — and fix it before launch. Workshop from $2,500.',
} as const
