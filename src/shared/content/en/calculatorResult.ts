export const calculatorResult = {
  meta: {
    title: 'Your tokenomics results',
    description:
      'Structure Score, unlock schedule, market benchmarks and growth points for your token model, calculated by the 8Blocks Tokenomics Calculator.',
  },
  title: 'Tokenomics\nCalculator',
  readiness: 'Your readiness:',
  download: 'Download report',
  preparing: 'Preparing…',
  reportFallback: { name: 'Token model', symbol: 'TOKEN' },
  radarLabel: 'The five Structure Score dimensions',
  dimensionTips: {
    community: 'Share of supply reserved for the community and public distribution',
    overhang: 'Volume of future emissions that will press on the price',
    shock: 'Size of single unlocks relative to circulating supply',
    float: 'Share of tokens freely circulating at listing',
    discipline: 'How strict lockups and vesting are for the team and early investors',
  },
  bestFit: {
    title: 'Best-fit path',
    tgeFloat: 'TGE float',
    pressure: '12m unlock pressure',
    supply: 'Supply',
    tips: {
      tgeFloat: 'Share of supply circulating at listing',
      pressure: 'New supply unlocking over the first 12 months',
      supply: 'Total token supply',
    },
    pressureTags: { Low: 'Low', Moderate: 'Moderate', Elevated: 'Elevated', High: 'High' },
  },
  inputs: {
    title: 'Your inputs',
    summary: 'Total supply: {supply} · +{count} parameters',
    edit: 'Edit',
  },
  tired: {
    title: 'Tired of modelling all of this yourself?',
    description:
      'We build the model around your case: allocations, vesting, the unlock schedule and demand scenarios — with sell pressure calculated and every number checked against market benchmarks.',
    action: { label: 'Book a meeting', href: '/contact' },
  },
  unlock: {
    title: 'Unlock schedule',
    action: { label: 'Discuss your model', href: '/contact' },
  },
  benchmarks: {
    title: 'Benchmarks',
    tip: 'We benchmark tokenomics only. A project’s outcome depends on far more than its token model — these conclusions come from performance analysis across hundreds of crypto projects over the market’s history.',
    caption: 'Your model compared with market norms and the top project in the category',
    average: 'Average',
    yours: 'Your model',
    top: 'Top in category:\n{name}',
    above: 'above',
    below: 'below',
    rows: {
      team: { label: 'Team share', tip: 'Share of total supply allocated to the founding team' },
      investors: { label: 'Investor share', tip: 'Share of total supply held by private and seed investors' },
      tgeFloat: { label: 'TGE float', tip: 'Share of supply circulating at the token generation event' },
      teamCliff: { label: 'Team cliff', tip: 'Period before any team tokens start unlocking' },
      teamVesting: { label: 'Team vesting', tip: 'Total length of the team unlock schedule after the cliff' },
    },
  },
  growth: {
    title: 'We found {count} growth\npoints in your model',
    description:
      'Each one is a concrete fix: allocations, vesting, the unlock schedule or listing terms. {open} are open below, the rest we walk through on the call.',
    descriptionLocked:
      'Each one is a concrete fix: allocations, vesting, the unlock schedule or listing terms. We walk through them with you on the call.',
    improvement: 'Improvement #{n}:',
    leaveWith: 'You leave with:',
    result: '+{gain} points to your Structure Score — from {from} to {to}.',
    see: 'See result',
    hide: 'Hide',
    locked: 'Book a call to unlock',
    lockedHref: '/contact',
    lockedTitles: [
      'Raise day-one float\nout of the danger zone',
      'Stretch team vesting\nto a 48-month tail',
      'Cut the treasury slice\ninto milestone tranches',
    ],
  },
  call: {
    title: '{count} more top fixes on a 45-minute\ncall with the 8Blocks team',
    imageAlt: '8Blocks team on a call',
    steps: [
      { title: 'Book a slot', description: 'Pick a time that suits you. The call is free and takes 45 minutes.' },
      { title: 'We study your model', description: 'Before the call, our team reviews your inputs against market benchmarks.' },
      { title: 'You get the fixes', description: 'We walk through the remaining fixes, rank them for your launch and agree on a next step.' },
    ],
    action: { label: 'Book the call', href: '/contact' },
  },
  checklist: {
    title: 'Calculating tokenomics is just one of the eight stages of token issuance.',
    description: 'Check it before you spend money on legal or technical implementation.',
    action: { label: 'Download full Checklist', href: '/contact' },
    coverAlt: 'The Complete Tokenomics Audit Checklist',
  },
  faq: {
    title: 'The questions owners ask us first.',
    items: [
      {
        question: 'How do you calculate my readiness verdict?',
        answer:
          'We run five checks: community allocation, day-one float, supply overhang, insider lock discipline, and unlock shock. Each check uses norms for your launch archetype: VC-backed, community-led, fair launch, or utility/enterprise.',
      },
      {
        question: 'My verdict looks strong. Do I still need the fixes?',
        answer:
          'A strong verdict means your model has no structural blockers. The fixes target weak spots that tend to surface after TGE, like first-year unlocks. Investors usually catch them in due diligence.',
      },
      {
        question: 'Can I apply the fixes myself?',
        answer:
          'The open fixes work as a starting point. The others depend on your round terms, listing plans, and market, and the right order matters, since one fix can shift another. We work through them with you on the call.',
      },
      {
        question: 'What doesn’t the calculator cover?',
        answer:
          'It tests supply structure. Demand, token utility, liquidity depth, and listing terms sit outside the model, and they often decide how unlocks play out after TGE.',
      },
      {
        question: 'What do I get from the free 45-minute call?',
        answer:
          'We’ll walk you through the remaining fixes, show which ones matter most for your launch, and agree on a clear next step.',
      },
    ],
    footer: { text: 'Have other questions not mentioned?', link: 'Contact us', href: '/contact' },
  },
  invalid: {
    title: 'This results link is broken',
    description: 'The link is incomplete or outdated. Build your model again — it takes about three minutes.',
    action: { label: 'Open the calculator', href: '/product/calculator' },
  },
}

export type CalculatorResultContent = typeof calculatorResult
