import { lang } from '@/shared/i18n'

type MethodologyContent = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  eyebrow: string
  lead: string
  publishedLabel: string
  updatedLabel: string
  publishedAt: string
  updatedAt: string
  philosophyTitle: string
  philosophy: string[]
  definitionTitle: string
  definition: string[]
  comparison: {
    caption: string
    headers: [string, string, string]
    rows: [string, string, string][]
  }
  problemTitle: string
  problem: string[]
  metricsTitle: string
  metricsLead: string
  metrics: { title: string; text: string }[]
  pullQuote: string
  blocksTitle: string
  blocksLead: string
  blocks: {
    id: string
    title: string
    question: string
    answer: string
    paragraphs: string[]
    points?: string[]
  }[]
  treasury: {
    title: string
    description: string
    steps: string[]
    caption: string
  }
  cel: {
    title: string
    definition: string
    paragraphs: string[]
    steps: string[]
    listingQuestion: string
    listingAnswer: string
    listingCriteria: string[]
  }
  examplesTitle: string
  examples: { title: string; text: string; sourceLabel: string; sourceHref: string }[]
  faqTitle: string
  faq: { question: string; answer: string }[]
  disclaimerTitle: string
  disclaimer: string
  breadcrumbHome: string
  breadcrumbCurrent: string
  authorLabel: string
  authorName: string
  tocLabel: string
}

