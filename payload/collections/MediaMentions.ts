import type { CollectionConfig } from 'payload'

export const MediaMentions: CollectionConfig = {
  slug: 'media-mentions',
  labels: {
    singular: 'Упоминание в медиа',
    plural: 'Мы в медиа',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Медиа',
    defaultColumns: ['title', 'category', 'publishedAt'],
    description: 'Публикации, интервью и упоминания 8Blocks в СМИ',
    listSearchableFields: ['title', 'excerpt', 'source'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Ссылка на публикацию',
      required: true,
      admin: {
        description: 'Полная ссылка на статью или интервью на внешнем ресурсе',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Краткое описание',
      admin: {
        description: 'Краткое описание публикации для карточки',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      label: 'Изображение',
      relationTo: 'media',
      admin: {
        description: 'Обложка публикации или логотип издания',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Категория',
      relationTo: 'media-categories',
      hasMany: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      required: true,
      admin: {
        description: 'Дата выхода материала в издании',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Закрепить в начале',
      defaultValue: false,
    },
  ],
}
