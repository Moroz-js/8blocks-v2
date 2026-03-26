// All homepage content — single source of truth (per 15-content-plan.md)
// Edit text here; never scatter copy across components
import { t } from '@/shared/i18n'

const localize = <T>(ru: T, en?: T) => t({ ru, en: en ?? ru })

export const heroContent = localize({
  label: 'Токеномика',
  headlineLine1: 'Токен-экономики',
  headlineLine2: 'которые усиливают',
  headlineLine3: 'бизнес',
  description:
    'Мы превращаем токены из разового способа привлечь деньги в работающие экономические механики. Они встроены в продукт и операционную логику, поэтому ценность формируется за счет спроса и использования, а не спекуляций.',
  serviceLinks: [
    { label: 'Стратегический консалтинг', href: '#services' },
    { label: 'Токеномика', href: '#services' },
    { label: 'Аудит токеномики', href: '#services' },
  ],
  cta: {
    label: 'Обсудить проект',
    href: '/contact',
  },
} as const, {
  label: 'Tokenomics',
  headlineLine1: 'Token economies',
  headlineLine2: 'that power',
  headlineLine3: 'the business',
  description:
    'We turn tokens from a one-time fundraising tool into working economic instruments. They are embedded into product and operations, so value comes from demand and usage, not speculation.',
  serviceLinks: [
    { label: 'Strategic consulting', href: '#services' },
    { label: 'Tokenomics', href: '#services' },
    { label: 'Tokenomics audit', href: '#services' },
  ],
  cta: {
    label: 'Talk to the team',
    href: '/contact',
  },
} as const)

export const servicesPageContent = localize({
  hero: {
    label: 'Услуги',
    headline: 'Стратегия, токеномика и аудит\nдля web3- и web2-проектов',
    description:
      'Подключаемся на ключевых этапах: когда нужно собрать модель с нуля, проверить уже готовую экономику или выстроить путь от идеи до листинга',
    ctaLabel: 'Обсудить задачу',
    ctaHref: '/contact',
  },
  transition: {
    headline: 'Не всем проектам сразу нужна разработка токеномики',
    description:
      'Иногда проекту нужен аудит уже собранной модели. Иногда – проектирование новой. А иногда сначала нужно понять, какую роль токен вообще должен играть в бизнесе',
  },
} as const, {
  hero: {
    label: 'Services',
    headline: 'Strategy, tokenomics, and audit\nfor Web3 and Web2 projects',
    description:
      'We step in at key stages: when you need to build a model from scratch, validate an existing economy, or chart the path from idea to listing',
    ctaLabel: 'Discuss your task',
    ctaHref: '/contact',
  },
  transition: {
    headline: 'Not every project needs tokenomics development right away',
    description:
      'Sometimes a project needs an audit of an existing model. Sometimes — a new design. And sometimes you first need to understand what role the token should play in the business',
  },
} as const)

export const servicesContent = localize({
  label: 'Услуги',
  headline: 'Как мы создаем и улучшаем токен-экономики',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Стратегический консалтинг',
      description:
        'Мы собираем стратегию токен-экономики проекта: формируем логику токена и стимулов, строим roadmap, готовим проект к привлечению инвестиций и выстраиваем партнерскую экосистему до выхода токена на рынок.',
      accentColor: 'purple',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Токеномика',
      description:
        'Разрабатываем экономическую модель токена, связанную с продуктом, спросом и логикой роста. Прорабатываем выпуск, распределение, вестинг, treasury, стимулы и внутреннюю архитектуру модели.',
      accentColor: 'green',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Аудит токеномики',
      description:
        'Проводим глубокий анализ текущей модели токена: выявляем слабые места, риски и точки роста, а также даем рекомендации по корректировке экономики проекта.',
      accentColor: 'blue',
    },
  ],
} as const, {
  label: 'Services',
  headline: 'How we build and improve token economies',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Strategic consulting',
      description:
        'We build the token economy strategy for the project: define token logic and incentives, create a roadmap, prepare the project for fundraising, and establish a partner ecosystem before the token hits the market.',
      accentColor: 'purple',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Tokenomics',
      description:
        "We design the token's economic model, tied to the product, demand, and growth logic. We work through emission, distribution, vesting, treasury, incentives, and the model's internal architecture.",
      accentColor: 'green',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Tokenomics audit',
      description:
        "We conduct a deep analysis of the current token model: identifying weaknesses, risks, and growth points, and provide recommendations for adjusting the project's economy.",
      accentColor: 'blue',
    },
  ],
} as const)

