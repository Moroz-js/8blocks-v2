// Strategic Consulting service page — single source of truth

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
      "We help Web3 and Web2 teams build the project's economic model, prepare for investment, and move all the way to bringing the token to market",
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Launching a token takes more than tokenomics',
    description:
      'Teams often underestimate how much has to be planned, aligned, and ready before launch',
    items: [
      {
        title: 'No clear token strategy',
        description: 'The token is not properly tied to the product or the business',
      },
      {
        title: "The story doesn't land with investors",
        description: "The model may make sense internally, but it's hard to explain clearly to the market",
      },
      {
        title: "The right partners\naren't in place",
        description: 'A launch needs more than a model. It needs the external players who help make it work',
      },
      {
        title: 'TGE prep is all\nover the place',
        description: 'Your project gets one real shot at a successful TGE',
      },
    ],
  },
  solution: {
    headline: 'We turn token launch into one unified strategy',
    description:
      'We connect the business model, tokenomics, investment logic, partner ecosystem, and TGE preparation into one working path',
    variant: 'consulting' as const,
    items: [
      { id: 'business', label: 'Business model', description: '' },
      { id: 'launch', label: 'Launch', description: '' },
      { id: 'tokenomics', label: 'Tokenomics', description: '' },
      { id: 'investment', label: 'Investor narrative', description: '' },
      { id: 'tge', label: 'TGE preparation', description: '' },
      { id: 'partners', label: 'Partner ecosystem', description: '' },
    ],
  },
  results: {
    headline: "What you'll walk away with",
    items: [
      {
        title: 'Project tokenomics',
        description: 'We build a full token model covering utility, allocation, cliffs, vesting, and issuance',
      },
      {
        title: 'White Paper',
        description: 'We define the project concept, token logic, and the principles behind the ecosystem',
      },
      {
        title: 'Pitch Deck',
        description: 'We prepare the investor presentation and supporting materials',
      },
      {
        title: 'Partner strategy',
        description: 'We identify the right partners across key areas and help organize the process around them',
      },
      {
        title: 'Listing and go-to-market',
        description: 'We help prepare the token for exchange listing and market entry',
      },
      {
        title: 'Ongoing advisory support',
        description: 'Up to 10 calls per month, 90 minutes each, with our experts throughout the project',
      },
    ],
  },
  deliverables: {
    label: "What you'll walk away with",
    headline: 'A token utility is only limited by the way you think about it',
    description: "If you haven't found the right use case yet,\nwe'll gladly do that part for you",
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
    items: [] as const,
  },
  process: {
    headline: 'How we work',
    steps: [
      {
        number: 1,
        title: 'We get deep into the project',
        description:
          "Looking at the business model, team, goals, and broader potential helps us understand what the project is really building toward.",
      },
      {
        number: 2,
        title: 'We shape the strategy',
        description:
          'From there, we define the key growth paths and build the economic architecture around them.',
      },
      {
        number: 3,
        title: 'We work through\nthe partner ecosystem',
        description:
          'That includes identifying, evaluating, and aligning with the key partners the project needs.',
      },
      {
        number: 4,
        title: 'We create the full\nset of materials',
        description:
          'This covers the tokenomics, white paper, pitch deck, and supporting investor materials.',
      },
      {
        number: 5,
        title: 'We stay involved through execution',
        description:
          'Support continues across every stage of implementation, including work with partners and exchanges.',
      },
      {
        number: 6,
        title: 'We stay close to the team',
        description: 'Up to 10 calls per month, 90 minutes each.',
      },
    ],
  },
  useCases: {
    headline: 'Where strategic consulting matters most',
    items: [
      {
        label: 'invest',
        title: 'Invest',
        bullets: [
          {
            title: 'The tokenomics starts to conflict with the business model',
            description:
              'As the token price rises, using it can become less attractive and create a mismatch between the value of the product and the cost to the user.',
          },
          {
            title: "The token doesn't strengthen the core product",
            description:
              'If its role comes down to yield or fee payments alone, the model becomes fragile very quickly.',
          },
          {
            title: 'The user gets too little real utility',
            description:
              'A token should unlock something extra inside the product, not just duplicate what is already available without it.',
          },
          {
            title: 'The token economy starts working against growth',
            description:
              'The model has to help the business scale, not create constraints that slow it down.',
          },
        ],
      },
      {
        label: 'rwa',
        title: 'RWA',
        bullets: [
          {
            title: "Tokenization on its own doesn't solve the business problem",
            description:
              "Wrapping an asset in a token doesn't automatically create demand or make the product stronger.",
          },
          {
            title: "It's not clear why the project needs a token",
            description:
              'Before launch, the team needs to define the purpose of tokenization and understand the role the token plays in the broader business strategy.',
          },
          {
            title: 'The RWA token sits outside the ecosystem',
            description:
              'Without utility mechanics, partner logic, or a broader product model around it, it remains an isolated instrument.',
          },
          {
            title: "The business doesn't gain new demand",
            description:
              "In many cases, growth doesn't come from the RWA token itself, but from the system built around it, including the utility layer.",
          },
        ],
      },
      {
        label: 'defi',
        title: 'DeFi',
        bullets: [
          {
            title: 'The blockchain choice works against the product',
            description:
              'A bad choice here affects gas costs, scalability, security, and the size of the user base you can realistically reach.',
          },
          {
            title: "The token doesn't strengthen the financial model",
            description:
              "In DeFi, adding a token on top isn't enough. It needs to reinforce the product and support real demand.",
          },
          {
            title: 'The user journey is underdesigned',
            description:
              "You need a clear view of who the user is, what problem they're solving, and why they'd choose your product over anything else.",
          },
          {
            title: "The market can't clearly see the model's value",
            description:
              "Even a strong product gets harder to trust if its financial logic and token utility don't come together in a system people can clearly understand.",
          },
        ],
      },
      {
        label: 'gamefi',
        title: 'GameFi',
        bullets: [
          {
            title: 'The economy breaks when earning and spending fall out of balance',
            description:
              'If the model is built around earning and selling the token instead of using it, the system quickly becomes unstable.',
          },
          {
            title: 'Players get more value from selling than using',
            description:
              'When selling the token feels more rewarding than using it inside the game, the in-game economy starts working against the project.',
          },
          {
            title: "The token doesn't support the gameplay loop",
            description:
              'The economy should reinforce progression, engagement, and retention, not turn the product into a short-term farm.',
          },
          {
            title: "The mechanics don't scale with the audience",
            description:
              "Even a working model can break under growth if the balance between issuance, utility, and burning isn't thought through.",
          },
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
          "Strategic consulting is for teams that need more than just tokenomics. It's for projects that want to build the full launch logic, from the project's economics and investor-ready materials to the partner ecosystem and TGE preparation. In most cases, it's the right fit for teams going to market for the first time or getting ready for the next stage of growth.",
      },
      {
        question: 'At what project stage should we engage you?',
        answer:
          "The earlier, the better. The ideal moment is when the team already has an idea, product logic, or some early materials, but the key decisions around the token, investor packaging, and go-to-market strategy still haven't been locked in. That said, we can also step in later if the project is already actively preparing for launch.",
      },
      {
        question: 'Can we engage if we already have tokenomics or a white paper?',
        answer:
          "Absolutely. If you already have some of the materials in place, we don't duplicate work just for the sake of it. We look at what can be kept, what needs refining, and what makes more sense to rebuild. From there, we pull everything into one strategy and close the gaps between the documents, the economics, and the launch plan.",
      },
      {
        question: 'What should we prepare before kickoff?',
        answer:
          "At the start, we'll want to see everything the project already has: presentations, draft white papers, a product overview, roadmap, the current token model, and any available information on rounds, team structure, and project goals. Even if the materials are still incomplete, that's usually enough to get started and see where deeper working sessions with the team will be needed.",
      },
      {
        question: 'Who from our side should be involved?',
        answer:
          "Usually, it's the founders and the key team members who shape the product, strategy, and project economics. Depending on how the project is structured, that might include the CEO, COO, CFO, product lead, marketing team, and technical team. What matters most is that decisions can be discussed quickly with the people who influence the launch.",
      },
      {
        question: 'Do you only consult, or also support implementation?',
        answer:
          "We go well beyond recommendations. As part of strategic consulting, we work through the model, prepare the key materials, help shape the partner ecosystem, and stay involved as the project moves into execution. It's not a one-call format. It's an active working process where we're built into the team's real tasks.",
      },
      {
        question: 'Do you help with partner selection?',
        answer:
          "Yes. We help define which partners the project needs at the launch prep stage, and we stay involved throughout the selection process across key areas such as market making, marketing, smart contracts, and other functions that matter for taking the token to market. We don't just pass along contacts or make introductions. We stay in the process, join the calls, help shape the brief for each contractor, and make sure the whole thing moves toward a clearer, more manageable outcome.",
      },
      {
        question: 'How long does the work take, and can it be accelerated?',
        answer:
          'Strategic consulting usually takes between 2 and 4 months. The exact timing depends on the stage of the project, the quality of the source materials, how quickly the team communicates internally, and how long coordination takes with outside partners. If needed, the process can be accelerated. The engagement is broken into key workstreams that are defined in the contract, and we can move faster through each of them. In that case, payment is tied to completed work blocks rather than billed monthly.',
      },
      {
        question: 'What is not included in strategic consulting?',
        answer:
          "Strategic consulting doesn't include legal work, smart contract development, marketing production, technical execution by outside contractors, or recommendations on how to expand or redesign the product line. That said, we can help identify which specialists the project needs and make sure their work fits into the broader launch strategy.",
      },
      {
        question: 'What is the final outcome?',
        answer:
          "By the end, you won't just have a stack of documents. You'll have a complete launch preparation system: tokenomics, a white paper, a pitch deck, a partner strategy, and a go-to-market plan. That gives the team a much stronger foundation for investor conversations, TGE preparation, and the operational steps that come next.",
      },
      {
        question: 'Is modeling included?',
        answer:
          'No. Modeling is a separate service available as Monte Carlo simulation in Python or visual simulation in Machinations.',
      },
    ],
  },
  midCta: {
    headline: 'Your project gets one real shot at a successful TGE',
    ctaLabel: 'Download the checklist',
    ctaHref: '/contact',
  },
  cta: {
    headline: "A token's utility is only limited by the way you think about it",
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
} as const

export const strategicConsultingContent = enObject

export const consultingMeta = {
  title: 'Strategic Consulting',
  description:
    "We help Web3 and Web2 teams build a project's economy, prepare for investment, and navigate the path to token market launch.",
  ogTitle: 'Strategic Consulting | 8Blocks',
  ogDescription:
    "We help Web3 and Web2 teams build a project's economy, prepare for investment, and navigate the path to token market launch.",
  twitterTitle: 'Strategic Consulting | 8Blocks',
  twitterDescription: 'We help Web3 teams shape project economics and prepare for TGE.',
} as const

export const consultingDeliverablesContent = {
  ariaLabel: 'Consulting results',
  items: [
    {
      title: 'Project tokenomics',
      description: 'We build a full token model covering utility, allocation, cliffs, vesting, and issuance',
      bullets: ['Token economic model', 'Utility mechanics', 'Allocation and vesting structure', 'Issuance projections'],
      group: 'main result',
      large: true,
    },
    {
      title: 'White Paper',
      description: 'We define the project concept, token logic, and the principles behind the ecosystem',
      bullets: ['Technical documentation', 'Economic model overview', 'Project roadmap', 'Legal considerations'],
      group: 'materials',
      large: false,
    },
    {
      title: 'Pitch Deck',
      description: 'We prepare the investor presentation and supporting materials',
      bullets: ['Investor presentation', 'Financial projections', 'Data visualization', 'Meeting materials'],
      group: 'materials',
      large: false,
    },
    {
      title: 'Partner strategy',
      description: 'We identify the right partners across key areas and help organize the process around them',
      bullets: ['Market making', 'Marketing and PR', 'Smart contract development', 'Legal support'],
      group: 'market launch',
      large: false,
      wide: true,
    },
    {
      title: 'Listing and go-to-market',
      description: 'We help prepare the token for exchange listing and market entry',
      bullets: ['TGE preparation', 'Exchange introductions', 'Launch strategy', 'Post-launch support'],
      group: 'market launch',
      large: false,
    },
    {
      title: 'Ongoing advisory support',
      description: 'Up to 10 calls per month, 90 minutes each, with our experts throughout the project',
      bullets: ['Strategic questions', 'Partner coordination', 'Investor meeting preparation'],
      group: 'support',
      large: false,
    },
  ],
} as const

export const consultingMapLabels = {
  nodes: [
    { id: 'business', lines: ['Business model'] },
    { id: 'tokenomics', lines: ['Tokenomics'] },
    { id: 'investment', lines: ['Investor', 'narrative'] },
    { id: 'partners', lines: ['Partner', 'ecosystem'] },
    { id: 'tge', lines: ['TGE', 'preparation'] },
    { id: 'launch', lines: ['Launch'] },
  ],
} as const
