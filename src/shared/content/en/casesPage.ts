
export type CaseTag = 'DeFi' | 'GameFi' | 'RWA' | 'Finance'

export interface CaseStudy {
  tag: CaseTag
  title: string
  task: string
  actions: string[]
  result: string
}

export const casesContent = {
  headline: 'Portfolio',
  description:
    "Our clients' case studies — from DeFi and GameFi to real-world asset tokenization and international settlements.",
} as const

export const cases: CaseStudy[] = [
    // ─── DeFi ──────────────────────────────────────────────────────
    {
      tag: 'DeFi',
      title: 'Crypto Bank — restored trust in the project token',
      task: 'Relaunch the token and restore its significance within the bank ecosystem.',
      actions: [
        'Integrated the updated token into the banks line of yield products',
        'Conducted a private sale for existing clients and a retrodrop for active users',
        'Launched the token through an in-house launchpad, maintaining emission transparency',
      ],
      result: 'The token became part of the ecosystem again; the project regained its clients and strengthened its DeFi position.',
    },
    {
      tag: 'DeFi',
      title: 'Crowdlending — designed tokenomics free from security classification risks',
      task: 'Build tokenomics that is legally sound and supports ecosystem growth.',
      actions: [
        'Separated the utility token from the internal infrastructure token to minimise regulatory risk',
        'Implemented staking, an insurance pool, and liquid RWA mechanics',
        'Structured the model so the project obtained utility status and passed legal review',
      ],
      result:
        'The token became a reliable instrument for global client operations and maintained resilience under international standards.',
    },
    {
      tag: 'DeFi',
      title: 'Foreign Trade Platform — tokenised supply contracts as NFTs and replaced settlements with tokens',
      task: 'Create a tokenised supply model that simplifies cross-border settlements and shields participants from sanctions.',
      actions: [
        'Digitised supply contracts as NFTs',
        'Calculated token emission and collateralisation for trade operations',
        'Added protective mechanisms to reduce costs and bypass barriers',
      ],
      result: 'The business cut cross-border settlement costs by 30% and streamlined the supply chain.',
    },
    {
      tag: 'DeFi',
      title: 'Decentralised Market Maker — simplified the token liquidity maintenance process',
      task: 'Develop a model with stable liquidity and transparent pricing.',
      actions: [
        'Designed token emission and utilisation mechanisms',
        'Modelled the pricing process and the balance of supply and demand',
        'Created a collateral system with performance guarantees',
      ],
      result:
        'Liquidity stabilised, and the market maker became a clear and accessible tool for early-stage projects.',
    },
    {
      tag: 'DeFi',
      title: 'Launchpad — developed a model in which token growth is inevitable',
      task: 'Build token economics where growth is directly tied to client activity and platform dynamics.',
      actions: [
        'Developed a token lock-up model for issuers',
        'Configured a Proof of Issuer mechanism to verify token release',
        'Defined token distribution principles and set circulation conditions',
      ],
      result: 'The platform token sustains growth as long as the platform has clients.',
    },
    {
      tag: 'DeFi',
      title: 'Crypto Lootbox — made loot boxes decentralised',
      task: 'Give users the ability to issue their own loot boxes and earn from them.',
      actions: [
        'Modelled token emission and distribution',
        'Developed the loot box purchase and sale mechanism',
        'Calculated collateral requirements for loot box issuance',
      ],
      result: 'Loot boxes evolved from a simple game mechanic into a fully-fledged earning instrument.',
    },

    // ─── RWA ───────────────────────────────────────────────────────
    {
      tag: 'RWA',
      title: 'High-purity metals — turned an illiquid asset into an investment instrument',
      task: 'Digitise the metal and make it a liquid asset.',
      actions: [
        'Developed three tokens (GOV, NFT, Utility)',
        'The NFT became the metal equivalent, preserving its value',
        'Structured the project across three jurisdictions',
      ],
      result: 'The token became liquid and in demand on the market.',
    },
    {
      tag: 'RWA',
      title: 'Gold & Real Estate — tokenised gold as collateral to fund residential construction',
      task: 'Create a model where gold is used as collateral to raise funds for construction.',
      actions: [
        'Balanced the value of gold-backed tokens',
        'Calculated the price of an NFT collection with real estate ownership rights',
        'Developed a mechanism for exchanging tokens for NFTs',
      ],
      result: 'Gold became a funding source: the founder retained control and attracted capital.',
    },
    {
      tag: 'RWA',
      title: 'Accounts Receivable — turned debt into an investment instrument',
      task: 'Create a model that converts company debt into an investable asset.',
      actions: [
        'Calculated fixed DFA returns for investors',
        'Modelled the financial outcome for the issuer',
        'Introduced variable yield tied to the success of debt recovery',
      ],
      result: 'The company converted its debts into investments and secured financing below the key rate.',
    },
    {
      tag: 'RWA',
      title: 'Wild-harvested goods (cedar nut) — developed a UTP-based investment instrument for the market',
      task: 'Find a solution to finance wild-harvested goods exports without credit instruments.',
      actions: [
        'Developed the logical and economic models',
        'Distributed nodes among participants and regulators',
        'Developed an asset buyback instrument',
      ],
      result:
        'The company gained a sustainable funding instrument and was able to scale its business without credit risk.',
    },
    {
      tag: 'RWA',
      title: 'Clinical trials — made medtech investment more accessible',
      task: 'Open up investment access to clinical research at early stages of drug development.',
      actions: [
        'Developed a molecule digitisation model',
        'Using UTP, made the molecule divisible into one million fractions',
        'Formed a long-term investment instrument to finance the drug development stage',
      ],
      result:
        'The company unlocked a new source of capital and made the medtech market more accessible to investors.',
    },

    // ─── GameFi ────────────────────────────────────────────────────
    {
      tag: 'GameFi',
      title: 'AR game — prevented a token dump and strengthened the token economy',
      task: 'Maintain in-game economic stability and prevent token devaluation after launch.',
      actions: [
        'Designed tokenomics with one primary token and five in-game tokens',
        'Configured mechanics where players spent tokens on NFT crafting instead of selling',
        'Created a system where the NFT collection became a growing-value asset and the token a scarce resource',
      ],
      result: 'The game economy maintained its balance, and the token began to appreciate.',
    },
    {
      tag: 'GameFi',
      title: 'NFT game — structured token distribution across all participants',
      task: 'Create a token distribution system that supports the project economy and balances participant interests.',
      actions: [
        'Modelled optimal token distribution',
        'Configured lock-up and vesting parameters',
        'Integrated staking as part of the core game mechanics',
      ],
      result: 'Players started valuing the token and using it as intended, rather than flipping it quickly.',
    },
    {
      tag: 'GameFi',
      title: 'Walk-to-Earn game — built a courier reward mechanism',
      task: 'Build an economy where courier income is stable regardless of token volatility.',
      actions: [
        'Calculated the unit economics of the project',
        'Modelled income under different price scenarios',
        'Built tokenomics with a flexible reward accrual system',
      ],
      result: 'The company entered the international market while maintaining stability and legal transparency.',
    },
    {
      tag: 'GameFi',
      title: 'MiniApp game — attracted clients to an investment company',
      task: 'Create a product that helps users grasp investing through a game format.',
      actions: [
        'Developed loyalty token tokenomics',
        'Shaped investment education logic in a game-based format',
        'Modelled engagement mechanics (Crush mechanisms) for different investor profiles',
      ],
      result: 'The company gained an effective and sustainable investor acquisition channel.',
    },
    {
      tag: 'GameFi',
      title: 'PvP game — embedded tokenomics into the game economy',
      task: 'Integrate tokenomics to increase token value and player engagement.',
      actions: [
        'Developed token emission and utilisation mechanisms',
        'Calculated the economics of NFT resources',
        'Modelled the impact of tokenomics on the project economy',
      ],
      result:
        'Players began actively using tokens in-game, strengthening the internal economy and increasing project value.',
    },

    // ─── Finance ───────────────────────────────────────────────────
    {
      tag: 'Finance',
      title: 'Marketplace — integrated a token into the business without regulatory risk',
      task: 'Find a way to embed a token into the companys business model while maintaining legal resilience when entering new markets.',
      actions: [
        'Created a token burn and client sales system',
        'Structured the business across multiple jurisdictions',
        'Developed a model for converting tokens into warehouse real estate',
      ],
      result: 'The project entered new markets while retaining transparency and the trust of partners and regulators.',
    },
    {
      tag: 'Finance',
      title: 'International settlements — built a mechanism to bypass currency restrictions',
      task: 'Establish cryptocurrency settlements between countries without regulatory risk.',
      actions: [
        'Organised trading through a consumer cooperative',
        'Developed a token parity exchange system',
        'Registered the token as intellectual property',
      ],
      result: 'Crypto settlements between Russia and India became possible without regulatory risk.',
    },
  ] as const as unknown as CaseStudy[]

export const allTags: CaseTag[] = ['DeFi', 'GameFi', 'RWA', 'Finance']

export const casesMeta = {
  title: 'Portfolio',
  description:
    '8Blocks case studies: tokenomics, DeFi, GameFi, RWA, and international finance. Real projects with results.',
  ogTitle: 'Portfolio | 8Blocks',
  ogDescription: "Our clients' case studies — from DeFi to real-world asset tokenization.",
} as const

export const casesUiContent = {
  heroLabel: 'Cases',
  heroHeadline: 'Portfolio',
  heroAriaLabel: 'Portfolio',
  taskLabel: 'Task',
  actionsLabel: 'What we did',
  resultLabel: 'Result',
  filterAll: 'All',
  emptyLabel: 'No cases yet',
} as const
