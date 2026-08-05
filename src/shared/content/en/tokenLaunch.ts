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
    statCaption: 'of tokens fall within 90 days of listing',
    statSourceLabel: '8Blocks · High FDV Token Failure Study · 542 listings on top exchanges analyzed',
    statSourceHref: 'https://8blocks.io/research/high-fdv-token-failure-study',
    headline: 'End-to-End Token Launch: Tokenomics, Funding, Market Making & Listing in One Track',
    description:
      'One modular track from 8Blocks, Fibonacci, and BingX: tokenomics audit and design, investor prep, market making, and listing. Take only the modules your project needs.',
    statsParagraph:
      "Of 542 listings on top exchanges in 2025, 79% went underwater within 90 days. 22% fell more than 80%. Only the sub-$10M FDV segment grew, averaging +35%. This isn't the market's fault. It's the gap between launches that did the work and launches that didn't.",
    ctaLabel: 'Price my track',
    ctaHref: '#calculator',
    secondaryLabel: 'Skip to the form',
    secondaryHref: '#contact',
    partnersLead: '8Blocks · Fibonacci · BingX',
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
      "A token launch isn't one job. It's a chain: tokenomics → investors → exchange → liquidity → growth. A gap at any point costs months of work, capital already raised, and the market's trust.",
    resultLabel: 'Result:',
    items: [
      {
        tag: 'Gap 1 · Tokenomics → investors',
        question: 'Why do funds pass after the pitch?',
        text: "The model looks finished, but it doesn't survive due diligence. Utility is vague, demand has nothing behind it, and vesting doesn't hold the price through the unlock. The fund sees it on the call and no term sheet follows.",
        result: 'the round is gone, 3–6 months to rebuild the model, competitors move ahead.',
      },
      {
        tag: 'Gap 2 · Investors → exchange',
        question: 'Why does the listing stall after the round closes?',
        text: 'The round is closed and the listing will not move. The exchange turns the project away: the model is raw, no market maker is in place, the legal structure is unfinished. The listing sits in limbo with no date in sight.',
        result: 'TGE slips by months, the market moment is gone, and early investors start pushing the team.',
      },
      {
        tag: 'Gap 3 · Exchange → liquidity',
        question: 'Why does the token dump right after listing?',
        text: "The listing goes through, and two weeks later the price is down 70%. Market making was never synced to the model: liquidity is thin, early holders exit first, and there's nobody holding the price up.",
        result: "community trust is broken, investors push back, and you're rebuilding tokenomics four months in.",
      },
      {
        tag: 'Gap 4 · Vendors → launch',
        question: 'Why do five vendors derail one launch?',
        text: "A tokenomics consultant, a pitch agency, a market maker, a listing agent, lawyers. Five contracts, five areas of responsibility, not one of them shared. Something gets dropped at every handoff, and there's nobody to hold accountable.",
        result: 'months go into coordination instead of launch, and the failure belongs to everyone and no one.',
      },
    ],
  },
  costs: {
    label: 'the cost of a mistake',
    headline: 'Each gap costs more than the whole track',
    description:
      'One mistake in a token launch can cost more than the entire track. Four questions below, answered with public market research from 2024–2025.',
    items: [
      {
        number: '01',
        question: 'What did a failed round cost in 2025?',
        lead: 'One failed round can cost a project up to a year of runway.',
        data: 'The average Web3 seed round in 2025 was $4M, pre-seed $2.6M. Deal count fell 34% against Q4 2024: investors were writing fewer checks, but bigger ones.',
        sourceLabel: 'Outlier Ventures · Web3 Fundraising Q1 2025',
        sourceHref: 'https://outlierventures.io/article/web3-fundraising-in-q1-2025-what-founders-investors-need-to-know/',
        external: true,
      },
      {
        number: '02',
        question: 'How many projects die between tokenomics and listing?',
        lead: 'More than half – and the cause is almost always the same.',
        data: '53.2% of crypto projects launched since 2021 have been declared dead (11.6M projects). The main causes are weak tokenomics and a lack of readiness for exchange due diligence.',
        sourceLabel: 'CoinGecko · Dead Coins Report 2025',
        sourceHref: 'https://www.coingecko.com/research/publications/how-many-cryptocurrencies-failed',
        external: true,
      },
      {
        number: '03',
        question: 'What happens to a token after listing?',
        lead: 'Four out of five tokens fall within the first 90 days.',
        data: 'The average change in token FDV 90 days after listing was −14%. Of 542 listings in 2025, 79% went underwater and 22% fell more than 80%. Only 21% held or grew their market cap.',
        sourceLabel: '8Blocks · High FDV Token Failure Study',
        sourceHref: 'https://8blocks.io/research/high-fdv-token-failure-study',
        external: true,
      },
      {
        number: '04',
        question: 'Does a "prestige" listing protect against a drop?',
        lead: 'The opposite – the bigger the exchange, the higher the chance of failure.',
        data: 'Binance listings went up in one case out of fifteen. On OKX, not one did. The only tokens that gained were the small ones, priced under $10M FDV, which averaged +35%. Where you list matters far less than what you list at.',
        sourceLabel: '8Blocks · High FDV Token Failure Study',
        sourceHref: 'https://8blocks.io/research/high-fdv-token-failure-study',
        external: true,
      },
    ],
  },
  partners: {
    label: 'the solution',
    headline: 'Three partners. One launch track',
    description:
      'We put strategy, investors, and listing into a single process, so each decision sets up the next stage instead of opening a new gap.',
    items: [
      {
        name: '8Blocks',
        role: 'Strategy and preparation',
        subtitle: 'Tokenomics, product logic, positioning',
        description:
          "Auditing existing tokenomics or building a new model, working through product logic, and getting the project ready to pitch investors. A tokenomics Workshop to test the key decisions before launch. If a model already exists, we audit it and rebuild it. If it doesn't, we design one so the token supports the business instead of sitting beside it.",
      },
      {
        name: 'Fibonacci',
        role: 'Investor access and liquidity',
        subtitle: 'Pitch sessions with funds and market making',
        description:
          'Running pitch sessions with funds and private investors, market making, and liquidity support after listing. Together with 8Blocks, prepares the project to raise and stays with it through to the exchange.',
      },
      {
        name: 'BingX',
        role: 'Exchange and listing',
        subtitle: 'The exchange track',
        description:
          'BingX takes the project through its own due diligence and runs the listing from approval to launch. If a different exchange suits the project better, we open that door instead.',
      },
    ],
  },
  calculator: {
    label: 'modules and calculator',
    headline: 'Build your track in 60 seconds',
    description:
      'Six modules, each with its own fixed price and timeline. Take the whole thing or take one. Plenty of projects come to us only for market making, or only for the audit, and that is a complete engagement. You pay for what you need.',
    step1Title: 'Step 1. Build your track',
    step2Title: 'Step 2. Tell us about your project',
    detailsLabel: 'Details',
    packagesLabel: 'Package options',
    fromPrefix: 'from',
    customPriceLabel: 'Custom',
    totalCostLabel: 'Cost',
    totalDurationLabel: 'Timeline',
    weeksTemplate: '~%s wks',
    emptyTotalNote: 'Select modules to see the cost and timeline',
    listingAsideNote: '+ listing priced separately, custom',
    disclaimer:
      'The estimate is indicative. Final cost and timeline are fixed after an initial review of your materials. The listing module is priced separately, subject to exchange approval.',
    bypassLead: 'Want to discuss without calculating?',
    bypassLabel: 'Leave a short request',
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
    submitCalcLabel: 'Price my track',
    submitShortLabel: 'Send request',
    sendingLabel: 'Sending…',
    successTitle: 'Thanks for reaching out.',
    successBody: "We'll be in touch by email within 24 hours.",
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
    headline: 'Six steps, from application to post-listing support',
    description:
      'Come in wherever you are. Already have the tokenomics and the money raised? Go straight to listing. Building a Web2 product with no token yet? Start with the Workshop. Not sure which modules you need? The configurator will tell you.',
    tableHead: ['#', 'Stage', 'Timeline', 'What happens'],
    rows: [
      {
        stage: 'Initial review',
        duration: '24–48 hours',
        text: 'We look at the application, the materials, and where the project stands. Then we work out the right track and which modules make sense. Everything gets confirmed by email.',
      },
      {
        stage: 'Tokenomics audit / design',
        duration: '1–12 weeks',
        text: 'We audit what exists or build the model from scratch. Product logic and prep for the next stage run alongside it.',
      },
      {
        stage: 'Preparation',
        duration: '1–2 weeks',
        text: "We finish the materials, get the project ready for meetings with funds, and line up the partners you'll need to launch: exchange, infrastructure, legal.",
      },
      {
        stage: 'Investor pitch sessions',
        duration: 'on schedule',
        text: 'We run pitch sessions with funds and private investors through Fibonacci. This is a real shot in front of investors, not a formality.',
      },
      {
        stage: 'Listing',
        duration: 'by agreement',
        text: "We take the project through due diligence with BingX and coordinate the launch. If BingX isn't the right fit, we bring in another exchange through our partner network.",
      },
      {
        stage: 'Market making / post-listing support',
        duration: 'from 1 month',
        text: 'Market making starts the moment the token lists. We hold liquidity and stay with the project after it is live.',
      },
    ],
  },
  fit: {
    label: 'who it fits',
    headline: 'We do not take every project',
    description:
      'We build a custom track for every project we take, which means we can only take on so many each month. This works best for teams that are hands-on and responsive throughout the process.',
    fitTitle: 'Good fit',
    fitItems: [
      'Web2 teams with an MVP, moving into Web3',
      'Web3 projects at MVP or near-MVP, heading toward TGE',
      'Projects with tokenomics already built that need an audit before TGE',
      'Teams ready to work the pitch process with investors',
      'Teams considering a listing',
      "Projects rebuilding tokenomics after a TGE that didn't work",
    ],
    unfitTitle: 'Not a fit',
    unfitItems: [
      'An idea with no product or MVP yet',
      'Teams not set up for a structured process with regular feedback',
      'Anyone expecting guaranteed funding',
      'Anyone expecting a guaranteed listing on a specific exchange',
      'Teams unwilling to pay for the prep work upfront',
    ],
  },
  faq: {
    label: 'faq',
    headline: 'Frequently asked questions',
    items: [
      {
        question: 'Can I take just one module?',
        answer:
          'Yes. Every module stands on its own. Order the tokenomics audit, the Workshop, or market making by itself, no need for the rest. The configurator builds whatever combination you need.',
      },
      {
        question: "What do you guarantee, and what don't you?",
        answer:
          "We stand behind our own work completely: the Workshop, the tokenomics audit and design, pitch prep, market making, and running the pitch sessions. Timelines and delivery on all of that are on us. What we can't promise is what happens once the decision leaves our hands, whether a fund invests or an exchange lists you. Those calls belong to them, not us. What we can promise is that by the time your project reaches that table, it's as ready as it can possibly be.",
      },
      {
        question: "What if BingX won't list my project?",
        answer:
          "Then we go elsewhere. We've got other exchanges in the partner network, and we bring one in. This is exactly why the initial review exists, we're checking how ready the project is and pointing it at whichever exchange track fits, without locking you into BingX from the start.",
      },
      {
        question: 'Who runs client communication, and how?',
        answer:
          'Initial contact runs over email. Once the project starts, we set up one shared working chat with 8Blocks, Fibonacci, and BingX, where day-to-day coordination happens. Responsibilities are split by stage: 8Blocks covers tokenomics and preparation, Fibonacci covers pitch sessions and market making, BingX covers the exchange track.',
      },
      {
        question: 'How soon do you start after payment?',
        answer:
          "The Workshop begins 1–3 days after confirmation. The tokenomics audit starts within 2–3 working days, tokenomics design within 3–5. Market making and listing depend on the exchange's schedule.",
      },
      {
        question: 'Can I get an NDA before sharing project details?',
        answer: 'Yes. If the project requires it, we sign a standard NDA before the initial review.',
      },
      {
        question: 'Does this work for a product with no token yet?',
        answer:
          "Yes. That's the exact question the Workshop answers, whether your product needs a token at all, and what kind. A lot of Web2 teams start here, before sinking months into building a token that ends up not fitting the product.",
      },
    ],
    geographyTitle: 'Locations and clients',
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
    headline: 'Ready to talk through your track?',
    description:
      "Tell us about the project, and we'll go through the application, the materials, and where you're at. You'll have a module recommendation in your inbox within 24 hours. The initial review doesn't commit you to anything.",
    ctaLabel: 'Price my track',
    ctaHref: '#calculator',
    formTitle: 'Short request, no calculator',
  },
}

export const tokenLaunchContent = enObject
export const tokenLaunchMeta = enObject.meta
