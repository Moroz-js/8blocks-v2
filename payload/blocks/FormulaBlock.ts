import type { Block } from 'payload'

export const FormulaBlock: Block = {
  slug: 'formula',
  labels: {
    singular: 'Формула',
    plural: 'Формулы',
  },
  fields: [
    {
      name: 'formula',
      type: 'textarea',
      label: 'Формула',
      required: true,
      admin: {
        description: 'LaTeX или текстовая формула',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Подпись',
    },
  ],
}
