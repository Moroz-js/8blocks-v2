'use client'

import Image from 'next/image'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { AuditExpertData } from './AuditExpert'
import styles from './AuditRating.module.scss'

export interface RatingBlock {
  block: string
  weight: number
  scoreFive: number
}

interface Props {
  blocks: RatingBlock[]
  letterRating?: string | null
  totalScore?: number | null
  title?: string
  conclusion?: string[] | null
  disclaimer?: string | null
  expert?: AuditExpertData | null
}

function round(n: number, digits = 1): number {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

export function AuditRating({
  blocks,
  letterRating,
  totalScore,
  title,
  conclusion,
  disclaimer,
  expert,
}: Props) {
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
  const avgFive = round(
    computed.reduce((acc, r) => acc + ((Number(r.weight) || 0) / 100) * (Number(r.scoreFive) || 0), 0),
  )
  const avgScore100 = Math.round(
    computed.reduce((acc, r) => acc + ((Number(r.weight) || 0) / 100) * r.score100, 0),
  )

  const radarData = computed.map((r) => ({ subject: r.block, value: r.score100, fullMark: 100 }))
  const conclusionParas = (conclusion ?? []).filter(Boolean)
  const expertInitials = (expert?.name ?? '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <section className={styles.root} aria-label={title ?? 'Итоговый рейтинг'}>
      <h2 className={styles.heading}>{title ?? 'Итоговый рейтинг'}</h2>

      <div className={styles.topGrid}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Профиль по блокам</p>
          <div className={styles.radarWrap}>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="currentColor" strokeOpacity={0.18} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.7 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#C24E88"
                  fill="#C24E88"
                  fillOpacity={0.28}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Детализация (0–100)</p>
          <div className={styles.bars}>
            {computed.map((r, i) => (
              <div key={`${r.block}-${i}`} className={styles.barRow}>
                <span className={styles.barLabel}>{r.block}</span>
                <span className={styles.barValue}>{r.score100}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.max(0, Math.min(100, r.score100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.summaryPanel}>
        <div className={styles.conclusion}>
          <p className={styles.panelLabel}>Итоговое заключение</p>
          {conclusionParas.map((p, i) => (
            <p key={`concl-${i}`} className={styles.conclusionText}>
              {p}
            </p>
          ))}
          {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
        </div>

        <div className={styles.ratingBox}>
          <div className={styles.ratingTop}>
            <p className={styles.ratingBoxLabel}>Итоговый рейтинг</p>
            <div className={styles.scoreLine}>
              <span className={styles.scoreNum}>{displayTotal}</span>
              <span className={styles.scoreMax}>/100</span>
            </div>
            {letterRating && <p className={styles.ratingLetter}>Рейтинг {letterRating}</p>}
          </div>

          {(expert?.name || expert?.photo) && (
            <div className={styles.expertRow}>
              <div className={styles.expertAvatar}>
                {expert?.photo?.url ? (
                  <Image
                    src={expert.photo.url}
                    alt={expert.photo.alt || expert.name || ''}
                    width={40}
                    height={40}
                    className={styles.expertImg}
                  />
                ) : (
                  <span className={styles.expertFallback}>{expertInitials}</span>
                )}
              </div>
              <div className={styles.expertInfo}>
                <span className={styles.expertLabel}>Главный эксперт</span>
                {expert?.name && <span className={styles.expertName}>{expert.name}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Блок</th>
              <th>Вес</th>
              <th>Score (0–5)</th>
              <th>Score (0–100)</th>
              <th>Вклад</th>
            </tr>
          </thead>
          <tbody>
            {computed.map((r, i) => (
              <tr key={`${r.block}-${i}`}>
                <td>{r.block}</td>
                <td>{r.weight}%</td>
                <td>{round(Number(r.scoreFive) || 0, 2)}</td>
                <td className={styles.scoreCell}>{r.score100}</td>
                <td className={styles.contribCell}>{r.contribution}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Итого</td>
              <td>{totalWeight}%</td>
              <td>{avgFive}</td>
              <td>{avgScore100}</td>
              <td className={styles.totalContrib}>{computedTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
