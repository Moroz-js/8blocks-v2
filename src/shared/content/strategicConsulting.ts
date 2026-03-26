// Strategic Consulting service page — single source of truth
// Content from requirements.md §5.2
import { t } from '@/shared/i18n'

const localize = <TRu, TEn>(ru: TRu, en: TEn) =>
  t({ ru, en } as { ru: TRu | TEn; en: TRu | TEn }) as TRu | TEn

const ruObject = {
  hero: {
    label: 'Стратегический консалтинг',
    headline: 'Стратегический консалтинг: от идеи до листинга',
    description:
      'Помогаем Web3 и Web2 командам выстроить экономику проекта, подготовиться к инвестициям и пройти путь до выхода токена на рынок.',
    ctaLabel: 'Записаться на консультацию',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Запуск токена требует большего, чем просто токеномика',
    description:
      'Команды часто недооценивают, сколько нужно собрать и синхронизировать до запуска.',
    items: [
      {
        title: 'Нет стратегии токена',
        description: 'Токен не связан с бизнесом и продуктом.',
      },
      {
        title: 'Слабая коммуникация с инвесторами',
        description: 'Ценность модели трудно объяснить рынку.',
      },
      {
        title: 'Нет партнерской экосистемы',
        description: 'Для запуска не хватает нужных внешних игроков.',
      },
      {
        title: 'Несистемная подготовка к TGE',
        description: 'У вашего проекта будет всего одна попытка на успешный TGE.',
      },
    ],
  },
  solution: {
    headline: 'Мы собираем запуск токена в единую стратегию',
    description:
      'Связываем бизнес-модель, токеномику, инвестиционную логику, партнерскую экосистему и подготовку к TGE в один рабочий маршрут.',
    variant: 'consulting' as const,
    items: [
      { id: 'business', label: 'Бизнес-модель', description: '' },
      { id: 'launch', label: 'Запуск', description: '' },
      { id: 'tokenomics', label: 'Токеномика', description: '' },
      { id: 'investment', label: 'Инвестиционная упаковка', description: '' },
      { id: 'tge', label: 'Подготовка к TGE', description: '' },
      { id: 'partners', label: 'Партнерская экосистема', description: '' },
    ],
  },
  results: {
    headline: 'Что вы получаете на выходе',
    items: [
      {
        title: 'Токеномика проекта',
        description: 'Разрабатываем полную модель: утилизацию токена, распределение, клейф, вестинг и эмиссию.',
      },
      {
        title: 'White Paper',
        description: 'Описываем концепцию проекта, логику токена и принципы экосистемы.',
      },
      {
        title: 'Pitch Deck',
        description: 'Готовим презентацию и дополнительные материалы для инвесторов.',
      },
      {
        title: 'Партнерская стратегия',
        description: 'Подбираем партнеров по ключевым направлениям и организуем встречи.',
      },
      {
        title: 'Листинг и выход',
        description: 'Помогаем с подготовкой к размещению токена на биржах.',
      },
      {
        title: 'Консультационная поддержка',
        description: 'До 10 звонков в месяц по 90 минут с нашими экспертами на протяжении всего проекта.',
      },
    ],
  },
  deliverables: {
    label: 'Что вы получаете на выходе',
    headline: 'Функционал токена ограничен только вашим сознанием',
    description:
      'Если вы не смогли придумать ему применение, то мы с радостью сделаем это за вас.',
    ctaLabel: 'Записаться на консультацию',
    ctaHref: '/contact',
    items: [] as const,
  },
  process: {
    headline: 'Как мы работаем',
    steps: [
      {
        number: 1,
        title: 'Погружаемся в проект',
        description: 'Изучаем материалы, цели и контекст, чтобы понять задачи проекта и логику продукта',
      },
      {
        number: 2,
        title: 'Проводим бенчмаркинг',
        description: 'Анализируем токеномики конкурентов, сравниваем модели и выделяем сильные решения',
      },
      {
        number: 3,
        title: 'Работаем с командой',
        description: 'Проводим совместные сессии, чтобы учесть нюансы продукта и собрать сильную модель',
      },
      {
        number: 4,
        title: 'Формируем правила использования токена',
        description: 'Определяем utility-механики, права держателей и условия вестинга внутри экосистемы',
      },
      {
        number: 5,
        title: 'Прорабатываем экосистему',
        description: 'Связываем токен с продуктом, интерфейсами и технической логикой проекта',
      },
      {
        number: 6,
        title: 'Проектируем движение токена',
        description: 'Строим сценарии потоков токена между всеми элементами экосистемы',
      },
      {
        number: 7,
        title: 'Планируем продажу токенов',
        description: 'Определяем количество раундов, формат продажи, сроки и средний чек',
      },
      {
        number: 8,
        title: 'Адаптируем модель под новые механики',
        description: 'Тестируем дополнительные функции по мере развития проекта',
      },
      {
        number: 9,
        title: 'Финализируем и защищаем модель',
        description: 'Собираем итоговую токеномику, готовим презентацию и защищаем решение перед вашей командой',
      },
    ],
  },
  useCases: {
    headline: 'Где стратегический консалтинг особенно важен',
    items: [
      {
        label: 'defi',
        title: 'DeFi',
        bullets: [
          {
            title: 'Выбор блокчейна не соответствует логике продукта',
            description:
              'Ошибка на этом этапе влияет на стоимость газа, масштабируемость, безопасность и потенциальный объем пользователей.',
          },
          {
            title: 'Токен не встроен в финансовую механику',
            description:
              'Для DeFi недостаточно просто добавить токен. Он должен усиливать продукт и поддерживать реальный спрос.',
          },
          {
            title: 'Слабо проработан пользовательский сценарий',
            description:
              'Важно понимать, кто ваш пользователь, какую задачу он решает и почему будет пользоваться именно вашим инструментом.',
          },
          {
            title: 'Ценность модели сложно объяснить рынку',
            description:
              'Даже сильный продукт теряет потенциал, если его финансовая логика и utility токена не собраны в понятную систему.',
          },
        ],
      },
      {
        label: 'gamefi',
        title: 'GameFi',
        bullets: [
          {
            title: 'Экономика ломается на балансе добычи и использования токена.',
            description:
              'Если модель строится вокруг получения и продажи токена, а не вокруг его применения, система быстро теряет устойчивость.',
          },
          {
            title: 'Игроку выгоднее продать, чем использовать',
            description:
              'Когда продажа токена приносит больше ценности, чем его использование внутри игры, внутриигровая экономика начинает работать против проекта.',
          },
          {
            title: 'Токен не поддерживает игровой цикл',
            description:
              'Экономика должна усиливать прогрессию, вовлечение и удержание, а не превращать продукт в краткосрочный фарм.',
          },
          {
            title: 'Механики не выдерживают роста аудитории',
            description:
              'Даже рабочая модель может сломаться при масштабировании, если не продуман баланс эмиссии, utility и сжигания.',
          },
        ],
      },
      {
        label: 'invest',
        title: 'Invest',
        bullets: [
          {
            title: 'Токеномика конфликтует с бизнес-моделью',
            description:
              'Рост цены токена может сделать его использование невыгодным и создать перекос между ценностью продукта и затратами пользователя.',
          },
          {
            title: 'Токен не усиливает основной продукт',
            description:
              'Если его функция сводится только к доходности или оплате комиссии, модель быстро становится уязвимой.',
          },
          {
            title: 'Пользователь получает слишком мало реальной полезности',
            description:
              'Токен должен открывать дополнительные возможности внутри продукта, а не дублировать то, что уже доступно без него.',
          },
          {
            title: 'Экономика токена начинает мешать росту проекта',
            description:
              'Важно выстроить модель так, чтобы токен усиливал развитие бизнеса, а не создавал для него ограничения.',
          },
        ],
      },
      {
        label: 'rwa',
        title: 'RWA',
        bullets: [
          {
            title: 'Токенизация сама по себе не решает задачу бизнеса',
            description:
              'Простая упаковка актива в токен не создает спрос автоматически и не делает продукт сильнее.',
          },
          {
            title: 'Неясно, зачем проекту нужен токен',
            description:
              'Перед запуском важно определить цель токенизации и понять, какую роль токен играет в общей стратегии бизнеса.',
          },
          {
            title: 'RWA-токен существует отдельно от экосистемы',
            description:
              'Без связи с utility-механиками, партнерской логикой или более широкой продуктовой моделью он остается изолированным инструментом.',
          },
          {
            title: 'Бизнес не получает нового спроса',
            description:
              'Во многих случаях рост приносит не сам RWA-токен, а правильно выстроенная система вокруг него, включая utility-слой.',
          },
        ],
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'Кому подходит стратегический консалтинг?',
        answer:
          'Стратегический консалтинг подходит командам, которые хотят не просто разработать токеномику, а выстроить всю логику запуска: от экономики проекта и investor-ready материалов до партнерской экосистемы и подготовки к TGE. Чаще всего это актуально для проектов, которые выходят на рынок впервые или готовятся к следующему этапу роста.',
      },
      {
        question: 'На каком этапе проекта лучше подключать вас?',
        answer:
          'Чем раньше, тем лучше. Оптимально подключаться на этапе, когда у команды уже есть идея, продуктовая логика или первые материалы, но еще не зафиксированы ключевые решения по токену, инвестиционной упаковке и стратегии выхода на рынок. При этом мы можем подключиться и позже, если проект уже находится в активной подготовке к запуску.',
      },
      {
        question: 'Можно ли обратиться к вам, если у нас уже есть токеномика или white paper?',
        answer:
          'Конечно. Если у вас уже есть часть материалов, мы не дублируем работу, а смотрим, что можно использовать, что требует доработки, а что лучше пересобрать. В этом формате мы собираем все элементы в единую стратегию и убираем разрывы между документами, экономикой и планом запуска.',
      },
      {
        question: 'Что нам нужно подготовить перед стартом?',
        answer:
          'На старте нам важно получить все, что уже есть у проекта: презентации, черновики white paper, описание продукта, roadmap, текущую модель токена, данные по раундам, команде и целям проекта. Даже если материалы неполные, этого уже достаточно, чтобы начать работу и понять, где нужны дополнительные сессии с командой.',
      },
      {
        question: 'Кто со стороны клиента должен участвовать в процессе?',
        answer:
          'Обычно в проекте участвуют фаундеры и ключевые участники команды, которые влияют на продукт, стратегию и экономику проекта. В зависимости от структуры проекта это могут быть CEO, COO, CFO, product lead, маркетинг и техническая команда. Нам важно, чтобы решения можно было обсуждать быстро и с теми, кто действительно влияет на запуск.',
      },
      {
        question: 'Вы только консультируете или помогаете с реализацией тоже?',
        answer:
          'Мы не ограничиваемся рекомендациями. В рамках стратегического консалтинга мы участвуем в проработке модели, готовим ключевые материалы, помогаем с партнерской экосистемой и сопровождаем проект на этапе реализации. Это не формат «созвонились и разошлись», а рабочий процесс с включением в задачи команды.',
      },
      {
        question: 'Помогаете ли вы с подбором партнеров?',
        answer:
          'Да. Мы помогаем определить, какие партнеры нужны проекту на этапе подготовки к запуску, и сопровождаем процесс подбора по ключевым направлениям: маркетмейкинг, маркетинг, смарт-контракты и другим зонам, которые критичны для выхода токена на рынок. Мы не просто передаем контакты или знакомим с партнерами, а берем на себя delivery-функцию: участвуем в звонках, помогаем ставить задачи подрядчикам и сопровождаем процесс до более понятного и управляемого результата.',
      },
      {
        question: 'Сколько времени занимает работа и можно ли ускорить процесс, если потребуется?',
        answer:
          'Обычно стратегический консалтинг занимает от 2 до 4 месяцев. Точные сроки зависят от стадии проекта, качества исходных материалов, скорости коммуникации внутри команды и сроков согласования с внешними партнерами. При необходимости процесс можно ускорить: консалтинг разбит на ключевые блоки работ, зафиксированные в договоре, и мы можем двигаться быстрее по каждому из них. В таком случае оплата происходит не помесячно, а по мере закрытия отдельных блоков.',
      },
      {
        question: 'Что не входит в стратегический консалтинг?',
        answer:
          'Стратегический консалтинг не включает юридические услуги, разработку смарт-контрактов, маркетинговое продюсирование, техническую реализацию со стороны подрядчиков, а также рекомендации по доработке или модернизации продуктовой линейки. При этом мы можем помочь определить, какие специалисты нужны проекту, и встроить их работу в общую стратегию подготовки к запуску.',
      },
      {
        question: 'Что будет итогом нашей работы?',
        answer:
          'На выходе у проекта формируется не просто набор документов, а собранная система подготовки к запуску: токеномика, white paper, Pitch Deck, партнерская стратегия и план выхода на рынок. Это создает более сильную основу для переговоров с инвесторами, подготовки к TGE и следующих операционных шагов команды.',
      },
      {
        question: 'Входит ли моделирование в список работ?',
        answer:
          'Нет. Моделирование – это отдельная услуга, которая может быть выполнена в двух вариантах: программное моделирование по методу Монте Карло в Python или визуальное моделирование в программе Machinations.',
      },
    ],
  },
  midCta: {
    headline: 'У вашего проекта будет всего одна попытка на успешный TGE',
    ctaLabel: 'Скачать чек-лист',
    ctaHref: '/contact',
  },
  cta: {
    headline: 'Если у токена нет цели, у проекта нет будущего.',
    ctaLabel: 'Обсудить проект',
    ctaHref: '/contact',
  },
} as const

