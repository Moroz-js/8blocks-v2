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

export const Research: CollectionConfig = {
  slug: 'research',
  labels: {
    singular: 'Исследование',
    plural: 'Исследования',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Исследования',
    defaultColumns: ['title', 'category', 'status', 'hidden', 'publishedAt'],
    description: 'Исследования',
    listSearchableFields: ['title', 'slug', 'excerpt'],
  },
  access: {
    read: () => true,
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
        description: 'Краткое описание для SEO и скрытого текста на карточке',
      },
    },
    {
      name: 'cardText',
      type: 'text',
      label: 'Текст карточки',
      required: true,
      admin: {
        description: 'Заголовок на карточке в архиве. Не путать с заголовком статьи на странице исследования.',
      },
    },

    // ── Card appearance (custom attributes) ───────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'cardColor',
          type: 'text',
          label: 'Цвет карточки',
          defaultValue: '#141414',
          admin: {
            width: '50%',
            description: 'Цвет фона карточки в архиве (HEX или CSS-цвет), например #1A1A1A',
            components: {
              Field: '/src/shared/admin/ColorPickerField#ColorPickerField',
            },
          },
        },
        {
          name: 'textColor',
          type: 'text',
          label: 'Цвет текста',
          defaultValue: '#FFFFFF',
          admin: {
            width: '50%',
            description: 'Цвет текста на карточке (HEX или CSS-цвет), например #FFFFFF',
            components: {
              Field: '/src/shared/admin/ColorPickerField#ColorPickerField',
            },
          },
        },
      ],
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
        description: 'Изображение-обложка исследования',
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
        { label: 'Опубликовано', value: 'published' },
      ],
    },

    // ── Related ───────────────────────────────────────────────────
    {
      name: 'relatedResearch',
      type: 'relationship',
      label: 'Похожие исследования',
      relationTo: 'research',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'До 3 исследований в блоке «Читать далее»',
      },
      filterOptions: ({ id }) => ({
        id: { not_in: [id] },
        status: { equals: 'published' },
        hidden: { not_equals: true },
      }),
    },

    // ── Content (editor) ──────────────────────────────────────────
    {
      name: 'content',
      type: 'richText',
      label: 'Контент исследования',
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
            enabledCollections: ['research', 'articles'],
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
        description: 'Метаданные страницы исследования',
      },
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          label: 'SEO заголовок',
          admin: {
            description: 'Если не заполнен, используется заголовок исследования',
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
          type: 'row',
          fields: [
            {
              name: 'ogTitle',
              type: 'text',
              label: 'OG title',
            },
            {
              name: 'ogDescription',
              type: 'textarea',
              label: 'OG description',
              admin: { rows: 2 },
            },
          ],
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: 'OG изображение',
          relationTo: 'media',
          admin: { description: 'Если пусто — может использоваться обложка' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'twitterTitle',
              type: 'text',
              label: 'Twitter title',
            },
            {
              name: 'twitterDescription',
              type: 'textarea',
              label: 'Twitter description',
              admin: { rows: 2 },
            },
          ],
        },
        {
          name: 'headMarkup',
          type: 'textarea',
          label: 'Доп. код в head',
          admin: {
            rows: 8,
            description: 'JSON-LD, meta — только для этого исследования',
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
      // Стартуем не с 0, а со случайных 100–150, дальше растёт через API при просмотре.
      defaultValue: () => Math.floor(Math.random() * 51) + 100,
      admin: {
        readOnly: true,
        description: 'Начальное значение задаётся случайно (100–150), далее обновляется при просмотрах',
      },
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Скрыто',
      defaultValue: false,
      admin: {
        description:
          'Не показывать в исследованиях; ссылка скрывается, если нет видимых исследований',
        position: 'sidebar',
      },
    },
  ],
}
