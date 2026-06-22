import type { Block } from 'payload'

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: {
    singular: 'Выделенный блок',
    plural: 'Выделенные блоки',
  },
  fields: [
    {
      name: 'severity',
      type: 'select',
      label: 'Уровень',
      defaultValue: 'important',
      options: [
        { label: 'Важно', value: 'important' },
        { label: 'Критично', value: 'critical' },
      ],
      admin: {
        description: 'Важное замечание или критическое (разный цвет маркера)',
      },
    },
    {
      name: 'label',
      type: 'text',
      label: 'Заголовок',
      admin: {
        description: 'Необязательно, например «Важно»',
      },
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст',
      required: true,
    },
  ],
}
