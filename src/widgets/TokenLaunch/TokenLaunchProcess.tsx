'use client'

import { motion } from 'framer-motion'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import { SectionHead } from './SectionHead'
import styles from './TokenLaunch.module.scss'

const ease = 'easeOut' as const
const { process } = tokenLaunchContent

export function TokenLaunchProcess() {
  return (
    <section className={styles.section} aria-label={process.headline}>
      <div className={styles.inner}>
        <SectionHead
          label={process.label}
          headline={process.headline}
          description={process.description}
        />
        <motion.div
          className={styles.processTableWrap}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease }}
        >
          <table className={styles.processTable}>
            <thead>
              <tr>
                {process.tableHead.map((head) => (
                  <th key={head} scope="col">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {process.rows.map((row, index) => (
                <tr key={row.stage}>
                  <td className={styles.processNumber}>{index + 1}</td>
                  <td className={styles.processStage}>{row.stage}</td>
                  <td className={styles.processDuration} data-label={process.tableHead[2]}>
                    {row.duration}
                  </td>
                  <td className={styles.processText}>{row.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
