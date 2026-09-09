import type { CollectionConfig } from 'payload'

function slugify(value: unknown) {
  return typeof value === 'string'
    ? value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : value
}

export const EventCities: CollectionConfig = {
  slug: 'event-cities',
  labels: { singular: 'Город события', plural: 'Города событий' },
  admin: {
    useAsTitle: 'name',
    group: 'События',
    defaultColumns: ['name', 'country', 'countryCode', 'updatedAt'],
    listSearchableFields: ['name', 'country'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', label: 'Город', required: true },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [({ value }) => slugify(value)] },
    },
    { name: 'country', type: 'text', label: 'Страна' },
    {
      name: 'countryCode',
      type: 'text',
      label: 'Код страны',
      required: true,
      minLength: 2,
      maxLength: 2,
      admin: { description: 'ISO 3166-1 alpha-2: FR, CA, US. Используется для флага.' },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)],
      },
      validate: (value: unknown) =>
        typeof value === 'string' && /^[A-Z]{2}$/.test(value) ? true : 'Введите код страны из двух латинских букв.',
    },
  ],
}