export const servicesShowcaseContent = localize({
  headline: 'Как мы подключаемся к проекту',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Стратегический консалтинг',
      description:
        'Когда нужна не только токеномика, а вся стратегия: от идеи и экономики до подготовки к TGE и выходу на рынок',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Токеномика',
      description:
        'Для проектов, которым нужна полноценная экономическая модель токена, связанная с продуктом, спросом и логикой роста',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Аудит токеномики',
      description:
        'Когда модель уже собрана, но нужно проверить её на слабые места, риски или подтвердить её работоспособность',
    },
  ],
} as const, {
  headline: 'How we engage with a project',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Strategic consulting',
      description:
        'When you need more than tokenomics — the full strategy: from idea and economics to TGE preparation and market launch',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Tokenomics',
      description:
        'For projects that need a full-fledged token economic model tied to the product, demand, and growth logic',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Tokenomics audit',
      description:
        'When the model is already built, but needs to be checked for weaknesses, risks, or validated for viability',
    },
  ],
} as const)

export const aboutContent = localize({
  label: 'О нас',
  attribution: '8Blocks Team',
  quote:
    '«Токен должен создавать ценность для проекта на протяжении всего его жизненного цикла. Это возможно только тогда, когда четко понятно, зачем он существует и кому он действительно нужен».',
  stats: [
    { value: '30+', label: 'токен-экономик, разработанных для проектов в различных отраслях' },
    { value: '$180M+', label: 'совокупная капитализация проектов, построенных на наших моделях' },
    { value: '21 день', label: 'средний срок разработки рабочей токен-экономической модели' },
    { value: '14 фондов', label: 'инвестировали в проекты, основанные на нашей токен-экономике' },
  ],
} as const, {
  label: 'About',
  attribution: '8Blocks Team',
  quote:
    "\"A token should generate value for the project throughout its entire lifecycle. This is only possible when it's clearly understood why it exists and who truly needs it.\"",
  stats: [
    { value: '30+', label: 'token economies designed for projects across multiple industries' },
    { value: '$180M+', label: 'combined capitalization of projects built on our models' },
    { value: '21 days', label: 'average time to design a working token economy model' },
    { value: '14 funds', label: 'invested in projects built on our token economics' },
  ],
} as const)

export const partnersContent = localize({
  label: 'Партнеры',
  headline: 'Партнеры',
  partners: [
    { name: 'Partner 1', logo: '/partners/1.svg' },
    { name: 'Partner 2', logo: '/partners/2.svg' },
    { name: 'Partner 3', logo: '/partners/3.svg' },
    { name: 'Lodes.tech', logo: '/partners/4.svg', href: 'https://lodestech.ru' },
    { name: 'Partner 5', logo: '/partners/5.svg' },
    { name: 'Partner 6', logo: '/partners/6.svg' },
    { name: 'Fibonacci', logo: '/partners/7.svg', href: 'https://fibonacci.market/' },
    { name: 'Partner 8', logo: '/partners/8.svg' },
    { name: 'Partner 9', logo: '/partners/9.svg' },
    { name: 'Partner 11', logo: '/partners/11.svg' },
    { name: 'Partner 12', logo: '/partners/12.svg' },
    { name: 'D&A', logo: '/partners/13.svg', href: 'https://dna.partners/' },
    { name: 'Partner 14', logo: '/partners/14.svg' },
    { name: 'Listing Help', logo: '/partners/15.svg', href: 'https://listing.help/' },
    { name: 'Cicada', logo: '/partners/16.svg', href: 'https://www.cicada-mm.com/' },
    { name: 'Anogem', logo: '/partners/17.svg', href: 'https://anogem.io' },
  ],
} as const, {
  label: 'Partners',
  headline: 'Partners',
  partners: [
    { name: 'Partner 1', logo: '/partners/1.svg' },
    { name: 'Partner 2', logo: '/partners/2.svg' },
    { name: 'Partner 3', logo: '/partners/3.svg' },
    { name: 'Lodes.tech', logo: '/partners/4.svg', href: 'https://lodestech.ru' },
    { name: 'Partner 5', logo: '/partners/5.svg' },
    { name: 'Partner 6', logo: '/partners/6.svg' },
    { name: 'Fibonacci', logo: '/partners/7.svg', href: 'https://fibonacci.market/' },
    { name: 'Partner 8', logo: '/partners/8.svg' },
    { name: 'Partner 9', logo: '/partners/9.svg' },
    { name: 'Partner 11', logo: '/partners/11.svg' },
    { name: 'Partner 12', logo: '/partners/12.svg' },
    { name: 'D&A', logo: '/partners/13.svg', href: 'https://dna.partners/' },
    { name: 'Partner 14', logo: '/partners/14.svg' },
    { name: 'Listing Help', logo: '/partners/15.svg', href: 'https://listing.help/' },
    { name: 'Cicada', logo: '/partners/16.svg', href: 'https://www.cicada-mm.com/' },
    { name: 'Anogem', logo: '/partners/17.svg', href: 'https://anogem.io' },
  ],
} as const)

