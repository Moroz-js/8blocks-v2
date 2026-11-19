import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeContentPath } from './normalize-path'

/**
 * Папки групп сайта `src/app/(site)` и `src/app/(site-v2)` относительно этого файла.
 * Пути — литералы: динамическая сборка пути заставляет Turbopack трассировать весь проект.
 */
function resolveSiteAppDirs(): string[] {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const dirs: string[] = []
  const v1Dir = path.resolve(here, '../../../app/(site)')
  if (fs.existsSync(v1Dir) && fs.statSync(v1Dir).isDirectory()) dirs.push(v1Dir)
  const v2Dir = path.resolve(here, '../../../app/(site-v2)')
  if (fs.existsSync(v2Dir) && fs.statSync(v2Dir).isDirectory()) dirs.push(v2Dir)
  return dirs
}

/**
 * Статические маршруты с `page.tsx` под группами сайта в `src/app`.
 * Сегменты с `[` (динамика) не обходим — только родительские статические страницы.
 * Группы `(name)` не дают сегмента в URL.
 */
export function discoverStaticSiteRoutePaths(): string[] {
  const siteDirs = resolveSiteAppDirs()
  if (siteDirs.length === 0) return []

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

  for (const dir of siteDirs) walk(dir, [])
  return [...out].sort((a, b) => {
    if (a === '/') return -1
    if (b === '/') return 1
    return a.localeCompare(b)
  })
}
