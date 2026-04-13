export const tokenLabContent = {
  hero: {
    badges: ['Base Mini App', 'Telegram Mini App'],
    headline: 'Structural scoring\nfor your token economy.',
    description:
      'Model allocations across up to 8 buckets, configure vesting schedules, and get an instant A\u2013D structural risk grade. Export a PDF report or connect with 8Blocks for a full audit.',
    ctas: [
      { label: 'Open in Base App', href: 'https://base.org/build/miniapps' },
      { label: 'Open in Telegram', href: 'https://t.me/eightblocks_tokenlab_bot/tokenlab' },
    ],
  },

  howItWorks: {
    label: 'How it works',
    headline: 'Three steps from zero to a structured token model.',
    ctaLabel: 'Try the simulator',
    stepPrefix: 'Step',
    steps: [
      {
        title: 'Set token basics & allocations',
        description:
          'Enter token name, ticker, and total supply. Split across up to 8 allocation buckets with real-time 100% validation.',
      },
      {
        title: 'Configure vesting schedules',
        description:
          'Set TGE unlock, cliff, and linear vesting per bucket. See the full unlock chart with spike detection warnings.',
      },
      {
        title: 'Get structural scoring & export',
        description:
          'Receive an A\u2013D grade across 4 dimensions. Export a branded PDF report or connect with 8Blocks for a full audit.',
      },
    ],
  },

  features: {
    label: 'What Token Lab covers',
    headline: 'Everything you need to validate your token design.',
    items: [
      {
        title: 'Up to 8 allocation buckets',
        description:
          'Team, investors, community, ecosystem, treasury, liquidity, foundation, public sale.',
      },
      {
        title: 'Dynamic vesting chart',
        description:
          'Full unlock horizon with spike detection when monthly unlocks exceed thresholds.',
      },
      {
        title: 'A\u2013D structural grade',
        description:
          '4 dimensions: Allocation Balance, Insider Pressure, TGE Readiness, Vesting Sustainability.',
      },
      {
        title: 'Risk signal detection',
        description:
          'Flags when unlocks exceed 3% of supply or 10% of circulating in a single month.',
      },
      {
        title: 'Branded PDF export',
        description:
          'Allocation donut, vesting chart, grades, and 8Blocks watermark. Ready to share.',
      },
      {
        title: 'No signup, no cost',
        description:
          'Runs inside Base App and Telegram. Free for any team, any stage.',
      },
    ],
  },

  audience: {
    label: 'Who this is for',
    headline: 'Built for teams building with tokens.',
    items: [
      {
        title: 'Founders',
        description:
          'Structure your economics before the whitepaper. Arrive at investor conversations with a model, not a slide.',
      },
      {
        title: 'Product Teams',
        description:
          'Run scenario comparisons, document assumptions, and communicate trade-offs before they become constraints.',
      },
      {
        title: 'TGE Teams',
        description:
          'Model the first 12\u201324 months of circulation. Spot sell pressure spikes before investors ask.',
      },
      {
        title: 'Web2 Teams',
        description:
          'Build intuition about token economics before engaging advisors. Arrive with a concrete model.',
      },
    ],
  },

  tiers: {
    label: 'Self-serve to expert',
    headline: 'Token Lab is the first layer. The audit goes deeper.',
    description:
      'Use Token Lab to define and test your core assumptions. When you need demand modeling, competitive benchmarking, and investor alignment analysis, the 8Blocks team takes it further.',
    selfServe: {
      tag: 'Self-serve',
      title: '8Blocks Token Lab',
      description: 'Allocations, vesting, A\u2013D scoring, PDF export. Free and instant.',
    },
    expert: {
      tag: 'Expert layer',
      title: 'Tokenomics Audit / Strategy',
      description: 'Demand modeling, product alignment, competitive context. By 8Blocks consultants.',
    },
  },

  cta: {
    headline: 'Ready for a deeper analysis?',
    description:
      "If your model raises questions Token Lab can\u2019t answer, the 8Blocks team handles what comes next.",
    primaryLabel: 'Request Tokenomics Audit',
    primaryHref: '/services/audit',
    secondaryLabel: 'Book a Call',
    secondaryHref: '/contact',
  },

  methodology: {
    label: 'Methodology',
    headline: 'Built on structured thinking.',
    items: [
      {
        title: 'Token Economy Design',
        description:
          'Structured methodology for supply architecture, allocation logic, and distribution strategy from first principles.',
      },
      {
        title: 'Token Demand Model',
        description:
          'Connecting token utility to product usage, modeling sustainable demand drivers beyond speculation.',
      },
      {
        title: 'Closed Economic Loop',
        description:
          'How value flows into and out of the token economy: earn, spend, burn, and recirculation.',
      },
      {
        title: 'Audit Methodology',
        description:
          'Token design, investor alignment, emissions risk, competitive benchmarking, and legal framing.',
      },
    ],
  },

  faq: {
    headline: 'Common questions.',
    items: [
      {
        question: 'Where do I access Token Lab?',
        answer:
          'Token Lab is available as a Base Mini App inside the Base App and as a Telegram Mini App via @eightblocks_tokenlab_bot. No signup or wallet required to explore.',
      },
      {
        question: 'Is it free?',
        answer:
          'Yes. Token Lab is completely free. It runs fully in your browser on both Base App and Telegram.',
      },
      {
        question: 'What is the structural grade?',
        answer:
          'Token Lab scores your token design on 4 dimensions: Allocation Balance, Insider Pressure, TGE Readiness, and Vesting Sustainability. Each is rated Strong, Mixed, or Weak. The overall grade ranges from A (excellent) to D (needs significant work).',
      },
      {
        question: 'What is a sell pressure spike?',
        answer:
          'A spike is flagged when a single month\u2019s unlock exceeds 3% of total supply or 10% of the prior circulating supply. Spikes represent concentrated unlock events that need attention before launch.',
      },
      {
        question: 'How many allocation buckets can I configure?',
        answer:
          'Up to 8: Team, Investors, Community, Ecosystem, Treasury, Liquidity, Foundation, and Public Sale. Each with independent vesting configuration.',
      },
      {
        question: 'Can I export my model?',
        answer:
          'Yes. Token Lab generates a branded PDF report with allocation donut, vesting chart, structural grade, and sub-check details. The report includes an 8Blocks watermark and is ready for sharing.',
      },
    ],
  },
} as const

export const tokenLabMeta = {
  title: '8Blocks Token Lab \u2014 Structural Token Scoring',
  description:
    'Model allocations, configure vesting schedules, and get an instant A\u2013D structural risk grade. Free, no signup required.',
  ogTitle: '8Blocks Token Lab \u2014 Structural Token Scoring',
  ogDescription:
    'Free tokenomics modeling tool. Up to 8 allocation buckets, vesting charts, structural scoring, and PDF export.',
  twitterTitle: '8Blocks Token Lab',
  twitterDescription:
    'Structural scoring for your token economy. Model, test, export.',
} as const
