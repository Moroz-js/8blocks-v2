/** Нормализация пути для сопоставления с CMS (без хвостового /, корень — `/`). */
export function normalizeContentPath(pathname: string): string {
  const p = pathname.trim() || '/'
  if (p === '/') return '/'
  return p.replace(/\/+$/, '') || '/'
}
