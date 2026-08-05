import { slugifyHeadingId } from '@/shared/lib/slugifyHeadingId'
import { normalizeHeadingText } from '@/shared/lib/normalizeHeadingText'

export interface TocItem {
  id: string
  text: string
  level: 2
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

export function buildToc(content: unknown): TocItem[] {
  if (!content || typeof content !== 'object') return []
  const root = (content as Record<string, unknown>).root as { children?: LexNode[] } | undefined
  if (!root?.children) return []

  const items: TocItem[] = []
  const idCount = new Map<string, number>()

  for (const node of root.children) {
    if (node.type !== 'heading') continue
    if (node.tag !== 'h2') continue

    const text = normalizeHeadingText(extractText(node))
    if (!text) continue

    const base = slugifyHeadingId(text)
    const count = idCount.get(base) ?? 0
    const id = count === 0 ? base : `${base}-${count}`
    idCount.set(base, count + 1)

    items.push({ id, text, level: 2 })
  }

  return items
}
