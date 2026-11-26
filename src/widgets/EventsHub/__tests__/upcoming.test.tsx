import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import type { EventCard } from '@/entities/event'
import { EventsHubPage } from '../EventsHubPage'

vi.mock('@/widgets/ServicePages/blocks/ServiceHero', () => ({ ServiceHero: () => null }))
vi.mock('./../PastEvents', () => ({ PastEvents: () => null }))
vi.mock('@/shared/ds', () => ({ Button: 'a', Section: 'section' }))

const future: EventCard = {
  id: 'test', slug: 'confirmed-event', title: 'Confirmed meeting', startsAt: '2099-12-01',
  format: 'offline', timezone: 'UTC', featured: false, badges: [], gallery: [],
}

it('omits the whole upcoming section when there are no announcements', () => {
  const html = renderToStaticMarkup(<EventsHubPage upcoming={[]} past={[]} />)
  expect(html).not.toContain('id="upcoming"')
})

it('renders a real announced event and its details link', () => {
  const html = renderToStaticMarkup(<EventsHubPage upcoming={[future]} past={[]} />)
  expect(html).toContain('id="upcoming"')
  expect(html).toContain('Confirmed meeting')
  expect(html).toContain('href="/events/confirmed-event"')
})
