import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeContentPath } from './normalize-path'

/** Папка `src/app/(site)` относительно этого файла (`…/site-seo/…`). */
function resolveSiteAppDir(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '../../../app/(site)')
}

/**
 * Статические маршруты с `page.tsx` под `src/app/(site)`.
 * Сегменты с `[` (динамика) не обходим — только родительские статические страницы.
 * Группы `(name)` не дают сегмента в URL.
 */
export function discoverStaticSiteRoutePaths(): string[] {
  const siteDir = resolveSiteAppDir()
  if (!fs.existsSync(siteDir) || !fs.statSync(siteDir).isDirectory()) {
    return []
  }

  const out = new Set<string>()

  function walk(absDir: string, urlSegments: string[]) {
    const entries = fs.readdirSync(absDir, { withFileTypes: true })
    const hasPage = entries.some((e) => e.isFile() && e.name === 'page.tsx')
    if (hasPage) {
      const u = urlSegments.length === 0 ? '/' : `/${urlSegments.join('/')}`
      out.add(normalizeContentPath(u))
    }
    for (const e of entries) {
      if (!e.isDirectory()) continue
      const name = e.name
      if (name.startsWith('_')) continue
      if (name.includes('[')) continue
      if (name.startsWith('(')) {
        walk(path.join(absDir, name), urlSegments)
        continue
      }
      walk(path.join(absDir, name), [...urlSegments, name])
    }
  }

  walk(siteDir, [])
  return [...out].sort((a, b) => {
    if (a === '/') return -1
    if (b === '/') return 1
    return a.localeCompare(b)
  })
}
