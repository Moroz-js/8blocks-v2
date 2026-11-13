import type { PathId } from '@/shared/lib/platform/readiness/scoring'
import { readiness, type ReadinessContent } from './readiness'

interface Action {
  label: string
  href: string
}

export type CountryId = 'uk' | 'eu' | 'ch' | 'kz' | 'ae' | 'jp' | 'sg' | 'us' | 'vg'

export interface DigitalAssetsContent {
  meta: { title: string; description: string }
  hero: { title: string; action: Action }
  widen: { title: string; cards: { title: string; points: string[] }[]; note: string }
  owners: { title: string; tabs: { path: PathId; label: string }[] }
  realEstate: { title: string; description: string; action: Action; imageAlt: string }
  steps: {
    title: string
    result: string
    items: { lead: string; text: string; result: string; action?: Action }[]
    selfServe: { title: string; actions: Action[] }
  }
  market: {
    source: string
    lead: { place: string; date: string; title: string; description: string; href: string }
    items: { place: string; date: string; title: string; description: string; href: string }[]
  }
  jurisdictions: {
    title: string
    description: string
    more: string
    close: string
    countries: Record<CountryId, { name: string; paragraphs: string[] }>
  }
  depths: {
    title: string
    badge: string
    labels: { provide: string; executes: string; ends: string }
    action: Action
    items: { title: string; subtitle: string; provide: string; executes: string; ends: string }[]
  }
  blocks: { title: string; items: { title: string; description: string }[] }
  casework: ReadinessContent['result']['casework']
  team: ReadinessContent['team']
  resources: { eyebrow: string; title: string; description: string; action: Action }[]
  faq: { title: string; items: { question: string; answer: string }[]; footer: { text: string; link: string; href: string } }
}

const CALL = 'https://calendly.com/care-8blocks/intro'
const CHECK = '/product/tokenization-readiness'
const CASES = '/product/tokenization-cases'
const DUBAI_SOURCE =
  'https://dubailand.gov.ae/en/news-media/dld-launches-the-mena-s-first-tokenized-real-estate-project-through-the-prypco-mint-platform'

