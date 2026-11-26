import { apiPath } from './apiPath'

/** Fetch only a file from our own Payload endpoint (including the staging media rewrite). */
export async function downloadAuditFile(media: unknown, signal: AbortSignal): Promise<Response> {
  if (!media || typeof media !== 'object' || !('mimeType' in media) || media.mimeType !== 'application/pdf' ||
      !('filename' in media) || typeof media.filename !== 'string' || !media.filename ||
      /[/\\]/.test(media.filename) || media.filename === '.' || media.filename === '..') {
    return Response.json({ error: 'Audit PDF unavailable' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  const filename = media.filename
  const encodedName = encodeURIComponent(filename).replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
  const mediaPath = apiPath(`/api/media/file/${encodedName}`)
  const response = await fetch(`http://127.0.0.1:${process.env.PORT || '3000'}${mediaPath}`, {
    cache: 'no-store', redirect: 'error', signal,
  })
  if (!response.ok || !response.body || response.headers.get('content-type')?.split(';')[0].trim() !== 'application/pdf') {
    await response.body?.cancel()
    return Response.json({ error: 'Audit PDF unavailable' }, { status: response.status === 404 ? 404 : 502, headers: { 'Cache-Control': 'no-store' } })
  }

  return new Response(response.body, { headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="audit.pdf"; filename*=UTF-8''${encodedName}`,
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'X-Content-Type-Options': 'nosniff',
  } })
}
