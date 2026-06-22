import type { Block } from 'payload'

export const ChartBlock: Block = {
  slug: 'chart',
  labels: {
    singular: 'График',
    plural: 'Графики',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Тип графика',
      required: true,
      defaultValue: 'line',
      options: [
        { label: 'Линия', value: 'line' },
        { label: 'Область (с заливкой)', value: 'area' },
        { label: 'Столбцы', value: 'bar' },
        { label: 'Кольцо (donut)', value: 'donut' },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Подпись',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'seriesLabel',
          type: 'text',
          label: 'Название серии',
          defaultValue: 'Значение',
          admin: {
            width: '50%',
            description: 'Подпись серии в легенде/тултипе',
            condition: (_, siblingData) => siblingData?.type !== 'donut',
          },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Цвет',
          defaultValue: '#E6007A',
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.type !== 'donut',
            components: {
              Field: '/src/shared/admin/ColorPickerField#ColorPickerField',
            },
          },
        },
      ],
    },
    {
      name: 'dataPoints',
      type: 'array',
      label: 'Данные',
      minRows: 1,
      labels: { singular: 'Точка', plural: 'Точки' },
      admin: {
        description:
          'Для линии/столбцов: подпись по оси X + значение. Для кольца: название сегмента + значение (+ цвет).',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Подпись',
              required: true,
              admin: { width: '45%' },
            },
            {
              name: 'value',
              type: 'number',
              label: 'Значение',
              required: true,
              admin: { width: '30%' },
            },
            {
              name: 'color',
              type: 'text',
              label: 'Цвет сегмента',
              admin: {
                width: '25%',
                condition: (data) => data?.type === 'donut',
                components: {
                  Field: '/src/shared/admin/ColorPickerField#ColorPickerField',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'preview',
      type: 'ui',
      label: 'Превью',
      admin: {
        components: {
          Field: '/src/shared/admin/ChartPreviewField#ChartPreviewField',
        },
      },
    },
  ],
}
