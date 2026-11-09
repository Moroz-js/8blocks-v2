// Service pages on design system v2 — texts from the designer's mockups
// (project/Tokenomics, Tokenomics Audit, Strategic Consulting, Tokenomics Workshop).

const common = {
  bookCall: { label: 'Book a consultation', href: '/contact' },
  stepsLabels: { prev: 'Previous steps', next: 'Next steps' },
  howWeWork: 'How we work',
  faq: {
    title: 'The questions owners ask us first.',
    footer: { text: 'Have other questions not mentioned?', link: 'Contact us', href: '/contact' },
  },
  miniApp: {
    title: 'Pressure-test your tokenomics',
    description:
      'In our mini app, you can quickly build a basic model, set up vesting, review unlock schedules, and spot the first risks in your tokenomics.',
    tabsLabel: 'Mini app features',
    shotAlt: 'Token Lab',
    tabs: [
      {
        label: 'Base model',
        text: 'Enter token supply, price, circulating supply, and allocations to get a quick read on the overall structure of your tokenomics',
      },
      {
        label: 'Vesting and unlocks',
        text: 'Set unlock schedules for each pool, review the unlock chart, spot possible spikes, and assess the model’s overall condition',
      },
      {
        label: 'Final score',
        text: 'Get a model snapshot with a short summary of tokenomics quality and key risk areas',
      },
      {
        label: 'Daily practice',
        text: 'Come back to the app every day, answer short questions, and build a stronger understanding of tokenomics step by step',
      },
    ],
    baseApp: { label: 'Open in Base App', href: 'https://base.app/app/https:/app.8blocks.io' },
    telegram: { label: 'Open in Telegram', href: 'https://t.me/eightblocks_tokenlab_bot/tokenlab' },
  },
}

