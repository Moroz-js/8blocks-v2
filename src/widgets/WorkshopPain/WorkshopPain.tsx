'use client'

import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './WorkshopPain.module.scss'

const ease = 'easeOut' as const

interface Persona {
  role: string
  quote: string
  story: string
}

interface TimelineStage {
  label: string
  description: string
}

interface WorkshopPainProps {
  headline: string
  description: string
  personas: readonly Persona[]
  timeline: {
    headline: string
    stages: readonly TimelineStage[]
  }
  closingNote: string
}

export function WorkshopPain({
  headline,
  description,
  personas,
  timeline,
  closingNote,
}: WorkshopPainProps) {
  return (
    <section className={styles.section} id="pain" aria-label="Problem">
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollRevealText text={headline} className={styles.headline} />
          <ScrollRevealText text={description} className={styles.description} />
        </div>

        <div className={styles.personas}>
          {personas.map((persona, i) => (
            <motion.article
              key={i}
              className={styles.persona}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <div className={styles.personaTopBorder} aria-hidden="true" />
              <span className={styles.personaRole}>{persona.role}</span>
              <blockquote className={styles.personaQuote}>
                <p>{persona.quote}</p>
              </blockquote>
              <p className={styles.personaStory}>{persona.story}</p>
            </motion.article>
          ))}
        </div>

        <div className={styles.timelineBlock}>
          <ScrollRevealText text={timeline.headline} className={styles.timelineHeadline} />
          <div className={styles.timeline}>
            {timeline.stages.map((stage, i) => (
              <motion.div
                key={i}
                className={styles.stage}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, ease, delay: i * 0.07 }}
              >
                <div className={styles.stageLeft}>
                  <span className={styles.stageNum}>{String(i + 1).padStart(2, '0')}</span>
                  {i < timeline.stages.length - 1 && (
                    <span className={styles.stageLine} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.stageRight}>
                  <span className={styles.stageLabel}>{stage.label}</span>
                  <p className={styles.stageDesc}>{stage.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          className={styles.closingNote}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          {closingNote}
        </motion.p>
      </div>
    </section>
  )
}
