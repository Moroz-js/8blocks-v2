import type { Block } from 'payload'

export const AuditTableBlock: Block = {
  slug: 'auditTable',
  labels: {
    singular: 'Таблица',
    plural: 'Таблицы',
  },
  fields: [
    {
      name: 'headers',
      type: 'array',
      label: 'Заголовки колонок',
      minRows: 1,
      fields: [
        {
          name: 'cell',
          type: 'text',
          label: 'Колонка',
          required: true,
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Строки',
      fields: [
        {
          name: 'cells',
          type: 'array',
          label: 'Ячейки',
          fields: [
            {
              name: 'cell',
              type: 'text',
              label: 'Значение',
            },
          ],
        },
      ],
    },
  ],
}
