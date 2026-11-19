// Token Vesting Benchmarks — texts from the designer's mockup (project 2) that are not in platformPages.

/** 8Blocks tips for the project cards: general advice, spread so a category does not repeat one. */
const TIPS = {
  community:
    'If you leave more than 50% of tokens to the community, weigh two things: the number of users and how much use the token actually has. You need a clear balance between distribution and utility. With few users and nowhere to use the token, all of it will be sold.',
  treasury:
    "A treasury's main job is to give tokens a transparent route to the market. It holds tokens that can't reach the market until the stated goals are met.",
  reserve:
    "A strategic reserve should stay locked until its stated goal is reached. If it sits in an ordinary wallet, it isn't a reserve, it's an overhang.",
  vesting:
    "Copying cliff and vesting periods makes no sense: they should follow the project's roadmap, such as when the product is ready and when the next release ships.",
  investors:
    'Tokenomics shows the size of the investor allocation, but not the terms on which investors came in.',
  rewards:
    'You can copy the rewards fund allocation, but study how tokens are removed from circulation too. One may not work without the other.',
  picture:
    "Splitting tokens into allocations isn't tokenomics yet, so copying it won't give the same result. Look at the whole picture: how the tokens were split, and why.",
}

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
    Solana: TIPS.picture,
    Aptos: TIPS.community,
    Sui: TIPS.reserve,
    Celestia: TIPS.investors,
    Arbitrum: TIPS.treasury,
    Optimism: TIPS.picture,
    Starknet: TIPS.vesting,
    ZKsync: TIPS.reserve,
    Uniswap: TIPS.community,
    dYdX: TIPS.investors,
    Ethena: TIPS.vesting,
    Hyperliquid: TIPS.rewards,
    'STON.fi': TIPS.treasury,
    'Axie Infinity': TIPS.rewards,
    'The Sandbox': TIPS.reserve,
    Immutable: TIPS.picture,
    Beam: TIPS.vesting,
    'Worldcoin (World)': TIPS.community,
    'io.net': TIPS.rewards,
    Grass: TIPS.investors,
    'Render Network': TIPS.treasury,
    'Virtuals Protocol': TIPS.community,
  } as Record<string, string>,
}
