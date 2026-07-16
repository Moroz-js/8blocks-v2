// Token Launch Track page — English content

const enObject = {
  meta: {
    title: 'End-to-End Token Launch: Tokenomics to Listing in One Track | 8Blocks',
    description:
      'One modular token launch track by 8Blocks, Fibonacci and BingX: tokenomics audit and design, investor readiness, crypto market making and token listing services. Pick only the modules your project needs.',
  },
  hero: {
    label: 'Token launch',
    statValue: '79%',
    statCaption: 'of tokens drop within the first 90 days after listing',
    statSourceLabel: '8Blocks · High FDV Token Failure Study · 542 top-exchange listings analyzed',
    statSourceHref: '/research',
    headline: 'End-to-End Token Launch: Tokenomics, Funding, Market Making & Listing in One Track',
    description:
      'One modular track by 8Blocks, Fibonacci and BingX: tokenomics audit and design, investor readiness, market making and listing. Pick only the modules your project actually needs.',
    statsParagraph:
      'Of 542 top-exchange listings in 2025, 79% went negative within the first 90 days. 22% collapsed by more than 80%. Only the sub-$10M FDV segment grew, by +35% on average. That is not “the market’s fault” — it is the difference between launches with preparation and without it.',
    ctaLabel: 'Calculate my track',
    ctaHref: '#calculator',
    secondaryLabel: 'Send a request without the calculator',
    secondaryHref: '#contact',
    partnersLead: 'Track partners',
    partners: [
      { name: '8Blocks', logo: '/icons/en-logo.svg', href: '' },
      { name: 'Fibonacci', logo: '/partners/fibonacci-white.png', href: 'https://fibonacci.market' },
      { name: 'BingX', logo: '/partners/bingx-logo.svg', href: 'https://bingx.com' },
    ],
  },
  gaps: {
    label: 'where launches break',
    headline: 'Four gaps where a token launch breaks',
    description:
      'A token launch is not one task but a chain of interdependent stages: tokenomics → investors → exchange → liquidity → growth. A gap at any of these stages can cost the project months of work, lost investment and market trust.',
    resultLabel: 'Result:',
    items: [
      {
        tag: 'Gap 1 · Tokenomics → investors',
        question: 'Why do funds pass after the pitch?',
        text: 'The model looks finished but fails investor due diligence. Utility is vague, demand has no mechanics behind it, vesting does not hold the price after unlocks. The fund sees it at the pitch and never issues a term sheet.',
        result: 'the round is lost, 3–6 months go into rebuilding the model, competitors move ahead.',
      },
      {
        tag: 'Gap 2 · Investors → exchange',
        question: 'Why does the listing stall after the round closes?',
        text: 'The money is raised, but the listing is stuck. The exchange will not let the project in: the model is raw, market making is not in place, the legal structure is not assembled. The listing slides into an open-ended wait.',
        result: 'the TGE slips by months, the market moment is lost, early investors pressure the team.',
      },
      {
        tag: 'Gap 3 · Exchange → liquidity',
        question: 'Why does the token dump right after listing?',
        text: 'The listing happens, but two weeks later the price loses 70%. Market making is not synchronized with the model: liquidity is thin, early holders exit first, nobody is there to hold the price.',
        result: 'community trust is broken, investors push back, re-tokenomics within 4 months.',
      },
      {
        tag: 'Gap 4 · Vendors → launch',
        question: 'Why do five vendors derail one launch?',
        text: 'A tokenomics consultant, a pitch agency, a market maker, a listing agent, lawyers. Five contracts, five zones of responsibility, none of them shared. Something gets lost at every handover between stages — and there is nobody to hold accountable.',
        result: 'months go into coordination instead of launching, and nobody answers for the failure.',
      },
    ],
  },
  costs: {
    label: 'the cost of a mistake',
    headline: 'Each gap costs more than the whole track',
    description:
      'The cost of a single launch mistake can exceed the price of the entire track. Below are four questions and answers based on public market research from 2024–2025.',
    items: [
      {
        number: '01',
        question: 'What did a failed round cost in 2025?',
        lead: 'One failed round can cost a project up to a year of runway.',
        data: 'The average Web3 seed round in 2025 was $4M; pre-seed — $2.6M. Deal count fell 34% versus Q4 2024: investors committed less often but with bigger checks.',
        sourceLabel: 'Outlier Ventures · Web3 Fundraising Q1 2025',
        sourceHref: 'https://outlierventures.io/article/web3-fundraising-in-q1-2025-what-founders-investors-need-to-know/',
        external: true,
      },
      {
        number: '02',
        question: 'How many projects die between tokenomics and listing?',
        lead: 'More than half — and the problem is almost always the same.',
        data: '53.2% of crypto projects launched since 2021 have been declared dead (11.6 million projects). Leading causes include weak tokenomics and unpreparedness for exchange due diligence.',
        sourceLabel: 'CoinGecko · Dead Coins Report 2025',
        sourceHref: 'https://www.coingecko.com/research/publications/how-many-cryptocurrencies-failed',
        external: true,
      },
      {
        number: '03',
        question: 'What happens to a token after listing?',
        lead: 'Four out of five tokens fall within the first 90 days.',
        data: 'The average change in FDV 90 days after listing was −14%. Of 542 listings in 2025, 79% went negative and 22% collapsed by more than 80%. Only 21% kept or grew their capitalization.',
        sourceLabel: '8Blocks · High FDV Token Failure Study',
        sourceHref: '/research',
        external: false,
      },
      {
        number: '04',
        question: 'Does a “prestige” listing protect against the drop?',
        lead: 'The opposite — the more prestigious the exchange, the higher the odds of failure.',
        data: 'On Binance only 1 of 15 tokens grew. On OKX none did. Only the sub-$10M FDV segment ended positive (+35%). Getting the pricing right at launch matters more than a “prestige” listing.',
        sourceLabel: '8Blocks · High FDV Token Failure Study',
        sourceHref: '/research',
        external: false,
      },
    ],
  },
  partners: {
    label: 'the solution',
    headline: 'Three partners. One launch track',
    description:
      'We merged strategy, investors and listing into one process, so every decision reinforces the next stage of the launch instead of creating new gaps.',
    items: [
      {
        name: '8Blocks',
        role: 'Strategy and preparation',
        subtitle: 'Tokenomics design, product logic, packaging',
        description:
          'A tokenomics audit of your existing model or the design of a new one, product-logic work and preparation for investor pitch sessions. A tokenomics workshop helps validate key decisions before launch. If a model exists, we audit and rebuild it. If not, we design one so the token supports the business instead of existing beside it.',
      },
      {
        name: 'Fibonacci',
        role: 'Investor access and liquidity',
        subtitle: 'Fund pitch sessions and crypto market making services',
        description:
          'Pitch sessions with funds and private investors, market making and post-listing liquidity support. Together with 8Blocks, Fibonacci prepares the project for fundraising and accompanies it all the way to the exchange.',
      },
      {
        name: 'BingX',
        role: 'Exchange and listing',
        subtitle: 'Exchange track and token listing services',
        description:
          'Listing negotiation with the exchange, due diligence and coordination of the listing process. If a different venue suits the project better, we bring it in through the partner network.',
      },
    ],
  },
  calculator: {
    label: 'modules and calculator',
    headline: 'Assemble your track in 60 seconds',
    description:
      'Six modules. Each is a standalone service with a fixed price and timeline. Start with any module, run the whole track, or join at the market-making stage. Pay only for what your project actually needs.',
    step1Title: 'Step 1. Assemble your track',
    step2Title: 'Step 2. Tell us about the project',
    detailsLabel: 'Details',
    packagesLabel: 'Package options',
    fromPrefix: 'from',
    totalCostLabel: 'Cost',
    totalDurationLabel: 'Timeline',
    weeksTemplate: '~%s wks',
    emptyTotalNote: 'Select modules to see the cost and timeline',
    listingAsideNote: '+ listing priced separately, from $50,000',
    disclaimer:
      'The estimate is indicative. Final cost and timeline are fixed after an initial review of your materials. The listing module is priced separately, subject to exchange approval.',
    bypassLead: 'Prefer to talk without the calculator?',
    bypassLabel: 'Send a short request',
    bypassHref: '#contact',
    selectedModulesLabel: 'Selected modules',
    estimateLabel: 'Estimate',
  },
  form: {
    nameLabel: 'Full name',
    namePlaceholder: 'John Smith',
    companyLabel: 'Company / project',
    companyPlaceholder: 'Project name',
    emailLabel: 'Email',
    emailPlaceholder: 'john@company.io',
    telegramLabel: 'Telegram',
    telegramPlaceholder: '@username',
    telegramOptional: 'optional',
    stageLabel: 'Project stage',
    stagePlaceholder: 'Select a stage',
    stageOptions: ['Idea', 'MVP', 'Pre-TGE', 'Post-TGE', 'Re-tokenomics'],
    taskLabel: 'Describe the task',
    taskPlaceholder: 'A few lines about the project and the goal',
    submitCalcLabel: 'Calculate the track',
    submitShortLabel: 'Send request',
    sendingLabel: 'Sending…',
    successTitle: 'Request received.',
    successBody: 'We will reply within 24 hours to your email.',
    errorFallback: 'Failed to send. Please try again.',
    requiredError: 'Please fill in the required fields',
    companyLine: 'Company / project',
    telegramLine: 'Telegram',
    stageLine: 'Project stage',
    modulesLine: 'Selected modules',
    estimateLine: 'Estimate',
    sourceLine: 'Page: /product/token-launch',
  },
  process: {
    label: 'client journey',
    headline: 'Six stages from request to post-listing support',
    description:
      'You can join at any stage. Have finished tokenomics and raised capital — go straight to listing. Running a Web2 product with no tokenomics — start with the Workshop. The configurator will suggest which modules your project needs.',
    tableHead: ['#', 'Stage', 'Timeline', 'What happens'],
    rows: [
      {
        stage: 'Initial review',
        duration: '24–48 hours',
        text: 'We study the request, materials and project stage, pick the optimal track and recommend the right modules. All details are agreed over email.',
      },
      {
        stage: 'Tokenomics audit / design',
        duration: '1–12 weeks',
        text: 'We audit the existing tokenomics or design a new model. In parallel we work through the product logic and prepare the project for the next stage.',
      },
      {
        stage: 'Preparation',
        duration: '1–2 weeks',
        text: 'We refine the materials, prepare the project for fund meetings and select launch partners: the exchange, infrastructure and legal support.',
      },
      {
        stage: 'Investor pitch sessions',
        duration: 'per schedule',
        text: 'We organize pitch sessions with funds and private investors through Fibonacci’s infrastructure. A real opportunity to present the project to potential investors.',
      },
      {
        stage: 'Listing',
        duration: 'by agreement',
        text: 'We negotiate the listing with BingX, guide the project through due diligence and coordinate the launch. If BingX is not the right fit, we bring in alternative exchanges through the partner network.',
      },
      {
        stage: 'Market making / post-listing support',
        duration: 'from 1 month',
        text: 'We launch market making simultaneously with the listing, maintain liquidity and support the project after the token goes live on the exchange.',
      },
    ],
  },
  fit: {
    label: 'who it fits',
    headline: 'We do not take every project',
    description:
      'Every project gets an individual track, so the number of new projects per month is limited. We only work with teams ready for systematic work and feedback.',
    fitTitle: 'A fit',
    fitItems: [
      'Web2 teams with an MVP moving into Web3',
      'Web3 projects with an MVP or near-MVP preparing for TGE',
      'Projects with finished tokenomics that need a tokenomics audit before TGE',
      'Teams ready to work with investors systematically through pitch sessions',
      'Teams considering an exchange listing',
      'Projects after a failed TGE looking for re-tokenomics',
    ],
    unfitTitle: 'Not a fit',
    unfitItems: [
      'Ideas without a product or MVP',
      'Teams not ready for systematic work and feedback',
      'Clients expecting guaranteed fundraising',
      'Clients expecting a guaranteed listing on a specific exchange',
      'Teams unwilling to invest in paid preparation',
    ],
  },
  faq: {
    label: 'faq',
    headline: 'Frequently asked questions',
    items: [
      {
        question: 'Can I take just one module?',
        answer:
          'Yes. Each module is a standalone service. You can order a tokenomics audit, the Workshop or market making separately. The configurator lets you assemble any combination.',
      },
      {
        question: 'What do you guarantee — and what not?',
        answer:
          'We guarantee expertise, fixed timelines and deliverables for the modules we own directly: the Workshop, tokenomics audit, tokenomics design, pitch-session preparation, market making and the organization of pitch sessions. We do not guarantee fundraising, a listing on a specific exchange or outcomes on the investor or exchange side — those decisions are theirs; our job is to prepare the project for that decision as well as possible.',
      },
      {
        question: 'What if BingX does not accept my project for listing?',
        answer:
          'We bring in alternative exchanges through the partner network. During the initial review we assess the project’s readiness and propose a relevant exchange track without being locked to a single venue.',
      },
      {
        question: 'Who runs client communication, and how?',
        answer:
          'Initial contact is over email. Once the project starts, a shared working chat with 8Blocks, Fibonacci and BingX is created for day-to-day work. Responsibility by stage: 8Blocks — tokenomics and preparation, Fibonacci — pitch sessions and market making, BingX — the exchange track.',
      },
      {
        question: 'How fast do you start after payment?',
        answer:
          'The Workshop runs within 1–3 days from confirmation to session. A tokenomics audit starts within 2–3 business days, tokenomics design within 3–5. Market making and listing follow the exchange’s schedule.',
      },
      {
        question: 'Can we sign an NDA before sharing project details?',
        answer: 'Yes. A standard NDA is signed before the initial review if the project requires it.',
      },
      {
        question: 'Does the track fit projects with a product but no token?',
        answer:
          'Yes. The Workshop answers exactly that question: does your product need a token, and which kind. Many Web2 teams start here — before spending months building a token that later does not fit the product.',
      },
    ],
    geographyTitle: 'Geography and clients',
    geographyText: 'Offices in Dubai and Berlin. Clients across the US, Europe, MENA and LatAm.',
    networkLabel: 'partner network',
    networkTitle: 'Our partner network',
    network: [
      { label: 'BingX', href: 'https://bingx.com' },
      { label: 'MEXC', href: 'https://www.mexc.com' },
      { label: 'CertiK', href: 'https://www.certik.com' },
      { label: 'Fibonacci', href: 'https://fibonacci.market' },
      { label: 'EasyMM', href: 'https://easymm.io' },
      { label: 'Listing Help', href: 'https://listing.help' },
      { label: 'Cicada', href: 'https://cicada-mm.com' },
      { label: 'Pessimistic', href: 'https://pessimistic.io' },
      { label: 'BeInCrypto', href: 'https://beincrypto.com' },
      { label: 'DMCC', href: 'https://www.dmcc.ae' },
    ],
  },
  finalCta: {
    label: 'final step',
    headline: 'Ready to discuss your track?',
    description:
      'Describe the project and we will study the request, materials and stage. Within 24 hours we come back to your email with a module recommendation. The initial review carries no obligations on your side.',
    ctaLabel: 'Calculate in the configurator',
    ctaHref: '#calculator',
    formTitle: 'Short request, no calculator',
  },
}

export const tokenLaunchContent = enObject
export const tokenLaunchMeta = enObject.meta
