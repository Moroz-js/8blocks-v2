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
  mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2246.4!2d37.6082!3d55.7271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54bca36edce63%3A0x5b0e4d43e4f5d2a0!2z0JvQtdC90LjQvdGB0LrQuNC5INC_0YDQvtGB0L_QtdC60YIsIDE10LAsINCc0L7RgdC60LLQsA!5e0!3m2!1sru!2sru',
  pageLinks: [
    { label: 'Услуги', href: '/services' },
    { label: 'Блог', href: '/blog' },
    { label: 'Контакты', href: '/contact' },
  ],
  serviceLinks: [
    { label: 'Стратегический консалтинг', href: '/services/strategic-consulting' },
    { label: 'Базовая токеномика', href: '/services/tokenomics' },
    { label: 'Аудит токеномики', href: '/services/audit' },
  ],
  productLinks: [
    {
      label: 'Калькулятор токеномики',
      href: '/product/calculator',
    },
  ],
} as const
