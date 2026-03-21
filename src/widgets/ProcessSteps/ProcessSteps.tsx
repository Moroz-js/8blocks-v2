'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './ProcessSteps.module.scss'

const ease = 'easeOut' as const

export interface ProcessStep {
  number: number
  title: string
  description: string
}

interface ProcessStepsProps {
  headline: string
  steps: readonly ProcessStep[]
}

export function ProcessSteps({ headline, steps }: ProcessStepsProps) {
  return (
    <section className={styles.section} aria-label="Process">
      <div className={styles.inner}>
        <ScrollRevealText text={headline} className={styles.headline} />

        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <motion.article
              key={step.number}
              className={styles.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
            >
              <div className={styles.stepLeft}>
                <span className={styles.stepNumber}>{String(step.number).padStart(2, '0')}</span>
                {i < steps.length - 1 && <span className={styles.stepLine} aria-hidden="true" />}
              </div>
              <div className={styles.stepRight}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
