import type { CollectionConfig, Where } from 'payload'
import {
  BlocksFeature,
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ChartBlock, ChartRowBlock, ExpertQuoteBlock } from '../blocks/index.ts'

const publicCaseWhere: Where = {
  and: [
    { status: { equals: 'published' } },
    { hidden: { not_equals: true } },
  ],
}

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: {
    singular: 'Кейс',
    plural: 'Кейсы',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Портфолио',
    defaultColumns: ['title', 'overview.industry', 'service', 'status', 'hidden', 'publishedAt'],
    listSearchableFields: ['title', 'slug', 'overview.industry'],
  },
  access: {
    read: ({ req }) => (req.user ? true : publicCaseWhere),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название проекта',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === 'string'
              ? value
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '')
              : value,
        ],
      },
    },
    {
      name: 'format',
      type: 'select',
      label: 'Формат кейса',
      required: true,
      defaultValue: 'full',
      options: [
        { label: 'Mini — краткий snapshot', value: 'mini' },
        { label: 'Full — полный кейс', value: 'full' },
      ],
      admin: {
        description:
          'Mini показывает Task / What we did / Result. Full дополнительно показывает Overview, Challenges, rich-text, графики и цитаты.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Порядок в каталоге',
      min: 1,
      admin: {
        position: 'sidebar',
        description: 'Меньшее значение показывается раньше.',
      },
    },
    {
      type: 'group',
      name: 'overview',
      label: 'Overview',
      fields: [
        {
          name: 'industry',
          type: 'select',
          label: 'Индустрия',
          options: [
            { label: 'DeFi', value: 'DeFi' },
            { label: 'GameFi', value: 'GameFi' },
            { label: 'RWA', value: 'RWA' },
            { label: 'Finance', value: 'Finance' },
          ],
        },
        { name: 'clientGoals', type: 'textarea', label: 'Цели клиента' },
      ],
    },
    {
      name: 'service',
      type: 'select',
      label: 'Тип услуги',
      options: [
        { label: 'Design', value: 'design' },
        { label: 'Audit', value: 'audit' },
        { label: 'Advisory', value: 'advisory' },
      ],
    },
    {
      name: 'cover',
      type: 'upload',
      label: 'Обложка',
      relationTo: 'media',
    },
    {
      name: 'task',
      type: 'textarea',
      label: 'Task',
      required: true,
    },
    {
      name: 'challenge',
      type: 'textarea',
      label: 'Challenges',
    },
    {
      type: 'group',
      name: 'solution',
      label: 'Solution / What we did',
      fields: [
        { name: 'stepOne', type: 'text', label: 'Действие 1' },
        { name: 'stepTwo', type: 'text', label: 'Действие 2' },
        { name: 'stepThree', type: 'text', label: 'Действие 3' },
      ],
    },
    {
      type: 'group',
      name: 'result',
      label: 'Results',
      fields: [
        { name: 'summary', type: 'textarea', label: 'Вывод' },
        { name: 'metricValue', type: 'text', label: 'KPI: значение' },
        { name: 'metricLabel', type: 'text', label: 'KPI: подпись' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Детальное раскрытие кейса',
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          LinkFeature({ enabledCollections: ['articles'] }),
          BlocksFeature({ blocks: [ChartBlock, ChartRowBlock, ExpertQuoteBlock] }),
          UploadFeature({
            maxDepth: 2,
            collections: {
              media: {
                fields: [{ name: 'alt', type: 'text', label: 'Alt текст' }],
              },
            },
          }),
        ],
      }),
    },
    {
      name: 'relatedArticle',
      type: 'relationship',
      label: 'Статья в блоге',
      relationTo: 'articles',
      hasMany: false,
    },
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
    {
      type: 'group',
      name: 'seo',
      label: 'SEO',
      fields: [
        { name: 'seoTitle', type: 'text', label: 'SEO заголовок' },
        { name: 'seoDescription', type: 'textarea', label: 'SEO описание' },
        { name: 'ogTitle', type: 'text', label: 'OG title' },
        { name: 'ogDescription', type: 'textarea', label: 'OG description' },
        { name: 'ogImage', type: 'upload', label: 'OG изображение', relationTo: 'media' },
        { name: 'noindex', type: 'checkbox', label: 'Скрыть от поисковиков', defaultValue: false },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      hooks: {
        beforeChange: [
          ({ siblingData, value }) =>
            siblingData?.status === 'published' && !value ? new Date().toISOString() : value,
        ],
      },
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Скрыто',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