export const benefitsContent = localize({
  label: 'Почему 8Blocks',
  headlinePart1: 'Когда бизнес растет,',
  headlinePart2: 'токен не всегда растёт вместе с ним.',
  headlinePart3: 'Поэтому мы проектируем экономику,\nв которой он обязан это сделать.',
  items: [
    {
      id: 'business-tied',
      title: 'Экономика, встроенная в бизнес',
      description:
        'Ценность токена структурно связана с использованием продукта, а не с динамикой рынка. Когда бизнес растет, спрос на токен вынужден расти вместе с ним.',
    },
    {
      id: 'usage-demand',
      title: 'Спрос от использования',
      description:
        'Токены нужны для доступа к продукту, правам или возможностям. И их держат потому, что они необходимы, а не потому, что что-то пообещали.',
    },
    {
      id: 'stress-tested',
      title: 'Проверка рынком',
      description:
        'Мы тестируем модели в реальных условиях: продажи, отток пользователей, низкая ликвидность, резкие скачки роста. Потому что рынок никогда не живет по идеальному сценарию.',
    },
    {
      id: 'growth-mechanics',
      title: 'Контролируемый рост',
      description:
        'Механики выпуска, стимулов и обращения развиваются вместе с процессами, сохраняя контроль у компании, а не у рынка.',
    },
  ],
} as const, {
  label: 'Why 8Blocks',
  headlinePart1: 'When the business grows,',
  headlinePart2: "the token doesn't always follow.",
  headlinePart3: 'So we design economies\nwhere it has to.',
  items: [
    {
      id: 'business-tied',
      title: 'Business-linked economics',
      description:
        'Token value is structurally tied to product usage, not market dynamics. When the business grows, token demand has no choice but to follow.',
    },
    {
      id: 'usage-demand',
      title: 'Usage-driven demand',
      description:
        "Tokens are required to access the product, rights, or advantages. People hold them because they're needed, not because something was promised.",
    },
    {
      id: 'stress-tested',
      title: 'Stress-tested circulation',
      description:
        'We test models against real conditions: sell pressure, user churn, low liquidity, growth spikes. Because markets never follow best-case scenarios.',
    },
    {
      id: 'growth-mechanics',
      title: 'Controlled growth mechanics',
      description:
        'Supply, incentives, and circulation scale with operations, keeping control with the company — not the market.',
    },
  ],
} as const)

export const teamContent = localize({
  members: [
    { photo: '/team/team-1.png' },
    { photo: '/team/team-2.png' },
    { photo: '/team/team-3.png' },
    { photo: '/team/team-4.png' },
    { photo: '/team/team-5.png' },
  ],
} as const)

