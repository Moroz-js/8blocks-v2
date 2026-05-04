import { normalizeContentPath } from './normalize-path'

type Row = Record<string, unknown>

function rowByPath(rows: Row[] | null | undefined): Map<string, Row> {
  const m = new Map<string, Row>()
  for (const row of rows ?? []) {
    const key = normalizeContentPath(String(row.path ?? '/'))
    m.set(key, row)
  }
  return m
}

/**
 * Оставляет только маршруты из `routes`, порядок как в массиве.
 * `path` всегда из автогенерации; поля SEO — из incoming, иначе из previous.
 */
export function syncSiteSeoPageOverrides(
  routes: string[],
  previous: Row[] | null | undefined,
  incoming: Row[] | null | undefined,
): Row[] {
  const prevMap = rowByPath(previous)
  const incMap = rowByPath(incoming)

  return routes.map((routePath) => {
    const key = normalizeContentPath(routePath)
    const prevRow = prevMap.get(key) ?? {}
    const incRow = incMap.get(key) ?? {}
    const merged: Row = { ...prevRow, ...incRow }
    merged.path = routePath
    return merged
  })
}
