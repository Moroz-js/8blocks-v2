// Manual one-off import; never run on push, on deploy or by schema migrations.
// Run from the target instance's project directory (the owner of its public/uploads).
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const entries = [
  ['token2049-singapore-2026', '2026-10-07', 'offline', 'map-sg'],
  ['open-board-web3-leaders-meeting-point', '2026-10-06', 'offline'],
  ['token2049-show-hottest-market-narratives-to-invest-in', '2026-10-02', 'online'],
  ['korea-blockchain-week-2026', '2026-09-29', 'offline', 'map-kr'],
  ['running-hackathon-v02', '2026-09-24', 'offline', 'map-es'],
  ['which-web3-business-models-actually-have-a-chance-in-the-next-cycle', '2026-09-18', 'online'],
  ['conf3rence-2026', '2026-09-15', 'offline', 'map-de'],
  ['what-will-bring-300b-in-capital-from-usd-backed-stablecoins-back-into-defi', '2026-08-20', 'online'],
] as const

async function main() {
  const args = process.argv.slice(2)
  if (args.some(a => !['--apply', '--replace-existing', '--verify'].includes(a))) throw new Error('Unknown argument')
  const apply = args.includes('--apply')
  const replace = args.includes('--replace-existing')
  const verify = args.includes('--verify')
  if (apply && verify) throw new Error('Verify and apply are separate operations')
  console.log(verify ? 'VERIFY' : apply ? 'APPLY' : 'DRY RUN')
  const payload = await getPayload({ config })
  try {
    const seen = new Set<string>()
    const plan = []
    for (const [slug, day, format, pin] of entries) {
      let { docs } = await payload.find({ collection: 'events', where: { or: [{ slug: { equals: slug } }, { 'seo.alternateSlug': { equals: slug } }] }, limit: 2, depth: 0 })
      if (!docs.length) {
        const end = new Date(Date.parse(day) + 86_400_000).toISOString()
        docs = (await payload.find({ collection: 'events', where: { and: [{ startsAt: { greater_than_equal: `${day}T00:00:00Z`, less_than: end } }, { format: { equals: format } }] }, limit: 2, depth: 0 })).docs
      }
      if (docs.length !== 1 || docs[0].format !== format || seen.has(String(docs[0].id))) throw new Error(`No unique event for ${slug}; stopped before writing`)
      seen.add(String(docs[0].id))
      const event = docs[0]
      for (const [field, stem] of [['cover', slug], ['mapPhoto', pin]] as const) {
        if (!stem) continue
        const data = await readFile(path.resolve(__dirname, '../src/widgets/EventsHub/assets', stem + '.webp'))
        const hash = createHash('sha256').update(data).digest('hex').slice(0, 12)
        const name = `event-${stem}-${hash}.webp`
        const matches = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })
        const mediaId = matches.docs[0]?.id
        const before = event[field] ?? null
        const unchanged = mediaId != null && String(before) === String(mediaId)
        console.log(JSON.stringify({ source: slug, slug: event.slug, title: event.title, event: event.id, field, before, file: name, action: unchanged ? 'unchanged' : 'assign' }))
        plan.push({ id: event.id, field, before, unchanged, mediaId, data, name, alt: String(event.title) })
      }
    }
    if (verify) {
      if (plan.length !== 12 || plan.some(p => !p.unchanged)) throw new Error('Incomplete event relationships')
      const base = `http://127.0.0.1:${process.env.PORT || '3000'}`
      for (const item of plan) {
        const r = await fetch(`${base}/api/media/file/${encodeURIComponent(item.name)}`, { signal: AbortSignal.timeout(30_000) })
        if (!r.ok || !r.headers.get('content-type')?.includes('image/webp') || !(await r.arrayBuffer()).byteLength) throw new Error(`Media download failed: ${item.name}`)
      }
      const audits = await payload.find({collection:'public-audits', where:{hidden:{not_equals:true}}, limit:1, depth:0, select:{slug:true,pdfFile:true}})
      if (typeof audits.docs[0]?.slug !== 'string') throw new Error('No visible audit available to verify')
      const pdf = await fetch(`${base}/api/audits/${encodeURIComponent(audits.docs[0].slug)}/pdf`, {signal:AbortSignal.timeout(110_000)})
      if (!pdf.ok || !pdf.headers.get('content-disposition')?.startsWith('attachment') || Buffer.from(await pdf.arrayBuffer()).subarray(0,5).toString() !== '%PDF-') throw new Error(`Audit PDF check failed: ${pdf.status}`)
      console.log('VERIFIED: 8 event covers, 4 map photos, 12 WebP downloads and 1 audit PDF attachment')
      return
    }
    if (!apply) return
    if (!replace && plan.some(p => !p.unchanged && p.before != null)) {
      throw new Error('Review the dry run and preserve previous IDs before using --replace-existing; nothing written')
    }
    for (const item of plan) {
      if (item.unchanged) continue
      const latest = await payload.findByID({ collection: 'events', id: item.id, depth: 0 })
      if ((latest[item.field] ?? null) !== item.before) throw new Error(`Field changed during import: ${item.id}/${item.field}; stopped`)
      const id = item.mediaId ?? (await payload.create({
        collection: 'media', data: { alt: item.alt },
        file: { data: item.data, name: item.name, mimetype: 'image/webp', size: item.data.length },
      })).id
      await payload.update({ collection: 'events', id: item.id, data: { [item.field]: id }, depth: 0 })
      console.log(JSON.stringify({ event: item.id, field: item.field, before: item.before, after: id }))
    }
  } finally {
    await payload.destroy()
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1) })
