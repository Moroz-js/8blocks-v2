import type { CollectionConfig } from 'payload'

export const LaunchModules: CollectionConfig = {
  slug: 'launch-modules',
  labels: {
    singular: 'Модуль запуска',
    plural: 'Модули запуска',
  },
  admin: {
    useAsTitle: 'nameRu',
    group: 'Контент',
    defaultColumns: ['nameRu', 'price', 'durationLabelRu', 'order', 'updatedAt'],
    description:
      'Услуги калькулятора на странице «Запуск токена» (/product/token-launch). Порядок в калькуляторе задаётся полем «Порядок».',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      required: true,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Модули сортируются по возрастанию',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'nameRu',
          type: 'text',
          label: 'Название (RU)',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'nameEn',
          type: 'text',
          label: 'Название (EN)',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'durationLabelRu',
          type: 'text',
          label: 'Срок — отображение (RU)',
          required: true,
          admin: { width: '50%', description: 'Например: «10 рабочих дней»' },
        },
        {
          name: 'durationLabelEn',
          type: 'text',
          label: 'Срок — отображение (EN)',
          required: true,
          admin: { width: '50%', description: 'Например: “10 business days”' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'durationWeeks',
          type: 'number',
          label: 'Срок в неделях (для счётчика)',
          required: true,
          min: 0,
          admin: { width: '50%', step: 0.5 },
        },
        {
          name: 'price',
          type: 'number',
          label: 'Базовая цена, USD',
          required: true,
          min: 0,
          admin: { width: '50%', description: 'Если есть пакеты — цена первого пакета' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priceFrom',
          type: 'checkbox',
          label: 'Цена «от»',
          defaultValue: false,
          admin: { width: '33%' },
        },
        {
          name: 'parallel',
          type: 'checkbox',
          label: 'Идёт параллельно',
          defaultValue: false,
          admin: {
            width: '33%',
            description: 'Параллельные модули не суммируются по сроку (Workshop, аудит)',
          },
        },
        {
          name: 'includeInTotal',
          type: 'checkbox',
          label: 'Входит в сумму',
          defaultValue: true,
          admin: {
            width: '33%',
            description: 'Выключите для листинга — считается отдельно',
          },
        },
      ],
    },
    {
      name: 'descriptionRu',
      type: 'textarea',
      label: 'Описание (RU)',
      required: true,
    },
    {
      name: 'descriptionEn',
      type: 'textarea',
      label: 'Описание (EN)',
      required: true,
    },
    {
      name: 'packages',
      type: 'array',
      label: 'Пакеты',
      labels: { singular: 'Пакет', plural: 'Пакеты' },
      admin: {
        description:
          'Опционально. Если пакеты заданы, пользователь выбирает один из них, и его цена заменяет базовую',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'labelRu',
              type: 'text',
              label: 'Название (RU)',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'labelEn',
              type: 'text',
              label: 'Название (EN)',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'number',
              label: 'Цена, USD',
              required: true,
              min: 0,
              admin: { width: '50%' },
            },
            {
              name: 'durationWeeks',
              type: 'number',
              label: 'Срок в неделях',
              min: 0,
              admin: { width: '50%', step: 0.5, description: 'Опционально, если отличается от модуля' },
            },
          ],
        },
      ],
    },
  ],
}
