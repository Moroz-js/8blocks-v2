// Tokenomics service page — single source of truth
// Content from requirements.md §5.3
import { t } from '@/shared/i18n'

const localize = <TRu, TEn>(ru: TRu, en: TEn) =>
  t({ ru, en } as { ru: TRu | TEn; en: TRu | TEn }) as TRu | TEn

const ruObject = {
  hero: {
    label: 'Токеномика',
    headline: 'Токеномика',
    description:
      'Разрабатываем экономическую модель токена для проектов, где важно связать бизнес-механику, участников и технические процессы в одну систему.',
    ctaLabel: 'Записаться на консультацию',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Почему большинство токеномик не работают после запуска',
    description:
      'Потому что красивая схема в white paper еще не означает, что токен будет создавать ценность, выдерживать спрос и поддерживать экономику проекта.',
    items: [
      {
        title: 'Токен не связан с продуктом',
        description: 'Не создает реальной ценности внутри экосистемы.',
      },
      {
        title: 'Спрос не подкреплен механикой',
        description: 'Продукт покупают, а токен продают.',
      },
      {
        title: 'Быстрая раздача убивает токен',
        description: 'Инвесторы не будут долго ждать.',
      },
      {
        title: 'Раздать токен недостаточно',
        description: 'Непонятно, зачем кому-то его покупать.',
      },
    ],
  },
  solution: {
    headline: 'Мы проектируем не токен, а экономическую архитектуру проекта',
    description:
      'Прорабатываем токеномику на уровне продукта, пользовательских сценариев, Treasury, финансовых потоков и технических процессов, чтобы модель была встроена в реальную экономику проекта.',
    variant: 'tokenomics' as const,
    items: [
      {
        id: 'deep-dive',
        label: 'Глубокая погруженность в продукт',
        description:
          'Разбираем не только токен, но и саму бизнес-модель проекта, роль участников и сценарии использования.',
      },
      {
        id: 'flows',
        label: 'Выстраиваем логику внутри экосистемы',
        description:
          'Проектируем движение токена между продуктом, пользователями, гильдиями и Treasury.',
      },
      {
        id: 'finance-tech',
        label: 'Учитываем финансовые и технические процессы',
        description:
          'Связываем токеномику с ончейн-логикой и внутренними правилами системы.',
      },
      {
        id: 'adaptive',
        label: 'Адаптируем модель под рыночные реалии',
        description:
          'Закладываем сценарии, которые выдерживают волатильность и рост экосистемы.',
      },
    ],
  },
  deliverables: {
    label: 'Что будет в вашей токеномике',
    headline:
      'На выходе вы получаете не просто документ, а комплексную экономическую модель токена, необходимую для запуска токенсейла, привлечения инвестиций, заключения стратегических партнерств и дальнейшего развития проекта',
    items: [
      {
        title: 'Оптимальная эмиссия',
        description:
          'Определяем, как именно токен появляется в системе: через майнинг, покупку или алгоритмическое распределение.',
      },
      {
        title: 'Механика выпуска',
        description:
          'Просчитываем, какие объемы идут на продажу, вознаграждения, поощрения и другие задачи экосистемы.',
      },
      {
        title: 'Фонд распределения',
        description:
          'Делим токены по пулам, задаем сроки заморозки и график раздачи под разные категории участников.',
      },
      {
        title: 'Пулы, заморозки и вестинг',
        description:
          'Прорабатываем логику применения токенов, их накопления во внутренних фондах, перераспределения и повторного вывода на рынок.',
      },
      {
        title: 'Замкнутая экосистема',
        description:
          'Закладываем механизмы против манипуляций, крупных продаж и сценариев, которые могут быстро обнулить цену.',
      },
      {
        title: 'Treasury, резервы и хеджирование',
        description:
          'Прорабатываем кредитные пулы, деривативы, дефляционные механики, а также NFT, сервисы и подписки, которые переносят ценность на экосистему.',
      },
      {
        title: 'Финансовые и utility-механики',
        description:
          'Связываем токеномику с on-chain/off-chain логикой, ликвидностью и внутренними правилами системы.',
      },
      {
        title: 'Визуализация для white paper',
        description:
          'Готовим диаграммы, графики и таблицы, которые помогают встроить токеномику в документацию проекта.',
      },
    ],
  },
  process: {
    headline: 'Как мы работаем',
    steps: [
      {
        number: 1,
        title: 'Погружаемся в проект',
        description:
          'Изучаем материалы, цели и контекст, чтобы понять задачи проекта и логику продукта.',
      },
      {
        number: 2,
        title: 'Проводим бенчмаркинг',
        description: 'Анализируем токеномики конкурентов, сравниваем модели и выделяем сильные решения.',
      },
      {
        number: 3,
        title: 'Работаем с командой',
        description:
          'Проводим совместные сессии, чтобы учесть нюансы продукта и собрать сильную модель.',
      },
      {
        number: 4,
        title: 'Формируем правила использования токена',
        description:
          'Определяем utility-механики, права держателей и условия вестинга внутри экосистемы.',
      },
      {
        number: 5,
        title: 'Прорабатываем экосистему',
        description: 'Связываем токен с продуктом, интерфейсами и технической логикой проекта.',
      },
      {
        number: 6,
        title: 'Проектируем движение токена',
        description: 'Строим сценарии потоков токена между всеми элементами экосистемы.',
      },
      {
        number: 7,
        title: 'Планируем продажу токенов',
        description: 'Определяем количество раундов, формат продажи, сроки и средний чек.',
      },
      {
        number: 8,
        title: 'Адаптируем модель под новые механики',
        description: 'Тестируем дополнительные функции по мере развития проекта.',
      },
      {
        number: 9,
        title: 'Финализируем и защищаем модель',
        description:
          'Собираем итоговую токеномику, готовим презентацию и защищаем решение перед вашей командой.',
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'Можно ли прийти к вам уже с готовым черновиком токеномики?',
        answer:
          'Да. Если у вас уже есть расчеты, white paper, product deck или черновая модель, мы не начинаем с нуля без причины. Сначала смотрим, что можно использовать, что требует доработки, а что лучше пересобрать, чтобы итоговая модель работала как единая система.',
      },
      {
        question: 'В какой момент уже нужен аудит, а не разработка токеномики?',
        answer:
          'Если у вас уже есть готовая модель и задача – проверить ее на ошибки, риски и слабые места, тогда нужен аудит. Если модель еще собирается, не закрывает ключевые вопросы или требует глубокой пересборки, нужен формат разработки.',
      },
      {
        question: 'Что вам нужно от нас на старте?',
        answer:
          'Все, что у вас уже есть по проекту: white paper, product deck, roadmap, описание токена или NFT, данные по раундам, структуре командного пула и другие рабочие материалы. Даже если часть документов еще не финализирована, этого достаточно, чтобы начать работу.',
      },
      {
        question: 'Работаете только с utility-токенами или с NFT тоже?',
        answer:
          'Не только с utility-токенами. Мы можем работать и с NFT-моделями, и с более сложными гибридными структурами, если актив встроен в экономику продукта и играет роль в логике экосистемы.',
      },
      {
        question: 'Входит ли в работу логика токенсейла?',
        answer:
          'Да. Мы прорабатываем количество раундов, их формат, сроки и средний чек покупки токена, чтобы модель не существовала отдельно от логики продажи и выхода проекта к рынку.',
      },
      {
        question: 'Входит ли моделирование в список работ?',
        answer:
          'Нет. Моделирование – это отдельная услуга, которая может быть выполнена в двух вариантах: программное моделирование по методу Монте Карло в Python или визуальное моделирование в программе Machinations.',
      },
      {
        question: 'Что не входит в разработку токеномики?',
        answer:
          'В этот формат не входят юридические услуги, разработка смарт-контрактов, маркетинговое продюсирование и техническая реализация со стороны подрядчиков. Но при необходимости мы можем подключить дополнительные встречи с юристами, маркетмейкерами и другими профильными экспертами, чтобы глубже проработать отдельные части модели.',
      },
      {
        question: 'Сколько обычно занимает работа?',
        answer:
          'Обычно разработка токеномики занимает от 3 до 7 недель. Точные сроки зависят от объема материалов, сложности модели, скорости коммуникации с командой и глубины проработки.',
      },
      {
        question: 'Можно ли ускорить процесс, если это критично?',
        answer:
          'Да, в отдельных случаях это можно обсуждать. Скорость зависит от того, насколько быстро команда дает вводные, согласует решения и двигается по этапам вместе с нами.',
      },
      {
        question: 'Можно ли дорабатывать токеномику потом, если продукт изменится?',
        answer:
          'Да. Если в проекте появляются новые механики, сценарии использования или дополнительные продукты, модель можно адаптировать и развивать дальше. Это особенно важно для проектов, где экономика должна расти вместе с продуктом.',
      },
      {
        question: 'Что именно мы получим на выходе?',
        answer:
          'На выходе вы получаете не просто описание токена, а комплексную экономическую модель, необходимую для токенсейла, привлечения инвестиций, стратегических партнерств и дальнейшего развития экосистемы. В нее входят ключевые параметры эмиссии, выпуска, распределения, вестинга, Treasury, защитных механизмов и визуализации для white paper.',
      },
    ],
  },
  cta: {
    headline: 'Иногда токену не нужен медвежий рынок, чтобы умереть. Ему достаточно плохой токеномики.',
    ctaLabel: 'Записаться на консультацию',
    ctaHref: '/contact',
  },
} as const

