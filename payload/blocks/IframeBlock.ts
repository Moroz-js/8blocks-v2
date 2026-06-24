import type { Block } from 'payload'

export const IframeBlock: Block = {
  slug: 'iframe',
  labels: {
    singular: 'Встраивание (iframe)',
    plural: 'Встраивания (iframe)',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'URL для встраивания',
      required: true,
      admin: {
        description:
          'Ссылка на встраиваемую страницу (embed URL): дашборд, график, видео, калькулятор и т.п.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок (для доступности)',
      admin: {
        description: 'Краткое описание содержимого, читается скринридерами.',
      },
    },
    {
      name: 'height',
      type: 'number',
      label: 'Высота, px',
      defaultValue: 480,
      min: 120,
      max: 2000,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Подпись',
    },
  ],
}