export const digitalAssets: DigitalAssetsContent = {
  meta: {
    title: 'Turn a real asset into a financing instrument',
    description:
      'For owners of established businesses and real assets. We check whether your property, receivables or fund interests can support fractional investment — and design the structure only if the numbers work.',
  },
  hero: {
    title: 'Turn a real asset into\na financing instrument.\nWithout selling control.',
    action: { label: 'Book a call', href: CALL },
  },
  widen: {
    title: 'Widen access to capital without selling the asset',
    cards: [
      {
        title: 'Bank financing',
        points: [
          'Asset is typically used as collateral',
          'Cost of capital depends heavily on your local market',
          'Default can put the underlying asset at risk',
        ],
      },
      {
        title: 'Bonds / traditional debt',
        points: [
          'Fixed repayment obligations',
          'Principal has to be repaid on schedule',
          'Less flexibility if the project underperforms',
        ],
      },
      {
        title: 'Equity',
        points: [
          'You dilute ownership',
          'Investors receive governance rights',
          'You may lose part of the operational control over the business',
        ],
      },
      {
        title: 'Asset Tokenization',
        points: [
          'Reach investors beyond your home market',
          'Structure returns around specific asset cash flows',
          'Keep operational control of the asset',
          'Choose a structure that fits both the business and investors',
        ],
      },
    ],
    note: 'Access widens only when a real buyer side exists: that is exactly what the assessment checks.',
  },
  owners: {
    title: 'Owners of real assets. Find your situation',
    tabs: [
      { path: 'asset_backed', label: 'Commercial real estate' },
      { path: 'credit', label: 'Debt and collateral on the books' },
      { path: 'other', label: 'High-value movables people rent' },
      { path: 'funds', label: 'Securities or fund interests' },
    ],
  },
  realEstate: {
    title: 'Real Estate Tokenization is already working worldwide',
    description:
      'Working example from commercial real estate: in May 2025 the Dubai Land Department, a government body, launched a platform selling fractions of property title deeds, entry from AED 2,000 (about $540), with no crypto wallets for buyers. Structures differ: some never touch wallets, others use them behind the scenes.',
    action: { label: 'Explore Real Estate Tokenization', href: CASES },
    imageAlt: 'Residential tower',
  },
  steps: {
    title: 'From asset to instrument, step by step.',
    result: 'You leave with:',
    items: [
      {
        lead: 'Free 45-minute call.',
        text: 'You describe the asset and the goal. No deck, no preparation.',
        result: 'a fit / no-fit read, the likely path, and whether the Workshop is worth it.',
        action: { label: 'Book a call', href: CALL },
      },
      {
        lead: 'The Workshop.',
        text: 'We collect the facts, work the session, and send the written diagnosis after internal review.',
        result: 'the math on your asset, structure options, a roadmap, or a reasoned “not yet”.',
        action: { label: 'Explore Workshops', href: '/product/workshop' },
      },
      {
        lead: 'Architecture.',
        text: 'The full design: economics, rights, payout logic, partner brief.',
        result: 'a build-ready specification your counsel and partners can work from.',
      },
      {
        lead: 'Build coordination.',
        text: 'Legal, technical, and market partners coordinated around your decisions.',
        result: 'a working system, accepted by you.',
      },
      {
        lead: 'Launch and operate.',
        text: 'Monitoring, reporting, holder communication, until the agreed handoff.',
        result: 'a live instrument and a planned handoff to your team.',
      },
    ],
    selfServe: {
      title: 'Prefer self-serve first?',
      actions: [
        { label: 'Run the 3-minute readiness check', href: CHECK },
        { label: 'Browse institutional cases', href: CASES },
      ],
    },
  },
  market: {
    source: 'View source',
    lead: {
      place: 'Dubai',
      date: 'May 2025',
      title: 'First government-run platform for tokenized property title deeds',
      description: 'Dirham payments, entry from AED 2,000, real title deeds on record.',
      href: DUBAI_SOURCE,
    },
    items: [
      {
        place: 'USA',
        date: '2023–2025',
        title: 'Real money, early market',
        description:
          'Tokenized U.S. Treasuries grew from $104 million to roughly $5 billion in two years. Real estate on the same rails is still under 0.1% of the global market. Both facts shape how we size your case.',
        href: 'https://reports.weforum.org/docs/WEF_Asset_Tokenization_in_Financial_Markets_2025.pdf',
      },
      {
        place: 'EU',
        date: '2023–2025',
        title: 'The rules are now explicit',
        description:
          'SEC staff clarified that a tokenized security is still a security: the technology changes the format, not the law. In the EU, MiCA, the Markets in Crypto-Assets regulation, has been in force since 2024.',
        href: 'https://www.morganlewis.com/pubs/2026/02/sec-clarifies-federal-securities-law-treatment-of-tokenized-securities',
      },
    ],
  },
  jurisdictions: {
    title: 'Where RWA tokens can be issued',
    description:
      'There is no single “RWA law”. Each jurisdiction combines securities, fund and digital-asset rules: here is how the main ones work today.',
    more: 'Learn more',
    close: 'Close',
    countries: {
      uk: {
        name: 'United Kingdom',
        paragraphs: [
          'The FCA classifies RWA tokens as security tokens — issuance, custody and trading require FCA authorisation.',
          'The regulator also takes part in international work with MAS Singapore to standardise approaches.',
        ],
      },
      eu: {
        name: 'European Union',
        paragraphs: [
          'MiCA came into full force in 2026. RWA tokens in the EU fall into two categories: those qualifying as transferable securities under MiFID II — subject to the traditional prospectus and trading-venue requirements — and those outside that definition, regulated directly by MiCA.',
          'Germany — the Electronic Securities Act (eWpG, 2021) legalises DLT-based securities without a paper certificate; crypto-securities registrars need a BaFin licence. France — the PACTE law (2019) introduced the DASP regime: platforms register with the AMF, public offerings need a separate AMF visa.',
          'Luxembourg — the law of 15 March 2023 recognises DLT systems as a valid securities register, one of the best routes for tokenised funds with an EU passport. Liechtenstein (EEA) — the TVTG “Token Act” uses a token-container model: a token can represent any right or asset, and passports into 30 EEA states.',
        ],
      },
      ch: {
        name: 'Switzerland',
        paragraphs: [
          'The DLT Act, in force since 2021, gives tokenised securities — “DLT rights” — the same legal standing as traditional ones. They can represent equity, debt or other rights.',
          'FINMA supervises issuance. Switzerland is the global benchmark for legal clarity and infrastructure maturity, with venues such as SDX.',
        ],
      },
      kz: {
        name: 'Kazakhstan',
        paragraphs: [
          'A less obvious but fast-growing hub. The AIFC regulator AFSA issues the Digital Asset Operator licence and the Investment Fund Manager licence, and the centre operates under English law.',
          'Tax: 0% profit tax inside the AIFC until 2066 and 0% VAT on digital assets. A strong fit for the CIS market and first rounds up to roughly $20m.',
        ],
      },
      ae: {
        name: 'UAE',
        paragraphs: [
          'One of the most progressive regimes. In May 2025 VARA, Dubai’s virtual-asset regulator, classified RWA tokens as Asset-Referenced Virtual Assets and allowed issuance, listing and secondary trading — full legislation, not a sandbox.',
          'Issuers need a Category 1 licence with minimum capital of AED 1.5m (~$408k), monthly audits and reserve verification. Eligible collateral: real estate, private credit and income-producing assets.',
          'DIFC and ADGM run on English law, with access to institutional capital across the Middle East and Asia. In 2025 Dubai also launched a pilot tokenising property title deeds through the Land Department.',
        ],
      },
      jp: {
        name: 'Japan',
        paragraphs: [
          'Japan keeps expanding its crypto regulation.',
          'In 2025 it launched a pilot tokenising government securities on DLT, following successful projects in Germany, Singapore and Hong Kong.',
        ],
      },
      sg: {
        name: 'Singapore',
        paragraphs: [
          'MAS regulates tokenised assets through the Securities and Futures Act: RWA tokens count as securities when they convey equity, debt or collective-investment interests.',
          'Issuance, custody, trading and market operation all require SFA licences. Project Guardian serves as the institutional sandbox for testing tokenisation.',
        ],
      },
      us: {
        name: 'United States',
        paragraphs: [
          'There is no dedicated RWA law. In January 2026 the SEC confirmed that a security remains a security whether or not ownership is recorded on a blockchain. Tokens conveying rights to income or profit are securities under federal rules — the Howey test and prospectus requirements apply.',
          'In 2025–2026 the SEC launched “Project Crypto” with the CFTC: asset classification, a safe harbour for tokens, a single licence for trading venues and lighter custody rules. The GENIUS Act (July 2025) created the first federal framework for stablecoins, and the CLARITY Act on market structure passed the House and is pending in the Senate.',
        ],
      },
      vg: {
        name: 'British Virgin Islands',
        paragraphs: [
          'A classic offshore route, used as a holding SPV without a licence to distribute — a structural layer rather than the point of sale to investors.',
          'Tax: 0% on profit, capital gains and VAT. Usually combined with a regulated front in another jurisdiction, for example Liechtenstein or the AIFC.',
        ],
      },
    },
  },
  depths: {
    title: 'Three depths of involvement',
    badge: 'Most popular option',
    labels: { provide: 'You provide', executes: 'Who executes', ends: 'Ends with' },
    action: { label: 'Book a call', href: CALL },
    items: [
      {
        title: 'The architect',
        subtitle: 'Full structure spec, rights model, partner brief',
        provide: 'Asset facts, decisions, your counsel',
        executes: 'You, with partners you contract directly',
        ends: 'A build-ready specification',
      },
      {
        title: 'Architect +\ngeneral contractor',
        subtitle: 'Everything in The architect, plus the coordinated build',
        provide: 'Decisions at weekly checkpoints',
        executes: 'Vetted partners: legal, technical',
        ends: 'A working system, accepted by you',
      },
      {
        title: 'Your external team',
        subtitle: 'End-to-end delivery, through launch and the agreed period after',
        provide: 'The mandate and sign-offs',
        executes: 'We own the outcome across all partners',
        ends: 'Launch, then a planned handoff',
      },
    ],
  },
  blocks: {
    title: '8Blocks in 8 blocks',
    items: [
      { title: 'Since 2017', description: 'Token economies designed through every market cycle.' },
      { title: 'Economics first', description: 'A structure must pay off as a business before it exists as software.' },
      { title: 'Jurisdiction-specific', description: 'Every structure is drawn for your counsel’s review.' },
      { title: 'Stress-tested', description: 'Models are pressure-tested before anything launches.' },
      { title: 'Built into the business', description: 'Instruments that work inside your operation, not beside it.' },
      { title: 'Design and build', description: 'From a model on paper to a live, running instrument.' },
      { title: 'One point of contact', description: 'We coordinate every partner; you deal with one team.' },
      { title: 'Two worlds, one team', description: 'We translate between your business and the on-chain rails.' },
    ],
  },
  casework: readiness.result.casework,
  team: readiness.team,
  resources: [
    {
      eyebrow: 'Self-serve',
      title: 'Check your asset in Token Lab.',
      description:
        'A few questions about the asset and the goal: a first read on what might fit, before you talk to anyone. Three minutes, free, no registration.',
      action: { label: 'Open Token Lab', href: CHECK },
    },
    {
      eyebrow: 'For the busy owner',
      title: readiness.result.guide.title.replace('\n', ' '),
      description: readiness.result.guide.description,
      action: readiness.result.guide.action,
    },
  ],
  faq: {
    title: 'The questions owners ask us first.',
    items: [
      {
        question: 'What does tokenization mean, in plain terms?',
        answer:
          'Tokenization puts ownership, a financial claim, or another defined economic right on digital infrastructure. Think of a share in a building, a pool of invoices, or a revenue stream. We design the legal and financial structure first and use blockchain to implement it. The first question we answer is which form fits your case, if any.',
      },
      {
        question: 'Is tokenization legal?',
        answer:
          'The rules are clearer today than ever, and legal feasibility still depends on your case. Specialized counsel and regulated partners in your jurisdiction make that call. We hand them a design that’s built to pass their review.',
      },
      {
        question: 'Do I keep control of my asset?',
        answer:
          'Yes. You keep operations, management, and the decision to sell. Holders get the economic rights your structure defines, such as a share of income or repayment, written into enforceable documents that your counsel reviews.',
      },
      {
        question: 'Will this unsettle my bank or existing investors?',
        answer:
          'Before we design anything, we map your existing loans, covenants, and shareholder agreements. If a structure would breach a covenant or affect current investors, the Workshop flags it early, and we adjust the design or recommend waiting.',
      },
      {
        question: 'Who holds the licenses and legal responsibility?',
        answer:
          'Licensed partners issue and distribute the instrument, and your counsel signs off on the legal structure in your jurisdiction. 8Blocks designs the economics and rights, then coordinates every partner, so you deal with one team.',
      },
      {
        question: 'Who buys the fractions?',
        answer:
          'Typically qualified investors, family offices, and investors outside your home market, plus retail buyers where local rules allow it. Your jurisdiction and structure define who’s eligible. We confirm a real buyer side and the minimum ticket before any build starts.',
      },
      {
        question: 'What does it cost to work with you?',
        answer:
          'The first 45-minute call is free. The Workshop has a fixed fee, and we credit it in full toward further work. We scope and price architecture and build around your asset after the Workshop.',
      },
    ],
    footer: { text: 'Have other questions not mentioned?', link: 'Contact us', href: '/contact' },
  },
}
