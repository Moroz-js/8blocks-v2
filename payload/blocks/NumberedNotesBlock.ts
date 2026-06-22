import type { Block } from 'payload'

export const NumberedNotesBlock: Block = {
  slug: 'numberedNotes',
  labels: { singular: 'Нумерованные заметки', plural: 'Нумерованные заметки' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Заметки',
      minRows: 1,
      labels: { singular: 'Заметка', plural: 'Заметки' },
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'textarea', label: 'Описание', required: true },
      ],
    },
  ],
}
