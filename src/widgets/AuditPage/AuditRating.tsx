'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from 'recharts'
import { Section } from '@/shared/ds'
import type { AuditExpertData } from './auditMetrics'
import styles from './AuditRating.module.scss'

/** $ds-pink: SVG presentation attributes can't read CSS variables. */
const RADAR_COLOR = '#ca005a'

export interface RatingBlock {
  block: string
  weight: number
  scoreFive: number
}

export interface AuditRatingLabels {
  title: string
  profile: string
  breakdown: string
  conclusion: string
  ratingWord: string
  leadExpert: string
  columns: Record<'block' | 'weight' | 'scoreFive' | 'score100' | 'contribution' | 'total', string>
}

interface Props {
  blocks: RatingBlock[]
  labels: AuditRatingLabels
  letterRating?: string | null
  totalScore?: number | null
  conclusion?: string[] | null
  disclaimer?: string | null
  expert?: AuditExpertData | null
}

function round(n: number, digits = 1): number {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

function useBoxWidth(fallback = 560) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(fallback)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const next = Math.floor(el.getBoundingClientRect().width)
      if (next > 0) setWidth((prev) => (prev === next ? prev : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

const LinkedInIcon = (
  <svg className={styles.expertLinkedInIcon} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
  </svg>
)

/** Final rating: block radar, 0–100 bars, summary with the score and the lead expert, score table. */
export function AuditRating({ blocks, labels, letterRating, totalScore, conclusion, disclaimer, expert }: Props) {
  const [radarRef, radarWidth] = useBoxWidth()
  const rows = (blocks ?? []).filter((b) => b && b.block)
  if (rows.length === 0) return null

  const computed = rows.map((b) => {
    const score100 = round((Number(b.scoreFive) || 0) * 20)
    const contribution = round(((Number(b.weight) || 0) / 100) * score100)
    return { ...b, score100, contribution }
  })

  const computedTotal = round(computed.reduce((acc, r) => acc + r.contribution, 0))
  const displayTotal = totalScore != null ? totalScore : Math.round(computedTotal)
  const totalWeight = round(computed.reduce((acc, r) => acc + (Number(r.weight) || 0), 0))
  const avgFive = round(computed.reduce((acc, r) => acc + ((Number(r.weight) || 0) / 100) * (Number(r.scoreFive) || 0), 0))
  const avgScore100 = Math.round(computed.reduce((acc, r) => acc + ((Number(r.weight) || 0) / 100) * r.score100, 0))

  const radarData = computed.map((r) => ({ subject: r.block, value: r.score100, fullMark: 100 }))
  const conclusionParas = (conclusion ?? []).filter(Boolean)
  const expertInitials = (expert?.name ?? '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  const { columns } = labels

  return (
    <Section title={labels.title} sheen data-pdf-rating>
      <div className={styles.topGrid} data-pdf-rating-profile>
        <div className={styles.card}>
          <p className={styles.cardTitle}>{labels.profile}</p>
          <div ref={radarRef} className={styles.radarWrap}>
            <RadarChart width={radarWidth} height={400} data={radarData} outerRadius="62%" title={labels.profile}>
              <PolarGrid stroke="currentColor" strokeOpacity={0.16} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip />
              <Radar name="Score" dataKey="value" stroke={RADAR_COLOR} fill={RADAR_COLOR} fillOpacity={0.3} isAnimationActive={false} />
            </RadarChart>
          </div>
        </div>

        <div className={styles.card} data-pdf-detail-bars>
          <p className={styles.cardTitle}>{labels.breakdown}</p>
          <div className={styles.bars}>
            {computed.map((r, i) => (
              <div key={`${r.block}-${i}`} className={styles.barRow}>
                <span className={styles.barLabel}>{r.block}</span>
                <span className={styles.barValue}>{r.score100}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${Math.max(0, Math.min(100, r.score100))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ratingTail} data-pdf-rating-tail>
        <div className={styles.summaryPanel}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>{labels.conclusion}</p>
            <div className={styles.conclusion}>
              {conclusionParas.map((p, i) => (
                <p key={i} className={styles.conclusionText}>
                  {p}
                </p>
              ))}
            </div>
            {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
          </div>

          <div className={styles.ratingBox}>
            <div>
              <p className={styles.cardTitle}>{labels.title}</p>
              <p className={styles.scoreLine}>
                <span className={styles.scoreNum}>{displayTotal}</span>
                <span className={styles.scoreMax}>/100</span>
              </p>
              {letterRating && (
                <p className={styles.ratingLetter}>
                  {labels.ratingWord} {letterRating}
                </p>
              )}
            </div>

            {(expert?.name || expert?.photo) && (
              <div className={styles.expertRow}>
                <div className={styles.expertAvatar}>
                  {expert?.photo?.url ? (
                    <Image src={expert.photo.url} alt={expert.photo.alt || expert.name || ''} width={40} height={40} className={styles.expertImg} />
                  ) : (
                    <span>{expertInitials}</span>
                  )}
                </div>
                <div className={styles.expertInfo}>
                  <span className={styles.expertLabel}>{labels.leadExpert}</span>
                  {expert?.name &&
                    (expert.linkedIn ? (
                      <a href={expert.linkedIn} className={styles.expertName} target="_blank" rel="noopener noreferrer">
                        {expert.name}
                        {LinkedInIcon}
                      </a>
                    ) : (
                      <span className={styles.expertName}>{expert.name}</span>
                    ))}
                  {expert?.role && <span className={styles.expertLabel}>{expert.role}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{columns.block}</th>
                <th>{columns.weight}</th>
                <th>{columns.scoreFive}</th>
                <th>{columns.score100}</th>
                <th>{columns.contribution}</th>
              </tr>
            </thead>
            <tbody>
              {computed.map((r, i) => (
                <tr key={`${r.block}-${i}`}>
                  <td>{r.block}</td>
                  <td>{r.weight}%</td>
                  <td>{round(Number(r.scoreFive) || 0, 2)}</td>
                  <td className={styles.accentCell}>{r.score100}</td>
                  <td>{r.contribution}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>{columns.total}</td>
                <td>{totalWeight}%</td>
                <td>{avgFive}</td>
                <td>{avgScore100}</td>
                <td className={styles.accentCell}>{computedTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Section>
  )
}