export const tokenEconomyContent = localize({
  headline: 'Мы не добавляем токен к бизнесу.\nМы встраиваем его в экономику',
  accentWords: ['добавляем', 'встраиваем'],
  description:
    'Сильная модель делает токен частью системы: он усиливает экономику проекта, работает на вовлечение пользователей и ясно отвечает на вопрос, зачем он нужен бизнесу.',
  cards: [
    {
      title: 'Деньги не должны заканчиваться на продаже токена',
      description:
        'Сильная модель создает цикл использования, накопления и повторного спроса.',
    },
    {
      title: 'Ликвидность не должна быть дешёвой',
      description:
        'Мы проектируем механизмы, которые расширяют опыт пользователей, а не сводятся к банальной скидке.',
    },
    {
      title: 'Если модель нельзя быстро объяснить, она уже слаба',
      description:
        'Инвестор должен сразу понимать, какую роль токен играет в бизнесе и за счет чего он создает ценность.',
    },
    {
      title: 'С 2017 года в токен-экономиках',
      description:
        'За это время мы увидели тысячи моделей и собрали десятки собственных.',
    },
    {
      title: 'Опыт в классических финансах',
      description:
        'Позволяет нам быстро разбираться в сложных бизнес-моделях и находить решения, которые усиливают экономику проекта, а не усложняют её.',
    },
  ],
} as const, {
  headline: "We don't add a token to the business.\nWe embed it into the economy",
  accentWords: ['add', 'embed'],
  description:
    "A strong model makes the token part of the system: it strengthens the project's economy, drives user engagement, and clearly answers why the business needs it.",
  cards: [
    {
      title: "Revenue shouldn't end at the token sale",
      description:
        'A strong model creates a cycle of usage, accumulation, and recurring demand.',
    },
    {
      title: "Liquidity shouldn't come cheap",
      description:
        'We design mechanisms that expand user experience, not ones that boil down to a trivial discount.',
    },
    {
      title: "If the model can't be explained quickly, it's already weak",
      description:
        "An investor should immediately understand the token's role in the business and what drives its value.",
    },
    {
      title: 'In token economies since 2017',
      description:
        "During that time, we've seen thousands of models and built dozens of our own.",
    },
    {
      title: 'Experience in traditional finance',
      description:
        "Enables us to quickly grasp complex business models and find solutions that strengthen the project's economy, not complicate it.",
    },
  ],
} as const)

export const tokenFilterContent = localize({
  headline: 'Не каждый токен должен существовать',
  subtitle: 'И не каждая модель заслуживает выход на рынок',
  ctaLabel: 'Обсудить задачу',
  ctaHref: '/contact',
} as const, {
  headline: 'Not every token should exist',
  subtitle: 'And not every model deserves to go to market',
  ctaLabel: 'Discuss your task',
  ctaHref: '/contact',
} as const)

export const tokenomicsTestContent = localize({
  headline: 'Протестируйте свою токеномику',
  description:
    'В нашем мини-приложении можно быстро собрать базовую модель, настроить вестинг, посмотреть график разлоков и увидеть первые риски токеномики.',
  cards: [
    {
      title: 'Базовая модель',
      description:
        'Задайте объем токенов, цену, циркуляцию и аллокации, чтобы быстро увидеть базовую картину по токеномике',
    },
    {
      title: 'Вестинг и разлоки',
      description:
        'Настройте разлоки по каждому пулу, посмотрите графики анлоков, возможные всплески и общее состояние модели',
    },
    {
      title: 'Итоговая оценка',
      description:
        'Получите срез модели с кратким выводом о рисках и качестве токеномики',
    },
    {
      title: 'Ежедневная практика',
      description:
        'Возвращайтесь в приложение каждый день, отвечайте на вопросы и шаг за шагом прокачивайте понимание токеномики',
    },
  ],
  ctaLabel: 'Открыть приложение',
  ctaHref: 'https://8blocks-token-lab.vercel.app/calculator',
} as const, {
  headline: 'Test your tokenomics',
  description:
    'In our mini-app you can quickly build a basic model, set up vesting, view the unlock schedule, and spot the first risks in your tokenomics.',
  cards: [
    {
      title: 'Basic model',
      description:
        'Set the token supply, price, circulation, and allocations to quickly see the tokenomics overview',
    },
    {
      title: 'Vesting and unlocks',
      description:
        'Set up unlocks for each pool, view unlock charts, potential spikes, and overall model health',
    },
    {
      title: 'Final assessment',
      description:
        'Get a model snapshot with a brief summary of risks and tokenomics quality',
    },
    {
      title: 'Daily practice',
      description:
        'Come back to the app daily, answer questions, and step by step improve your tokenomics understanding',
    },
  ],
  ctaLabel: 'Open the app',
  ctaHref: 'https://8blocks-token-lab.vercel.app/calculator',
} as const)

