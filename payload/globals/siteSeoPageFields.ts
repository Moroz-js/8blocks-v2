import type { Field } from 'payload'

/** Поля SEO одной статической страницы (без path — маршрут задаётся глобалом). */
export const siteSeoPageGlobalFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title (вкладка)',
      },
      {
        name: 'seoTitle',
        type: 'text',
        label: 'SEO title (OG / Twitter, если не заданы отдельно)',
        admin: { description: 'Если задан без ogTitle — попадёт в Open Graph и Twitter title' },
      },
    ],
  },
  {
    name: 'metaDescription',
    type: 'textarea',
    label: 'Meta description',
    admin: { rows: 3 },
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
    name: 'canonicalUrl',
    type: 'text',
    label: 'Canonical URL',
    admin: { description: 'Полный URL или путь; необязательно' },
  },
  {
    name: 'robotsNoindex',
    type: 'checkbox',
    label: 'noindex, nofollow',
    defaultValue: false,
  },
  {
    name: 'pageHeadMarkup',
    type: 'textarea',
    label: 'Код в head (только эта страница)',
    admin: { rows: 10 },
  },
]
