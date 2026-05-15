import type { Block } from 'payload'

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: {
    singular: 'Выделенный блок',
    plural: 'Выделенные блоки',
  },
  fields: [
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
