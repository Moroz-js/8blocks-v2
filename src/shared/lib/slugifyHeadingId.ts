/**
 * Стабильный id для h2/h3 (оглавление, якоря). Допускает буквы любых алфавитов (кириллица и т.д.).
 */
export function slugifyHeadingId(text: string): string {
  const s = text
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-_]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'heading'
}
