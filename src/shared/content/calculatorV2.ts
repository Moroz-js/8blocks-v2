import { t } from '@/shared/i18n'

// Tokenomics calculator on design system v2 — texts copied verbatim from
// Figma «Website», frame 3608:10888. The design has no Russian version yet,
// so `ru` repeats `en` until a translated frame exists.
const en = {
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
          'See where your design would raise questions — community share, day-one float, supply overhang, insider locks, unlock spikes.',
          'Fixes ranked by impact. Export the PDF or hand it to 8Blocks for a full audit.',
        ],
      },
    ],
  },
  features: {
    title: 'Three steps from zero to a structured token model',
    rows: [
      [
        {
          title: 'We build for change',
          description: 'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
        },
        {
          title: 'We build for change',
          description: 'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
        },
        {
          title: 'We build for change',
          description: 'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
        },
      ],
      [
        {
          title: 'We build for change',
          description: 'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
        },
        {
          title: 'We account for financial and technical systems',
          description:
            'We connect tokenomics to on-chain and off-chain logic, liquidity, and the internal rules the system runs on',
        },
        {
          title: 'We build for change',
          description: 'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
        },
      ],
    ],
  },
  faq: {
    title: 'The questions owners ask us first.',
    items: [
      {
        question: 'What does “tokenization” actually mean, in plain terms?',
        answer: 'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
      },
      { question: 'Is this legal?', answer: '' },
      { question: 'Who buys the fractions?', answer: '' },
      { question: 'What rights do fraction holders get over my asset?', answer: '' },
      { question: 'Will this unsettle my bank or my existing investors?', answer: '' },
      { question: 'Will anyone need a crypto wallet?', answer: '' },
    ],
    footerText: 'Have other questions not mentioned?',
    footerLink: 'Contact us',
  },
}

export const calculatorV2 = t({ ru: en, en })
