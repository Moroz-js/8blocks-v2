// Footer content — single source of truth

export const footerContent = {
  subscribeLabel: 'Подписаться',
  subscribeNote: 'Подписка для тех, кто хочет разбираться глубже.',
  navHeading: 'Навигация',
  servicesHeading: 'Услуги',
  productsHeading: 'Продукты',
  mapTitle: 'Карта',
  copyright: 'Все права защищены.',
  privacyPolicy: 'Политика конфиденциальности',
  mapEmbedSrc: 'https://yandex.ru/map-widget/v1/?ll=37.539021%2C55.747187&z=16&pt=37.539021%2C55.747187%2Cpm2rdm',
  pageLinks: [
    { label: 'Кейсы', href: '/cases' },
    { label: 'Блог', href: '/blog' },
    { label: 'Исследования', href: '/research' },
    { label: 'События', href: '/events' },
    { label: 'Пресса', href: '/press' },
    { label: 'Публичные аудиты', href: '/audits' },
    { label: 'Контакты', href: '/contact' },
    { label: 'О компании', href: '/about' },
    { label: 'Условия использования', href: '/terms' },
    { label: 'Бенчмарки вестинга токенов', href: '/learn/token-vesting-benchmarks' },
  ],
  serviceLinks: [
    { label: 'Стратегический консалтинг', href: '/services/strategic-consulting' },
    { label: 'Базовая токеномика', href: '/services/tokenomics' },
    { label: 'Аудит токеномики', href: '/services/audit' },
    { label: 'Воркшоп по токеномике', href: '/product/workshop' },
    { label: 'Стратегия цифровых активов', href: '/product/digital-assets' },
  ],
  productLinks: [
    {
      label: 'Запуск токена с Fibonacci и BingX',
      href: '/product/token-launch',
    },
    {
      label: 'Калькулятор токеномики',
      href: '/product/calculator',
    },
    {
      label: 'Готовность к токенизации',
      href: '/product/tokenization-readiness',
    },
    {
      label: 'Кейсы токенизации',
      href: '/product/tokenization-cases',
    },
    {
      label: 'Tokenomics AI',
      href: '/product/tokenomics-ai',
    },
  ],
} as const
