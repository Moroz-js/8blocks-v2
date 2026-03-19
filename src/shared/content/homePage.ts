// All homepage content — single source of truth (per 15-content-plan.md)
// Edit text here; never scatter copy across components

export const heroContent = {
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
} as const

export const servicesContent = {
  label: 'Услуги',
  headline: 'Как мы создаем и восстанавливаем токен-экономики',
  items: [
    {
      id: 'strategic-consulting',
      href: '/services/strategic-consulting',
      title: 'Стратегический консалтинг',
      description:
        'Мы разрабатываем стратегию экономики проекта, формируем логику токена и стимулов, готовим проект к привлечению инвестиций и выстраиваем партнерскую экосистему до выхода токена на рынок.',
      accentColor: 'purple',
    },
    {
      id: 'tokenomics',
      href: '/services/tokenomics',
      title: 'Базовая токеномика',
      description:
        'Фундаментальная экономика токена с продуманным выпуском и распределением, заложенная для стабильной работы системы с первого дня.',
      accentColor: 'green',
    },
    {
      id: 'audit',
      href: '/services/audit',
      title: 'Аудит токеномики',
      description:
        'Полный разбор существующей экономики токена с выявлением структурных рисков, сломанных стимулов и точек, где рост приводит к системным сбоям.',
      accentColor: 'blue',
    },
  ],
} as const

export const aboutContent = {
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
} as const

export const partnersContent = {
  label: 'Партнеры',
  headline: 'Партнеры',
  partners: [
    { name: 'Partner 1', logo: '/partners/1.svg' },
    { name: 'Partner 2', logo: '/partners/2.svg' },
    { name: 'Partner 3', logo: '/partners/3.svg' },
    { name: 'Partner 4', logo: '/partners/4.svg' },
    { name: 'Partner 5', logo: '/partners/5.svg' },
    { name: 'Partner 6', logo: '/partners/6.svg' },
    { name: 'Partner 7', logo: '/partners/7.svg' },
    { name: 'Partner 8', logo: '/partners/8.svg' },
    { name: 'Partner 9', logo: '/partners/9.svg' },
    { name: 'Partner 11', logo: '/partners/11.svg' },
    { name: 'Partner 12', logo: '/partners/12.svg' },
    { name: 'Partner 13', logo: '/partners/13.svg' },
    { name: 'Partner 14', logo: '/partners/14.svg' },
    { name: 'Partner 15', logo: '/partners/15.svg' },
    { name: 'Partner 16', logo: '/partners/16.svg' },
    { name: 'Partner 17', logo: '/partners/17.svg' },
  ],
} as const

export const benefitsContent = {
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
} as const

export const teamContent = {
  members: [
    { photo: '/team/team-1.png' },
    { photo: '/team/team-2.png' },
    { photo: '/team/team-3.png' },
    { photo: '/team/team-4.png' },
    { photo: '/team/team-5.png' },
  ],
} as const

export const ctaContent = {
  label: 'Далее',
  headline: 'Если у токена нет роли,\nу проекта нет будущего.',
  body: 'Мы определяем роль токена и встраиваем ее в выручку и бизнес-процессы.',
  cta: {
    label: 'Обсудить проект',
    href: '/contact',
  },
} as const