const tokenomics = {
  meta: {
    title: 'Tokenomics',
    description:
      'Token economy model: emission, distribution, and vesting — built to keep the system stable from day one.',
    ogTitle: 'Tokenomics | 8Blocks',
    ogDescription:
      'Token economy model: emission, distribution, and vesting — built to keep the system stable from day one.',
    twitterTitle: 'Tokenomics | 8Blocks',
    twitterDescription: 'Token economy model: emission, allocation, and vesting.',
  },
  hero: {
    title: 'Tokenomics',
    description:
      'We design token models for projects that need to connect business logic, user behavior, and technical systems into one coherent framework',
  },
  pains: {
    title: 'Why most token models\nfail after launch',
    description:
      "Because a polished diagram in a white paper doesn't mean the token will create value, sustain demand, or support the project's economics",
    items: [
      { title: 'The token is disconnected from the product', description: 'It creates no real value inside the ecosystem' },
      { title: 'Demand has no mechanism behind it', description: 'People buy the product, then sell the token' },
      { title: 'Fast distribution kills the token', description: 'Investors won’t wait forever' },
      { title: 'Giving out the token isn’t enough', description: 'It’s not clear why anyone should buy it' },
    ],
  },
  approach: {
    title: 'What we review in the model',
    description:
      "We don't just look at the tokenomics itself. We look at the context it has to work in: the product, the business processes, the market, and the project's internal logic",
    items: [
      {
        title: 'We go deep into the product',
        description: 'We look beyond the token itself to understand the project’s business logic, user roles, and usage scenarios',
      },
      {
        title: 'We design flows across the ecosystem',
        description: 'We map how the token moves across products, users, pools, and treasury',
      },
      {
        title: 'We account for financial and technical systems',
        description: 'We connect tokenomics to on-chain and off-chain logic, liquidity, and the internal rules the system runs on',
      },
      {
        title: 'We build for change',
        description: 'We design models that can evolve with new mechanics, product changes, and ecosystem growth',
      },
    ],
  },
  parts: {
    title: 'What goes into your tokenomics',
    description:
      'This is not just a document. It is a working economic model built to support token sales, fundraising, strategic partnerships, and the long-term growth of the project',
    items: [
      { lead: 'Optimal supply.', text: 'We define the total token supply and choose the right issuance model, whether fixed or uncapped' },
      { lead: 'Allocation structure.', text: 'We map out how tokens are distributed across sales, rewards, incentives, and other parts of the ecosystem' },
      { lead: 'White paper visuals.', text: 'We prepare diagrams, charts, and tables that help translate the tokenomics into clear project documentation' },
      {
        lead: 'Financial and utility mechanics.',
        text: 'We develop credit pools, derivatives, deflationary mechanics, as well as NFTs, services, and subscriptions that shift value toward the ecosystem',
      },
      { lead: 'Closed-loop ecosystem.', text: 'We design how tokens are used, accumulated in internal funds, redistributed, and brought back into circulation' },
      {
        lead: 'Treasury, reserves, and hedging.',
        text: 'We build in mechanisms to protect the model from manipulation, large sell-offs, and scenarios that can quickly crush the price',
      },
      { lead: 'Pools, lockups, and vesting.', text: 'We break tokens into pools, set lockup periods, and design vesting schedules for different participant groups' },
      { lead: 'Issuance mechanics.', text: 'We determine how the token enters the system, whether through mining, purchase flows, or algorithmic distribution' },
    ],
  },
  steps: [
    { title: 'We dive into the project', description: 'We review the materials, goals, and context to understand the project’s challenges and product logic' },
    { title: 'We benchmark the market', description: 'We analyze competing token models, compare approaches, and identify the strongest solutions' },
    { title: 'We work closely with the team', description: 'We run working sessions to capture product nuance and build a stronger model together' },
    { title: 'We define how the token is used', description: 'We shape the utility mechanics, holder rights, and vesting structure inside the ecosystem' },
    { title: 'We design the ecosystem around it', description: 'We connect the token to the product, interfaces, and technical logic of the project' },
    { title: 'We map token flows', description: 'We build token flow scenarios across every part of the ecosystem' },
    { title: 'We plan the sale structure', description: 'We define the number of rounds, sale format, timing, and target ticket size' },
    { title: 'We adapt the model as new mechanics appear', description: 'We test new functions and adjust the model as the project evolves' },
    {
      title: 'We finalize and defend the model',
      description: 'We package the final tokenomics, prepare the presentation, and walk your team through the reasoning behind it',
    },
  ],
  cta: {
    title: 'Sometimes a token doesn’t need a bear market to die',
    description: 'Bad tokenomics will do the job just fine',
  },
  faq: [
    {
      question: 'Can we come to you with an existing tokenomics draft?',
      answer:
        'Yes. If you already have calculations, a white paper, a product deck, or a draft model, we don’t start from scratch for no reason. We first look at what can be used, what needs refinement, and what makes more sense to rebuild so the final model works as one coherent system.',
    },
    {
      question: 'When do we need an audit instead of tokenomics development?',
      answer:
        'If you already have a model and the goal is to test it for mistakes, risks, and weak spots, then you need an audit. If the model is still taking shape, doesn’t answer the core questions, or needs a deeper rebuild, then it makes more sense to go into full tokenomics development.',
    },
    {
      question: 'What do you need from us at the start?',
      answer:
        'Anything you already have on the project: a white paper, product deck, roadmap, token or NFT description, round data, team allocation structure, and any other working materials. Even if some of it isn’t finalized yet, that’s usually enough to get started.',
    },
    {
      question: 'Do you only work with utility tokens, or with NFTs as well?',
      answer:
        'Not just utility tokens. We also work with NFT models and more complex hybrid structures, as long as the asset is built into the product’s economics and plays a real role in how the ecosystem works.',
    },
    {
      question: 'Does the engagement include token sale logic?',
      answer:
        'Yes. We work through the number of rounds, their structure, timing, and target check size so the model isn’t built in isolation from the sale logic or the project’s path to market.',
    },
    {
      question: 'Is modeling included in the scope of work?',
      answer:
        'No. Modeling is a separate service. It can be done in two formats: software-based Monte Carlo modeling in Python, or visual modeling in Machinations.',
    },
    {
      question: 'What isn’t included in tokenomics development?',
      answer:
        'This format doesn’t include legal work, smart contract development, marketing production, or technical implementation by outside contractors. But if needed, we can bring in additional sessions with lawyers, market makers, and other specialized experts to go deeper on specific parts of the model.',
    },
    {
      question: 'How long does the work usually take?',
      answer:
        'Tokenomics development usually takes between 3 and 7 weeks. The exact timing depends on the amount of material available, the complexity of the model, how quickly the team communicates, and how deep the work needs to go.',
    },
    {
      question: 'Can the process be accelerated if timing is critical?',
      answer:
        'Yes, in some cases that can be discussed. The pace depends on how quickly the team provides input, signs off on decisions, and moves through each stage with us.',
    },
    {
      question: 'Can the tokenomics be updated later if the product changes?',
      answer:
        'Yes. If new mechanics, use cases, or additional products appear, the model can be adapted and expanded over time. That matters especially for projects where the economics need to evolve alongside the product.',
    },
    {
      question: 'What exactly will we get at the end?',
      answer:
        'You won’t just get a token description. You’ll get a full economic model built to support the token sale, fundraising, strategic partnerships, and the long-term growth of the ecosystem. It includes the core parameters around supply, issuance, allocation, vesting, treasury, protective mechanisms, and visuals for the white paper.',
    },
  ],
}

