import type { Block } from 'payload'

export const ChartRowBlock: Block = {
  slug: 'chartRow',
  labels: { singular: 'Ряд графиков', plural: 'Ряды графиков' },
  fields: [
    {
      name: 'charts',
      type: 'array',
      label: 'Графики',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'График', plural: 'Графики' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              label: 'Тип',
              required: true,
              defaultValue: 'line',
              admin: { width: '50%' },
              options: [
                { label: 'Линия', value: 'line' },
                { label: 'Область', value: 'area' },
                { label: 'Столбцы', value: 'bar' },
                { label: 'Гор. столбцы', value: 'hbar' },
                { label: 'Кольцо (donut)', value: 'donut' },
              ],
            },
            {
              name: 'color',
              type: 'text',
              label: 'Цвет',
              defaultValue: '#C24E88',
              admin: {
                width: '50%',
                components: { Field: '/src/shared/admin/ColorPickerField#ColorPickerField' },
              },
            },
          ],
        },
        { name: 'caption', type: 'text', label: 'Подпись' },
        { name: 'seriesLabel', type: 'text', label: 'Название серии', defaultValue: 'Значение' },
        {
          name: 'dataPoints',
          type: 'array',
          label: 'Данные',
          minRows: 1,
          labels: { singular: 'Точка', plural: 'Точки' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Подпись', required: true, admin: { width: '45%' } },
                { name: 'value', type: 'number', label: 'Значение', required: true, admin: { width: '30%' } },
                {
                  name: 'color',
                  type: 'text',
                  label: 'Цвет',
                  admin: {
                    width: '25%',
                    components: { Field: '/src/shared/admin/ColorPickerField#ColorPickerField' },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
