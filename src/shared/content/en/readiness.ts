import type { OptionId, PathId, PillarId, QuestionId, StatusId } from '@/shared/lib/platform/readiness/scoring'

interface OptionCopy {
  label: string
  /** Line under «Project strengths». */
  strength?: string
  /** Line under «Worth validating before you commit». */
  concern?: string
  /** Fragment of the result summary. */
  phrase?: string
}

interface QuestionCopy<Q extends QuestionId> {
  chip: string
  title: string
  help?: string
  options: Record<OptionId<Q>, OptionCopy>
}

interface PathCopy {
  name: string
  /** «You get». */
  headline: string
  holders: string
  keep: string
  check: string
  example: { title: string; body: string }
  imageAlt: string
  /** Always the last line under «Worth validating». */
  validate: string
  precedent: { kicker: string; title: string; description: string; stat?: string }
  widen: {
    title: string
    conventional: { label: string; value: string; text: string }
    digital: { label: string; value: string; text: string }
  }
}

interface Action {
  label: string
  href: string
}

export interface ReadinessContent {
  meta: { title: string; description: string }
  resultMeta: { title: string; description: string }
  hero: { title: string; description: string; start: string; sample: string; privacy: string }
  pillars: Record<PillarId, { label: string; tip: string }>
  chartLabel: string
  statuses: Record<StatusId, { name: string; short: string; description: string }>
  statusSection: { eyebrow: string; title: string; description: string }
  paths: {
    title: string
    description: string
    labels: { headline: string; holders: string; keep: string; check: string }
    items: Record<PathId, PathCopy>
  }
  quiz: {
    progress: string
    previous: string
    questions: { [Q in QuestionId]: QuestionCopy<Q> }
  }
  four: {
    title: string
    description: string
    items: { title: string; description: string }[]
    meansToggle: string
    means: string
  }
  team: {
    title: string
    description: string
    primary: Action
    secondary: Action
  }
  faq: { title: string; items: { question: string; answer: string }[]; footer: { text: string; link: string; href: string } }
  result: {
    direction: string
    readiness: string
    summary: Record<StatusId, string>
    strengthsTitle: string
    noStrengths: string
    validateTitle: string
    inputs: { title: string; edit: string }
    precedent: { title: string; note: string }
    feasibility: { title: string; description: string; primary: Action; restart: string }
    route: { title: string; description: string; steps: { title: string; description: string }[] }
    casework: {
      title: string
      cta: string
      items: { category: string; title: string; description: string; href: string }[]
    }
    call: { title: string; imageAlt: string; steps: { title: string; description: string }[]; action: Action }
    guide: { title: string; description: string; action: Action; imageAlt: string }
    faq: { title: string; items: { question: string; answer: string }[]; footer: { text: string; link: string; href: string } }
    invalid: { title: string; description: string; action: Action }
  }
}

const CALL = 'https://calendly.com/care-8blocks/intro'
const FAQ_FOOTER = { text: 'Have other questions not mentioned?', link: 'Contact us', href: '/contact' }

