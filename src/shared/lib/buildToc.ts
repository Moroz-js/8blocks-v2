export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

type LexNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexNode[]
}

function extractText(node: LexNode): string {
  if (node.type === 'text') return node.text ?? ''
  if (node.children) return node.children.map(extractText).join('')
  return ''
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'heading'
  )
}

export function buildToc(content: unknown): TocItem[] {
  if (!content || typeof content !== 'object') return []
  const root = (content as Record<string, unknown>).root as { children?: LexNode[] } | undefined
  if (!root?.children) return []

  const items: TocItem[] = []
  const idCount = new Map<string, number>()

  for (const node of root.children) {
    if (node.type !== 'heading') continue
    const tag = node.tag
    if (tag !== 'h2' && tag !== 'h3') continue

    const text = extractText(node)
    if (!text.trim()) continue

    const base = slugify(text)
    const count = idCount.get(base) ?? 0
    const id = count === 0 ? base : `${base}-${count}`
    idCount.set(base, count + 1)

    items.push({ id, text, level: tag === 'h2' ? 2 : 3 })
  }

  return items
}
