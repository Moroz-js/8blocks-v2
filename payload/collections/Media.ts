import type { CollectionConfig } from 'payload'
import path from 'path'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Медиа',
    plural: 'Медиа',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Контент',
    description: 'Загруженные изображения для обложек и rich text',
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/uploads'),
    mimeTypes: ALLOWED_MIME_TYPES,
    filesRequiredOnCreate: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1280,
        height: 720,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt текст',
      required: true,
      admin: {
        description: 'Описание изображения для доступности и SEO',
      },
    },
  ],
}
