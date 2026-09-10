import type { CollectionConfig, Where } from 'payload'
import { EVENT_CITY_SELECT_OPTIONS } from '@/shared/config/eventCities'
import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const publicEventWhere: Where = {
  and: [{ status: { equals: 'published' } }, { hidden: { not_equals: true } }],
}

function slugify(value: unknown) {
  return typeof value === 'string'
    ? value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : value
}

function validateUrl(value: unknown) {
  if (!value) return true
  try {
    const url = new URL(String(value))
    return ['http:', 'https:'].includes(url.protocol) || 'Ссылка должна начинаться с https://'
  } catch {
    return 'Некорректная ссылка.'
  }
}

const eventEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    BoldFeature(),
    ItalicFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    LinkFeature(),
    UploadFeature({ collections: { media: { fields: [] } } }),
  ],
})

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Событие', plural: 'События' },
  admin: {
    useAsTitle: 'title',
    group: 'События',
    defaultColumns: ['title', 'format', 'startsAt', 'city', 'status', 'hidden', 'featured'],
    listSearchableFields: ['title', 'slug', 'venueName'],
  },
  access: {
    read: ({ req }) => (req.user ? true : publicEventWhere),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            { name: 'title', type: 'text', label: 'Название', required: true },
            {
              name: 'slug',
              type: 'text',
              label: 'Slug (URL)',
              required: true,
              unique: true,
              index: true,
              hooks: { beforeValidate: [({ value }) => slugify(value)] },
            },
            { name: 'subtitle', type: 'text', label: 'Подзаголовок для featured-карточки' },
            { name: 'contentTitle', type: 'text', label: 'Подзаголовок в описании' },
            {
              name: 'ourRole',
              type: 'select',
              label: 'Наша роль',
              defaultValue: 'none',
              options: [
                { label: 'Участвуем', value: 'none' },
                { label: 'Спикер', value: 'speaker' },
                { label: 'Хост', value: 'host' },
                { label: 'Ко-хост', value: 'cohost' },
              ],
              admin: { description: 'Роль А8А9 на этом событии (отображается как бейдж)' },
            },
            {
              name: 'format',
              type: 'select',
              label: 'Формат',
              required: true,
              defaultValue: 'offline',
              options: [
                { label: 'Офлайн', value: 'offline' },
                { label: 'Онлайн', value: 'online' },
              ],
            },
            { name: 'featured', type: 'checkbox', label: 'Большая featured-карточка', defaultValue: false },
            { name: 'cover', type: 'upload', label: 'Обложка карточки', relationTo: 'media' },
            { name: 'poster', type: 'upload', label: 'Постер детальной страницы', relationTo: 'media' },
          ],
        },
        {
          label: 'Расписание',
          fields: [
            { name: 'startsAt', type: 'date', label: 'Начало', required: true, index: true, admin: { date: { pickerAppearance: 'dayAndTime', timeIntervals: 15 } } },
            {
              name: 'endsAt',
              type: 'date',
              label: 'Окончание',
              admin: { date: { pickerAppearance: 'dayAndTime', timeIntervals: 15 } },
              validate: (value: unknown, { siblingData }) => {
                const start = (siblingData as { startsAt?: unknown } | undefined)?.startsAt
                if (!value || !start) return true
                return new Date(String(value)) >= new Date(String(start))
                  ? true
                  : 'Окончание не может быть раньше начала.'
              },
            },
            {
              name: 'timezone',
              type: 'text',
              label: 'Часовой пояс IANA',
              required: true,
              defaultValue: 'Europe/Moscow',
              admin: { description: 'Например: Asia/Seoul, America/Toronto.' },
            },
          ],
        },
        {
          label: 'Офлайн / онлайн',
          fields: [
            {
              name: 'city',
              type: 'select',
              options: EVENT_CITY_SELECT_OPTIONS,
              label: 'Город',
              admin: { condition: (data: Record<string, unknown>) => data?.format === 'offline' },
              validate: (value: unknown, context: { data?: unknown }) =>
                (context.data as { format?: unknown } | undefined)?.format !== 'offline' || value ? true : 'Для офлайн-события выберите город.',
            },
            { name: 'venueName', type: 'text', label: 'Площадка', admin: { condition: (data: Record<string, unknown>) => data?.format === 'offline' } },
            { name: 'address', type: 'textarea', label: 'Адрес', admin: { condition: (data: Record<string, unknown>) => data?.format === 'offline' } },
            { name: 'mapsUrl', type: 'text', label: 'Ссылка на карту', validate: validateUrl, admin: { condition: (data: Record<string, unknown>) => data?.format === 'offline' } },
            { name: 'mapsEmbedUrl', type: 'text', label: 'URL карты для embed', validate: validateUrl, admin: { condition: (data: Record<string, unknown>) => data?.format === 'offline' } },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Фотогалерея',
              admin: { condition: (data: Record<string, unknown>) => data?.format === 'offline' },
            },
            {
              name: 'platform',
              type: 'select',
              label: 'Площадка',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'X (Twitter)', value: 'x' },
                { label: 'Zoom', value: 'zoom' },
                { label: 'Другая', value: 'other' },
              ],
              admin: { condition: (data: Record<string, unknown>) => data?.format === 'online' },
              validate: (value: unknown, context: { data?: unknown }) =>
                (context.data as { format?: unknown } | undefined)?.format !== 'online' || value ? true : 'Для онлайн-события выберите площадку.',
            },
            { name: 'platformLabel', type: 'text', label: 'Название другой площадки', admin: { condition: (data: Record<string, unknown>) => data?.format === 'online' && data?.platform === 'other' } },
            { name: 'platformUrl', type: 'text', label: 'Ссылка на площадку', validate: validateUrl, admin: { condition: (data: Record<string, unknown>) => data?.format === 'online' } },
            { name: 'hostName', type: 'text', label: 'Хост стрима', admin: { condition: (data: Record<string, unknown>) => data?.format === 'online' } },
          ],
        },
        {
          label: 'Люди',
          fields: [
            { name: 'mainOrganizer', type: 'relationship', relationTo: 'event-organizers', label: 'Главный организатор' },
            { name: 'organizers', type: 'relationship', relationTo: 'event-organizers', hasMany: true, label: 'Организаторы' },
            {
              name: 'representatives',
              type: 'array',
              label: 'Представители 8Blocks',
              fields: [
                { name: 'person', type: 'relationship', relationTo: 'authors', required: true, label: 'Человек' },
                { name: 'bioOverride', type: 'textarea', label: 'Описание для этого события' },
              ],
            },
          ],
        },
        {
          label: 'Контент',
          fields: [
            { name: 'content', type: 'richText', label: 'Описание события', editor: eventEditor },
            { name: 'summary', type: 'richText', label: 'Саммари встречи', editor: eventEditor },
            { name: 'recapMedia', type: 'upload', relationTo: 'media', label: 'Медиа саммари' },
          ],
        },
        {
          label: 'Материалы',
          fields: [
            { name: 'eventUrl', type: 'text', label: 'Сайт мероприятия', validate: validateUrl },
            { name: 'recordingUrl', type: 'text', label: 'Ссылка на запись', validate: validateUrl },
            { name: 'recordingFile', type: 'upload', relationTo: 'media', label: 'Файл записи' },
            { name: 'presentation', type: 'upload', relationTo: 'media', label: 'Файл презентации' },
            { name: 'presentationUrl', type: 'text', label: 'Ссылка на презентацию', validate: validateUrl },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO',
              fields: [
                { name: 'seoTitle', type: 'text', label: 'SEO заголовок' },
                { name: 'seoDescription', type: 'textarea', label: 'SEO описание' },
                { name: 'ogTitle', type: 'text', label: 'OG title' },
                { name: 'ogDescription', type: 'textarea', label: 'OG description' },
                { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG изображение' },
                { name: 'noindex', type: 'checkbox', label: 'Скрыть от поисковиков', defaultValue: false },
              ],
            },
          ],
        },
      ],
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: 'Скрыто',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: { position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => siblingData?.status === 'published' && !value ? new Date().toISOString() : value,
        ],
      },
    },
  ],
}
