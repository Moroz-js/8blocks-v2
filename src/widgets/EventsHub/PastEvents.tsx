'use client'

import { useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { Button, Tabs } from '@/shared/ds'
import type { EventFormat } from '@/entities/event'
import { EventCard, ChevronIcon } from './EventCard'
import { MAP_HEIGHT, MAP_WIDTH, type EventCardData, type MapPin } from './model'
import styles from './PastEvents.module.scss'

type FormatFilter = 'all' | EventFormat

export interface PastEventsStrings {
  allCountries: string
  countryLabel: string
  formatLabel: string
  all: string
  offline: string
  online: string
  showAll: string
  showIn: string
  empty: string
  mapLabel: string
}

interface PastEventsProps {
  events: readonly EventCardData[]
  pins: readonly MapPin[]
  strings: PastEventsStrings
  detailsLabel: string
}

const PAGE = 6
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))

/** Past events: the map of countries, country and format filters, a grid that opens up to all. */
export function PastEvents({ events, pins, strings, detailsLabel }: PastEventsProps) {
  const [country, setCountry] = useState('all')
  const [format, setFormat] = useState<FormatFilter>('all')
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const inCountry = (event: EventCardData, code = country) => code === 'all' || event.country === code
  const inFormat = (event: EventCardData, value = format) => value === 'all' || event.format === value

  const countries = useMemo(() => {
    const names = new Map(pins.map((pin) => [pin.country, pin.name]))
    for (const event of events) {
      if (event.country && !names.has(event.country)) names.set(event.country, event.country)
    }
    return [...names].sort((a, b) => a[1].localeCompare(b[1]))
  }, [events, pins])

  const filtered = events.filter((event) => inCountry(event) && inFormat(event))
  const visible = expanded ? filtered : filtered.slice(0, PAGE)
  const formatCount = (value: FormatFilter) => events.filter((event) => inCountry(event) && inFormat(event, value)).length
  const countryCount = (code: string) => events.filter((event) => inCountry(event, code) && (code === 'all' ? inFormat(event) : true)).length

  const pickCountry = (code: string) => {
    setCountry(code)
    if (code !== 'all') setFormat('all')
  }

  const showCountry = (code: string) => {
    pickCountry(code)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className={styles.map} role="group" aria-label={strings.mapLabel}>
        <Image src="/img/events/map.webp" alt="" fill sizes="(max-width: 1280px) 100vw, 1200px" className={styles.mapArt} />
        {pins.map((pin) => {
          const label = fill(strings.showIn, { country: pin.name })
          const position = {
            '--x': `${(pin.x / MAP_WIDTH) * 100}%`,
            '--y': `${(pin.y / MAP_HEIGHT) * 100}%`,
            '--thumb-x': `${(pin.thumbX / MAP_WIDTH) * 100}%`,
          } as CSSProperties
          return (
            <div key={pin.country} className={styles.pin} style={position}>
              <span className={styles.point} aria-hidden="true" />
              <button type="button" className={styles.thumb} onClick={() => showCountry(pin.country)} aria-label={label} title={label}>
                <span className={styles.thumbImage}>
                  {pin.cover && <Image src={pin.cover.url} alt="" fill sizes="70px" />}
                </span>
                <span className={styles.thumbLabel}>
                  {pin.name}
                  <ChevronIcon />
                </span>
              </button>
            </div>
          )
        })}
      </div>

      <div ref={listRef} className={styles.filters}>
        <div className={styles.select}>
          <select
            value={country}
            onChange={(event) => pickCountry(event.target.value)}
            aria-label={strings.countryLabel}
            data-active={country !== 'all' || undefined}
          >
            <option value="all">
              {strings.allCountries} · {countryCount('all')}
            </option>
            {countries.map(([code, name]) => (
              <option key={code} value={code}>
                {name} · {countryCount(code)}
              </option>
            ))}
          </select>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <Tabs
          className={styles.segments}
          variant="ghost"
          label={strings.formatLabel}
          value={format}
          onChange={setFormat}
          items={[
            { value: 'all', label: strings.all, count: formatCount('all') },
            { value: 'offline', label: strings.offline, count: formatCount('offline') },
            { value: 'online', label: strings.online, count: formatCount('online') },
          ]}
        />
      </div>

      {visible.length > 0 ? (
        <div className={styles.grid}>
          {visible.map((event) => (
            <EventCard key={event.id} event={event} detailsLabel={detailsLabel} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>{strings.empty}</p>
      )}

      {!expanded && filtered.length > PAGE && (
        <div className={styles.more}>
          <Button onClick={() => setExpanded(true)}>
            {fill(strings.showAll, { n: filtered.length })}
          </Button>
        </div>
      )}
    </>
  )
}