const en: MethodologyContent = {
  slug: 'methodology',
  title: 'The 8Blocks Methodology',
  metaTitle: '8Blocks Methodology: Tokenomics as a Token Economic Model',
  metaDescription:
    'A tokenomics design framework built on 8 blocks: positioning, pricing, distribution, utility, circulation, ecosystem, retention and scarcity. By 8Blocks, since 2017.',
  eyebrow: 'Tokenomics design framework · since 2017',
  lead:
    'The 8Blocks Methodology is a tokenomics design framework of eight blocks used to build Token Economic Models since 2017. It connects token supply, utility and circulation to the goals and economics of a real product.',
  publishedLabel: 'Published',
  updatedLabel: 'Updated',
  publishedAt: '2026-08-19',
  updatedAt: '2026-08-19',
  philosophyTitle: 'Why 8Blocks starts with logic, not projections',
  philosophy: [
    'Classic tokenomics reduced the work to allocations, lockups and vesting. Those numbers are useful, but a distribution schedule detached from business goals cannot explain why a token should exist or who will buy it.',
    'The 8Blocks methodology treats a token as a product whose demand must be earned. Instead of presenting speculative price forecasts as certainty, it maps the product, buyers, utility, circulation and sources of scarcity into one testable economic logic.',
  ],
  definitionTitle: 'What is a Token Economic Model?',
  definition: [
    'A Token Economic Model (TEM) is a single, public description of how a token is issued, acquired, used, circulated, retained and removed from circulation. It gives founders, users, partners and investors the same account of the token lifecycle.',
    'In the 8Blocks methodology, classic tokenomics is one part of the TEM rather than the whole document. The model covers the complete path from initial distribution to utility, Treasury flows, recurring demand and supply reduction.',
  ],
  comparison: {
    caption: 'Tokenomics vs Token Economic Model',
    headers: ['Property', 'Classic tokenomics', 'Token Economic Model'],
    rows: [
      ['Primary focus', 'Allocations, unlocks and vesting', 'The complete token lifecycle'],
      ['Business connection', 'Often indirect', 'Demand is tied to product use'],
      ['Time horizon', 'Usually through TGE', 'From issuance through repeated circulation'],
      ['Core question', 'How are tokens distributed?', 'Who buys the token, why and what happens next?'],
      ['Output', 'Tables and schedules', 'A shared operating logic for the token economy'],
    ],
  },
  problemTitle: 'Why classic tokenomics fails',
  problem: [
    'A token can have a polished allocation chart and still have no reason to be purchased. When teams plan only for fundraising and TGE, utility, staking yield, burns and post-use token flows remain ambiguous. Users form false expectations and teams lose a common decision framework.',
    'A Token Economic Model reduces this uncertainty by making demand, monetization and circulation explicit. It does not guarantee market performance; it makes the assumptions visible enough to inspect, test and revise.',
  ],
  metricsTitle: 'How to tell if a token economic model works',
  metricsLead:
    'A workable model should connect every source of supply with a credible source of demand and a transparent destination after the token is used.',
  metrics: [
    {
      title: 'A dated utility milestone',
      text: 'The model states when a product function becomes available and how many tokens a user must acquire or lock.',
    },
    {
      title: 'Transparent revenue sources',
      text: 'Rewards come from named business revenue or another disclosed source, not from unexplained new issuance.',
    },
    {
      title: 'More than one demand source',
      text: 'Product access, discounts, B2B use, buybacks or partner integrations create independent reasons to acquire tokens.',
    },
    {
      title: 'A complete circulation mechanism',
      text: 'The model shows where spent tokens go, how long they remain locked and under which rules they can return to market.',
    },
    {
      title: 'Supply aligned with market size',
      text: 'Expected annual token use is compared with unlocks, emissions and rewards to expose structural imbalance.',
    },
  ],
  pullQuote: 'Who will buy this token, and why?',
  blocksTitle: 'The eight blocks of the 8Blocks methodology',
  blocksLead:
    'Each block answers a decision founders must make before launch. Together they form one Token Economic Model rather than eight isolated calculations.',
  blocks: [
    {
      id: 'positioning',
      title: 'Positioning',
      question: 'Does my project need a token?',
      answer:
        'Only when the token performs a necessary role that existing money or stablecoins cannot perform as effectively. If a credible Token Economic Model cannot connect the token to product demand, issuing it can add cost and risk without adding value.',
      paragraphs: [
        'Positioning defines the purpose, legal and functional format, and initial network. The goal may be product access, loyalty, cross-border coordination, community participation or fundraising, but the chosen format must fit the applicable legal framework.',
        'The launch chain affects distribution, cost and compliance exposure, but it need not limit future expansion to compatible networks.',
      ],
      points: ['Purpose of issuance', 'Token format', 'Launch network and expansion path'],
    },
    {
      id: 'pricing',
      title: 'Pricing',
      question: 'How big should token supply be?',
      answer:
        'Supply should be calculated after utility and circulation are known. It must be large enough for users to access the product, yet proportionate to expected demand, unlocks and the scale of the addressable market.',
      paragraphs: [
        'The block covers target Fully Diluted Valuation (FDV) at Token Generation Event (TGE), launch price, round pricing and maximum supply. There is no universal correct FDV or standard supply: the assumptions behind the number matter more than convention.',
        'Oversupply is usually more damaging than an unconventional token count because healthy product demand may still be unable to absorb emissions.',
      ],
      points: ['Evidence-based FDV', 'Utility-sized supply', 'Demand and emission balance'],
    },
    {
      id: 'distribution',
      title: 'Initial token distribution',
      question: 'Should early investors get a discount?',
      answer:
        'The discount should be minimal or absent. A deep discount gives early buyers a profitable exit below the TGE price and creates structural sell pressure that later users must absorb.',
      paragraphs: [
        'The 8Blocks methodology groups supply into team-controlled, investor-controlled and ecosystem tokens. The objective is to avoid price control by any one group while keeping enough supply available for users to earn and use.',
        'Community distributions are not free: the project should estimate acquisition cost, reserve the corresponding liquidity and plan how released tokens will be absorbed.',
      ],
      points: ['Limited early-investor concentration', 'Limited team concentration', 'More earnable ecosystem supply'],
    },
    {
      id: 'utility',
      title: 'Token utility',
      question: 'How many utilities should a token launch with?',
      answer:
        'Start with one function that a clearly defined user group genuinely needs. Preserve the ability to add new functions as the product and ecosystem grow.',
      paragraphs: [
        'A simple first utility makes the reason to buy understandable. Later utilities should reach new buyer groups instead of multiplying features for the same users.',
        'A flexible model does not lock the token into one product forever; it creates an extensible demand layer around the business.',
      ],
      points: ['One clear launch utility', 'New utilities for new buyer groups', 'Continuous product-led expansion'],
    },
    {
      id: 'circulation',
      title: 'Token circulation',
      question: 'What is a Treasury in tokenomics?',
      answer:
        'A Treasury is the transparent mechanism that receives, stores and redistributes tokens under disclosed conditions. It can include stabilization, buyback and reward funds governed by smart contracts.',
      paragraphs: [
        'The circulation map follows tokens from allocation and market supply through acquisition, use, storage and eventual release or removal. Every monetization point must be visible.',
        'Since 2019, 8Blocks models have used Treasury logic to hold tokens after use and return part of them to the market only under predetermined conditions.',
      ],
      points: ['Post-use destination', 'Lock and release rules', 'Transparent monetization points'],
    },
    {
      id: 'ecosystem',
      title: 'Ecosystem approach',
      question: 'Why build an ecosystem around one token?',
      answer:
        'An ecosystem lets multiple products and participant groups create demand for the same token. That makes demand less dependent on one feature or one market cycle.',
      paragraphs: [
        'A platform that supports many product instances can create more utility than a single isolated launch. Direct customers, partners and B2B networks can each contribute distinct demand.',
        'The ecosystem is therefore an operating model, not a marketing label: products must share meaningful token flows and value creation.',
      ],
    },
    {
      id: 'retention',
      title: 'Token retention',
      question: 'Why is TVL not always a good metric?',
      answer:
        'Total Value Locked (TVL) is useful only when locking serves a business purpose. Reward-only staking can inflate TVL temporarily while creating future sell pressure from newly issued rewards.',
      paragraphs: [
        'Retention can bridge the time until utility launches, power loyalty benefits, secure a protocol or determine voting weight. The benefit must justify the lock.',
        'The model should track what users receive, where rewards come from and what happens when locked supply returns to the market.',
      ],
      points: ['Purpose-led locking', 'Funded rewards', 'Known unlock consequences'],
    },
    {
      id: 'scarcity',
      title: 'Creating scarcity',
      question: 'How does a token become scarce?',
      answer:
        'Scarcity appears when credible demand exceeds available supply. Burns and locks cannot create durable scarcity for a token nobody needs.',
      paragraphs: [
        'Scarcity is not the same as demand or monetary deflation. It can emerge when product use grows faster than emissions, useful tokens are locked or removed, or new utilities attract new buyer groups.',
        'The 8Blocks methodology uses scarcity to connect the token to commercial success: stronger product use should increase token demand or reduce liquid supply through explicit mechanisms.',
      ],
      points: ['Demand before supply reduction', 'Emissions below useful demand', 'Product growth linked to token demand'],
    },
  ],
  treasury: {
    title: 'The token lifecycle through Treasury',
    description:
      'A complete circulation design shows each transition and the rules that control it.',
    steps: ['Initial distribution', 'Market acquisition', 'Product utility', 'Treasury', 'Lock, reuse or burn', 'Return to market'],
    caption:
      'Token Treasury mechanism: tokens move from distribution to users, through product utility into Treasury, then follow disclosed lock, reuse, burn or market-release rules.',
  },
  cel: {
    title: 'What is a Closed Economic Loop?',
    definition:
      'A Closed Economic Loop (CEL) is a system that generates recurring cash flow from real product users rather than depending only on market hype or the initial token sale.',
    paragraphs: [
      'Users acquire tokens, use them in the product and send them into a disclosed Treasury flow. Eligible tokens may later return to the market for the next user, while the project monetizes repeated circulation.',
      'A CEL is not a separate feature. It is a design principle connecting utility, storage, release and monetization across the model. It can make the business more resilient during broad crypto-market downturns, but it does not make a token independent of all market risk.',
    ],
    steps: ['Product demand', 'Token purchase', 'Use in product', 'Treasury flow', 'Controlled reissue', 'Recurring demand'],
    listingQuestion: 'Does the choice of exchange determine token price?',
    listingAnswer:
      'No exchange can replace product demand, community access and a coherent Token Economic Model. Exchange quality still matters for custody, access and liquidity, but a recognizable brand alone does not guarantee post-listing performance.',
    listingCriteria: [
      'The project community can register and trade',
      'No material history of fraud or arbitrary seizure',
      'Healthy, verifiable trading activity',
      'Access for professional market participants',
    ],
  },
  examplesTitle: 'Examples and evidence',
  examples: [
    {
      title: 'BNB: utility that expanded with the ecosystem',
      text: 'BNB began with exchange-fee utility and later gained uses across Launchpool, services and BNB Chain. It illustrates how an extensible model can add new demand sources as the business develops.',
      sourceLabel: 'Official BNB documentation',
      sourceHref: 'https://www.bnbchain.org/en/bnb-chain-whitepaper',
    },
    {
      title: 'Hyperliquid: product demand and protocol expansion',
      text: 'HYPE combines protocol utility with ecosystem development. Its design is a useful reference for studying how professional and B2B participants can become distinct demand groups.',
      sourceLabel: 'Hyperliquid documentation',
      sourceHref: 'https://hyperliquid.gitbook.io/hyperliquid-docs',
    },
    {
      title: 'STEPN: emissions without enough external demand',
      text: 'STEPN demonstrates the risk of a loop where users earn and spend tokens mainly to earn more. When progression matures, emissions can exceed demand from new or existing users.',
      sourceLabel: 'STEPN whitepaper',
      sourceHref: 'https://whitepaper.stepn.com/',
    },
  ],
  faqTitle: 'Tokenomics methodology FAQ',
  faq: [
    {
      question: 'How is a Token Economic Model different from tokenomics?',
      answer:
        'Classic tokenomics usually describes supply, allocations, unlocks and vesting. A Token Economic Model covers the full lifecycle: why the token exists, who buys it, how it is used, where it goes afterward, how demand recurs and how liquid supply changes. Tokenomics is therefore one block inside the broader model.',
    },
    {
      question: 'Does every business need a token?',
      answer:
        'No. Many Web3 businesses work better with existing money or stablecoins. A token is justified when it performs a necessary role in product access, coordination, incentives or value circulation that another instrument cannot provide as effectively. If that role cannot be explained clearly, issuing a token may increase cost and risk.',
    },
    {
      question: 'What is a Closed Economic Loop?',
      answer:
        'A Closed Economic Loop is a recurring flow in which users acquire tokens, use them in a real product and send them into a transparent Treasury mechanism. Some tokens can later return to circulation under disclosed rules, creating repeat demand and monetization beyond the initial sale.',
    },
    {
      question: 'Does the exchange choice affect token price?',
      answer:
        'Exchange access, liquidity quality, custody practices and reputation matter, but the exchange name alone cannot create durable demand. Post-listing performance depends more fundamentally on product utility, circulating supply, unlocks, communication and the project’s ability to attract and retain real token users.',
    },
    {
      question: 'How many tokens should a project issue?',
      answer:
        'There is no universal supply. The number should be calculated after utility, expected customer volume, token consumption, unlocks and emissions are known. Supply must let users access the product without creating a persistent surplus that even healthy demand cannot absorb.',
    },
    {
      question: 'Should early investors receive a token discount?',
      answer:
        'A discount may compensate early risk, but it should be small and modeled against post-TGE liquidity. Deep discounts let early investors sell profitably below the public launch price, creating structural sell pressure and unequal break-even points for later participants.',
    },
    {
      question: 'What is a Treasury in tokenomics?',
      answer:
        'A Treasury is the mechanism that receives, holds and redistributes tokens according to public rules. It may contain stabilization, buyback and reward funds. Smart-contract enforcement can make lock periods, release conditions, burns and market returns auditable for users and investors.',
    },
    {
      question: 'Why is TVL not always a good metric?',
      answer:
        'TVL measures value locked, not whether the lock creates useful demand or sustainable revenue. Reward-only staking can raise TVL while issuing tokens that later reach the market as sell pressure. The metric is useful only alongside the lock’s purpose, reward source and unlock consequences.',
    },
  ],
  disclaimerTitle: 'Important information',
  disclaimer:
    'This material is educational and does not constitute investment, legal, tax or financial advice. Token issuance, distribution, buybacks, staking and listings may be regulated differently across jurisdictions. Obtain qualified advice before implementing a token economic model.',
  breadcrumbHome: 'Home',
  breadcrumbCurrent: 'Tokenomics methodology',
  authorLabel: 'By',
  authorName: '8Blocks methodology team',
  tocLabel: 'On this page',
}

