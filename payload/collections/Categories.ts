import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Категория',
    plural: 'Категории',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Блог',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Категории для статей блога',
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
      admin: {
        description: 'Уникальный идентификатор в URL. Только строчные буквы, цифры и дефисы.',
      },
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
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткое описание категории',
      },
    },
    {
      type: 'group',
      name: 'seo',
      label: 'SEO',
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          label: 'SEO заголовок',
          admin: {
            description: 'Если не заполнен, используется название категории',
          },
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          label: 'SEO описание',
          admin: {
            description: 'Если не заполнено, используется описание категории',
          },
        },
      ],
    },
  ],
}
