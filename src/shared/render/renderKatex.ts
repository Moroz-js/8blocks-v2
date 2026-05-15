import katex from 'katex'

export function normalizeLatex(input: string): string {
  const trimmed = input.trim()
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
    return trimmed.slice(2, -2).trim()
  }
  if (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) {
    return trimmed.slice(2, -2).trim()
  }
  if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

export function renderKatexHtml(latex: string, displayMode = true): string {
  const source = normalizeLatex(latex)
  if (!source) return ''

  try {
    return katex.renderToString(source, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
    })
  } catch {
    return source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
}
