import type { CollectionConfig } from 'payload'

export const NewsletterSubscriptions: CollectionConfig = {
  slug: 'newsletter-subscriptions',
  labels: {
    singular: 'Подписка',
    plural: 'Подписки на рассылку',
  },
  admin: {
    useAsTitle: 'email',
    group: 'CRM',
    defaultColumns: ['email', 'source', 'createdAt'],
    description: 'Подписки на email-рассылку',
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      unique: true,
    },
    {
      name: 'source',
      type: 'text',
      label: 'Источник',
      admin: {
        description: 'Откуда пришла подписка (например, футер, страница блога)',
        readOnly: true,
      },
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Согласие на рассылку',
      defaultValue: true,
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
