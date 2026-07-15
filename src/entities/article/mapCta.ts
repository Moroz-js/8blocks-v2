import type { ArticleCta } from './types'

/** Маппит группу cta из Payload-документа (articles/research) в тип фронтенда. */
export function mapArticleCta(raw: unknown): ArticleCta | null {
  if (!raw || typeof raw !== 'object') return null
  const cta = raw as {
    text?: unknown
    buttonLabel?: unknown
    file?: unknown
    requireEmail?: unknown
  }
  if (typeof cta.buttonLabel !== 'string' || !cta.buttonLabel.trim()) return null

  const file =
    cta.file && typeof cta.file === 'object'
      ? (cta.file as { url?: unknown; filename?: unknown })
      : null
  if (!file) return null

  const fileUrl =
    typeof file.url === 'string' && file.url
      ? file.url
      : typeof file.filename === 'string' && file.filename
        ? `/uploads/${file.filename}`
        : null
  if (!fileUrl) return null

  return {
    text: typeof cta.text === 'string' && cta.text.trim() ? cta.text : null,
    buttonLabel: cta.buttonLabel,
    fileUrl,
    fileName: typeof file.filename === 'string' ? file.filename : null,
    requireEmail: cta.requireEmail === true,
  }
}