const enObject = {
  hero: {
    label: 'Tokenomics',
    headline: 'Tokenomics',
    description:
      'We design token economic models for projects that need to connect business mechanics, stakeholders, and technical processes into one coherent system.',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Why most tokenomics models fail after launch',
    description:
      'Because a polished white paper chart does not guarantee that the token creates value, sustains demand, or supports your project economy.',
    items: [
      {
        title: 'Token is disconnected from the product',
        description: 'It creates no real value inside the ecosystem.',
      },
      {
        title: 'Demand is not supported by mechanics',
        description: 'Users buy the product while the token gets sold off.',
      },
      {
        title: 'Fast distribution kills the token',
        description: 'Investors rarely wait for long.',
      },
      {
        title: 'Distribution alone is not enough',
        description: 'It is unclear why anyone should buy the token.',
      },
    ],
  },
  solution: {
    headline: 'We design not just a token, but your project economic architecture',
    description:
      'We build tokenomics across product design, user journeys, treasury logic, financial flows, and technical processes so the model works in your real economy.',
    variant: 'tokenomics' as const,
    items: [
      {
        id: 'deep-dive',
        label: 'Deep product immersion',
        description:
          'We analyze not just the token itself but also your business model, stakeholder roles, and usage scenarios.',
      },
      {
        id: 'flows',
        label: 'Ecosystem flow design',
        description:
          'We design token movement between product modules, users, guilds, and treasury.',
      },
      {
        id: 'finance-tech',
        label: 'Financial and technical alignment',
        description:
          'We connect tokenomics to on-chain logic and internal system rules.',
      },
      {
        id: 'adaptive',
        label: 'Market-adaptive model',
        description:
          'We build scenarios that can handle volatility and ecosystem growth.',
      },
    ],
  },
  deliverables: {
    label: 'What your tokenomics includes',
    headline:
      'The outcome is not just a document, but a complete token economic model required for token sale launch, fundraising, strategic partnerships, and long-term project growth.',
    items: [
      {
        title: 'Optimal issuance',
        description:
          'We define how the token enters the system: mining, purchase, or algorithmic distribution.',
      },
      {
        title: 'Release mechanics',
        description:
          'We calculate volumes for sale, rewards, incentives, and other ecosystem needs.',
      },
      {
        title: 'Allocation framework',
        description:
          'We split tokens into pools, define lock periods, and set release schedules by stakeholder category.',
      },
      {
        title: 'Pools, lockups, and vesting',
        description:
          'We design token usage, treasury accumulation, redistribution, and recirculation logic.',
      },
      {
        title: 'Closed-loop ecosystem',
        description:
          'We include safeguards against manipulation, large sell-offs, and scenarios that can quickly collapse price.',
      },
      {
        title: 'Treasury, reserves, and hedging',
        description:
          'We design credit pools, derivatives, deflationary mechanics, and NFT/service/subscription layers that transfer value back to the ecosystem.',
      },
      {
        title: 'Financial and utility mechanics',
        description:
          'We connect tokenomics to on-chain/off-chain logic, liquidity strategy, and internal system rules.',
      },
      {
        title: 'White paper visualization',
        description:
          'We prepare diagrams, charts, and tables to embed tokenomics clearly into project documentation.',
      },
    ],
  },
  process: {
    headline: 'How we work',
    steps: [
      {
        number: 1,
        title: 'Project immersion',
        description:
          'We review your materials, goals, and context to understand product logic and project priorities.',
      },
      {
        number: 2,
        title: 'Benchmarking',
        description: 'We analyze competitor tokenomics, compare models, and extract strong patterns.',
      },
      {
        number: 3,
        title: 'Team workshops',
        description:
          'We run collaborative sessions to capture product nuance and build a robust model together.',
      },
      {
        number: 4,
        title: 'Token usage rules',
        description:
          'We define utility mechanics, holder rights, and vesting conditions across the ecosystem.',
      },
      {
        number: 5,
        title: 'Ecosystem architecture',
        description: 'We connect the token to product flows, interfaces, and technical logic.',
      },
      {
        number: 6,
        title: 'Token flow design',
        description: 'We build token flow scenarios across all ecosystem components.',
      },
      {
        number: 7,
        title: 'Token sale planning',
        description: 'We define round count, sale format, timeline, and average ticket size.',
      },
      {
        number: 8,
        title: 'Model adaptation',
        description: 'We test additional mechanics as your project evolves.',
      },
      {
        number: 9,
        title: 'Finalization and defense',
        description:
          'We finalize the tokenomics, prepare the presentation, and defend the model with your team.',
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'Can we come to you with an existing tokenomics draft?',
        answer:
          'Yes. If you already have calculations, a white paper, a product deck, or a draft model, we do not restart from zero without reason. We first assess what can be retained, what needs refinement, and what should be rebuilt for a cohesive system.',
      },
      {
        question: 'When do we need an audit instead of tokenomics development?',
        answer:
          'If your model is already built and you need to validate risks, assumptions, and weak points, you need an audit. If the model is still incomplete or requires deep restructuring, development is the right format.',
      },
      {
        question: 'What do you need from us at kickoff?',
        answer:
          'Everything you already have: white paper, product deck, roadmap, token/NFT description, round data, team-pool structure, and related working files. Even partial documents are enough to start.',
      },
      {
        question: 'Do you work only with utility tokens, or also with NFTs?',
        answer:
          'Not only utility tokens. We also work with NFT-based and hybrid structures when the asset is embedded in product economics and ecosystem logic.',
      },
      {
        question: 'Is token sale logic included?',
        answer:
          'Yes. We design round structure, sale format, timing, and average ticket so tokenomics is aligned with go-to-market execution.',
      },
      {
        question: 'Is modeling included in this scope?',
        answer:
          'No. Modeling is a separate service delivered either as Monte Carlo simulation in Python or visual simulation in Machinations.',
      },
      {
        question: 'What is not included in tokenomics development?',
        answer:
          'This scope excludes legal services, smart contract development, marketing production, and contractor-side technical implementation. If needed, we can involve focused sessions with lawyers, market makers, and other specialists.',
      },
      {
        question: 'How long does the work usually take?',
        answer:
          'Tokenomics development usually takes 3 to 7 weeks depending on model complexity, material quality, communication speed, and expected depth.',
      },
      {
        question: 'Can the process be accelerated if timing is critical?',
        answer:
          'Yes, in selected cases. Speed depends on how quickly your team provides inputs, approves decisions, and moves through stages with us.',
      },
      {
        question: 'Can tokenomics be updated later if the product changes?',
        answer:
          'Yes. As new mechanics, user scenarios, or product lines appear, the model can be adapted and scaled further. This is especially important for projects that evolve rapidly.',
      },
      {
        question: 'What exactly do we receive in the end?',
        answer:
          'You get a complete economic model, not just token text. It supports token sale, fundraising, strategic partnerships, and ecosystem growth, including issuance, release, allocation, vesting, treasury, safeguards, and white paper visualization.',
      },
    ],
  },
  cta: {
    headline: 'A token does not need a bear market to fail. Bad tokenomics is enough.',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
} as const

export const tokenomicsContent = localize(ruObject, enObject)
