import * as React from 'react'
import { load, type CheerioAPI } from 'cheerio'
import type { Element } from 'domhandler'

function toReactAttribs(attribs: Record<string, string> | undefined): Record<string, string | boolean> {
  if (!attribs) return {}
  const out: Record<string, string | boolean> = {}
  for (const [k, v] of Object.entries(attribs)) {
    if (v === '') continue
    const key =
      k === 'class'
        ? 'className'
        : k === 'for'
          ? 'htmlFor'
          : k === 'http-equiv'
            ? 'httpEquiv'
            : k === 'charset'
              ? 'charSet'
              : k
    out[key] = v
  }
  return out
}

function renderHeadTag(el: Element, key: number, $: CheerioAPI): React.ReactNode {
  const tag = el.name?.toLowerCase()
  if (!tag) return null
  const props = toReactAttribs(el.attribs) as Record<string, unknown> & { key?: number }
  props.key = key

  const inner = $(el).html() ?? ''

  switch (tag) {
    case 'meta':
      return React.createElement('meta', props)
    case 'link':
      return React.createElement('link', props)
    case 'script': {
      const hasSrc = Boolean(el.attribs?.src)
      return React.createElement('script', {
        ...props,
        dangerouslySetInnerHTML: hasSrc ? undefined : { __html: inner },
      })
    }
    case 'style':
      return React.createElement('style', {
        ...props,
        dangerouslySetInnerHTML: { __html: inner },
      })
    case 'noscript':
      return React.createElement('noscript', {
        key,
        dangerouslySetInnerHTML: { __html: inner },
      })
    default:
      return null
  }
}

/** Разбор доверенного HTML-фрагмента для вставки в `<head>` (meta, link, script, style, noscript). */
export function HeadMarkupInjector({ markup }: { markup?: string | null }) {
  if (!markup?.trim()) return null
  const $ = load(markup, { xml: { decodeEntities: false } }, false)
  const nodes = $.root()
    .children()
    .toArray()
    .filter((n): n is Element => n.type === 'tag')

  return <>{nodes.map((el, i) => renderHeadTag(el, i, $))}</>
}
