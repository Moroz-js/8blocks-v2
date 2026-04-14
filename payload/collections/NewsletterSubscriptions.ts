import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
import { BANNED_EMAILS } from '@/shared/config/banned-emails'
import { FORM_LIMITS, PUBLIC_FORM_ERRORS } from '@/shared/lib/form-sanitize'

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
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        if (data.email === undefined || data.email === null) {
          return data
        }
        const raw = String(data.email)
        if (/[\r\n]/.test(raw)) {
          throw new ValidationError({
            collection: 'newsletter-subscriptions',
            errors: [{ path: 'email', message: 'Invalid email address.' }],
            req,
          })
        }
        const normalized = raw.replace(/\0/g, '').trim().toLowerCase()
        data.email = normalized
        if (BANNED_EMAILS.has(normalized)) {
          throw new ValidationError({
            collection: 'newsletter-subscriptions',
            errors: [
              {
                path: 'email',
                message: 'This email address cannot be used.',
              },
            ],
            req,
          })
        }

        const existing = await req.payload.find({
          collection: 'newsletter-subscriptions',
          where: { email: { equals: normalized } },
          limit: 2,
        })
        const conflict = existing.docs.filter((doc) => doc.id !== originalDoc?.id)
        if (conflict.length > 0) {
          throw new ValidationError({
            collection: 'newsletter-subscriptions',
            errors: [
              {
                path: 'email',
                message: PUBLIC_FORM_ERRORS.newsletterDuplicateEmail,
              },
            ],
            req,
          })
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      unique: true,
      validate: (value) => {
        if (typeof value === 'string' && value.length > FORM_LIMITS.emailMax) {
          return 'Email is too long'
        }
        return true
      },
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
