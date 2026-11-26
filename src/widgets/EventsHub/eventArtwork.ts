import type { StaticImageData } from 'next/image'
import type { EventCard } from '@/entities/event'
import singapore from './assets/token2049-singapore-2026.webp'
import openBoard from './assets/open-board-web3-leaders-meeting-point.webp'
import narratives from './assets/token2049-show-hottest-market-narratives-to-invest-in.webp'
import korea from './assets/korea-blockchain-week-2026.webp'
import hackathon from './assets/running-hackathon-v02.webp'
import businessModels from './assets/which-web3-business-models-actually-have-a-chance-in-the-next-cycle.webp'
import conference from './assets/conf3rence-2026.webp'
import stablecoins from './assets/what-will-bring-300b-in-capital-from-usd-backed-stablecoins-back-into-defi.webp'
import germanyPin from './assets/map-de.webp'
import spainPin from './assets/map-es.webp'
import koreaPin from './assets/map-kr.webp'
import singaporePin from './assets/map-sg.webp'

// The supplied Events design has distinct conference covers and country photos.
const covers = new Map<string, StaticImageData>([
  ['token2049-singapore-2026', singapore],
  ['open-board-web3-leaders-meeting-point', openBoard],
  ['token2049-show-hottest-market-narratives-to-invest-in', narratives],
  ['korea-blockchain-week-2026', korea],
  ['running-hackathon-v02', hackathon],
  ['which-web3-business-models-actually-have-a-chance-in-the-next-cycle', businessModels],
  ['conf3rence-2026', conference],
  ['what-will-bring-300b-in-capital-from-usd-backed-stablecoins-back-into-defi', stablecoins],
])

const pinPhotos = new Map<string, StaticImageData>([
  ['DE', germanyPin], ['ES', spainPin], ['KR', koreaPin], ['SG', singaporePin],
])

export function eventCover(event: Pick<EventCard, 'slug' | 'title' | 'cover'>) {
  const supplied = covers.get(event.slug)
  if (supplied) return { url: supplied.src, alt: event.title }
  return event.cover ? { url: event.cover.url, alt: event.cover.alt || event.title } : null
}

export function countryPhoto(country: string) {
  const supplied = pinPhotos.get(country)
  return supplied ? { url: supplied.src, alt: '' } : null
}
