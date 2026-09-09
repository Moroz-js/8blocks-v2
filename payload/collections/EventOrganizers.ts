import type { CollectionConfig } from 'payload'

function normalizeUrl(value: unknown) {
  if (!value) return true
  try {
    const url = new URL(String(value))
    return ['http:', 'https:'].includes(url.protocol) || 'Ссылка должна начинаться с https://'
  } catch {
    return 'Некорректная ссылка.'
  }
}

function slugify(value: unknown) {
  return typeof value === 'string'
    ? value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : value
}

export const EventOrganizers: CollectionConfig = {
  slug: 'event-organizers',
  labels: { singular: 'Организатор события', plural: 'Организаторы событий' },
  admin: {
    useAsTitle: 'name',
    group: 'События',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    listSearchableFields: ['name', 'slug'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [({ value }) => slugify(value)] },
    },
    { name: 'logo', type: 'upload', label: 'Логотип', relationTo: 'media' },
    { name: 'instagram', type: 'text', label: 'Instagram', validate: normalizeUrl },
    { name: 'x', type: 'text', label: 'X (Twitter)', validate: normalizeUrl },
    { name: 'website', type: 'text', label: 'Сайт', validate: normalizeUrl },
    {
      name: 'extraLinks',
      type: 'array',
      label: 'Дополнительные ссылки',
      fields: [
        { name: 'label', type: 'text', label: 'Название', required: true },
        { name: 'url', type: 'text', label: 'Ссылка', required: true, validate: normalizeUrl },
      ],
    },
  ],
}
