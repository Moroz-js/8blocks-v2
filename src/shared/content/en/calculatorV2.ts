// Tokenomics calculator landing (project 2 «Tokenomics Calculator»).

export const calculatorV2 = {
  hero: {
    eyebrow: 'Tokenomics calculator:',
    title: 'Catch the red flags while they’re still cheap to fix.',
    cta: 'Check my token design',
  },
  steps: {
    title: 'Three steps from zero to a structured token model',
    items: [
      {
        title: 'Set token basics & allocations',
        points: [
          'Enter token name, ticker, and total supply.',
          'Split across up to 8 allocation buckets with real-time 100% validation.',
        ],
      },
      {
        title: 'Configure vesting schedules',
        points: [
          'Set TGE unlock, cliff, and linear vesting per bucket.',
          'See the full unlock chart with spike detection warnings.',
        ],
      },
      {
        title: 'Get structural scoring & export',
        points: [
          'See where your design would raise questions: community share, day-one float, supply overhang, insider locks, unlock spikes.',
          'Fixes ranked by impact. Export the PDF or hand it to 8Blocks for a full audit.',
        ],
      },
    ],
  },
  features: {
    title: 'Everything you need to validate your token design.',
    items: [
      {
        shape: 'coinstacks',
        title: 'Up to 8 allocation buckets',
        description: 'Team, investors, community, ecosystem, treasury, liquidity, foundation, public sale.',
      },
      {
        shape: 'bars',
        title: 'Dynamic vesting chart',
        description: 'Full unlock horizon with spike detection when monthly unlocks exceed thresholds.',
      },
      {
        shape: 'gauge',
        title: 'Structure Score',
        description:
          'One number for structural sell-pressure risk, judged against launches like yours. Five checks: community allocation, day-one float, supply overhang, insider lock discipline, unlock shock.',
      },
      {
        shape: 'warn',
        title: 'Risk signal detection',
        description: 'Flags when unlocks exceed 3% of supply or 10% of circulating in a single month.',
      },
      {
        shape: 'file',
        title: 'Branded PDF export',
        description: 'Allocation donut, vesting chart, grades, and 8Blocks watermark. Ready to share.',
      },
      {
        shape: 'tag',
        title: 'No signup, no cost',
        description: 'Runs right here in your browser. Free for any team, any stage.',
      },
    ],
  },
  faq: {
    title: 'The questions owners ask us first.',
    items: [
      {
        question: 'Which template should I start with?',
        answer:
          'Pick the one closest to how you’ll raise. VC-backed fits a venture round with long team locks. Community-led and Fair launch fit projects with little or no insider allocation. Utility/Enterprise fits product-first tokens. You can edit every value afterward.',
      },
      {
        question: 'How long does it take?',
        answer: 'About five minutes with a template. Adjust allocations and vesting, and your Structure Score updates instantly.',
      },
      {
        question: 'What is the Structure Score?',
        answer:
          'It’s a 0–100 score for structural sell-pressure risk. It checks five areas: community allocation, day-one float, supply overhang, insider lock discipline, and unlock shock. Norms adapt to your launch archetype, so a fair launch gets judged against fair launches. See the vesting benchmarks.',
      },
      {
        question: 'My score is low. What should I fix first?',
        answer:
          'Start with your lowest-graded check. Low scores usually trace back to a thin day-one float or short insider locks. Each flagged spike shows the month and the bucket that caused it.',
      },
      {
        question: 'Can I share and export the model?',
        answer:
          'Yes. You’ll get a shareable link your team can open and edit, plus a branded PDF with your score, risks, allocation, and unlock schedule.',
      },
      {
        question: 'What does a full tokenomics audit add?',
        answer:
          'The calculator covers supply structure. A full audit adds demand modeling, product fit, incentives, user behavior, and legal constraints, along with scenario analysis from 8Blocks consultants. Request an audit and bring your shared model.',
      },
    ],
    footerText: 'Have other questions not mentioned?',
    footerLink: 'Contact us',
  },
}