const audit = {
  meta: {
    title: 'Tokenomics Audit',
    description:
      'Full assessment of an existing token economy: structural risks, broken incentive loops, and scaling bottlenecks.',
    ogTitle: 'Tokenomics Audit | 8Blocks',
    ogDescription: 'Comprehensive token economy assessment with structural risks and growth bottlenecks.',
    twitterTitle: 'Tokenomics Audit | 8Blocks',
    twitterDescription: 'Comprehensive review of your existing token economy.',
  },
  hero: {
    title: 'Tokenomics audit',
    description:
      'We run a deep review of the current token model, identify weak spots, and provide practical recommendations on how to improve it',
  },
  pains: {
    title: 'A finished token model\ncan still fall apart',
    description:
      "A polished document doesn't guarantee a model that can hold up, earn trust, or support the project as it grows",
    items: [
      {
        title: 'The model already has structural cracks',
        description: 'They may not be obvious at first, but sooner or later they start pulling the project in the wrong direction',
      },
      {
        title: 'Growth exposes the weak points',
        description: 'What looks fine in a static model often stops working once the product and ecosystem begin to scale',
      },
      { title: 'The logic doesn’t hold up in investor conversations', description: 'If the model is hard to explain, confidence drops fast' },
      { title: 'The problems surface too late', description: 'Usually at the point when they’re already slowing the project down' },
    ],
  },
  when: {
    title: 'When an audit stops being optional',
    description:
      'Most teams come in for an audit when the model is already built, but no one feels fully comfortable relying on it before a TGE, investor conversations, or the market itself',
    items: [
      'If the tokenomics is already built, but confidence still isn’t there',
      'If the model exists, but you still wouldn’t want to stand behind it in front of investors',
      'If the product has changed, but the tokenomics is still stuck in an older version of the project',
      'If the team feels something is off in the model, but can’t clearly point to where',
      'If you’d rather fix weak spots before the token sale than discover them after launch',
      'If you want to know in advance what’s most likely to break first',
      'If the tokenomics looks perfect on paper, but you still want an outside expert view before moving forward',
    ],
  },
  review: {
    title: 'What we review in the model',
    description:
      "We don't just look at the tokenomics itself. We look at the context it has to work in: the product, the business processes, the market, and the project's internal logic",
    items: [
      {
        title: 'The current token structure',
        description: 'We review supply, utility, vesting, pool allocation, and the economic relationships built into the model.',
      },
      {
        title: 'Calculations, forecasts, and scenarios',
        description: 'We revisit the formulas, assumptions, and key scenarios to spot mistakes and weak points.',
      },
      {
        title: 'How the model fits the project’s goals',
        description: 'We look at how well the tokenomics supports the product logic, the core metrics, and the business priorities right now.',
      },
      {
        title: 'The market and competing models',
        description: 'We compare the model against strong market benchmarks to see where it gives the project an edge and where it falls short.',
      },
      {
        title: 'Critical business processes',
        description: 'We work through the details with the CEO, CTO, CFO, and other process owners to uncover risks that don’t show up in the documents alone.',
      },
    ],
  },
  outcomeCta: {
    title: 'What becomes clear after the audit',
    description:
      'You see where the current tokenomics is losing strength, clarity, and investor trust, and what needs to be corrected for the model to support growth instead of constant manual intervention',
  },
  problems: {
    title: 'An audit often reveals a different problem than the one everyone was looking for',
    items: [
      {
        label: 'It looks like the model is already finished',
        text: 'In practice, the audit shows which parts of the tokenomics no longer match the project in its current form',
      },
      { label: 'It looks like the allocation is fine', text: 'The review shows where it starts creating unnecessary pressure on the token' },
      {
        label: 'It looks like the issue is just in the numbers',
        text: 'In reality, the weak spot is often in the token logic, its utility, or the way it connects to the product',
      },
      {
        label: 'It looks like the product just needs better marketing',
        text: 'In reality, the issue is often not external demand, but weak economics inside the model',
      },
      {
        label: 'It looks like investors simply didn’t understand the model',
        text: 'After the audit, it becomes clear where the tokenomics lost clarity and trust',
      },
      {
        label: 'It looks like the utility works',
        text: 'But once we test it, it turns out some of the mechanics create no real value and only make the structure more complicated',
      },
    ],
  },
  cta: {
    title: 'Before launch, it’s better to hear\nthe hard truth from experts',
    description: 'Than to hear it later from investors and the market',
  },
  faq: [
    {
      question: 'We already have tokenomics. Why do we need an audit?',
      answer:
        'Because a finished tokenomics model can still fail in real conditions. An audit helps you verify whether the logic is strong enough before the token sale, investor conversations, and market pressure expose weak spots.',
    },
    {
      question: 'Can you audit a model that was not built by your team?',
      answer:
        'Yes. We often audit models built by in-house teams or other advisors. The goal isn’t to rewrite everything by default, but to identify what works, what doesn’t, and what should be fixed first.',
    },
    {
      question: 'Can we run the audit right before TGE or token sale?',
      answer:
        'Yes. That is one of the most common moments to do it. The audit helps reduce avoidable mistakes before launch, when the cost of being wrong is already high.',
    },
    {
      question: 'Do you assess whether the model is clear to investors?',
      answer:
        'Absolutely. If the logic is hard to explain, trust drops quickly. We check not only the internal math, but also how clearly the model can be defended externally.',
    },
    {
      question: 'Will the audit show if tokenomics no longer matches the product?',
      answer:
        'Yes. This is a frequent case. We identify where the current model is out of sync with product changes and where that mismatch creates risk.',
    },
    {
      question: 'What do you need from us at the start?',
      answer:
        'Any existing materials: white paper, product deck, current token model, spreadsheets, issuance and allocation schemes, plus context on product and business logic.',
    },
    {
      question: 'What do we receive at the end?',
      answer:
        'You receive a structured audit outcome with clear findings, priority weak spots, and practical recommendations on what to improve and in what order.',
    },
    {
      question: 'How long does the audit usually take?',
      answer: 'Typically 1 to 2 weeks, depending on model complexity, amount of source material, and response speed from the team.',
    },
    {
      question: 'Can the process be accelerated if timing is critical?',
      answer: 'Yes, in many cases. Fast material sharing and quick alignment sessions usually shorten the timeline.',
    },
    {
      question: 'What isn’t included in the audit scope?',
      answer:
        'The audit does not include legal services, full tokenomics redevelopment from scratch, smart contract implementation, marketing production, or standalone modeling.',
    },
    {
      question: 'If the audit shows a major rebuild is needed, is that normal?',
      answer:
        'Yes. That is often the most valuable outcome. It is better to discover structural issues before launch than after the market does it for you.',
    },
  ],
}