export const readiness: ReadinessContent = {
  meta: {
    title: 'Tokenization Readiness Check',
    description:
      'Seven questions about your goal, asset, economics and execution. A free, honest read on whether tokenization is worth exploring, what path may fit, and what to validate first.',
  },
  resultMeta: {
    title: 'Your tokenization readiness',
    description: 'Readiness status, best-fit path and the open questions for your case.',
  },
  hero: {
    title: 'Is tokenization actually a fit\nfor your business?',
    description:
      'Answer seven questions about your goal, asset, economics and execution readiness. Get an honest assessment of whether tokenization is worth exploring, what path may fit, and what needs validation first.',
    start: 'Check my readiness',
    sample: 'See a sample result',
    privacy: 'Nothing is sent anywhere — the assessment is computed in your browser.',
  },
  pillars: {
    objective: { label: 'Objective\nfit', tip: 'Is there a problem tokenization can realistically solve?' },
    asset: { label: 'Asset\n& rights', tip: 'Is the asset or right clearly defined and enforceable?' },
    demand: { label: 'Demand\n& economics', tip: 'A plausible buyer side and viable economics?' },
    execution: { label: 'Execution', tip: 'Enough clarity, time and commitment to structure it properly?' },
  },
  chartLabel: 'Readiness by pillar: objective fit, asset and rights, demand and economics, execution',
  statuses: {
    strong: {
      name: 'Strong candidate',
      short: 'strong potential',
      description:
        'There is a clear business objective, a credible underlying asset or financial right, and no obvious structural blocker. Worth validating seriously.',
    },
    explore: {
      name: 'Explore first',
      short: 'explore first',
      description:
        'There may be a viable case, but one or more critical assumptions still need validation before committing to structuring or implementation.',
    },
    notYet: {
      name: 'Not yet',
      short: 'not yet',
      description:
        'The current objective, economics or execution conditions do not justify tokenization today. The result explains what would need to change.',
    },
  },
  statusSection: {
    eyebrow: 'Two answers, instantly',
    title: 'Readiness status',
    description:
      'Seven questions cannot make anyone “ready to tokenize”. The assessment only determines whether going deeper is justified.',
  },
  paths: {
    title: 'Best-fit path',
    description: 'The second answer: which structure is worth testing first. Four possible directions.',
    labels: { headline: 'You get', holders: 'Holders get', keep: 'You keep', check: 'First we check' },
    items: {
      asset_backed: {
        name: 'Asset-backed financing',
        headline: 'Capital without selling the asset',
        holders: 'Designed to be enforceable and reviewed by your counsel',
        keep: 'Operation, management, the decision to sell',
        check: 'Who buys the fractions, at what minimum ticket',
        example: {
          title: 'Working example from commercial real estate.',
          body: 'In May 2025 the Dubai Land Department, a government body, launched a platform selling fractions of property title deeds, entry from AED 2,000 (about $540), with no crypto wallets for buyers. Structures differ: some never touch wallets, others use them behind the scenes.',
        },
        imageAlt: 'Commercial building facade at night',
        validate: 'Jurisdiction and the regulated route for distribution',
        precedent: {
          kicker: 'Regulated pilot',
          title: 'Dubai Land Department + Ctrl Alt',
          description:
            'Give investors regulated fractional access to Dubai real estate.\nA government-backed tokenization pilot: title-deed-linked fractions issued through a licensed platform, with a controlled secondary-market phase introduced afterwards.',
          stat: '10 properties, $5M+ tokenized in the initial phase',
        },
        widen: {
          title: 'Widen access to capital without selling the asset',
          conventional: {
            label: 'Conventional financing',
            value: '1–2 sources of capital',
            text: 'A bank or a single buyer sets the terms.',
          },
          digital: {
            label: 'Digital structuring',
            value: 'Many holders',
            text: 'One asset, fractions sold to the audience you validate. Terms stay yours.',
          },
        },
      },
      credit: {
        name: 'Credit & receivables',
        headline: 'Liquidity against what is already pledged',
        holders: 'A claim on the cash flow, ranked behind your existing lender',
        keep: 'The loan, the covenants, the banking relationship',
        check: 'What your credit agreement permits without a waiver',
        example: {
          title: 'Working example from debt and collateral.',
          body: 'Private credit funds now issue tokenised notes against loan books already pledged to a bank, with holders ranked behind the senior lender. The mechanics are ordinary subordinated debt; only the register and the settlement rail are new.',
        },
        imageAlt: 'Ledger books and documents',
        validate: 'What your credit agreements permit without a waiver',
        precedent: {
          kicker: 'Working example',
          title: 'Tokenised notes on pledged loan books',
          description:
            'Raise funding against receivables without replacing the senior lender.\nPrivate credit funds issue tokenised notes against loan books already pledged to a bank, with holders ranked behind the senior lender. Only the register and the settlement rail are new.',
        },
        widen: {
          title: 'Fund receivables beyond a single credit line',
          conventional: {
            label: 'Conventional financing',
            value: 'One lender',
            text: 'A bank or a factor sets the advance rate and the price.',
          },
          digital: {
            label: 'Digital structuring',
            value: 'A pool of funders',
            text: 'Claims on the cash flow placed with investors you validate, ranked behind your lender.',
          },
        },
      },
      funds: {
        name: 'Funds & securities',
        headline: 'A tradable wrapper for an existing interest',
        holders: 'The same economics as the underlying interest, in smaller units',
        keep: 'The mandate, the governance, the exit decision',
        check: 'Which exemption the offer relies on, and where',
        example: {
          title: 'Working example from securities and fund interests.',
          body: 'Several regulated funds have issued tokenised feeder interests in Luxembourg and Singapore, cutting minimum tickets from six figures to four. The economics mirror the underlying interest exactly; the wrapper only changes transferability.',
        },
        imageAlt: 'Trading screens with market data',
        validate: 'Which exemption the offer relies on, and in which markets',
        precedent: {
          kicker: 'Working example',
          title: 'Tokenised feeder interests',
          description:
            'Lower the minimum ticket without changing the fund.\nRegulated funds in Luxembourg and Singapore have issued tokenised feeder interests, cutting minimum tickets from six figures to four. The economics mirror the underlying interest exactly.',
        },
        widen: {
          title: 'Lower the entry ticket for an existing interest',
          conventional: {
            label: 'Conventional access',
            value: 'Six-figure tickets',
            text: 'Only a narrow circle of large investors can come in.',
          },
          digital: {
            label: 'Digital structuring',
            value: 'Smaller units',
            text: 'The same economics in smaller, transferable units — within the exemption you rely on.',
          },
        },
      },
      other: {
        name: 'Other / needs discovery',
        headline: 'Financing the fleet, not the balance sheet',
        holders: 'A share of rental income, measured per unit',
        keep: 'The fleet, the contracts, the operating margin',
        check: 'Utilisation history and how residual value is proven',
        example: {
          title: 'Working example from high-value movables.',
          body: 'Aircraft and yacht operators have financed fleets by selling income shares per unit rather than equity in the company. Payouts follow utilisation data, so investors price the asset’s actual working life instead of the operator’s balance sheet.',
        },
        imageAlt: 'Aircraft on an airfield',
        validate: 'Which structure fits the case — a discovery session decides',
        precedent: {
          kicker: 'Working example',
          title: 'Income shares per unit',
          description:
            'Finance the assets, not the company.\nAircraft and yacht operators have financed fleets by selling income shares per unit rather than equity. Payouts follow utilisation data, so investors price the asset’s working life.',
        },
        widen: {
          title: 'Find the structure before you build it',
          conventional: {
            label: 'Without discovery',
            value: 'A guess',
            text: 'A structure picked before the asset and the buyer side are clear.',
          },
          digital: {
            label: 'With discovery',
            value: 'A tested hypothesis',
            text: 'The asset, the right and the buyer side first — then the structure that fits them.',
          },
        },
      },
    },
  },
  quiz: {
    progress: 'Question {n} of {total}',
    previous: '← Previous',
    questions: {
      objective: {
        chip: 'Objective',
        title: 'What are you trying to achieve?',
        help: 'The objective decides which structure is worth testing — not the industry you are in.',
        options: {
          raise_capital: {
            label: 'Raise capital against an asset or cash flow',
            strength: 'A concrete business objective, not tokenization for its own sake',
            phrase: 'You are looking to raise capital',
          },
          working_capital: {
            label: 'Finance working capital',
            strength: 'A concrete business objective, not tokenization for its own sake',
            phrase: 'You are looking to finance working capital',
          },
          investor_access: {
            label: 'Broaden investor access to an existing fund or security',
            strength: 'A concrete business objective, not tokenization for its own sake',
            phrase: 'You want to broaden investor access to an existing fund or security',
          },
          transferability: {
            label: 'Improve transferability or administration of an investment instrument',
            strength: 'A concrete business objective: an instrument that is easier to transfer and administer',
            phrase: 'You want an investment instrument that is easier to transfer and administer',
          },
          explore: {
            label: 'Explore whether digital assets could create value',
            concern: 'A concrete business problem for tokenization to solve',
            phrase: 'You are exploring whether digital assets could create value',
          },
          other: {
            label: 'Something else',
            concern: 'Which problem tokenization is meant to solve',
            phrase: 'You have your own objective in mind',
          },
        },
      },
      asset: {
        chip: 'Underlying asset',
        title: 'What would sit behind the digital instrument?',
        options: {
          real_assets: {
            label: 'Real estate, infrastructure or equipment',
            strength: 'A recognizable underlying asset: a real-estate, infrastructure or equipment asset',
            phrase: ', with a real-estate, infrastructure or equipment asset',
          },
          receivables: {
            label: 'Receivables, loans or contracted revenue',
            strength: 'A recognizable underlying asset: receivables, loans or contracted revenue',
            phrase: ', with receivables, loans or contracted revenue',
          },
          securities: {
            label: 'Fund interests or existing securities',
            strength: 'A recognizable underlying asset: fund interests or existing securities',
            phrase: ', with fund interests or existing securities',
          },
          inventory: {
            label: 'Inventory or commodities',
            strength: 'A recognizable underlying asset: inventory or commodities',
            phrase: ', with inventory or commodities',
          },
          other_right: {
            label: 'Another clearly defined asset or financial right',
            concern: 'How exactly the asset or right is defined and enforced',
            phrase: ', with another defined asset or financial right',
          },
          nothing: {
            label: 'Nothing specific yet',
            concern: 'What would actually sit behind the instrument',
            phrase: ', with no specific asset behind the instrument yet',
          },
        },
      },
      rights: {
        chip: 'Legal clarity',
        title: 'How clearly is ownership or the financial right documented?',
        options: {
          clear: {
            label: 'Clear and fully documented',
            strength: 'Ownership and the financial right are already documented',
            phrase: ' and documented ownership behind it',
          },
          mostly: {
            label: 'Mostly clear, some structuring is still needed',
            concern: 'The structuring still needed around ownership and rights',
            phrase: ' and ownership that is mostly documented',
          },
          complex: {
            label: 'Complex or unclear',
            concern: 'Who holds which rights, and whether they can be transferred',
            phrase: ' but ownership that is still complex or unclear',
          },
          none: {
            label: 'Not documented yet',
            concern: 'Documenting ownership before anything else',
            phrase: ' but ownership that is not documented yet',
          },
        },
      },
      size: {
        chip: 'Economics',
        title: 'What is the approximate size of the asset or financing opportunity?',
        help: 'Size does not disqualify a case by itself — it shapes whether structuring costs pay off.',
        options: {
          under_250k: {
            label: 'Under $250k',
            concern: 'Whether structuring costs pay off at this size',
            phrase: ' below $250k',
          },
          '250k_1m': { label: '$250k – $1m', phrase: ' in the $250k–$1m range' },
          '1m_5m': { label: '$1m – $5m', phrase: ' in the $1m–$5m range' },
          '5m_plus': { label: '$5m+', phrase: ' above $5m' },
          unsure: {
            label: 'Not sure yet',
            concern: 'The size of the asset or the financing need',
          },
        },
      },
      evidence: {
        chip: 'Track record',
        title: 'What evidence supports the underlying economics?',
        options: {
          established: {
            label: 'Established performance and reliable financial records',
            strength: 'Established performance behind the economics',
          },
          operating: {
            label: 'Operating history with usable internal records',
            strength: 'An operating history with usable records',
          },
          limited: {
            label: 'Limited operating history or incomplete data',
            concern: 'Data that supports the underlying economics',
          },
          projections: {
            label: 'Mostly projections / pre-revenue',
            concern: 'Evidence behind the projections',
          },
        },
      },
      demand: {
        chip: 'Demand',
        title: 'Who could realistically buy or fund this instrument?',
        help: 'Tokenization does not create liquidity or investor demand by itself.',
        options: {
          existing: {
            label: 'Existing investors, clients or counterparties',
            strength: 'A buyer side you already know: investors, clients or counterparties',
          },
          institutional: {
            label: 'Identified professional / institutional investors',
            strength: 'Identified professional or institutional investors',
          },
          unvalidated: {
            label: 'We know the target investor type but have not validated demand',
            concern: 'Whether the target investors would actually buy',
          },
          retail: {
            label: 'Broad retail investors',
            concern: 'Retail distribution rules in your target markets',
          },
          unknown: {
            label: 'We do not know yet',
            concern: 'Who would realistically buy or fund the instrument',
          },
        },
      },
      execution: {
        chip: 'Execution',
        title: 'How prepared are you to explore implementation?',
        options: {
          ready: {
            label: 'Decision-maker involved, realistic timeline and resources available',
            strength: 'A decision-maker, a realistic timeline and resources in place',
          },
          serious: { label: 'Serious interest, but several execution questions remain' },
          early: {
            label: 'Early exploration',
            concern: 'Who owns the decision, the timeline and the budget',
          },
          urgent: {
            label: 'We need capital immediately / within the next few months',
            concern: 'Timing: structuring takes months, a faster route may fit the immediate need',
          },
        },
      },
    },
  },
  four: {
    title: 'Four things determine whether\nthe case is worth exploring',
    description:
      'The assessment does not determine whether you can legally issue a token. It identifies whether there is enough economic and structural substance to justify deeper feasibility work.',
    items: [
      { title: 'Objective', description: 'A problem tokenization can realistically solve' },
      { title: 'Asset & rights', description: 'Something clearly defined and enforceable' },
      { title: 'Demand & economics', description: 'A plausible buyer side and viable economics' },
      { title: 'Execution', description: 'Enough clarity, time and commitment to structure it properly' },
    ],
    meansToggle: 'What “tokenization” means here',
    means:
      'Here, tokenization means representing ownership, a financial claim or another defined economic right through digital infrastructure. The legal and financial structure comes first; blockchain is the implementation layer. Liquidity, a secondary market or a wider investor pool are outcomes some structures earn — not automatic effects.',
  },
  team: {
    title: 'We are trying\nto determine whether\na real business case exists',
    description: 'before you spend money on legal or technical implementation.',
    primary: { label: 'Book the free 45-min call', href: CALL },
    secondary: { label: 'Or check your readiness first', href: '#quiz' },
  },
  faq: {
    title: 'The questions owners\nask us first.',
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
        question: 'How long does it take?',
        answer:
          'Timelines depend on your structure and jurisdiction. You’ll get a feasibility view in one call and a written diagnosis after the Workshop. Structuring and implementation usually take 3 to 12 months, and legal work takes the longest.',
      },
      {
        question: 'Will tokenization make my asset liquid?',
        answer:
          'Liquidity comes from investor demand and a working secondary market. Tokenization can open both when the structure, distribution route, and buyer side are in place. That’s why the assessment asks who could realistically buy or fund your instrument.',
      },
      {
        question: 'What happens on the free 45-minute call?',
        answer:
          'Our co-founder and CPO review your case, check whether a real business case exists, and name the one or two questions your project depends on. You’ll leave knowing which data to collect next and whether a Workshop makes sense for you.',
      },
      {
        question: 'Is this assessment advice?',
        answer:
          'It’s an educational self-assessment. It shows whether deeper feasibility work makes sense. For legal, financial, or investment advice, talk to licensed advisors in your jurisdiction.',
      },
    ],
    footer: FAQ_FOOTER,
  },
  result: {
    direction: 'Suggested direction:',
    readiness: 'Your readiness:',
    summary: {
      strong: '{case}. That makes {path} the first structure worth testing. The main unresolved question is {question}.',
      explore:
        '{case}. {Path} is the structure worth testing first, but {question} needs validation before you commit to structuring.',
      notYet:
        '{case}. Today this does not justify tokenization: {question} has to change first. Revisit the assessment once it does.',
    },
    strengthsTitle: 'Project strengths',
    noStrengths: 'None of the answers stand out yet — the open questions below come first.',
    validateTitle: 'Worth validating before you commit',
    inputs: { title: 'Your inputs', edit: 'Edit' },
    precedent: {
      title: 'A similar structure already exists',
      note: 'A precedent shows the structure class exists — it does not prove your project is legally feasible or commercially viable.',
    },
    feasibility: {
      title: '45-minute feasibility call',
      description: 'Not a sales call — the next diagnostic step. Your case → structure → blockers → next step.',
      primary: { label: 'Discuss my asset structure', href: CALL },
      restart: 'Start over',
    },
    route: {
      title: 'The typical route, step by step',
      description: 'Timelines depend on the structure and jurisdiction — the Workshop puts dates on your case.',
      steps: [
        { title: 'Research & model', description: 'Define the objective, run the math' },
        { title: 'Structuring', description: 'Rights, vehicle, jurisdiction' },
        { title: 'Infrastructure', description: 'Issuance, custody, distribution' },
        { title: 'Launch', description: 'Issue, place, operate' },
      ],
    },
    casework: {
      title: 'From our casework',
      cta: 'View case',
      items: [
        {
          category: 'RWA · Commodities',
          title: 'Gold as collateral',
          description: 'Tokenised gold as collateral to fund residential construction.',
          href: '/cases',
        },
        {
          category: 'RWA · Trade finance',
          title: 'Exports without bank credit',
          description: 'A financing instrument for wild-harvest exports, with buyback.',
          href: '/cases',
        },
        {
          category: 'RWA · Commodities',
          title: 'An illiquid metal, made investable',
          description: 'High-purity metal turned liquid across three jurisdictions.',
          href: '/cases',
        },
      ],
    },
    call: {
      title: 'In 45 minutes we’ll figure out whether tokenization fits your asset — and what to do next',
      imageAlt: '8Blocks team on a video call',
      steps: [
        {
          title: 'Your case, in your terms',
          description: 'Your asset and your goal — revenue, cost, control. No deck to prepare.',
        },
        {
          title: 'A first pass at the numbers',
          description: 'Fraction price, minimum ticket, likely buyers and the cost of the structure.',
        },
        {
          title: 'A straight read',
          description: 'The realistic path with ranges — or the reasons to wait.',
        },
      ],
      action: { label: 'Book the call', href: CALL },
    },
    guide: {
      title: 'The owner’s guide,\non one page.',
      description: 'Seven questions to ask before tokenizing an asset, the same ones we ask on the call. No email required.',
      action: { label: 'Open the guide', href: '/product/digital-assets/owners-guide' },
      imageAlt: 'Envelope with the owner’s guide',
    },
    faq: {
      title: 'The questions owners\nask us first.',
      items: [
        {
          question: 'How do you reach my verdict?',
          answer:
            'We score your answers across four pillars: objective fit, asset and rights, demand and economics, and execution. The verdict reflects how all four hold together, and the strengths and open questions above show which answers drove it.',
        },
        {
          question: 'What does my verdict mean for next steps?',
          answer:
            'Your verdict shows whether deeper feasibility work makes sense today. A strong result points to the structure worth testing first and the question to resolve before you commit. “Explore first” and “Not yet” show what to fix and when to reassess.',
        },
        {
          question: 'How accurate can seven questions be?',
          answer:
            'Seven questions give a first read on whether your case has enough substance to explore. They can’t confirm legal feasibility or investor demand. Those come from deeper work with your facts, your counsel, and real buyer conversations.',
        },
        {
          question: 'Who would buy fractions of my asset?',
          answer:
            'That depends on your asset, ticket size, and jurisdiction. Typical buyers include qualified investors, family offices, and investors outside your home market. Confirming a real buyer side for your case comes first, before any structuring.',
        },
        {
          question: 'What happens after the call?',
          answer:
            'If the case holds, the Workshop comes next: we collect your asset facts, run a working session, and send a written diagnosis with the math, structure options, and a roadmap. If it doesn’t hold, we’ll tell you what to fix or which financing fits better.',
        },
      ],
      footer: FAQ_FOOTER,
    },
    invalid: {
      title: 'This result link is incomplete',
      description: 'The answers in the link could not be read. Take the seven questions again — it takes about two minutes.',
      action: { label: 'Check my readiness', href: '/product/tokenization-readiness#quiz' },
    },
  },
}
