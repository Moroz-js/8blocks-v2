'use client'

import { useEffect, useRef, useState } from 'react'
import { Tabs } from '@/shared/ds'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import styles from './TokenizationCasesPage.module.scss'

interface Source {
  title: string
  url: string
}

interface CaseItem {
  name: string
  class: string
  metric: string
  metricLabel: string
  line: string
  year: string
  source: Source
}

export interface CasesData {
  stats: {
    value: number
    prefix: string
    suffix: string
    label: string
    source: Source
  }[]
  classes: string[]
  cases: CaseItem[]
}

function CountUp({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const startedAt = performance.now()
      const tick = (time: number) => {
        const progress = Math.min((time - startedAt) / 900, 1)
        setDisplay(value * (1 - Math.pow(1 - progress, 3)))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref}>
      {prefix}
      {Number.isInteger(value) ? Math.round(display) : display.toFixed(2)}
      {suffix}
    </span>
  )
}

function SourceLink({ source }: { source: Source }) {
  return (
    <a href={source.url} target="_blank" rel="nofollow noopener noreferrer" className={styles.source}>
      {source.title}
    </a>
  )
}

export function CaseStats({ stats }: { stats: CasesData['stats'] }) {
  return (
    <div className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <div className={styles.statText}>
            <p className={styles.statValue}>
              <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
          <SourceLink source={stat.source} />
        </div>
      ))}
    </div>
  )
}

export function CasesLibrary({ data, title }: { data: CasesData; title: string }) {
  const all = data.classes[0]
  const [active, setActive] = useState(all)
  const cases = data.cases.filter((item) => active === all || item.class === active)

  return (
    <section className={styles.library}>
      <h2 className={styles.libraryTitle}>{title}</h2>
      <Tabs
        items={data.classes.map((value) => ({ value, label: value }))}
        value={active}
        onChange={(value) => {
          setActive(value)
          trackPlatformEvent('case_filter_selected', { tool: 'cases', class: value })
        }}
        label={title}
        className={styles.filter}
      />
      <div className={styles.grid}>
        {cases.map((item) => (
          <article key={`${item.name}-${item.class}`} className={styles.card}>
            <div className={styles.cardHead}>
              <p className={styles.cardMeta}>
                <span className={styles.cardClass}>{item.class}</span>
                <span>{item.year}</span>
              </p>
              <h3 className={styles.cardName}>{item.name}</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.metric}>
                <span className={styles.metricValue}>{item.metric}</span>
                <span className={styles.metricLabel}>{item.metricLabel}</span>
              </p>
              <p className={styles.cardLine}>{item.line}</p>
            </div>
            <SourceLink source={item.source} />
          </article>
        ))}
      </div>
    </section>
  )
}
