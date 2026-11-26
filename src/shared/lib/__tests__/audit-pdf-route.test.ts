import { afterEach, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/audits/[slug]/pdf/route'

const { find, readFile } = vi.hoisted(() => ({ find: vi.fn(), readFile: vi.fn() }))
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('node:fs/promises', async (original) => ({ ...await original<typeof import('node:fs/promises')>(), readFile }))
const request = () => GET(new Request('http://localhost/api/audits/demo/pdf'), { params: Promise.resolve({ slug: 'demo' }) })
const doc = (pdfFile: unknown) => ({ docs: [{ updatedAt: '2026-11-26', pdfFile }] })
afterEach(() => { vi.resetAllMocks(); vi.unstubAllGlobals() })

it('downloads the chosen file, including after replacement, without touching the renderer cache', async () => {
  const fetchFile = vi.fn(async () => new Response('%PDF-supplied', { headers: { 'Content-Type': 'application/pdf' } }))
  vi.stubGlobal('fetch', fetchFile)
  for (const file of ['Report 1.pdf', 'Report 2.pdf']) {
    find.mockResolvedValueOnce(doc({ filename: file, mimeType: 'application/pdf' }))
    const response = await request()
    expect(await response.text()).toBe('%PDF-supplied')
    expect(response.headers.get('content-disposition')).toContain(`filename*=UTF-8''${encodeURIComponent(file)}`)
    expect(fetchFile).toHaveBeenLastCalledWith(expect.stringContaining('/api/media/file/' + encodeURIComponent(file)), expect.objectContaining({ cache: 'no-store' }))
  }
  expect(readFile).not.toHaveBeenCalled()
})

it('still downloads the normal generated PDF if the editor leaves or clears the field', async () => {
  find.mockResolvedValue(doc(null)); readFile.mockResolvedValue(Buffer.from('%PDF-generated'))
  expect(await (await request()).text()).toBe('%PDF-generated')
  expect(readFile).toHaveBeenCalledTimes(1)
})

it('checks audit visibility before attempting any download', async () => {
  find.mockResolvedValue({ docs: [] }); const fetchFile = vi.fn(); vi.stubGlobal('fetch', fetchFile)
  expect((await request()).status).toBe(404)
  expect(find).toHaveBeenCalledWith(expect.objectContaining({ where: { and: [{ slug: { equals: 'demo' } }, { hidden: { not_equals: true } }] } }))
  expect(fetchFile).not.toHaveBeenCalled()
})

it('does not disguise a missing or invalid attached file as a generated audit', async () => {
  find.mockResolvedValueOnce(doc({ filename: 'old.pdf', mimeType: 'application/pdf' }))
  vi.stubGlobal('fetch', vi.fn(async () => new Response(null, {status: 404})))
  expect((await request()).status).toBe(404)
  find.mockResolvedValueOnce(doc({ filename: 'cover.png', mimeType: 'image/png' }))
  expect((await request()).status).toBe(404)
  expect(readFile).not.toHaveBeenCalled()
})
