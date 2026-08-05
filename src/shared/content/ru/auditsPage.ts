export const auditsMeta = {
  title: 'Публичные аудиты — А8А9 токеномика.рф',
  description: 'Публичные аудиты токенов от команды А8А9.',
  ogTitle: 'Публичные аудиты — А8А9 токеномика.рф',
  ogDescription: 'Публичные аудиты токенов от команды А8А9.',
} as const

export const auditsArchiveContent = {
  labelSection: 'Аудиты',
  headline: 'Публичные аудиты',
  emptyState: 'Аудиты появятся здесь.',
  emptyHint: 'Загляните позже.',
  paginationAriaLabel: 'Навигация по страницам',
  prevPage: 'Предыдущая страница',
  nextPage: 'Следующая страница',
  readLink: 'Смотреть',
  blogArticleLink: 'Читать статью в блоге',
  downloadPdf: 'Скачать Аудит в PDF',
  expertLabel: 'Эксперт',
  auditLabel: 'Аудит токена',
  finalRating: 'Итоговый рейтинг',
  countSingular: 'аудит',
  countFew: 'аудита',
  countMany: 'аудитов',
} as const

export const methodologyContent = {
  ariaLabel: 'Методология рейтинга',
  label: 'Методология рейтинга',
  headline: 'Как мы оцениваем связь продукта и токена',
  product: {
    label: 'PRODUCT',
    caption: 'Users · volume · revenue',
  },
  token: {
    label: 'TOKEN',
    caption: 'Price · holders · demand',
  },
  linkage: {
    label: 'TPL',
    caption: 'Token Product Linkage',
  },
  strong: 'Сильная связь',
  noLinkage: 'Нет связи',
  strongDescription:
    'Рост продукта создаёт спрос и экономическую ценность для токена.',
  noLinkageDescription:
    'Без Token Product Linkage рост продукта не обязательно усиливает токен.',
  signals: [
    { id: 'value-capture', title: 'Захват ценности', line: 'Доходит ли выручка продукта до токена?' },
    { id: 'token-necessity', title: 'Необходимость токена', line: 'Нужен в основном цикле или опционален?' },
    { id: 'demand-elasticity', title: 'Эластичность спроса', line: 'Активность растёт → спрос на токен растёт.' },
    { id: 'supply-sinks', title: 'Стоки предложения', line: 'Сжигания и локи, растущие с использованием.' },
    { id: 'on-chain-proof', title: 'On-chain доказательства', line: 'Проверяемые потоки, а не «поверьте на слово».' },
    { id: 'rule-durability', title: 'Устойчивость правил', line: 'Насколько сложно отключить связку?' },
  ],
  ratingDescription:
    'Token Product Linkage — ядро оценки. Дополнительно мы анализируем устойчивость токеномики, фундаментал, управление и контроль, безопасность и рыночный слой; результат объединяет скор, цветовую оценку и ключевые риски.',
  scoredNote: 'Каждый аудит выше оценивается по этой методологии.',
  transparency:
    'Мы показываем, что и зачем измеряем; веса и формулы остаются внутренней методологией.',
  consultationLabel: 'Записаться на консультацию',
} as const
