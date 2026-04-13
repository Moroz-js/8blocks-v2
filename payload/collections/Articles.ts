import type { CollectionConfig } from 'payload'
import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Статья',
    plural: 'Статьи',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Блог',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    description: 'Статьи блога',
    listSearchableFields: ['title', 'slug', 'excerpt'],
  },
  fields: [
    // ── Core ─────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Уникальный URL-идентификатор. Только строчные буквы, цифры и дефисы.',
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
      name: 'excerpt',
      type: 'textarea',
      label: 'Краткое описание (excerpt)',
      admin: {
        description: 'Краткое описание для карточки статьи и SEO',
      },
    },

    // ── Taxonomy ──────────────────────────────────────────────────
    {
      name: 'category',
      type: 'relationship',
      label: 'Категория',
      relationTo: 'categories',
      hasMany: false,
    },
    {
      name: 'cover',
      type: 'upload',
      label: 'Обложка',
      relationTo: 'media',
      admin: {
        description: 'Изображение-обложка статьи',
      },
    },

    // ── Publication ───────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'Опубликована', value: 'published' },
      ],
    },

    // ── Related ───────────────────────────────────────────────────
    {
      name: 'relatedArticles',
      type: 'relationship',
      label: 'Похожие статьи',
      relationTo: 'articles',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'До 3 статей в блоке «Читать далее»',
      },
      filterOptions: ({ id }) => ({
        id: { not_in: [id] },
        status: { equals: 'published' },
      }),
    },

     // ── Content (editor) + views ─────────────────────────────────
     {
      name: 'content',
      type: 'richText',
      label: 'Контент статьи',
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          InlineCodeFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          LinkFeature({
            enabledCollections: ['articles'],
          }),
          UploadFeature({
            maxDepth: 2,
            collections: {
              media: {
                fields: [
                  {
                    name: 'alt',
                    type: 'text',
                    label: 'Alt текст',
                  },
                ],
              },
            },
          }),
        ],
      }),
    },

    // ── SEO ───────────────────────────────────────────────────────
    {
      type: 'group',
      name: 'seo',
      label: 'SEO',
      admin: {
        description: 'Метаданные страницы статьи',
      },
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          label: 'SEO заголовок',
          admin: {
            description: 'Если не заполнен, используется заголовок статьи',
          },
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          label: 'SEO описание',
          admin: {
            description: 'Если не заполнено, используется excerpt',
          },
        },
        {
          name: 'noindex',
          type: 'checkbox',
          label: 'Скрыть от поисковиков (noindex)',
          defaultValue: false,
          admin: {
            description: 'Запрещает индексацию страницы',
          },
        },
      ],
    },

   
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData?.status === 'published' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'views',
      type: 'number',
      label: 'Просмотры',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Обновляется через API при просмотре статьи',
      },
    },
  ],
}