const ru: MethodologyContent = {
  slug: 'methodology',
  title: 'Методология А8А9',
  metaTitle: 'Методология А8А9: разработка токеномики через экономическую модель токена',
  metaDescription:
    'Фреймворк разработки токеномики из 8 блоков: позиционирование, ценообразование, распределение, применение, обращение, экосистема, удержание и дефицит.',
  eyebrow: 'Методология А8А9 · с 2017 года',
  lead:
    'Фреймворк разработки токеномики из восьми блоков, применяемый для создания Экономических моделей токена с 2017 года. Он связывает предложение, применение и обращение токена с продуктом и экономикой реального бизнеса.',
  publishedLabel: 'Опубликовано',
  updatedLabel: 'Обновлено',
  publishedAt: '2026-08-19',
  updatedAt: '2026-08-19',
  philosophyTitle: 'Почему А8А9 опирается на логику, а не на прогнозы',
  philosophy: [
    'Классическая токеномика свела работу к аллокациям, локапам и вестингу. Эти расчёты полезны, но оторванное от целей бизнеса распределение не объясняет, зачем существует токен и кто будет его покупать.',
    'Методология А8А9 рассматривает токен как товар, спрос на который нужно сформировать. Вместо выдачи прогнозов цены за достоверный результат она объединяет продукт, покупателей, применение, обращение и дефицит в одну проверяемую экономическую логику.',
  ],
  definitionTitle: 'Что такое Экономическая модель токена?',
  definition: [
    'Экономическая модель токена (ЭМТ) — это единое публичное описание выпуска, получения, применения, обращения, удержания и удаления токена из оборота. Фаундеры, пользователи, партнёры и инвесторы получают одинаковое представление о полном жизненном цикле токена.',
    'В методологии А8А9 классическая токеномика является частью ЭМТ, а не всем документом. Модель охватывает путь от начального распределения до применения, потоков Treasury, повторного спроса и сокращения ликвидного предложения.',
  ],
  comparison: {
    caption: 'Токеномика и Экономическая модель токена',
    headers: ['Свойство', 'Классическая токеномика', 'Экономическая модель токена'],
    rows: [
      ['Основной фокус', 'Аллокации, разблокировки и вестинг', 'Полный жизненный цикл токена'],
      ['Связь с бизнесом', 'Часто косвенная', 'Спрос связан с использованием продукта'],
      ['Горизонт', 'Обычно до TGE', 'От выпуска до повторного обращения'],
      ['Главный вопрос', 'Как распределены токены?', 'Кто купит токен, зачем и что произойдёт дальше?'],
      ['Результат', 'Таблицы и графики', 'Единая операционная логика токен-экономики'],
    ],
  },
  problemTitle: 'Почему классическая токеномика не работает',
  problem: [
    'У токена может быть аккуратная диаграмма распределения, но не быть причины для покупки. Если команда планирует только привлечение средств и TGE, применение, доходность стейкинга, сжигания и потоки после использования остаются неопределёнными. Пользователи формируют ложные ожидания, а команда теряет общую систему решений.',
    'Экономическая модель токена снижает неопределённость: явно описывает спрос, монетизацию и обращение. Она не гарантирует рыночный результат, но делает предположения доступными для проверки, тестирования и корректировки.',
  ],
  metricsTitle: 'Как понять, работает ли экономическая модель токена',
  metricsLead:
    'Работоспособная модель связывает каждый источник предложения с обоснованным источником спроса и прозрачным сценарием после использования токена.',
  metrics: [
    {
      title: 'Дата запуска применения',
      text: 'Указано, когда функция продукта станет доступна и сколько токенов пользователь должен купить или заблокировать.',
    },
    {
      title: 'Прозрачные источники дохода',
      text: 'Вознаграждения финансируются названной выручкой бизнеса или другим раскрытым источником, а не необъяснимой эмиссией.',
    },
    {
      title: 'Несколько источников спроса',
      text: 'Доступ к продукту, скидки, B2B-применение, байбеки и партнёрские интеграции создают независимые причины покупки.',
    },
    {
      title: 'Полный механизм обращения',
      text: 'Показано, куда поступают использованные токены, сколько хранятся и при каких условиях возвращаются на рынок.',
    },
    {
      title: 'Соответствие предложения рынку',
      text: 'Годовое использование сопоставляется с разблокировками, эмиссией и наградами, чтобы выявить структурный дисбаланс.',
    },
  ],
  pullQuote: 'Кто и зачем будет покупать этот токен?',
  blocksTitle: 'Восемь блоков методологии А8А9',
  blocksLead:
    'Каждый блок отвечает на решение, которое команда должна принять до запуска. Вместе они образуют единую Экономическую модель токена, а не восемь изолированных расчётов.',
  blocks: [
    {
      id: 'positioning',
      title: 'Позиционирование',
      question: 'Нужен ли проекту токен?',
      answer:
        'Только если токен выполняет необходимую роль, с которой существующие деньги или стейблкоины не справятся так же эффективно. Если ЭМТ не связывает токен со спросом на продукт, выпуск добавит расходы и риски без новой ценности.',
      paragraphs: [
        'Позиционирование определяет цель, правовой и функциональный формат, а также первую сеть. Целью может быть доступ к продукту, лояльность, трансграничная координация, участие сообщества или привлечение инвестиций, но формат должен соответствовать применимому праву.',
        'Стартовый блокчейн влияет на дистрибуцию, стоимость и регуляторный риск, но не обязан ограничивать последующее масштабирование в совместимые сети.',
      ],
      points: ['Цель выпуска', 'Формат токена', 'Стартовая сеть и путь масштабирования'],
    },
    {
      id: 'pricing',
      title: 'Ценообразование',
      question: 'Сколько токенов выпускать?',
      answer:
        'Эмиссию следует рассчитывать после определения применения и обращения. Токенов должно хватать для доступа пользователей к продукту, но предложение должно соответствовать ожидаемому спросу, разблокировкам и масштабу рынка.',
      paragraphs: [
        'Блок охватывает целевой Fully Diluted Valuation (FDV) на Token Generation Event (TGE), стартовую цену, цены раундов и максимальную эмиссию. Универсально правильного FDV или стандартного предложения не существует: важнее основания расчёта.',
        'Избыточное предложение обычно опаснее нестандартного количества токенов: даже здоровый спрос на продукт может не поглотить эмиссию.',
      ],
      points: ['Обоснованный FDV', 'Эмиссия по масштабу применения', 'Баланс спроса и выпуска'],
    },
    {
      id: 'distribution',
      title: 'Начальное распределение',
      question: 'Нужен ли дисконт ранним инвесторам?',
      answer:
        'Дисконт должен быть минимальным или отсутствовать. Большая скидка позволяет ранним покупателям прибыльно выйти ниже цены TGE и создаёт структурное давление продаж, которое должны поглощать следующие пользователи.',
      paragraphs: [
        'Методология А8А9 делит предложение на токены под управлением команды, инвесторов и экосистемы. Задача — не передать контроль над ценой одной группе и сохранить достаточный объём для добычи и использования пользователями.',
        'Раздача сообществу не бесплатна: проекту следует оценить стоимость привлечения, зарезервировать ликвидность и спланировать поглощение вышедших на рынок токенов.',
      ],
      points: ['Минимум концентрации у ранних инвесторов', 'Минимум концентрации у команды', 'Больше доступных к добыче токенов'],
    },
    {
      id: 'utility',
      title: 'Применение токенов',
      question: 'Сколько функций должно быть у токена на старте?',
      answer:
        'Начните с одной функции, действительно нужной понятной группе пользователей. При этом сохраните возможность добавлять новые функции по мере роста продукта и экосистемы.',
      paragraphs: [
        'Одна сильная функция делает причину покупки понятной. Следующие применения должны привлекать новые группы покупателей, а не просто умножать возможности для той же аудитории.',
        'Гибкая модель не запирает токен в одном продукте навсегда, а создаёт расширяемый слой спроса вокруг бизнеса.',
      ],
      points: ['Одна понятная функция на старте', 'Новые функции для новых покупателей', 'Непрерывное продуктовое развитие'],
    },
    {
      id: 'circulation',
      title: 'Обращение токенов',
      question: 'Что такое Treasury в токеномике?',
      answer:
        'Treasury — прозрачный механизм, который принимает, хранит и перераспределяет токены по раскрытым правилам. Он может включать стабилизационный фонд, фонд байбека и фонд вознаграждений под управлением смарт-контрактов.',
      paragraphs: [
        'Карта обращения прослеживает токены от аллокации и рыночного предложения через покупку, использование и хранение до повторного выпуска или удаления. Каждая точка монетизации должна быть видна.',
        'С 2019 года модели А8А9 используют логику Treasury для накопления токенов после использования и возврата части из них на рынок только при заранее определённых условиях.',
      ],
      points: ['Назначение после использования', 'Правила блокировки и выпуска', 'Прозрачные точки монетизации'],
    },
    {
      id: 'ecosystem',
      title: 'Экосистемный подход',
      question: 'Зачем строить экосистему вокруг одного токена?',
      answer:
        'Экосистема позволяет нескольким продуктам и группам участников создавать спрос на один токен. Спрос становится меньше зависим от одной функции или одного рыночного цикла.',
      paragraphs: [
        'Платформа, поддерживающая множество продуктовых сценариев, может создать больше применения, чем изолированный запуск. Клиенты, партнёры и B2B-сети формируют разные источники спроса.',
        'Экосистема — это не маркетинговый ярлык, а операционная модель: продукты должны разделять содержательные потоки токена и создание ценности.',
      ],
    },
    {
      id: 'retention',
      title: 'Удержание токенов',
      question: 'Почему TVL — не всегда хорошая метрика?',
      answer:
        'Total Value Locked (TVL) полезна, только если блокировка решает задачу бизнеса. Стейкинг только ради наград временно увеличивает TVL, но создаёт будущее давление продаж новыми токенами.',
      paragraphs: [
        'Удержание может перекрывать период до запуска применения, давать бонусы лояльности, защищать протокол или определять вес голоса. Выгода должна оправдывать блокировку.',
        'Модель должна показывать, что получает пользователь, откуда берутся награды и что произойдёт после возврата заблокированных токенов на рынок.',
      ],
      points: ['Блокировка с конкретной целью', 'Обеспеченные награды', 'Известные последствия разблокировки'],
    },
    {
      id: 'scarcity',
      title: 'Формирование дефицита',
      question: 'Как формируется дефицит токена?',
      answer:
        'Дефицит возникает, когда обоснованный спрос превышает доступное предложение. Сжигания и блокировки не создадут устойчивого дефицита для токена, который никому не нужен.',
      paragraphs: [
        'Дефицит — не то же самое, что спрос или денежная дефляция. Он появляется, когда использование продукта растёт быстрее эмиссии, полезные токены блокируются или удаляются, а новые функции привлекают дополнительные группы покупателей.',
        'Методология А8А9 использует дефицит для связи токена с коммерческим успехом: рост продукта должен повышать спрос или сокращать ликвидное предложение через явные механизмы.',
      ],
      points: ['Сначала спрос, затем сокращение предложения', 'Эмиссия ниже полезного спроса', 'Связь роста продукта и спроса на токен'],
    },
  ],
  treasury: {
    title: 'Жизненный цикл токена через Treasury',
    description:
      'Полная схема обращения показывает каждый переход и управляющие им правила.',
    steps: ['Начальное распределение', 'Покупка на рынке', 'Применение в продукте', 'Treasury', 'Блокировка, повторное использование или сжигание', 'Возврат на рынок'],
    caption:
      'Механизм Token Treasury: токены переходят от распределения к пользователям, через продукт попадают в Treasury, а затем блокируются, используются повторно, сжигаются или возвращаются на рынок по раскрытым правилам.',
  },
  cel: {
    title: 'Что такое Замкнутый экономический цикл?',
    definition:
      'Замкнутый экономический цикл (ЗЭЦ) — система, создающая повторный денежный поток от реальных пользователей продукта, а не зависящая только от рыночного хайпа или первичной продажи токенов.',
    paragraphs: [
      'Пользователи покупают токены, применяют их в продукте и направляют в прозрачный Treasury. Допустимая часть токенов позже возвращается на рынок для следующего пользователя, а проект монетизирует повторное обращение.',
      'ЗЭЦ — не отдельная функция, а принцип проектирования, связывающий применение, хранение, выпуск и монетизацию. Он может повысить устойчивость бизнеса во время общего спада крипторынка, но не делает токен независимым от всех рыночных рисков.',
    ],
    steps: ['Спрос на продукт', 'Покупка токена', 'Использование', 'Поток Treasury', 'Контролируемый выпуск', 'Повторный спрос'],
    listingQuestion: 'Влияет ли выбор биржи на цену токена?',
    listingAnswer:
      'Ни одна биржа не заменит спрос на продукт, доступ сообщества и целостную ЭМТ. Качество биржи важно для хранения, доступа и ликвидности, но узнаваемый бренд сам по себе не гарантирует результат после листинга.',
    listingCriteria: [
      'Комьюнити проекта может зарегистрироваться и торговать',
      'Нет существенной истории обмана или произвольного изъятия средств',
      'Есть здоровая и проверяемая торговая активность',
      'Есть доступ для профессиональных участников рынка',
    ],
  },
  examplesTitle: 'Примеры и доказательная база',
  examples: [
    {
      title: 'BNB: применение, расширенное вместе с экосистемой',
      text: 'BNB начал с оплаты биржевых комиссий и позднее получил применение в Launchpool, сервисах и BNB Chain. Пример показывает, как расширяемая модель добавляет источники спроса по мере развития бизнеса.',
      sourceLabel: 'Официальная документация BNB',
      sourceHref: 'https://www.bnbchain.org/en/bnb-chain-whitepaper',
    },
    {
      title: 'Hyperliquid: продуктовый спрос и развитие протокола',
      text: 'HYPE объединяет применение в протоколе с развитием экосистемы. Модель полезна для изучения того, как профессиональные и B2B-участники могут стать отдельными группами спроса.',
      sourceLabel: 'Документация Hyperliquid',
      sourceHref: 'https://hyperliquid.gitbook.io/hyperliquid-docs',
    },
    {
      title: 'STEPN: эмиссия без достаточного внешнего спроса',
      text: 'STEPN показывает риск цикла, в котором пользователи добывают и используют токены преимущественно ради дальнейшей добычи. После завершения прогрессии эмиссия может превысить спрос новых и текущих пользователей.',
      sourceLabel: 'Whitepaper STEPN',
      sourceHref: 'https://whitepaper.stepn.com/',
    },
  ],
  faqTitle: 'Вопросы о методологии токеномики',
  faq: [
    {
      question: 'Чем Экономическая модель токена отличается от токеномики?',
      answer:
        'Классическая токеномика обычно описывает предложение, аллокации, разблокировки и вестинг. ЭМТ охватывает полный жизненный цикл: зачем существует токен, кто его покупает, как применяет, куда он поступает дальше, как повторяется спрос и меняется ликвидное предложение. Поэтому токеномика является одним из блоков более широкой модели.',
    },
    {
      question: 'Нужен ли каждому бизнесу токен?',
      answer:
        'Нет. Многие Web3-бизнесы эффективнее работают с существующими деньгами или стейблкоинами. Токен оправдан, когда выполняет необходимую роль в доступе к продукту, координации, стимулах или обращении ценности. Если эту роль нельзя ясно объяснить, выпуск может только увеличить расходы и риски.',
    },
    {
      question: 'Что такое Замкнутый экономический цикл?',
      answer:
        'ЗЭЦ — повторяющийся поток, в котором пользователи приобретают токены, применяют их в реальном продукте и направляют в прозрачный Treasury. Часть токенов может вернуться в обращение по раскрытым правилам, создавая повторный спрос и монетизацию после первичной продажи.',
    },
    {
      question: 'Влияет ли выбор биржи на цену токена?',
      answer:
        'Доступность биржи, качество ликвидности, хранение и репутация важны, но одно имя биржи не создаёт устойчивый спрос. Результат после листинга фундаментально зависит от применения продукта, предложения в обращении, разблокировок, коммуникации и способности проекта привлекать и удерживать реальных пользователей токена.',
    },
    {
      question: 'Сколько токенов выпускать?',
      answer:
        'Универсального предложения нет. Количество рассчитывают после определения применения, ожидаемого числа клиентов, расходования токенов, разблокировок и эмиссии. Токенов должно хватать для доступа к продукту, но не должно возникать постоянного излишка, который не способен поглотить даже здоровый спрос.',
    },
    {
      question: 'Нужен ли дисконт ранним инвесторам?',
      answer:
        'Скидка может компенсировать ранний риск, но должна быть небольшой и моделироваться вместе с ликвидностью после TGE. Большой дисконт позволяет ранним инвесторам прибыльно продавать ниже публичной цены запуска, создавая структурное давление и разные точки безубыточности для участников.',
    },
    {
      question: 'Что такое Treasury в токеномике?',
      answer:
        'Treasury — механизм, который принимает, хранит и перераспределяет токены по публичным правилам. Он может включать стабилизационный фонд, фонд байбека и наград. Смарт-контракты делают сроки блокировки, условия выпуска, сжигания и возврата на рынок проверяемыми.',
    },
    {
      question: 'Почему TVL — не всегда хорошая метрика?',
      answer:
        'TVL измеряет заблокированную стоимость, но не полезность блокировки и устойчивость дохода. Стейкинг только ради наград может повысить TVL и одновременно выпустить токены, которые позднее создадут давление продаж. Метрику нужно оценивать вместе с целью блокировки, источником наград и последствиями разблокировки.',
    },
  ],
  disclaimerTitle: 'Важная информация',
  disclaimer:
    'Материал носит образовательный характер и не является инвестиционной, юридической, налоговой или финансовой рекомендацией. Выпуск, распределение, байбеки, стейкинг и листинг токенов регулируются по-разному в разных юрисдикциях. До реализации ЭМТ получите профильную консультацию.',
  breadcrumbHome: 'Главная',
  breadcrumbCurrent: 'Методология А8А9',
  authorLabel: 'Автор',
  authorName: 'Команда методологии А8А9',
  tocLabel: 'На этой странице',
}

export const methodologyContent = lang === 'en' ? en : ru
