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
