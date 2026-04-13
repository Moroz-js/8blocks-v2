import Image from 'next/image'
import Link from 'next/link'
import { slugifyHeadingId } from '@/shared/lib/slugifyHeadingId'
import styles from './RichText.module.scss'

// Text format bitmask (Lexical)
const FORMAT_BOLD        = 1
const FORMAT_ITALIC      = 2
const FORMAT_STRIKETHROUGH = 4
const FORMAT_UNDERLINE   = 8
const FORMAT_CODE        = 16

type LexNode = {
  type?: string
  text?: string
  format?: number
  tag?: string
  children?: LexNode[]
  listType?: 'bullet' | 'number' | 'check'
  checked?: boolean
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: string
  }
  value?: {
    url?: string
    alt?: string
    width?: number
    height?: number
    caption?: string
    filename?: string
  }
  relationTo?: string
  language?: string
  indent?: number
}

function extractPlainText(node: LexNode): string {
  if (node.type === 'text') return node.text ?? ''
  if (node.children) return node.children.map(extractPlainText).join('')
  return ''
}

function renderText(node: LexNode, key: string): React.ReactNode {
  const fmt = node.format ?? 0
  let content: React.ReactNode = node.text ?? ''

  if (fmt & FORMAT_CODE)          content = <code key={`${key}-code`}>{content}</code>
  if (fmt & FORMAT_BOLD)          content = <strong key={`${key}-b`}>{content}</strong>
  if (fmt & FORMAT_ITALIC)        content = <em key={`${key}-i`}>{content}</em>
  if (fmt & FORMAT_UNDERLINE)     content = <u key={`${key}-u`}>{content}</u>
  if (fmt & FORMAT_STRIKETHROUGH) content = <s key={`${key}-s`}>{content}</s>

  return content
}

type IdMap = Map<string, number>

function renderNode(node: LexNode, key: string, idMap: IdMap): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)

    case 'linebreak':
      return <br key={key} />

    case 'heading': {
      const Tag = (node.tag ?? 'h2') as 'h2' | 'h3'
      const text = extractPlainText(node)
      const base = slugifyHeadingId(text)
      const count = idMap.get(base) ?? 0
      const id = count === 0 ? base : `${base}-${count}`
      idMap.set(base, count + 1)
      return (
        <Tag key={key} id={id} className={styles[Tag]}>
          {renderChildren(node.children, key, idMap)}
        </Tag>
      )
    }

    case 'paragraph':
      return (
        <p key={key} className={styles.p}>
          {renderChildren(node.children, key, idMap)}
        </p>
      )

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={key} className={styles[Tag]}>
          {renderChildren(node.children, key, idMap)}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li key={key} className={styles.li}>
          {renderChildren(node.children, key, idMap)}
        </li>
      )

    case 'quote':
      return (
        <blockquote key={key} className={styles.blockquote}>
          {renderChildren(node.children, key, idMap)}
        </blockquote>
      )

    case 'horizontalrule':
      return <hr key={key} className={styles.hr} />

    case 'link':
    case 'autolink': {
      const url = node.fields?.url ?? '#'
      const isExternal = node.fields?.newTab || /^https?:\/\//.test(url)
      if (isExternal) {
        return (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={styles.a}>
            {renderChildren(node.children, key, idMap)}
          </a>
        )
      }
      return (
        <Link key={key} href={url} className={styles.a}>
          {renderChildren(node.children, key, idMap)}
        </Link>
      )
    }

    case 'upload': {
      if (node.relationTo !== 'media' || node.value == null) return null
      const raw = node.value
      if (typeof raw !== 'object') return null
      const { url, alt, width, height, caption, filename } = raw as {
        url?: string
        alt?: string
        width?: number
        height?: number
        caption?: string
        filename?: string
      }
      const src = url ?? (filename ? `/uploads/${filename}` : null)
      if (!src) return null
      return (
        <figure key={key} className={styles.figure}>
          <Image
            src={src}
            alt={alt ?? ''}
            width={width ?? 1200}
            height={height ?? 675}
            className={styles.img}
          />
          {caption && <figcaption className={styles.figcaption}>{caption}</figcaption>}
        </figure>
      )
    }

    default:
      if (node.children) {
        return <>{renderChildren(node.children, key, idMap)}</>
      }
      return null
  }
}

function renderChildren(
  children: LexNode[] | undefined,
  parentKey: string,
  idMap: IdMap,
): React.ReactNode {
  return children?.map((node, i) => renderNode(node, `${parentKey}-${i}`, idMap))
}

interface Props {
  content: unknown
  className?: string
}

export function RichText({ content, className }: Props) {
  if (!content || typeof content !== 'object') return null
  const root = (content as Record<string, unknown>).root as
    | { children?: LexNode[] }
    | undefined
  if (!root?.children) return null

  const idMap: IdMap = new Map()

  return (
    <div className={[styles.richText, className].filter(Boolean).join(' ')}>
      {root.children.map((node, i) => renderNode(node, `root-${i}`, idMap))}
    </div>
  )
}