const consulting = {
  meta: {
    title: 'Strategic Consulting',
    description:
      "We help Web3 and Web2 teams build a project's economy, prepare for investment, and navigate the path to token market launch.",
    ogTitle: 'Strategic Consulting | 8Blocks',
    ogDescription:
      "We help Web3 and Web2 teams build a project's economy, prepare for investment, and navigate the path to token market launch.",
    twitterTitle: 'Strategic Consulting | 8Blocks',
    twitterDescription: 'We help Web3 teams shape project economics and prepare for TGE.',
  },
  hero: {
    title: 'Strategic Consulting:\nfrom idea to listing',
    description:
      'We help Web3 and Web2 teams build the project’s economic model, prepare for investment, and move all the way to bringing the token to market',
  },
  pains: {
    title: 'Launching a token takes\nmore than tokenomics',
    description: 'Teams often underestimate how much has to be planned, aligned, and ready before launch',
    items: [
      { title: 'No clear token strategy', description: 'The token is not properly tied to the product or the business' },
      { title: 'The story doesn’t land with investors', description: 'The model may make sense internally, but it’s hard to explain clearly to the market' },
      { title: 'The right partners aren’t in place', description: 'A launch needs more than a model. It needs the external players who help make it work' },
      { title: 'TGE prep is all over the place', description: 'Your project gets one real shot at a successful TGE' },
    ],
  },
  tgeCta: {
    title: 'Your project gets one real shot at a successful TGE',
    description: 'A launch needs more than a model. It needs the external players who help make it work',
  },
  strategy: {
    title: 'We turn token launch\ninto one unified strategy',
    description:
      'We connect the business model, tokenomics, investment logic, partner ecosystem, and TGE preparation into one working path',
    stages: ['Business model', 'Tokenomics', 'Investor narrative', 'Partner ecosystem', 'TGE preparation', 'Launch'],
  },
  deliver: {
    title: 'What you’ll walk\naway with',
    items: [
      {
        label: 'Project tokenomics',
        text: 'We build a full token model covering utility, allocation, cliffs, vesting, and issuance',
        points: ['Token economic model', 'Allocation and vesting structure', 'Utility mechanics', 'Issuance projections'],
      },
      {
        label: 'White Paper',
        text: 'We define the project concept, token logic, and the principles behind the ecosystem',
        points: ['Technical documentation', 'Project roadmap', 'Economic model overview', 'Legal considerations'],
      },
      {
        label: 'Pitch Deck',
        text: 'We prepare the investor presentation and supporting materials',
        points: ['Investor presentation', 'Data visualization', 'Financial projections', 'Meeting materials'],
      },
      {
        label: 'Partner strategy',
        text: 'We identify the right partners across key areas and help organize the process around them',
        points: ['Market making', 'Smart contract development', 'Marketing and PR', 'Legal support'],
      },
      {
        label: 'Listing and go-to-market',
        text: 'We help prepare the token for exchange listing and market entry',
        points: ['TGE preparation', 'Launch strategy', 'Exchange introductions', 'Post-launch support'],
      },
      {
        label: 'Ongoing advisory support',
        text: 'Up to 10 calls per month, 90 minutes each, with our experts throughout the project',
        points: ['Strategic questions', 'Investor meeting preparation', 'Partner coordination'],
      },
    ],
  },
  utilityCta: {
    title: 'A token utility is only limited by\nthe way you think about it',
    description: 'If you haven’t found the right use case yet, we’ll gladly do that part for you',
  },
  steps: [
    {
      title: 'We get deep into the project',
      description: 'Looking at the business model, team, goals, and broader potential helps us understand what the project is really building toward.',
    },
    { title: 'We shape the strategy', description: 'From there, we define the key growth paths and build the economic architecture around them.' },
    {
      title: 'We work through the partner ecosystem',
      description: 'That includes identifying, evaluating, and aligning with the key partners the project needs.',
    },
    { title: 'We create the full set of materials', description: 'This covers the tokenomics, white paper, pitch deck, and supporting investor materials.' },
    {
      title: 'We stay involved through execution',
      description: 'Support continues across every stage of implementation, including work with partners and exchanges.',
    },
    { title: 'We stay close to the team', description: 'Up to 10 calls per month, 90 minutes each.' },
  ],
  useCases: {
    title: 'Where strategic consulting matters most',
    tabsLabel: 'Industries',
    items: [
      {
        label: 'Invest',
        cards: [
          {
            title: 'The tokenomics starts to conflict with the business model',
            description:
              'As the token price rises, using it can become less attractive and create a mismatch between the value of the product and the cost to the user.',
          },
          {
            title: "The token doesn't strengthen the core product",
            description: 'If its role comes down to yield or fee payments alone, the model becomes fragile very quickly.',
          },
          {
            title: 'The user gets too little real utility',
            description: 'A token should unlock something extra inside the product, not just duplicate what is already available without it.',
          },
          {
            title: 'The token economy starts working against growth',
            description: 'The model has to help the business scale, not create constraints that slow it down.',
          },
        ],
      },
      {
        label: 'RWA',
        cards: [
          {
            title: "Tokenization on its own doesn't solve the business problem",
            description: "Wrapping an asset in a token doesn't automatically create demand or make the product stronger.",
          },
          {
            title: "It's not clear why the project needs a token",
            description:
              'Before launch, the team needs to define the purpose of tokenization and understand the role the token plays in the broader business strategy.',
          },
          {
            title: 'The RWA token sits outside the ecosystem',
            description: 'Without utility mechanics, partner logic, or a broader product model around it, it remains an isolated instrument.',
          },
          {
            title: "The business doesn't gain new demand",
            description:
              "In many cases, growth doesn't come from the RWA token itself, but from the system built around it, including the utility layer.",
          },
        ],
      },
      {
        label: 'DeFi',
        cards: [
          {
            title: 'The blockchain choice works against the product',
            description: 'A bad choice here affects gas costs, scalability, security, and the size of the user base you can realistically reach.',
          },
          {
            title: "The token doesn't strengthen the financial model",
            description: "In DeFi, adding a token on top isn't enough. It needs to reinforce the product and support real demand.",
          },
          {
            title: 'The user journey is underdesigned',
            description: "You need a clear view of who the user is, what problem they're solving, and why they'd choose your product over anything else.",
          },
          {
            title: "The market can't clearly see the model's value",
            description:
              "Even a strong product gets harder to trust if its financial logic and token utility don't come together in a system people can clearly understand.",
          },
        ],
      },
      {
        label: 'GameFi',
        cards: [
          {
            title: 'The economy breaks when earning and spending fall out of balance',
            description: 'If the model is built around earning and selling the token instead of using it, the system quickly becomes unstable.',
          },
          {
            title: 'Players get more value from selling than using',
            description: 'When selling the token feels more rewarding than using it inside the game, the in-game economy starts working against the project.',
          },
          {
            title: "The token doesn't support the gameplay loop",
            description: 'The economy should reinforce progression, engagement, and retention, not turn the product into a short-term farm.',
          },
          {
            title: "The mechanics don't scale with the audience",
            description: "Even a working model can break under growth if the balance between issuance, utility, and burning isn't thought through.",
          },
        ],
      },
    ],
  },
  faq: [
    {
      question: 'Who is strategic consulting for?',
      answer:
        'Strategic consulting is for teams that need more than just tokenomics. It’s for projects that want to build the full launch logic, from the project’s economics and investor-ready materials to the partner ecosystem and TGE preparation. In most cases, it’s the right fit for teams going to market for the first time or getting ready for the next stage of growth.',
    },
    {
      question: 'At what project stage should we engage you?',
      answer:
        'The earlier, the better. The ideal moment is when the team already has an idea, product logic, or some early materials, but the key decisions around the token, investor packaging, and go-to-market strategy still haven’t been locked in. That said, we can also step in later if the project is already actively preparing for launch.',
    },
    {
      question: 'Can we engage if we already have tokenomics or a white paper?',
      answer:
        'Absolutely. If you already have some of the materials in place, we don’t duplicate work just for the sake of it. We look at what can be kept, what needs refining, and what makes more sense to rebuild. From there, we pull everything into one strategy and close the gaps between the documents, the economics, and the launch plan.',
    },
    {
      question: 'What should we prepare before kickoff?',
      answer:
        'At the start, we’ll want to see everything the project already has: presentations, draft white papers, a product overview, roadmap, the current token model, and any available information on rounds, team structure, and project goals. Even if the materials are still incomplete, that’s usually enough to get started and see where deeper working sessions with the team will be needed.',
    },
    {
      question: 'Who from our side should be involved?',
      answer:
        'Usually, it’s the founders and the key team members who shape the product, strategy, and project economics. Depending on how the project is structured, that might include the CEO, COO, CFO, product lead, marketing team, and technical team. What matters most is that decisions can be discussed quickly with the people who influence the launch.',
    },
    {
      question: 'Do you only consult, or also support implementation?',
      answer:
        'We go well beyond recommendations. As part of strategic consulting, we work through the model, prepare the key materials, help shape the partner ecosystem, and stay involved as the project moves into execution. It’s not a one-call format. It’s an active working process where we’re built into the team’s real tasks.',
    },
    {
      question: 'Do you help with partner selection?',
      answer:
        'Yes. We help define which partners the project needs at the launch prep stage, and we stay involved throughout the selection process across key areas such as market making, marketing, smart contracts, and other functions that matter for taking the token to market. We don’t just pass along contacts or make introductions. We stay in the process, join the calls, help shape the brief for each contractor, and make sure the whole thing moves toward a clearer, more manageable outcome.',
    },
    {
      question: 'How long does the work take, and can it be accelerated?',
      answer:
        'Strategic consulting usually takes between 2 and 4 months. The exact timing depends on the stage of the project, the quality of the source materials, how quickly the team communicates internally, and how long coordination takes with outside partners. If needed, the process can be accelerated. The engagement is broken into key workstreams that are defined in the contract, and we can move faster through each of them. In that case, payment is tied to completed work blocks rather than billed monthly.',
    },
    {
      question: 'What is not included in strategic consulting?',
      answer:
        'Strategic consulting doesn’t include legal work, smart contract development, marketing production, technical execution by outside contractors, or recommendations on how to expand or redesign the product line. That said, we can help identify which specialists the project needs and make sure their work fits into the broader launch strategy.',
    },
    {
      question: 'What is the final outcome?',
      answer:
        'By the end, you won’t just have a stack of documents. You’ll have a complete launch preparation system: tokenomics, a white paper, a pitch deck, a partner strategy, and a go-to-market plan. That gives the team a much stronger foundation for investor conversations, TGE preparation, and the operational steps that come next.',
    },
    {
      question: 'Is modeling included?',
      answer: 'No. Modeling is a separate service available as Monte Carlo simulation in Python or visual simulation in Machinations.',
    },
  ],
}

