import { siteConfig } from '@/shared/config/site'

/** Абсолютный URL файла из Payload upload (для OG). */
export function mediaToAbsoluteUrl(media: unknown): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const m = media as { url?: unknown; filename?: unknown }
  const base = siteConfig.url.replace(/\/$/, '')
  if (typeof m.url === 'string' && m.url.length > 0) {
    if (m.url.startsWith('http://') || m.url.startsWith('https://')) return m.url
    return `${base}${m.url.startsWith('/') ? '' : '/'}${m.url}`
  }
  if (typeof m.filename === 'string' && m.filename.length > 0) {
    return `${base}/uploads/${m.filename}`
  }
  return undefined
}
