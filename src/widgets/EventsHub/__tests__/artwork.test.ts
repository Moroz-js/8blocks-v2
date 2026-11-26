import { expect, it } from 'vitest'
import { mapEventCard } from '@/shared/lib/event-mappers'
import { buildMapPins, toEventCardData } from '../model'

const image = (name: string) => ({ id: name, url: `/uploads/${name}.webp`, alt: name })
const event = (cover: string, pin?: string) => toEventCardData(mapEventCard({
  id: cover, slug: 'token2049-singapore-2026', title: 'Singapore',
  startsAt: '2026-10-07', format: 'offline', city: 'singapore', timezone: 'UTC',
  cover: image(cover), mapPhoto: pin ? image(pin) : null,
})!)
const points = { SG: [1.35, 103.82] as const }

it('reflects the editor’s cover even for an event previously hardcoded by slug', () => {
  expect(event('replacement').cover?.url).toMatch(/\/uploads\/replacement.webp$/)
})

it('prefers the newest explicit map photo, even when the newest event only has a card cover', () => {
  const pins = buildMapPins([event('first'), event('second', 'dedicated'), event('third', 'older')], points)
  expect(pins).toHaveLength(1)
  expect(pins[0].cover?.url).toMatch(/\/uploads\/dedicated.webp$/)
})

it('falls back to a CMS cover if a country has no dedicated map photo', () => {
  expect(buildMapPins([event('cover')], points)[0].cover?.url).toMatch(/\/uploads\/cover.webp$/)
})