const workshop = {
  meta: {
    title: 'Tokenomics Workshop',
    description:
      "A 1–3 hour structured session that surfaces your token's core assumptions and delivers 2–3 working concepts. $2,500. First call free.",
    ogTitle: 'Tokenomics Workshop — 8Blocks',
    ogDescription:
      'Find out who needs your token and why. Interactive workshop with an individual scenario. $2,500 · 1–3 hours · full team.',
    twitterTitle: 'Tokenomics Workshop — 8Blocks',
    twitterDescription: '85% of tokens trade below their TGE price. Find out why — and fix it before launch. Workshop from $2,500.',
  },
  hero: {
    title: 'Who needs your token?\nAnd why should anyone buy it?',
    description:
      'An interactive workshop with an individual scenario. Leave with concrete tokenomics concepts — not theory, but a foundation for real design.',
    stat: {
      source: 'Memento Research',
      sourceHref: 'https://mementoresearch.com/state-of-2025-token-launches-year-in-review',
      sourceTitle: 'Memento Research, State of 2025 Token Launches',
      text: '85% of tokens trade below their TGE price',
    },
    book: { label: 'Book a workshop', href: '/contact' },
    failure: { label: 'See what failure looks like', href: '#ws-pain' },
    facts: ['$2,500', '1–3 hours', 'full team'],
  },
  people: {
    title: 'Two people. One mistake.',
    description:
      "Tokenomics gets skipped — not because teams don't know about it — but because everyone assumes someone else already handled it.",
    items: [
      {
        label: 'CEO / Co-founder',
        title: '“Once we launch the token, investors will come on their own.”',
        description:
          'The round is closed, the listing is agreed. But the question — why would anyone hold the token for more than two weeks — has no answer. Within a month of TGE, the dump begins. Investors lose confidence. The team blames the market.',
      },
      {
        label: 'CPO / Product Lead',
        title: '“We’ll integrate the token into the product later.”',
        description:
          'The architecture is ready, users are there. Then it turns out the token doesn’t fit into the product logic without rewriting half the mechanics. Two months of refactoring, a delayed TGE, and competitors move ahead.',
      },
    ],
  },
  trajectory: {
    title: 'Typical trajectory\nwithout tokenomics work',
    items: [
      { title: 'TGE + Listing', description: 'Hype, volume, price rise. The team thinks: “everything is working.”' },
      { title: 'Week 2–3', description: 'No real demand-side. Early investors take profits. Price starts to fall.' },
      { title: 'Month 2', description: 'Team is “working on utility.” Community is waiting. Price at −70% from ATH.' },
      { title: 'Month 4+', description: 'Retokenomics. A new round of consultants, lost time, and reputational damage.' },
    ],
  },
  what: {
    title: 'What is a tokenomics workshop',
    description:
      'A structured session with your project team: in 1–3 hours you surface the key assumptions in your token design and shape 2–3 working concepts to build on.',
    items: [
      {
        title: 'Where we focus',
        description:
          'Not on building the full model end-to-end, but on the strategic foundation: why the token matters to the product, who creates demand, and how the token fits into product logic.',
      },
      {
        title: 'Who it is for',
        description:
          'Teams planning a TGE in the next 3–6 months, and projects that have already seen a post-launch token drawdown and need a path to redesign the model.',
      },
      {
        title: 'Why it matters',
        description:
          'In our experience, 95% of teams that skip this step come back to it within 2–4 months after TGE — when the cost of mistakes is higher: time is gone and community trust is damaged.',
      },
    ],
  },
  audience: {
    eyebrow: 'Who is this for?',
    title: 'Teams before a token launch —\nor facing retokenomics',
    facts: ['60–180 minutes · brainstorm format', '1–3 days from first call to workshop', 'Individual scenario tailored to your product'],
  },
  results: {
    title: 'Three concrete results',
    description: 'Everything you need to move to full tokenomics design — or to make an informed decision not to.',
    items: [
      { title: 'Session recording', description: 'Rewatch and share with your team and investors at any time.' },
      { title: 'Insights document', description: 'What works for your model, what doesn’t, and exactly why.' },
      { title: '2–3 tokenomics concepts', description: 'Described concepts ready to serve as the foundation for full design.' },
    ],
  },
  credit: {
    title: '$2,500 is credited toward the full project',
    description:
      'If you continue with full tokenomics design at 8Blocks, the workshop fee is deducted from the project cost. This is not an expense — it’s a deposit.',
    action: { label: 'Learn about full tokenomics design', href: '/services/tokenomics' },
  },
  steps: {
    title: 'Three steps to ready concepts',
    items: [
      {
        title: 'First call · 30 min, free',
        description:
          'You tell us about the product, the team, and your plans. We decide if the workshop is right for you — and if so, we schedule a date and send the invoice.',
      },
      {
        title: 'Scenario prep · 1–2 days',
        description: 'We study your product, market, and competitors. We build a custom scenario for your case — no templates.',
      },
      {
        title: 'Workshop · 60–180 min',
        description:
          'Your team + our experts. We work through the scenario, surface assumptions, and form concepts. Afterwards: recording, insights, tokenomics concepts.',
      },
    ],
  },
  questions: {
    title: '15 questions that change everything',
    description: 'The real scenario is built for you — but these questions run through every case.',
    labels: { prev: 'Previous questions', next: 'Next questions' },
    items: [
      'What is your product?',
      'Who is your user?',
      'Who else interacts with the product?',
      'Why does your project need a token?',
      'How does the token interact with the product?',
      'Will the token trade on an exchange?',
      'How will the token reach customers?',
      'How can customers use the token?',
      'What do customers get from using it?',
      'Who will create the most demand?',
      'What if customers don’t come?',
      'What if people only sell the token?',
      'What happens when strong competitors appear?',
      'What if customers don’t use the token?',
      'Why should anyone buy your token?',
    ],
  },
  comparison: {
    title: 'Workshop vs alternatives',
    caption: 'Workshop compared with other ways to design tokenomics',
    columns: ['Workshop 8blocks', 'Full consulting', 'Template solutions', 'Self-managed'],
    rows: [
      { label: 'Timeline', values: ['1–3 hours', '4–12 weeks', 'Instant', '1–6 months'] },
      { label: 'Price', values: ['$2,500', '$30,000–$150,000', '$0–$5,000', 'Team time'] },
      { label: 'Customization', values: ['Full', 'Full', 'Zero', 'Full'] },
      { label: 'Depth', values: ['Concepts', 'Full model', 'Basic', 'Varies'] },
      { label: 'Risk of failure', values: ['Low', 'Minimal', 'High', 'Very high'] },
      { label: 'Best for', values: ['Pre-TGE, retokenomics', 'Pre-TGE with budget', 'Hackathons, MVP', 'In-house expert'] },
    ],
  },
  proof: {
    quote: '“Their suggestions were practical and actionable, not just theoretical observations.”',
    author: 'Vera Yurkova',
    role: 'Apr 28, 2026. Brand & Communications Lead, EarnPark',
    /** The availability note after the prefix comes from the SEO global (admin). */
    slots: {
      title: 'Maximum 6 workshops per month.',
      descriptionPrefix: 'Each one requires a custom scenario — that takes real time.',
    },
    stats: [
      { value: '2017', label: 'Building token economies' },
      { value: '$180M+', label: 'Raised by clients before TGE' },
      { value: '100%', label: 'Token as part of the product' },
      { value: '5', label: 'Verticals: DeFi, GameFi, RWA, infrastructure, finance' },
    ],
    offices: 'Offices in Dubai and Berlin. Clients across the US, Europe, and MENA.',
  },
  partnersLabel: 'Partners',
  faq: [
    {
      question: 'What is a tokenomics workshop and how is it different from consulting?',
      answer:
        'A workshop is a 1–3 hour structured session focused on strategic foundations: who needs your token and why. Unlike full consulting — which produces a complete economic model over 4–12 weeks — the workshop surfaces core assumptions and delivers 2–3 ready concepts. It is ideal when you need direction quickly rather than a finished document.',
    },
    {
      question: 'How much does the workshop cost?',
      answer:
        'The workshop costs $2,500. This fee is fully credited toward full tokenomics design if you continue with 8Blocks. The first discovery call is free and takes about 30 minutes — no commitment required.',
    },
    {
      question: 'How long does the process take from first contact to results?',
      answer:
        'Typically 3–5 days: one day to confirm fit on a free call, 1–2 days for us to prepare your custom scenario, and 1–3 hours for the workshop. You receive the recording, insights document, and concept descriptions within 24 hours after the session.',
    },
    {
      question: 'Who should attend from our team?',
      answer:
        'The workshop is designed for the full founding or core team: CEO, CPO, CTO, and anyone responsible for product economics or community. The more context participants bring, the more concrete the resulting concepts.',
    },
    {
      question: 'Is the workshop suitable if we already launched our token?',
      answer:
        'Yes. Retokenomics is one of the main use cases. If your token is trading significantly below TGE price or community demand is stalling, the workshop identifies the structural gaps and gives you viable paths forward — without months of additional consulting.',
    },
  ],
  bookCta: { title: 'Book a workshop', action: { label: 'Apply', href: '/contact' } },
}

export const servicePages = { common, tokenomics, audit, consulting, workshop }
export type ServicePagesContent = typeof servicePages
