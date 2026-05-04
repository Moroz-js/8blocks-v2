'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './WorkshopComparison.module.scss'

const ease = 'easeOut' as const

interface ComparisonRow {
  param: string
  workshop: string
  consulting: string
  templates: string
  solo: string
}

interface WorkshopComparisonProps {
  headline: string
  columns: readonly string[]
  rows: readonly ComparisonRow[]
}

export function WorkshopComparison({ headline, columns, rows }: WorkshopComparisonProps) {
  return (
    <section className={styles.section} aria-label="Comparison">
      <div className={styles.inner}>
        <ScrollRevealText text={headline} className={styles.headline} />

        <motion.div
          className={styles.tableWrapper}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease }}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thParam} scope="col"></th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={i === 0 ? `${styles.th} ${styles.thAccent}` : styles.th}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={styles.tr}>
                  <td className={styles.tdParam}>{row.param}</td>
                  <td className={`${styles.td} ${styles.tdAccent}`}>{row.workshop}</td>
                  <td className={styles.td}>{row.consulting}</td>
                  <td className={styles.td}>{row.templates}</td>
                  <td className={styles.td}>{row.solo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
