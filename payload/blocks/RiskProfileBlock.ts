import type { Block } from 'payload'

export const RiskProfileBlock: Block = {
  slug: 'riskProfile',
  labels: {
    singular: 'Риск-профиль',
    plural: 'Риск-профили',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Риск-профиль',
    },
    {
      name: 'criteria',
      type: 'array',
      label: 'Критерии оценки',
      minRows: 1,
      labels: { singular: 'Критерий', plural: 'Критерии' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Критерий',
              required: true,
              admin: { width: '55%' },
            },
            {
              name: 'score',
              type: 'number',
              label: 'Оценка',
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'max',
              type: 'number',
              label: 'Максимум',
              required: true,
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'comment',
          type: 'textarea',
          label: 'Комментарий',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'totalScore',
          type: 'number',
          label: 'Итоговая оценка риска',
          admin: { width: '50%', description: 'Например, 72 (из 100)' },
        },
        {
          name: 'rating',
          type: 'text',
          label: 'Буквенный рейтинг риска',
          admin: { width: '50%', description: 'Например, B' },
        },
      ],
    },
    {
      name: 'interpretation',
      type: 'textarea',
      label: 'Интерпретация',
    },
  ],
}
