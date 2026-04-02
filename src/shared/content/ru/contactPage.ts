// Contact page — single source of truth

export const contactMeta = {
  title: 'Контакты',
  description:
    'Свяжитесь с 8Blocks: обсудим токен-экономику, консалтинг или аудит. Ответим в течение одного рабочего дня.',
  ogTitle: 'Контакты | 8Blocks',
  ogDescription: 'Свяжитесь с нами — обсудим ваш проект.',
} as const

export const contactPageContent = {
  hero: {
    ariaLabel: 'Контакты',
    label: 'Контакты',
    headline: 'Обсудим ваш проект',
    description:
      'Пишите по вопросам стратегического консалтинга, токеномики и аудита. Если удобнее, сразу выберите слот для звонка.',
    person: {
      name: 'Оксана',
      role: 'COO',
      tgHref: 'https://t.me/Eight_Blocks',
      tgLabel: 'Telegram →',
    },
    preferEmailLabel: 'Предпочитаете почту?',
  },
  contacts: {
    ariaLabel: 'Контактная информация',
    socialsLabel: 'Соцсети',
    addressLabel: 'Адрес',
    phoneLabel: 'Телефон',
  },
  calendly: {
    ariaLabel: 'Забронировать звонок',
    headline: 'Забронировать звонок',
    description:
      'Выберите удобное время, и мы обсудим задачу, контекст проекта и возможный формат работы.',
    services: [
      'Стратегический консалтинг',
      'Разработка токеномики',
      'Аудит текущей модели',
    ],
  },
  section: {
    label: 'Контакт',
    headline: 'Обсудим',
    headlineAccent: 'ваш проект',
    description:
      'Расскажите нам о своей задаче — мы ответим в течение одного рабочего дня и предложим формат сотрудничества.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    officeLabel: 'Office',
    directionsLabel: 'Маршрут',
  },
} as const

export const contactFormContent = {
  nameLabel: 'Имя',
  namePlaceholder: 'Иван Иванов',
  messageLabel: 'Сообщение',
  messagePlaceholder: 'Расскажите о проекте и что вы ищете',
  submitLabel: 'Оставить заявку',
  sendingLabel: 'Отправка…',
  failedError: 'Не удалось отправить',
  successTitle: 'Сообщение отправлено',
  successBody: 'Мы ответим в течение одного рабочего дня.',
} as const
