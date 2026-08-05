import type { Block } from 'payload'

export const ExpertQuoteBlock: Block = {
  slug: 'expertQuote',
  labels: {
    singular: 'Цитата эксперта',
    plural: 'Цитаты экспертов',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Заголовок',
      defaultValue: () =>
        process.env.NEXT_PUBLIC_LANG === 'en'
          ? '8Blocks expert comment'
          : 'Комментарий эксперта А8А9',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Эксперт',
      required: true,
      admin: {
        description: 'Имя, должность, фото и ссылка берутся из профиля автора',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      label: 'Цитата',
      required: true,
    },
  ],
}
