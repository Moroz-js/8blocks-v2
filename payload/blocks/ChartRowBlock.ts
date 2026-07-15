import type { Block } from 'payload'
import { chartSeriesFields } from './ChartBlock.ts'

type ChartSibling = { type?: string } | undefined

const isSingleSeriesType = (_: unknown, siblingData: ChartSibling) => {
  const t = siblingData?.type
  return t === 'bar' || t === 'hbar'
}

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
          name: 'type',
          type: 'select',
          label: 'Тип',
          required: true,
          defaultValue: 'line',
          options: [
            { label: 'Линия', value: 'line' },
            { label: 'Область', value: 'area' },
            { label: 'Столбцы', value: 'bar' },
            { label: 'Гор. столбцы', value: 'hbar' },
            { label: 'Кольцо (donut)', value: 'donut' },
          ],
        },
        { name: 'caption', type: 'text', label: 'Подпись' },
        ...chartSeriesFields,
        {
          type: 'row',
          admin: { condition: isSingleSeriesType },
          fields: [
            {
              name: 'seriesLabel',
              type: 'text',
              label: 'Название серии',
              defaultValue: 'Значение',
              admin: {
                width: '50%',
                condition: (_: unknown, siblingData: ChartSibling) => siblingData?.type !== 'donut',
              },
            },
            {
              name: 'color',
              type: 'text',
              label: 'Цвет',
              defaultValue: '#C24E88',
              admin: {
                width: '50%',
                condition: (_: unknown, siblingData: ChartSibling) => siblingData?.type !== 'donut',
                components: { Field: '/src/shared/admin/ColorPickerField#ColorPickerField' },
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
              'Линия/область: подпись + значения по сериям. Столбцы/кольцо: поле «Значение».',
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
                description: 'По одному числу на каждую серию.',
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
            },
            {
              name: 'color',
              type: 'text',
              label: 'Цвет сегмента (кольцо)',
              admin: {
                components: { Field: '/src/shared/admin/ColorPickerField#ColorPickerField' },
              },
            },
          ],
        },
      ],
    },
  ],
}
