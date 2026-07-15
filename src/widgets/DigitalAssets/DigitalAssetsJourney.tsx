'use client'

import { motion } from 'framer-motion'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { journey } = digitalAssetsContent

export function DigitalAssetsJourney() {
  return (
    <section className={styles.section} aria-label={journey.label}>
      <div className={styles.inner}>
        <SectionHead
          label={journey.label}
          headline={journey.headline}
          description={journey.description}
        />

        <ol className={styles.journeyList}>
          {journey.steps.map((step, i) => (
            <motion.li
              key={i}
              className={styles.journeyStep}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
            >
              <span className={styles.journeyNumber} aria-hidden="true">
                {i + 1}
              </span>
              <div className={styles.journeyMain}>
                <h3 className={styles.journeyTitle}>{step.title}</h3>
                <p className={styles.journeyDescription}>{step.description}</p>
              </div>
              <div className={styles.journeyLeave}>
                <span className={styles.journeyLeaveLabel}>{journey.leaveLabel}</span>
                <p className={styles.journeyLeaveText}>{step.leaveWith}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
