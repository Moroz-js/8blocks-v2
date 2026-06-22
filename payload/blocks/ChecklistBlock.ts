import type { Block } from 'payload'

export const ChecklistBlock: Block = {
  slug: 'checklist',
  labels: { singular: 'Чек-лист', plural: 'Чек-листы' },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок блока' },
    {
      name: 'items',
      type: 'array',
      label: 'Пункты',
      minRows: 1,
      labels: { singular: 'Пункт', plural: 'Пункты' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Иконка',
              required: true,
              defaultValue: 'check',
              admin: { width: '30%' },
              options: [
                { label: '✓ Плюс', value: 'check' },
                { label: '✕ Минус', value: 'cross' },
                { label: '⚠ Риск', value: 'warn' },
              ],
            },
            { name: 'text', type: 'text', label: 'Текст', required: true, admin: { width: '70%' } },
          ],
        },
      ],
    },
  ],
}
