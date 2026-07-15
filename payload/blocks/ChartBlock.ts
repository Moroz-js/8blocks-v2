import type { Block, Field } from 'payload'

type BlockSibling = { type?: string } | undefined

const isLineOrArea = (_: unknown, siblingData: BlockSibling) =>
  siblingData?.type === 'line' || siblingData?.type === 'area'

const isBar = (_: unknown, siblingData: BlockSibling) => siblingData?.type === 'bar'

/** Shared multi-series fields for line/area (also used by ChartRowBlock). */
export const chartSeriesFields: Field[] = [
  {
    name: 'series',
    type: 'array',
    label: 'Серии',
    labels: { singular: 'Серия', plural: 'Серии' },
    admin: {
      description:
        'Несколько линий/областей. Порядок серий = порядок значений в каждой точке. Ось: слева или справа (разные масштабы).',
      condition: isLineOrArea,
      initCollapsed: false,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            label: 'Название',
            required: true,
            admin: { width: '40%' },
          },
          {
            name: 'color',
            type: 'text',
            label: 'Цвет',
            defaultValue: '#C24E88',
            admin: {
              width: '30%',
              components: {
                Field: '/src/shared/admin/ColorPickerField#ColorPickerField',
              },
            },
          },
          {
            name: 'yAxis',
            type: 'select',
            label: 'Ось Y',
            defaultValue: 'left',
            options: [
              { label: 'Слева', value: 'left' },
              { label: 'Справа', value: 'right' },
            ],
            admin: { width: '30%' },
          },
        ],
      },
    ],
  },
]

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
    ...chartSeriesFields,
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
            condition: isBar,
          },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Цвет',
          defaultValue: '#E6007A',
          admin: {
            width: '50%',
            condition: isBar,
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
          'Линия/область: подпись X + «Значения по сериям» (1-е значение → Серия 01, 2-е → Серия 02, …). Столбцы/кольцо: поле «Значение».',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Подпись (ось X)',
          required: true,
        },
        {
          name: 'values',
          type: 'array',
          label: 'Значения по сериям',
          labels: { singular: 'Значение серии', plural: 'Значения серий' },
          admin: {
            description: 'По одному числу на каждую серию (порядок совпадает с «Серии»).',
            components: {
              Field: '/src/shared/admin/ChartPointValuesField#ChartPointValuesField',
            },
          },
          fields: [
            {
              name: 'value',
              type: 'number',
              label: 'Число',
            },
          ],
        },
        {
          name: 'value',
          type: 'number',
          label: 'Значение (столбцы / кольцо)',
          admin: {
            description: 'Для bar/donut. Для line/area можно не заполнять, если есть значения по сериям.',
          },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Цвет сегмента (кольцо)',
          admin: {
            components: {
              Field: '/src/shared/admin/ColorPickerField#ColorPickerField',
            },
          },
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
