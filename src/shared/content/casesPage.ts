import { t } from '@/shared/i18n'

const localize = <T>(ru: T, en?: T) => t({ ru, en: en ?? ru })

export type CaseTag = 'DeFi' | 'GameFi' | 'RWA' | 'Finance'

export interface CaseStudy {
  tag: CaseTag
  title: string
  task: string
  actions: string[]
  result: string
}

export const casesContent = localize({
  headline: 'Портфолио',
  description: 'Кейсы наших клиентов — от DeFi и GameFi до токенизации реальных активов и международных расчетов.',
} as const, {
  headline: 'Portfolio',
  description:
    "Our clients' case studies — from DeFi and GameFi to real-world asset tokenization and international settlements.",
} as const)

export const cases: CaseStudy[] = localize(
  [
    // ─── DeFi ──────────────────────────────────────────────────────
    {
      tag: 'DeFi',
      title: 'Криптобанк — восстановили доверие к токену проекта',
      task: 'Перезапустить токен и вернуть его значимость в экосистеме банка.',
      actions: [
        'Интегрировали обновленный токен в линейку доходных продуктов банка',
        'Провели закрытый сейл для клиентов и ретродроп для активных пользователей',
        'Запустили токен через собственный лаунчпад, сохранив прозрачность эмиссии',
      ],
      result: 'Токен снова стал частью экосистемы, проект вернул клиентов и укрепил позиции в DeFi.',
    },
    {
      tag: 'DeFi',
      title: 'Краудлендинг — создали токеномику без рисков признания security',
      task: 'Построить токеномику, которая юридически надежна и помогает расти экосистеме.',
      actions: [
        'Разделили utility-токен и внутренний токен инфраструктуры, чтобы минимизировать регуляторные риски',
        'Внедрили механики стейкинга, страхового пула и ликвидных RWA-активов',
        'Упаковали модель так, чтобы проект получил utility-статус и прошел юридическую проверку',
      ],
      result:
        'Токен стал надежным инструментом для глобальной работы с клиентами и сохранил устойчивость по международным стандартам.',
    },
    {
      tag: 'DeFi',
      title: 'ВЭД-платформа — превратили договоры поставки в NFT и заменили расчеты на токены',
      task: 'Создать токенизированную модель поставок, которая упростит расчеты между странами и защитит участников от санкций.',
      actions: [
        'Оцифровали договоры поставки в формате NFT',
        'Рассчитали эмиссию и обеспечение токенов для торговых операций',
        'Добавили защитные механизмы, снижающие издержки и обходящие барьеры',
      ],
      result: 'Бизнес сократил расходы на трансграничные расчеты на 30% и упростил цепочку поставок.',
    },
    {
      tag: 'DeFi',
      title: 'Децентрализованный маркетмейкер — упростили процесс поддержания ликвидности токенов',
      task: 'Сформировать модель с устойчивой ликвидностью и прозрачным ценообразованием.',
      actions: [
        'Разработали механизмы эмиссии и утилизации токенов',
        'Смоделировали процесс ценообразования и баланс спроса и предложения',
        'Создали систему обеспечения с гарантиями успешности',
      ],
      result:
        'Ликвидность стабилизировалась, а маркетмейкер стал понятным и доступным инструментом для молодых проектов.',
    },
    {
      tag: 'DeFi',
      title: 'Launchpad — разработали модель, в которой рост токена неизбежен',
      task: 'Построить экономику токена, где его рост напрямую зависит от активности клиентов и динамики платформы.',
      actions: [
        'Разработали модель заморозки токенов для эмитентов',
        'Настроили механизм Proof of Issuer, подтверждающий выпуск',
        'Определили принципы распределения токенов и задали условия их обращения',
      ],
      result: 'Токен платформы сохраняет рост, пока у нее есть клиенты.',
    },
    {
      tag: 'DeFi',
      title: 'Крипто Lootbox — сделали лутбоксы децентрализованными',
      task: 'Дать пользователям возможность самим выпускать лутбоксы и зарабатывать на них.',
      actions: [
        'Смоделировали эмиссию и распределение токенов',
        'Разработали механизм покупки и продажи лутбоксов',
        'Рассчитали обеспечение при выпуске лутбоксов',
      ],
      result: 'Лутбоксы перестали быть просто механикой и стали полноценным инструментом заработка.',
    },

    // ─── RWA ───────────────────────────────────────────────────────
    {
      tag: 'RWA',
      title: 'Высокоочищенные металлы — превратили низколиквидный актив в инвестиционный инструмент',
      task: 'Оцифровать металл и сделать его ликвидным активом.',
      actions: [
        'Разработали три токена (GOV, NFT, Utility)',
        'NFT стал эквивалентом металла, сохранив его ценность',
        'Структурировали проект в трех юрисдикциях',
      ],
      result: 'Токен стал ликвидным и востребованным на рынке.',
    },
    {
      tag: 'RWA',
      title: 'Золото и недвижимость — оцифровали золото как залог для фондирования строительства жилых домов',
      task: 'Создать модель, где золото используется как залог для привлечения средств на строительство.',
      actions: [
        'Сбалансировали стоимость токенов, обеспеченных золотом',
        'Рассчитали цену NFT-коллекции с правом владения недвижимостью',
        'Разработали механизм обмена токенов на NFT',
      ],
      result: 'Золото стало источником финансирования: фаундер сохранил управление и привлек средства.',
    },
    {
      tag: 'RWA',
      title: 'Дебиторская задолженность — превратили долги в инвестиционный инструмент',
      task: 'Создать модель, которая превращает долги компании в инвестиционный актив.',
      actions: [
        'Рассчитали фиксированный доход по ЦФА для инвесторов',
        'Смоделировали финансовый результат для эмитента',
        'Внедрили переменную доходность, зависящую от успешности взыскания',
      ],
      result: 'Компания конвертировала долги в инвестиции и получила финансирование ниже ключевой ставки.',
    },
    {
      tag: 'RWA',
      title: 'Дикоросы (кедровый орех) — разработали инвестиционный инструмент для рынка на базе УЦП',
      task: 'Найти решение, чтобы финансировать экспорт дикоросов без кредитных инструментов.',
      actions: [
        'Разработали логическую и экономическую модели',
        'Распределили ноды между участниками и регуляторами',
        'Разработали инструмент обратного выкупа активов',
      ],
      result:
        'Компания получила инструмент устойчивого фондирования и смогла масштабировать бизнес без кредитных рисков.',
    },
    {
      tag: 'RWA',
      title: 'Клинические испытания — сделали инвестиции в medtech доступнее',
      task: 'Открыть доступ к инвестициям в клинические исследования на ранних этапах разработки.',
      actions: [
        'Разработали модель оцифровки молекул',
        'С помощью УЦП сделали молекулу делимой на миллион частей',
        'Сформировали долгосрочный инвестиционный инструмент для финансирования этапа разработки препаратов',
      ],
      result:
        'Компания открыла новый источник капитала и сделала рынок medtech доступнее для инвесторов.',
    },

    // ─── GameFi ────────────────────────────────────────────────────
    {
      tag: 'GameFi',
      title: 'AR-игра — предотвратили дамп и укрепили экономику токена',
      task: 'Сохранить стабильность внутриигровой экономики и предотвратить обесценивание токена после выхода игры.',
      actions: [
        'Разработали токеномику с основным токеном и пятью внутриигровыми',
        'Настроили механику, где игроки тратили токены на крафт NFT вместо продажи',
        'Создали систему, где NFT-коллекция стала активом с растущей ценностью, а токен — дефицитным ресурсом',
      ],
      result: 'Экономика игры сохранила баланс, а токен начал расти.',
    },
    {
      tag: 'GameFi',
      title: 'NFT-игра — выстроили распределение токенов между всеми участниками',
      task: 'Создать систему распределения токенов, которая поддерживает экономику проекта и баланс интересов участников.',
      actions: [
        'Смоделировали оптимальное распределение токенов',
        'Настроили параметры заморозки и вестинга',
        'Интегрировали стейкинг как часть игровой механики',
      ],
      result: 'Игроки начали ценить токен и использовать его по назначению, а не для быстрой перепродажи.',
    },
    {
      tag: 'GameFi',
      title: 'Walk to Earn-игра — создали механизм вознаграждения курьеров',
      task: 'Построить экономику, в которой доход курьеров стабилен, независимо от волатильности токена.',
      actions: [
        'Рассчитали юнит-экономику проекта',
        'Смоделировали доход при разных ценовых сценариях',
        'Построили токеномику с гибкой системой начислений',
      ],
      result: 'Компания вышла на международный рынок, сохранив стабильность и юридическую прозрачность.',
    },
    {
      tag: 'GameFi',
      title: 'MiniApp-игра — привлекли клиентов в инвестиционную компанию',
      task: 'Создать продукт, который помогает пользователям освоить инвестиции через игровой формат.',
      actions: [
        'Разработали токеномику токена лояльности',
        'Сформировали логику обучения инвестициям в игровой форме',
        'Смоделировали игровые механики вовлечения (Crush-механизмы) для разных типов инвесторов',
      ],
      result: 'Компания получила эффективный и устойчивый канал привлечения инвесторов.',
    },
    {
      tag: 'GameFi',
      title: 'PvP-игра — встроили токеномику в экономику игры',
      task: 'Встроить токеномику так, чтобы повысить ценность токена и вовлеченность игроков.',
      actions: [
        'Разработали механизмы эмиссии и утилизации токенов',
        'Рассчитали экономику NFT-ресурсов',
        'Смоделировали влияние токеномики на экономику проекта',
      ],
      result:
        'Игроки начали активно использовать токены в игре, что укрепило внутреннюю экономику и повысило ценность проекта.',
    },

    // ─── Finance ───────────────────────────────────────────────────
    {
      tag: 'Finance',
      title: 'Маркетплейс — внедрили токен в бизнес без рисков регулирования',
      task: 'Найти способ встроить токен в бизнес-модель компании и сохранить юридическую устойчивость при выходе на новые рынки.',
      actions: [
        'Создали систему сгорания токенов и продаж клиентам',
        'Структурировали бизнес в нескольких юрисдикциях',
        'Разработали модель конвертации токенов в складскую недвижимость',
      ],
      result: 'Проект вышел на новые рынки, сохранив прозрачность и доверие со стороны партнеров и регуляторов.',
    },
    {
      tag: 'Finance',
      title: 'Международные расчеты — создали механизм обхода валютных ограничений',
      task: 'Наладить расчеты в криптовалюте между странами без регуляторных рисков.',
      actions: [
        'Организовали торговлю через потребительский кооператив',
        'Разработали систему паритетного обмена токенов',
        'Оформили токен как объект интеллектуальной собственности',
      ],
      result: 'Крипторасчеты между Россией и Индией стали возможны без регуляторных рисков.',
    },
  ] as const,
  [
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
  ] as const,
) as unknown as CaseStudy[]

export const allTags: CaseTag[] = ['DeFi', 'GameFi', 'RWA', 'Finance']
