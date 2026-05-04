import type { GlobalConfig } from 'payload'
import { siteSeoPageGlobalFields } from './siteSeoPageFields.ts'
import { discoverStaticSiteRoutePaths } from '@/shared/lib/site-seo/discover-static-route-paths'
import { syncSiteSeoPageOverrides } from '@/shared/lib/site-seo/sync-site-seo-page-overrides'

/** SEO статических страниц: строки = статические маршруты из src/app/(site); path только из кода. */
export const SiteSeo: GlobalConfig = {
  slug: 'site-seo',
  label: 'Глобальное SEO',
  admin: {
    group: 'Сайт',
    description:
      'Общий код в head для всего сайта. Список страниц подставляется автоматически из маршрутов Next; путь нельзя менять вручную, добавлять строки нельзя — только SEO-поля. У статей — в коллекции «Статьи».',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterRead: [
      async ({ doc }) => {
        const routes = discoverStaticSiteRoutePaths()
        if (routes.length === 0) return doc
        doc.pageOverrides = syncSiteSeoPageOverrides(
          routes,
          doc.pageOverrides as Record<string, unknown>[],
          doc.pageOverrides as Record<string, unknown>[],
        )
        return doc
      },
    ],
    beforeChange: [
      async ({ data, originalDoc }) => {
        if (!data || !('pageOverrides' in data)) return
        const routes = discoverStaticSiteRoutePaths()
        if (routes.length === 0) return
        const prev = (originalDoc as { pageOverrides?: Record<string, unknown>[] } | null)?.pageOverrides
        data.pageOverrides = syncSiteSeoPageOverrides(
          routes,
          prev,
          data.pageOverrides as Record<string, unknown>[],
        )
      },
    ],
  },
  fields: [
    {
      name: 'globalHeadMarkup',
      type: 'textarea',
      label: 'Код в head (глобально)',
      admin: {
        description:
          'HTML-фрагмент: script (в т.ч. JSON-LD), meta, link. Доступ только доверенным редакторам.',
        rows: 14,
      },
    },
    {
      name: 'pageOverrides',
      type: 'array',
      labels: { singular: 'Страница', plural: 'SEO по страницам' },
      admin: {
        description:
          'Список и пути совпадают с файловыми маршрутами сайта. Меняются только title, описания и т.д.',
        initCollapsed: false,
        isSortable: false,
      },
      fields: [
        {
          name: 'path',
          type: 'text',
          label: 'Путь URL (только чтение)',
          required: true,
          admin: {
            readOnly: true,
            description: 'Берётся из структуры `src/app/(site)`; при сохранении подставляется автоматически.',
          },
        },
        ...siteSeoPageGlobalFields,
      ],
    },
  ],
}
