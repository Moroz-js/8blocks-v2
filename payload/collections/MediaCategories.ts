import type { CollectionConfig } from 'payload'

export const MediaCategories: CollectionConfig = {
  slug: 'media-categories',
  labels: {
    singular: 'Категория медиа',
    plural: 'Категории медиа',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Медиа',
    defaultColumns: ['title', 'slug'],
    description: 'Категории для раздела «Мы в медиа»',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value === 'string') {
              return value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
  ],
}
