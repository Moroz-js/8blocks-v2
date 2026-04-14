import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
import { BANNED_EMAILS } from '@/shared/config/banned-emails'
import {
  FORM_LIMITS,
  PUBLIC_FORM_ERRORS,
  sanitizeLeadMessage,
  sanitizeLeadName,
} from '@/shared/lib/form-sanitize'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  admin: {
    useAsTitle: 'email',
    group: 'CRM',
    defaultColumns: ['name', 'email', 'createdAt'],
    description: 'Заявки с формы обратной связи',
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (data.name !== undefined && data.name !== null) {
          const n = sanitizeLeadName(String(data.name))
          if (!n) {
            throw new ValidationError({
              collection: 'leads',
              errors: [{ path: 'name', message: 'Name is required.' }],
              req,
            })
          }
          if (n.length > FORM_LIMITS.nameMax) {
            throw new ValidationError({
              collection: 'leads',
              errors: [{ path: 'name', message: 'Name is too long.' }],
              req,
            })
          }
          data.name = n
        }

        if (data.message !== undefined && data.message !== null) {
          const m = sanitizeLeadMessage(String(data.message))
          if (!m) {
            throw new ValidationError({
              collection: 'leads',
              errors: [{ path: 'message', message: 'Message is required.' }],
              req,
            })
          }
          if (m.length > FORM_LIMITS.messageMax) {
            throw new ValidationError({
              collection: 'leads',
              errors: [{ path: 'message', message: 'Message is too long.' }],
              req,
            })
          }
          data.message = m
        }

        if (data.email === undefined || data.email === null) {
          return data
        }
        const rawEmail = String(data.email)
        if (/[\r\n]/.test(rawEmail)) {
          throw new ValidationError({
            collection: 'leads',
            errors: [{ path: 'email', message: 'Invalid email address.' }],
            req,
          })
        }
        const normalized = rawEmail.replace(/\0/g, '').trim().toLowerCase()
        data.email = normalized

        if (BANNED_EMAILS.has(normalized)) {
          throw new ValidationError({
            collection: 'leads',
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
          collection: 'leads',
          where: { email: { equals: normalized } },
          limit: 2,
        })
        const conflict = existing.docs.filter((doc) => doc.id !== originalDoc?.id)
        if (conflict.length > 0) {
          throw new ValidationError({
            collection: 'leads',
            errors: [
              {
                path: 'email',
                message: PUBLIC_FORM_ERRORS.leadDuplicateEmail,
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
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
      maxLength: FORM_LIMITS.nameMax,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validate: (value) => {
        if (typeof value === 'string' && value.length > FORM_LIMITS.emailMax) {
          return 'Email is too long'
        }
        return true
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Сообщение',
      required: true,
      maxLength: FORM_LIMITS.messageMax,
    },
  ],
  timestamps: true,
}
