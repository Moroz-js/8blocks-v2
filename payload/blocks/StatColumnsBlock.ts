import type { Block } from 'payload'

export const StatColumnsBlock: Block = {
  slug: 'statColumns',
  labels: { singular: 'Колонки со статистикой', plural: 'Колонки со статистикой' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Колонки',
      minRows: 1,
      labels: { singular: 'Колонка', plural: 'Колонки' },
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок колонки' },
        {
          name: 'rows',
          type: 'array',
          label: 'Строки',
          labels: { singular: 'Строка', plural: 'Строки' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Параметр', required: true, admin: { width: '60%' } },
                { name: 'value', type: 'text', label: 'Значение', admin: { width: '40%' } },
              ],
            },
            {
              name: 'percent',
              type: 'number',
              label: 'Прогресс-бар, % (необязательно)',
              min: 0,
              max: 100,
            },
          ],
        },
        { name: 'note', type: 'textarea', label: 'Примечание' },
      ],
    },
  ],
}
