// Token Vesting Benchmarks — texts from the designer's mockup (project 2) that are not in platformPages.

export const vestingBenchmarksContent = {
  approach: {
    title: 'A smart approach\nto using benchmarks',
    description:
      'Many have tried to replicate BNB. Many exchanges launched tokens that copied BNB almost entirely. Yet in eight years, no second BNB has emerged. The same is now happening with HYPE.',
    good: {
      title: 'What benchmarks work',
      items: [
        'Evidence of demand for this token type or business model',
        'Insight into the terms on which investors joined the project',
        'Insight into the lockup periods and vesting terms investors accepted at TGE',
        'How projects learned from mistakes: their TGE terms and how those terms have changed since',
      ],
    },
    bad: {
      title: 'What benchmarks do not work:',
      items: [
        'A guarantee of repeating success. Time has passed, the market has changed, and market leadership has shifted.',
        'Copying terms will not work. No two projects are alike.',
        "The reasons behind a project's final terms or the alternatives it considered",
      ],
    },
  },
  adviceLabel: '8Blocks advice',
  medianLabel: 'median',
  carousel: { prev: 'Previous', next: 'Next' },
  vestingTitle: 'Vesting\nnorms',
  cta: {
    title: 'Create Your Tokenomics',
    accent: 'with a single request to our AI',
    features: [
      { title: 'Your personal tokenomist', text: 'Working for you\n24/7' },
      { title: 'Save 50× on costs', text: 'Without sacrificing quality or time' },
      { title: 'A personalized approach', text: 'Tailored to all your project requirements' },
    ],
    action: 'Open Tokenomics AI',
  },
  /** 8Blocks advice per project, keyed by the project name in projects.json. */
  advice: {
    Solana:
      'A big community reserve suits an L1 that funds validators for a decade. Sale rounds unlocked in under a year, though: copy the reserve, not the unlock speed.',
    Aptos:
      'A clean template for insiders: 0% at TGE, 12-month cliff, 4 years in total. The 10-year community vest fits a well-funded L1, not a seed-stage project.',
    Sui: 'Long cliffs kept early sell pressure low, but over half of supply lands after 2030. Model that overhang before borrowing a back-loaded design.',
    Celestia:
      "A 20% public float gave real liquidity at launch. An insider share above 50% with a 2-year backer vest is aggressive without demand like Celestia's.",
    Arbitrum:
      'A 4-year lock with a 1-year cliff for team and investors is a strong default. The airdrop was the only float, so early price discovery sat with farmers.',
    Optimism:
      'Leaving insider unlock dates to governance created uncertainty for holders. Even if you copy the ecosystem fund, publish a fixed unlock schedule.',
    Starknet:
      'Insider unlocks started two months after launch, and the market priced that in. Keep at least a 12-month cliff for team and investors.',
    ZKsync:
      'A 1-year cliff plus 3-year monthly vest for insiders is a sound baseline. Keep one official split: conflicting numbers on aggregators cost trust.',
    Uniswap:
      'A claimable 15% airdrop and a 4-year insider vest set the DeFi standard. Perpetual inflation only makes sense if governance has a real use for it.',
    dYdX: 'Half of supply went to insiders, and the amended lockup moved unlocks rather than removing them. Keep the insider share well below 50% from the start.',
    Ethena:
      '25% at a 1-year cliff, then 3-year linear, is a common investor structure. Check that trackers model the cliff correctly: DropsTab shows it as linear.',
    Hyperliquid:
      'Zero VC allocation and a large day-one airdrop built strong demand. It works because the product already had revenue; without it the float becomes sell pressure.',
    'STON.fi':
      'A ~6% TGE float keeps early pressure low. Spread the cliffs so treasury, team and investor unlocks do not overlap in months 24-36.',
    'Axie Infinity':
      'A 22% TGE float with most team tokens unlocked at day 0 is risky outside a bull cycle. Gameplay emissions need sinks of the same size.',
    'The Sandbox':
      'An unlocked public sale and seed tranches every six months create predictable unlock spikes. Monthly vesting smooths them out.',
    Immutable:
      'Re-locking the developer tranche helped, but changing schedules after launch hurts credibility. Set conservative terms at TGE instead.',
    Beam: 'Re-cliffing contributor tokens to 4 years strengthened alignment. A migration from an older token (MC 1:100) confuses holders, so communicate it early.',
    'Worldcoin (World)':
      'A ~1% float at launch is the low-float, high-FDV pattern the market punished in 2024. Aim for a higher initial float.',
    'io.net':
      'Supplier emissions over 20 years tie new supply to real network usage. Keep TGE unlocks of large buckets small: 30% of R&D adds early float.',
    Grass:
      'Keeping investor tokens non-stakeable while locked is a good alignment detail. A ~24% float at TGE needs real demand from day one to hold the price.',
    'Render Network':
      'No vesting worked for a 2017 ICO with tiny sales. An escrow-based supply model is still useful, but sale tokens today need a vesting schedule.',
    'Virtuals Protocol':
      'No future unlocks removes vesting risk, but 35% in a treasury without disbursement rules is the open question. Publish treasury spending rules.',
  } as Record<string, string>,
}
