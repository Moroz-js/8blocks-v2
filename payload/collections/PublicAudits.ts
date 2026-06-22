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
import {
  AuditTableBlock,
  CalloutBlock,
  ChartBlock,
  ChartRowBlock,
  ChecklistBlock,
  FormulaBlock,
  InfoColumnsBlock,
  MetricStripBlock,
  NumberedNotesBlock,
  RiskProfileBlock,
  StatColumnsBlock,
} from '../blocks/index.ts'
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
      name: 'hero',
      label: 'Шапка (Hero)',
      admin: {
        description: 'Тёмная обложка аудита: проект, метрики, рейтинг, вердикт',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'company', type: 'text', label: 'Компания (Кому)', admin: { width: '50%' } },
            { name: 'tokenName', type: 'text', label: 'Токен ($TICKER)', admin: { width: '25%' } },
            {
              name: 'tokenStandard',
              type: 'text',
              label: 'Стандарт',
              admin: { width: '25%', description: 'ERC-20, TON...' },
            },
          ],
        },
        {
          name: 'projectDescription',
          type: 'textarea',
          label: 'Описание проекта',
          admin: { description: 'Короткое описание проекта в hero' },
        },
        { name: 'site', type: 'text', label: 'Сайт' },
        {
          name: 'verdict',
          type: 'text',
          label: 'Короткий вердикт',
          admin: { description: 'Напр.: «Этот токен нужен» / «Токен не обязателен…»' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'strength',
              type: 'textarea',
              label: 'Сильная сторона (+)',
              admin: { width: '50%' },
            },
            {
              name: 'weakness',
              type: 'textarea',
              label: 'Слабая сторона (−)',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'letterRating',
              type: 'text',
              label: 'Буквенный рейтинг',
              admin: { width: '50%', description: 'BB / A / BBB...' },
            },
            {
              name: 'score',
              type: 'number',
              label: 'Балл (0–100)',
              min: 0,
              max: 100,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'heroMetrics',
      type: 'array',
      label: 'Метрики (Hero)',
      labels: { singular: 'Метрика', plural: 'Метрики' },
      admin: { description: 'Карточки-метрики в hero (FDV, MC, TVL, ...)' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Название', required: true, admin: { width: '50%' } },
            { name: 'value', type: 'text', label: 'Значение', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'ratingBlocks',
      type: 'array',
      label: 'Рейтинг по методологии 8Blocks',
      labels: { singular: 'Блок', plural: 'Блоки' },
      admin: {
        description: 'Из этих строк строятся таблица и radar-диаграмма рейтинга, и считается итог',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'block', type: 'text', label: 'Блок', required: true, admin: { width: '50%' } },
            {
              name: 'weight',
              type: 'number',
              label: 'Вес (%)',
              required: true,
              admin: { width: '25%', description: 'Напр. 40' },
            },
            {
              name: 'scoreFive',
              type: 'number',
              label: 'Score (0–5)',
              required: true,
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'expert',
      label: 'Эксперт',
      admin: { description: 'Автор/эксперт аудита (карточка внизу страницы)' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', label: 'Имя', admin: { width: '50%' } },
            { name: 'role', type: 'text', label: 'Роль', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Фото',
              admin: { width: '50%' },
            },
            {
              name: 'rating',
              type: 'text',
              label: 'Рейтинг эксперта',
              admin: { width: '50%', description: 'Опционально' },
            },
          ],
        },
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
            blocks: [
              CalloutBlock,
              AuditTableBlock,
              FormulaBlock,
              ChartBlock,
              ChartRowBlock,
              MetricStripBlock,
              ChecklistBlock,
              StatColumnsBlock,
              InfoColumnsBlock,
              NumberedNotesBlock,
              RiskProfileBlock,
            ],
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