const enObject = {
  hero: {
    label: 'Strategic Consulting',
    headline: 'Strategic Consulting: from idea to listing',
    description:
      'We help Web3 and Web2 teams build project economics, prepare for fundraising, and execute a full token go-to-market path.',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Token launch needs more than tokenomics alone',
    description:
      'Teams often underestimate how much preparation and alignment is required before launch.',
    items: [
      { title: 'No token strategy', description: 'The token is disconnected from business and product logic.' },
      { title: 'Weak investor communication', description: 'Model value is hard to explain to the market.' },
      { title: 'No partner ecosystem', description: 'Key external partners are missing for launch execution.' },
      { title: 'Unsynchronized TGE preparation', description: 'Your project gets only one real chance at a successful TGE.' },
    ],
  },
  solution: {
    headline: 'We turn token launch into a single strategy',
    description:
      'We connect business model, tokenomics, investment narrative, partner ecosystem, and TGE readiness into one executable route.',
    variant: 'consulting' as const,
    items: [
      { id: 'business', label: 'Business model', description: '' },
      { id: 'launch', label: 'Launch', description: '' },
      { id: 'tokenomics', label: 'Tokenomics', description: '' },
      { id: 'investment', label: 'Investment packaging', description: '' },
      { id: 'tge', label: 'TGE readiness', description: '' },
      { id: 'partners', label: 'Partner ecosystem', description: '' },
    ],
  },
  results: {
    headline: 'What you get',
    items: [
      { title: 'Project tokenomics', description: 'We build a complete model: utility, distribution, cliff, vesting, and issuance.' },
      { title: 'White Paper', description: 'We document project concept, token logic, and ecosystem principles.' },
      { title: 'Pitch Deck', description: 'We prepare investor presentation and supporting fundraising materials.' },
      { title: 'Partner strategy', description: 'We identify key partners and organize meetings by priority tracks.' },
      { title: 'Listing and launch support', description: 'We help you prepare for exchange listing and market entry.' },
      { title: 'Consulting support', description: 'Up to 10 monthly calls, 90 minutes each, with our experts throughout the project.' },
    ],
  },
  deliverables: {
    label: 'What you get',
    headline: 'Token functionality is limited only by your imagination',
    description: 'If you cannot define the right utility, we will design it with you.',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
    items: [] as const,
  },
  process: {
    headline: 'How we work',
    steps: [
      { number: 1, title: 'Project immersion', description: 'We review goals, context, and materials to understand core product logic.' },
      { number: 2, title: 'Benchmarking', description: 'We analyze competitor tokenomics, compare models, and isolate strong approaches.' },
      { number: 3, title: 'Team collaboration', description: 'We run focused sessions with your team to capture key product nuances.' },
      { number: 4, title: 'Token usage rules', description: 'We define utility mechanics, holder rights, and ecosystem vesting terms.' },
      { number: 5, title: 'Ecosystem design', description: 'We align token logic with product flows, interfaces, and technical architecture.' },
      { number: 6, title: 'Token flow architecture', description: 'We design token movement scenarios across ecosystem participants.' },
      { number: 7, title: 'Token sale planning', description: 'We define round structure, sale format, timing, and average ticket.' },
      { number: 8, title: 'Model adaptation', description: 'We test and adapt mechanics as the project evolves.' },
      { number: 9, title: 'Finalization and defense', description: 'We finalize tokenomics, prepare presentation materials, and defend the model with your team.' },
    ],
  },
  useCases: {
    headline: 'Where strategic consulting is especially critical',
    items: [
      {
        label: 'defi',
        title: 'DeFi',
        bullets: [
          { title: 'Wrong blockchain choice for product logic', description: 'This impacts gas costs, scalability, security, and reachable user volume.' },
          { title: 'Token is not embedded into financial mechanics', description: 'In DeFi, a token must reinforce product value and real demand.' },
          { title: 'Weakly designed user journey', description: 'You need a clear view of user jobs-to-be-done and product adoption drivers.' },
          { title: 'Model value is hard to explain to market', description: 'Even strong products underperform when token utility and economic logic are unclear.' },
        ],
      },
      {
        label: 'gamefi',
        title: 'GameFi',
        bullets: [
          { title: 'Economy breaks on earn-vs-spend balance', description: 'If the model rewards extraction over usage, sustainability collapses quickly.' },
          { title: 'Selling is more attractive than using', description: 'When selling beats in-game use, your game economy starts working against growth.' },
          { title: 'Token does not support gameplay loop', description: 'Economics must improve progression, engagement, and retention, not short-term farming.' },
          { title: 'Mechanics do not scale with audience', description: 'Even valid models fail at scale without proper issuance, utility, and burn balance.' },
        ],
      },
      {
        label: 'invest',
        title: 'Invest',
        bullets: [
          { title: 'Tokenomics conflicts with business model', description: 'Token price growth can make product usage too expensive for users.' },
          { title: 'Token does not strengthen core product', description: 'If it only serves yield or fees, the model becomes fragile fast.' },
          { title: 'Low practical utility for users', description: 'A token should unlock meaningful capabilities, not duplicate existing access.' },
          { title: 'Token economy slows business growth', description: 'The model should amplify business development, not create operational constraints.' },
        ],
      },
      {
        label: 'rwa',
        title: 'RWA',
        bullets: [
          { title: 'Tokenization alone does not solve business goals', description: 'Wrapping an asset in a token does not create demand by itself.' },
          { title: 'Unclear strategic role of the token', description: 'Before launch, tokenization goals and token role in strategy must be explicit.' },
          { title: 'RWA token exists outside ecosystem logic', description: 'Without utility and partner integration, it remains an isolated instrument.' },
          { title: 'Business gets no new demand', description: 'Growth usually comes from a complete system around RWA, not from RWA alone.' },
        ],
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'Who is strategic consulting for?',
        answer:
          'For teams that need more than tokenomics: they need a full launch logic from project economics and investor-ready materials to partner ecosystem and TGE preparation.',
      },
      {
        question: 'At what project stage should we engage you?',
        answer:
          'The earlier, the better. Ideal timing is when product logic exists but key token, fundraising, and go-to-market decisions are not fixed yet.',
      },
      {
        question: 'Can we engage if we already have tokenomics or a white paper?',
        answer:
          'Yes. We review existing assets, keep what works, improve weak parts, and rebuild only where needed to create one cohesive strategy.',
      },
      {
        question: 'What should we prepare before kickoff?',
        answer:
          'Share all available materials: deck, white paper drafts, product description, roadmap, token model, round data, team context, and goals.',
      },
      {
        question: 'Who from our side should be involved?',
        answer:
          'Usually founders and decision-makers across product, strategy, and economics: CEO, COO, CFO, product lead, marketing, and tech leads.',
      },
      {
        question: 'Do you only consult, or also support implementation?',
        answer:
          'We go beyond recommendations: we shape the model, prepare key materials, support partnerships, and stay involved through execution.',
      },
      {
        question: 'Do you help with partner selection?',
        answer:
          'Yes. We define partner requirements, support selection across key tracks, join calls, structure tasks, and drive delivery to clear outcomes.',
      },
      {
        question: 'How long does the work take, and can it be accelerated?',
        answer:
          'Strategic consulting typically takes 2-4 months. We can accelerate by moving through contractual work blocks faster when needed.',
      },
      {
        question: 'What is not included in strategic consulting?',
        answer:
          'Legal services, smart contract development, contractor-side technical implementation, and marketing production are outside this scope.',
      },
      {
        question: 'What is the final outcome?',
        answer:
          'You get a complete launch readiness system: tokenomics, white paper, pitch deck, partner strategy, and market entry plan.',
      },
      {
        question: 'Is modeling included?',
        answer:
          'No. Modeling is a separate service available as Monte Carlo simulation in Python or visual simulation in Machinations.',
      },
    ],
  },
  midCta: {
    headline: 'Your project gets only one real chance at a successful TGE',
    ctaLabel: 'Download checklist',
    ctaHref: '/contact',
  },
  cta: {
    headline: 'If a token has no purpose, the project has no future.',
    ctaLabel: 'Discuss your project',
    ctaHref: '/contact',
  },
} as const

export const strategicConsultingContent = localize(ruObject, enObject)
