import Image from 'next/image'
import Link from 'next/link'
import { slugifyHeadingId } from '@/shared/lib/slugifyHeadingId'
import { FormulaView } from './FormulaView'
import { ChartView, type ChartType } from './ChartView'
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
    blockType?: string
    label?: string
    text?: string
    severity?: 'important' | 'critical'
    formula?: string
    caption?: string
    headers?: { cell?: string | null; id?: string }[]
    rows?: { cells?: { cell?: string | null; id?: string }[]; id?: string }[]
    aiDescription?: string
    url?: string
    newTab?: boolean
    linkType?: string
    // chart
    type?: string
    seriesLabel?: string
    color?: string
    dataPoints?: { label?: string | null; value?: number | null; color?: string | null; id?: string }[]
    // chartRow
    charts?: {
      type?: string
      seriesLabel?: string
      color?: string
      caption?: string
      dataPoints?: { label?: string | null; value?: number | null; color?: string | null; id?: string }[]
      id?: string
    }[]
    // metricStrip / checklist / infoColumns / numberedNotes
    items?: {
      label?: string | null
      sub?: string | null
      value?: string | null
      variant?: 'check' | 'cross' | 'warn' | null
      text?: string | null
      title?: string | null
      formula?: string | null
      body?: string | null
      id?: string
    }[]
    // statColumns
    columns?: {
      title?: string | null
      note?: string | null
      rows?: {
        label?: string | null
        value?: string | null
        percent?: number | null
        id?: string
      }[]
      id?: string
    }[]
    // risk profile
    title?: string
    criteria?: {
      name?: string | null
      score?: number | null
      max?: number | null
      comment?: string | null
      id?: string
    }[]
    totalScore?: number | null
    rating?: string | null
    interpretation?: string | null
  }
  value?: {
    url?: string
    alt?: string
    width?: number
    height?: number
    caption?: string
    filename?: string
    aiDescription?: string
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

interface ChartFieldValue {
  type?: string
  seriesLabel?: string | null
  color?: string | null
  caption?: string | null
  dataPoints?: { label?: string | null; value?: number | null; color?: string | null }[]
}

function renderSingleChart(c: ChartFieldValue, key: string): React.ReactNode {
  const points = (c.dataPoints ?? [])
    .filter((p) => p && p.label != null && p.value != null)
    .map((p) => ({
      label: String(p.label),
      value: Number(p.value),
      color: p.color ?? null,
    }))
  if (points.length === 0) return null
  return (
    <ChartView
      key={key}
      type={(c.type as ChartType) ?? 'line'}
      dataPoints={points}
      seriesLabel={c.seriesLabel}
      color={c.color}
      caption={c.caption}
    />
  )
}

function renderBlock(node: LexNode, key: string): React.ReactNode {
  const fields = node.fields
  if (!fields?.blockType) return null

  switch (fields.blockType) {
    case 'callout': {
      const severity = fields.severity === 'critical' ? 'critical' : 'important'
      const calloutClass = [styles.callout, styles[`callout_${severity}`]]
        .filter(Boolean)
        .join(' ')
      return (
        <div key={key} className={calloutClass}>
          {fields.label && <strong className={styles.calloutLabel}>{fields.label}</strong>}
          <p className={styles.calloutText}>{fields.text}</p>
        </div>
      )
    }

    case 'auditTable': {
      const headers = fields.headers ?? []
      const rows = fields.rows ?? []
      return (
        <div key={key} className={styles.tableWrap}>
          <table className={styles.table}>
            {headers.length > 0 && (
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={`${key}-h-${i}`}>{header.cell}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${key}-r-${rowIndex}`}>
                  {(row.cells ?? []).map((cell, cellIndex) => (
                    <td key={`${key}-c-${rowIndex}-${cellIndex}`}>{cell.cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case 'formula':
      return fields.formula ? (
        <FormulaView key={key} formula={fields.formula} caption={fields.caption} />
      ) : null

    case 'chart': {
      return renderSingleChart(
        {
          type: fields.type,
          seriesLabel: fields.seriesLabel,
          color: fields.color,
          caption: fields.caption,
          dataPoints: fields.dataPoints,
        },
        key,
      )
    }

    case 'chartRow': {
      const charts = (fields.charts ?? []).filter(
        (c) => (c.dataPoints ?? []).length > 0,
      )
      if (charts.length === 0) return null
      return (
        <div key={key} className={styles.chartRow} data-count={charts.length}>
          {charts.map((c, i) => renderSingleChart(c, `${key}-c-${i}`))}
        </div>
      )
    }

    case 'metricStrip': {
      const items = (fields.items ?? []).filter((it) => it.label || it.value)
      if (items.length === 0) return null
      return (
        <div key={key} className={styles.metricStrip}>
          {items.map((it, i) => (
            <div key={`${key}-m-${i}`} className={styles.metricItem}>
              <span className={styles.metricLabel}>
                {it.label}
                {it.sub ? ` • ${it.sub}` : ''}
              </span>
              <span className={styles.metricValue}>{it.value}</span>
            </div>
          ))}
        </div>
      )
    }

    case 'checklist': {
      const items = (fields.items ?? []).filter((it) => it.text)
      if (items.length === 0) return null
      return (
        <div key={key} className={styles.checklistCard}>
          {fields.title && <p className={styles.checklistTitle}>{fields.title}</p>}
          <ul className={styles.checklist}>
            {items.map((it, i) => {
              const variant = it.variant ?? 'check'
              const mark: React.ReactNode =
                variant === 'check' ? (
                  '✓'
                ) : variant === 'cross' ? (
                  '−'
                ) : (
                  <svg
                    className={styles.warnIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M12 3.2c.69 0 1.33.37 1.67.97l7.4 12.93c.67 1.17-.18 2.63-1.53 2.63H4.46c-1.35 0-2.2-1.46-1.53-2.63l7.4-12.93c.34-.6.98-.97 1.67-.97Z"
                      fill="#EFA61E"
                    />
                    <rect x="11" y="8.4" width="2" height="5.6" rx="1" fill="#fff" />
                    <circle cx="12" cy="16.6" r="1.15" fill="#fff" />
                  </svg>
                )
              return (
                <li key={`${key}-ci-${i}`} className={styles.checkItem}>
                  <span className={`${styles.checkMark} ${styles[`mark_${variant}`]}`}>
                    {mark}
                  </span>
                  <span className={styles.checkText}>{it.text}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    case 'statColumns': {
      const columns = (fields.columns ?? []).filter(
        (c) => c.title || (c.rows ?? []).length > 0 || c.note,
      )
      if (columns.length === 0) return null
      return (
        <div key={key} className={styles.statColumns} data-count={columns.length}>
          {columns.map((col, i) => (
            <div key={`${key}-sc-${i}`} className={styles.statCol}>
              {col.title && <p className={styles.statColTitle}>{col.title}</p>}
              {(col.rows ?? []).map((r, ri) => (
                <div key={`${key}-sr-${i}-${ri}`} className={styles.statRow}>
                  <div className={styles.statRowHead}>
                    <span className={styles.statRowLabel}>{r.label}</span>
                    {r.value && <span className={styles.statRowValue}>{r.value}</span>}
                  </div>
                  {r.percent != null && (
                    <div className={styles.statBarTrack}>
                      <div
                        className={styles.statBarFill}
                        style={{ width: `${Math.max(0, Math.min(100, Number(r.percent)))}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
              {col.note && <p className={styles.statColNote}>{col.note}</p>}
            </div>
          ))}
        </div>
      )
    }

    case 'infoColumns': {
      const items = (fields.items ?? []).filter((it) => it.title || it.body)
      if (items.length === 0) return null
      return (
        <div key={key} className={styles.infoColumns} data-count={items.length}>
          {items.map((it, i) => (
            <div key={`${key}-ic-${i}`} className={styles.infoCard}>
              {it.title && <p className={styles.infoTitle}>{it.title}</p>}
              {it.formula && (
                <FormulaView formula={it.formula} caption={null} />
              )}
              {it.body && <p className={styles.infoBody}>{it.body}</p>}
            </div>
          ))}
        </div>
      )
    }

    case 'numberedNotes': {
      const items = (fields.items ?? []).filter((it) => it.title || it.text)
      if (items.length === 0) return null
      return (
        <ol key={key} className={styles.numberedNotes}>
          {items.map((it, i) => (
            <li key={`${key}-nn-${i}`} className={styles.numberedItem}>
              <span className={styles.numberedIndex}>{i + 1}</span>
              <div className={styles.numberedBody}>
                {it.title && <p className={styles.numberedTitle}>{it.title}</p>}
                {it.text && <p className={styles.numberedText}>{it.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      )
    }

    case 'riskProfile': {
      const criteria = (fields.criteria ?? []).filter((c) => c && c.name)
      return (
        <div key={key} className={styles.riskProfile}>
          {fields.title && <h3 className={styles.riskTitle}>{fields.title}</h3>}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Критерий</th>
                  <th>Оценка</th>
                  <th>Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c, i) => (
                  <tr key={`${key}-rc-${i}`}>
                    <td>{c.name}</td>
                    <td>
                      {c.score ?? '—'}
                      {c.max != null ? ` / ${c.max}` : ''}
                    </td>
                    <td>{c.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(fields.totalScore != null || fields.rating) && (
            <p className={styles.riskTotal}>
              {fields.totalScore != null && (
                <>
                  Итог: <strong>{fields.totalScore}</strong>
                </>
              )}
              {fields.rating && (
                <>
                  {fields.totalScore != null ? ' · ' : ''}Рейтинг риска:{' '}
                  <strong>{fields.rating}</strong>
                </>
              )}
            </p>
          )}
          {fields.interpretation && (
            <p className={styles.riskInterpretation}>{fields.interpretation}</p>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

function renderNode(node: LexNode, key: string, idMap: IdMap): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)

    case 'linebreak':
      return <br key={key} />

    case 'block':
      return renderBlock(node, key)

    case 'heading': {
      const Tag = (node.tag ?? 'h2') as 'h2' | 'h3' | 'h4'
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
      const { url, alt, width, height, caption, filename, aiDescription: aiFromValue } = raw as {
        url?: string
        alt?: string
        width?: number
        height?: number
        caption?: string
        filename?: string
        aiDescription?: string
      }
      const aiDescription = aiFromValue ?? node.fields?.aiDescription
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
          {aiDescription && (
            <figcaption className={styles.figcaptionSrOnly}>{aiDescription}</figcaption>
          )}
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
