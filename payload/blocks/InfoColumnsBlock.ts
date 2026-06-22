import type { Block } from 'payload'

export const InfoColumnsBlock: Block = {
  slug: 'infoColumns',
  labels: { singular: 'Инфо-колонки', plural: 'Инфо-колонки' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Карточки',
      minRows: 1,
      labels: { singular: 'Карточка', plural: 'Карточки' },
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        {
          name: 'formula',
          type: 'text',
          label: 'Формула (LaTeX)',
          admin: { description: 'Необязательно: формула под заголовком' },
        },
        { name: 'body', type: 'textarea', label: 'Текст' },
      ],
    },
  ],
}
