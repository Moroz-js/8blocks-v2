// Навигация сайта: мега-меню хедера и колонки футера (макеты project 2).

export const siteNav = {
  contact: { label: 'Связаться', href: '/contact' },
  menu: { open: 'Открыть меню', close: 'Закрыть меню', label: 'Меню', closeLabel: 'Закрыть' },
  groups: [
    {
      id: 'tokenomics',
      label: 'Токеномика',
      intro: {
        href: '/services/tokenomics',
        title: 'Рабочая экономика токена',
        text: 'Проектируем, проверяем и масштабируем устойчивую экономику токена для вашего продукта.',
        more: 'Подробнее о токеномике',
      },
      columns: [
        {
          heading: 'Услуги',
          links: [
            { label: 'Стратегический консалтинг', href: '/services/strategic-consulting' },
            { label: 'Разработка токеномики', href: '/services/tokenomics' },
            { label: 'Аудит токеномики', href: '/services/audit' },
            { label: 'Воркшоп', href: '/product/workshop' },
            { label: 'Запуск токена', href: '/product/token-launch' },
          ],
        },
        {
          heading: 'Инструменты',
          links: [
            { label: 'Калькулятор', href: '/product/calculator' },
            { label: 'Бенчмарки вестинга', href: '/learn/token-vesting-benchmarks' },
            { label: 'Tokenomics AI', href: '/product/tokenomics-ai' },
          ],
        },
      ],
    },
    {
      id: 'assets',
      label: 'Цифровые активы',
      intro: {
        href: '/product/digital-assets',
        title: 'Начните с бизнес-задачи',
        text: 'От стратегии до внедрения: превращаем реальные активы и финансовые инструменты в цифровые продукты.',
        more: 'Подробнее о цифровых активах',
      },
      columns: [
        {
          heading: 'Услуги',
          links: [{ label: 'Стратегия цифровых активов', href: '/product/digital-assets' }],
        },
        {
          heading: 'Изучить и оценить',
          links: [
            { label: 'Готовность к токенизации', href: '/product/tokenization-readiness' },
            { label: 'Кейсы токенизации', href: '/product/tokenization-cases' },
          ],
        },
      ],
    },
    {
      id: 'media',
      label: 'Медиа',
      intro: {
        href: '/cases',
        title: 'Наша работа и аналитика',
        text: 'Подробные кейсы, аудиты, исследования и материалы нашей команды.',
        more: 'Перейти в медиа',
      },
      columns: [
        {
          heading: 'Наша работа',
          links: [
            { label: 'Кейсы клиентов', href: '/cases' },
            { label: 'Публичные аудиты', href: '/audits' },
          ],
        },
        {
          heading: 'Знания',
          links: [
            { label: 'Исследования', href: '/research' },
            { label: 'Блог', href: '/blog' },
          ],
        },
      ],
    },
    {
      id: 'company',
      label: 'Компания',
      intro: {
        href: '/about',
        title: 'Знакомьтесь, А8А9',
        text: 'Команда, наш подход и то, что движет А8А9.',
        more: 'О компании',
      },
      columns: [
        {
          heading: 'О компании',
          links: [
            { label: 'О компании', href: '/about' },
            { label: 'Методология', href: '/methodology' },
            { label: 'События', href: '/events' },
            { label: 'Пресса', href: '/press' },
          ],
        },
      ],
    },
  ],
  footer: {
    subscribe: 'Подписаться',
    subscribeNote: 'Рассылка для тех,\nкто хочет разбираться глубже.',
    newsletter: {
      placeholder: 'Ваш email',
      submit: 'Подписаться',
      success: 'Вы подписаны. Скоро напишем.',
      error: 'Не удалось подписаться',
    },
    office: 'Офис',
    mapTitle: 'Офис на карте',
    mapEmbedSrc: 'https://yandex.ru/map-widget/v1/?ll=37.539021%2C55.747187&z=16&pt=37.539021%2C55.747187%2Cpm2rdm',
    rights: 'Все права защищены.',
    legal: [
      { label: 'Политика конфиденциальности', href: '/privacy-policy' },
      { label: 'Условия использования', href: '/terms' },
    ],
  },
}