export const servicesFaqContent = localize({
  headline: 'Частые вопросы',
  items: [
    {
      question: 'Как понять, какая услуга нужна именно нам?',
      answer:
        'Все зависит от того, на каком этапе вы находитесь и в чем реальная задача. Если модель уже есть, но к ней есть вопросы, обычно нужен аудит. Если токеномику нужно собрать заново – разработка. Если задача шире и включает стратегию, подготовку к TGE, инвесторам и выходу на рынок – стратегический консалтинг. Если есть сомнения, это как раз хороший повод прийти на консультацию.',
    },
    {
      question: 'К вам можно прийти уже с готовой моделью?',
      answer:
        'Да, конечно. Мы часто подключаемся к проектам, у которых уже есть токеномика, white paper, таблицы с расчетами или другие рабочие материалы. В этом случае мы не начинаем все заново без причины, а смотрим, что можно использовать, что требует доработки и что лучше пересобрать.',
    },
    {
      question: 'Вы работаете только с web3-проектами?',
      answer:
        'Нет. Мы работаем не только с web3-проектами, но и с web2-командами, у которых уже есть готовый бизнес или продукт и которые хотят выходить в web3 через токен-экономику.',
    },
    {
      question: 'Можно ли начать с аудита, а потом перейти в разработку или стратегию?',
      answer:
        'Да, это нормальный сценарий. Аудит часто помогает понять, достаточно ли модели точечных правок или проекту уже нужна более глубокая пересборка токеномики или стратегическая работа.',
    },
    {
      question: 'Как проходит первый контакт с вами?',
      answer:
        'Обычно мы начинаем с короткого разговора, где разбираем ваш проект, текущую задачу и контекст. На этом этапе уже можно понять, какой формат работы нужен, насколько глубоко нужно заходить и что будет следующим шагом.',
    },
    {
      question: 'Что нужно подготовить перед первым разговором?',
      answer:
        'Все, что уже есть по проекту: презентации, white paper, tokenomics deck, Excel-файлы, roadmap, описание продукта, текущие расчеты или просто внятное описание задачи. Даже если материалов немного, этого уже достаточно, чтобы начать разговор предметно.',
    },
    {
      question: 'Если у нас пока нет полной картины по проекту, есть смысл идти к вам?',
      answer:
        'Да. Чем раньше вы подключаете нашу команду, тем меньше риск совершить ошибки на старте. Довольно часто к нам приходят даже не с полным пакетом материалов, а с короткой, еще неоформленной идеей без подробного текстового описания. В таких случаях мы помогаем понять, чего проекту не хватает, где есть слабые места и с чего правильнее начинать работу.',
    },
    {
      question: 'Можно ли прийти только за консультацией, без большой работы сразу?',
      answer:
        'Да. Если вам сначала нужен взгляд со стороны и честный разбор ситуации, можно начать с консультации. Иногда после нее становится ясно, что делать дальше, а иногда – что проекту пока рано идти в большую работу.',
    },
    {
      question: 'Вы подключаетесь только на старте проекта или позже тоже?',
      answer:
        'И позже тоже. Мы работаем с проектами на разных этапах: когда токен только обсуждается, когда модель уже собрана, когда проект готовится к токенсейлу или когда становится понятно, что текущая экономика требует пересмотра.',
    },
    {
      question: 'Можно ли у вас просто уточнить, сильная у нас модель или нет?',
      answer:
        'Можно, но такой вопрос почти всегда требует более глубокого разбора. Для нас важно не просто дать общую оценку, а понять, за счет чего модель действительно сильна, где в ней заложены риски и насколько уверенно на нее можно опираться дальше.',
    },
    {
      question: 'Чем вы отличаетесь от тех, кто делает tokenomics-документ?',
      answer:
        'Мы смотрим на токен не как на отдельный элемент модели, а как на часть экономики бизнеса. Поэтому для нас важны не только таблицы, графики и аллокации, а то, как токен встроен в продукт, спрос, пользовательский опыт, инвестиционную логику и рост проекта.',
    },
  ],
} as const, {
  headline: 'FAQ',
  items: [
    {
      question: 'How do I know which service is right for us?',
      answer:
        "It depends on what stage you're at and what the real challenge is. If you already have a model but have questions about it, you usually need an audit. If the tokenomics needs to be built from scratch — development. If the task is broader and includes strategy, TGE preparation, investor readiness, and market launch — strategic consulting. If you're unsure, that's a great reason to come for a consultation.",
    },
    {
      question: "Can we come to you with a model that's already built?",
      answer:
        "Yes, of course. We often join projects that already have tokenomics, a white paper, calculation spreadsheets, or other working materials. In that case, we don't start from scratch without reason — we look at what can be used, what needs refinement, and what's better to rebuild.",
    },
    {
      question: 'Do you only work with Web3 projects?',
      answer:
        'No. We work not only with Web3 projects but also with Web2 teams that already have an established business or product and want to enter Web3 through token economics.',
    },
    {
      question: 'Can we start with an audit and then move to development or strategy?',
      answer:
        "Yes, that's a normal scenario. An audit often helps determine whether the model only needs minor fixes or if the project already requires a deeper tokenomics overhaul or strategic work.",
    },
    {
      question: 'What does the first contact with you look like?',
      answer:
        'We usually start with a short conversation where we review your project, current task, and context. At this stage, we can already understand what work format is needed, how deep we need to go, and what the next step will be.',
    },
    {
      question: 'What should we prepare before the first conversation?',
      answer:
        "Everything you already have on the project: presentations, white paper, tokenomics deck, Excel files, roadmap, product description, current calculations, or just a clear description of the task. Even if you have limited materials, it's enough to start a substantive conversation.",
    },
    {
      question: "If we don't have a complete picture of the project yet, is there a point in coming to you?",
      answer:
        "Yes. The earlier you involve our team, the lower the risk of making mistakes at the start. Quite often people come to us not even with a full set of materials, but with a short, still unformed idea without a detailed written description. In such cases, we help understand what the project is missing, where the weak points are, and where to start.",
    },
    {
      question: 'Can we just come for a consultation, without a large engagement right away?',
      answer:
        "Yes. If you first need an outside perspective and an honest assessment, you can start with a consultation. Sometimes after it, it becomes clear what to do next, and sometimes — that the project isn't ready for a major engagement yet.",
    },
    {
      question: "Do you only get involved at the project's start, or later too?",
      answer:
        'Later too. We work with projects at different stages: when the token is just being discussed, when the model is already built, when the project is preparing for a token sale, or when it becomes clear that the current economy needs a rethink.',
    },
    {
      question: 'Can we simply ask you whether our model is strong or not?',
      answer:
        "You can, but such a question almost always requires a deeper analysis. For us, it's important not just to give a general assessment, but to understand what actually makes the model strong, where risks are embedded, and how confidently you can rely on it going forward.",
    },
    {
      question: 'How are you different from those who make a tokenomics document?',
      answer:
        "We look at the token not as a standalone model element, but as part of the business economy. That's why what matters to us isn't just tables, charts, and allocations, but how the token is embedded in the product, demand, user experience, investment logic, and project growth.",
    },
  ],
} as const)

export const ctaContent = localize({
  label: 'Далее',
  headline: 'Если у токена нет роли,\nу проекта нет будущего.',
  body: 'Мы определяем роль токена и встраиваем ее в выручку и бизнес-процессы.',
  cta: {
    label: 'Обсудить проект',
    href: '/contact',
  },
} as const, {
  label: 'Next step',
  headline: 'If the token has no role,\nthe project has no future.',
  body: 'We define the token’s role and connect it directly to revenue and operations.',
  cta: {
    label: 'Talk to the team',
    href: '/contact',
  },
} as const)
