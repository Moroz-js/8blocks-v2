import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: {
    singular: 'Автор',
    plural: 'Авторы',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Контент',
    defaultColumns: ['name', 'position', 'linkedIn', 'updatedAt'],
    description: 'Авторы материалов: аудитов, исследований и статей',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: 'Slug профиля',
      unique: true,
      index: true,
      admin: {
        description: 'Адрес публичного профиля: /team/[slug]. Обязателен, если профиль опубликован.',
      },
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === 'string'
              ? value
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '')
              : value,
        ],
      },
    },
    {
      name: 'showProfile',
      type: 'checkbox',
      label: 'Показывать публичный профиль',
      defaultValue: false,
      admin: { position: 'sidebar' },
      validate: (value: unknown, { siblingData }) =>
        !value || (siblingData as { slug?: unknown } | undefined)?.slug
          ? true
          : 'Для публичного профиля заполните slug.',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Описание',
      admin: { description: 'Показывается в профиле и на странице события.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Имя',
          required: true,
          admin: {
            width: '50%',
            description: 'Например: «Имя Фамилия» или «А8А9 Team»',
          },
        },
        {
          name: 'position',
          type: 'text',
          label: 'Должность',
          admin: {
            width: '50%',
            description: 'Опционально. Для команды можно оставить пустым',
          },
        },
      ],
    },
    {
      name: 'linkedIn',
      type: 'text',
      label: 'LinkedIn',
      admin: {
        description:
          'Ссылка на профиль автора или страницу команды/компании, например https://www.linkedin.com/in/...',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            return 'Ссылка должна начинаться с https://'
          }
          return true
        } catch {
          return 'Некорректный URL. Пример: https://www.linkedin.com/in/username'
        }
      },
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          return ['https:', 'http:'].includes(url.protocol) || 'Ссылка должна начинаться с https://'
        } catch {
          return 'Некорректный URL.'
        }
      },
    },
    {
      name: 'telegram',
      type: 'text',
      label: 'Telegram',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          return ['https:', 'http:'].includes(url.protocol) || 'Ссылка должна начинаться с https://'
        } catch {
          return 'Некорректный URL.'
        }
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Сайт',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          return ['https:', 'http:'].includes(url.protocol) || 'Ссылка должна начинаться с https://'
        } catch {
          return 'Некорректный URL.'
        }
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'x',
      type: 'text',
      label: 'X (Twitter)',
      admin: {
        description: 'Ссылка на профиль в X. Используется, если LinkedIn не указан.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            return 'Ссылка должна начинаться с https://'
          }
          return true
        } catch {
          return 'Некорректный URL. Пример: https://x.com/username'
        }
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото',
      admin: {
        description: 'Используется в карточке эксперта на странице аудита',
      },
    },
  ],
}
