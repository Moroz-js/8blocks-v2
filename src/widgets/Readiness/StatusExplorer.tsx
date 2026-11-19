'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Eyebrow, ScorePetals, petalTone, type Petal } from '@/shared/ds'
import type { ReadinessContent } from '@/shared/content/readiness'
import { PILLARS, type PillarId, type StatusId } from '@/shared/lib/platform/readiness/scoring'
import { STATUS_ICONS } from './icons'
import styles from './StatusExplorer.module.scss'

const STATUSES: StatusId[] = ['strong', 'explore', 'notYet']
const TONE: Record<StatusId, string> = { strong: styles.good, explore: styles.medium, notYet: styles.bad }

/** Illustrative chart per status (designer's values), in petal order. */
const EXAMPLES: Record<StatusId | 'none', number[]> = {
  strong: [1, 1, 1, 1],
  explore: [0.78, 1, 0.56, 0.78],
  notYet: [0.56, 0.34, 0.34, 0.56],
  none: [1, 0.56, 1, 1],
}

const Chevron = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 6l5 5 5-5" />
  </svg>
)

export function StatusExplorer({
  heading,
  statuses,
  pillars,
  chartLabel,
}: {
  heading: ReadinessContent['statusSection']
  statuses: ReadinessContent['statuses']
  pillars: Record<PillarId, { label: string }>
  chartLabel: string
}) {
  const [open, setOpen] = useState<StatusId | null>('strong')
  const values = EXAMPLES[open ?? 'none']
  const petals: Petal[] = PILLARS.map((id, i) => ({
    id,
    label: pillars[id].label,
    value: values[i],
    tone: petalTone(values[i]),
  }))

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.heading}>
          <Eyebrow>{heading.eyebrow}</Eyebrow>
          <h2 className={styles.title}>{heading.title}</h2>
          <p className={styles.description}>{heading.description}</p>
        </div>
        <ul className={styles.list}>
          {STATUSES.map((id) => {
            const expanded = open === id
            return (
              <li key={id} className={clsx(styles.item, TONE[id], expanded && styles.open)}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={expanded}
                  aria-controls={`status-${id}`}
                  onClick={() => setOpen(expanded ? null : id)}
                >
                  <span className={styles.name}>
                    {STATUS_ICONS[id]}
                    {statuses[id].name}
                  </span>
                  <span className={styles.chevron}>{Chevron}</span>
                </button>
                <div id={`status-${id}`} className={styles.panel} hidden={!expanded}>
                  <p>{statuses[id].description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <ScorePetals petals={petals} label={chartLabel} bare className={styles.chart} />
    </div>
  )
}
