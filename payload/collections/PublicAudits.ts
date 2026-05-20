import type { CollectionConfig } from 'payload'
import {
  BlockquoteFeature,
  BlocksFeature,
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
import { AuditTableBlock, CalloutBlock, FormulaBlock } from '../blocks/index.ts'
export const PublicAudits: CollectionConfig = {
  slug: 'public-audits',
  labels: {
    singular: 'Публичный аудит',
    plural: 'Публичные аудиты',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Аудиты',
    defaultColumns: ['title', 'slug', 'hidden', 'publishedAt'],
    description: 'Публичные аудиты токенов',
    listSearchableFields: ['title', 'slug', 'excerpt'],
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
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL-путь аудита, например: my-audit',
      },
    },
    {
      name: 'relatedArticle',
      type: 'relationship',
      label: 'Статья в блоге',
      relationTo: 'articles',
      hasMany: false,
      admin: {
        description: 'Необязательная связь со статьёй в блоге',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст CTA',
      admin: {
        description: 'Текст для CTA-блока со ссылкой на статью в блоге',
        condition: (data) => Boolean(data?.relatedArticle),
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Краткое описание',
      admin: {
        description: 'Краткое описание аудита для карточки',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      label: 'Изображение',
      relationTo: 'media',
      admin: {
        description: 'Обложка или логотип проекта',
      },
    },
    {
      type: 'group',
      name: 'metrics',
      label: 'Метрики (Hero)',
      admin: {
        description: 'Карточки на обложке аудита',
      },
      fields: [
        { name: 'companyName', type: 'text', label: 'Компания' },
        { name: 'tokenName', type: 'text', label: 'Токен' },
        { name: 'tokenStandard', type: 'text', label: 'Стандарт (ERC-20...)' },
        { name: 'fdv', type: 'text', label: 'FDV' },
        { name: 'mc', type: 'text', label: 'MC' },
        { name: 'tvl', type: 'text', label: 'TVL' },
        { name: 'fees', type: 'text', label: 'Комиссии' },
        { name: 'users', type: 'text', label: 'Пользователи' },
        { name: 'unlock', type: 'text', label: 'UNLOCK (цена)' },
        { name: 'retail', type: 'text', label: 'RETAIL (цена)' },
        { name: 'rating', type: 'text', label: 'Рейтинг (BB-, A...)' },
        { name: 'ratingScore', type: 'text', label: 'Балл (74/100)' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Содержание',
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
          InlineCodeFeature(),
          HorizontalRuleFeature(),
          LinkFeature(),
          BlocksFeature({
            blocks: [CalloutBlock, AuditTableBlock, FormulaBlock],
          }),
          UploadFeature({
            maxDepth: 2,
            collections: {
              media: {
                fields: [
                  {
                    name: 'aiDescription',
                    type: 'textarea',
                    label: 'Описание данных (для AI)',
                    admin: {
                      description:
                        'Данные графика в текстовом виде. Не отображается пользователям.',
                    },
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
        description: 'Метаданные страницы аудита',
      },
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          label: 'SEO заголовок',
          admin: {
            description: 'Если не заполнен, используется заголовок аудита',
          },
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          label: 'SEO описание',
          admin: {
            description: 'Если не заполнено, используется краткое описание',
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
          admin: { description: 'Если пусто — используется обложка' },
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
          name: 'noindex',
          type: 'checkbox',
          label: 'Скрыть от поисковиков (noindex)',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      required: true,
      admin: {
        description: 'Дата публикации аудита',
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
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Скрыто',
      defaultValue: false,
      admin: {
        description: 'Не показывать в списке аудитов и скрыть ссылку, если нет видимых аудитов',
        position: 'sidebar',
      },
    },
  ],
}
