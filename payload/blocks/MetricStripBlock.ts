import type { Block } from 'payload'

export const MetricStripBlock: Block = {
  slug: 'metricStrip',
  labels: { singular: 'Полоса метрик', plural: 'Полосы метрик' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Метрики',
      minRows: 1,
      labels: { singular: 'Метрика', plural: 'Метрики' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Название', required: true, admin: { width: '34%' } },
            { name: 'sub', type: 'text', label: 'Подпись', admin: { width: '33%' } },
            { name: 'value', type: 'text', label: 'Значение', required: true, admin: { width: '33%' } },
          ],
        },
      ],
    },
  ],
}
