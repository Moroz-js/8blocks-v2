'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import { SectionHead } from './SectionHead'
import styles from './DigitalAssets.module.scss'

const ease = 'easeOut' as const
const { journey } = digitalAssetsContent

export function DigitalAssetsJourney() {
  const [activeStep, setActiveStep] = useState(-1)
  const timelineRef = useRef<HTMLDivElement>(null)
  const startMarkerRef = useRef<HTMLSpanElement>(null)
  const endMarkerRef = useRef<HTMLSpanElement>(null)
  const stepElements = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    const updateActiveStep = () => {
      const checkpoint = window.innerHeight * 0.6
      const nextActiveStep = stepElements.current.reduce(
        (lastActiveStep, step, index) =>
          step && step.getBoundingClientRect().top <= checkpoint ? index : lastActiveStep,
        -1,
      )

      setActiveStep(nextActiveStep)

      const timeline = timelineRef.current
      const startMarker = startMarkerRef.current
      const endMarker = endMarkerRef.current

      if (!timeline || !startMarker || !endMarker) return

      const timelineTop = timeline.getBoundingClientRect().top
      const start = startMarker.getBoundingClientRect().top + startMarker.offsetHeight / 2 - timelineTop
      const end = endMarker.getBoundingClientRect().top + endMarker.offsetHeight / 2 - timelineTop
      const progress = Math.min(1, Math.max(0, (checkpoint - (timelineTop + start)) / (end - start)))

      timeline.style.setProperty('--journey-progress-height', `${(end - start) * progress}px`)
    }

    window.addEventListener('scroll', updateActiveStep, { passive: true })
    window.addEventListener('resize', updateActiveStep)
    updateActiveStep()

    return () => {
      window.removeEventListener('scroll', updateActiveStep)
      window.removeEventListener('resize', updateActiveStep)
    }
  }, [])

  return (
    <section id="journey" className={`${styles.section} ${styles.journeySection}`} aria-label={journey.label}>
      <div className={styles.inner}>
        <SectionHead
          label={journey.label}
          headline={journey.headline}
          description={journey.description}
        />

        <div ref={timelineRef} className={styles.journeyTimeline}>
          <motion.aside
            className={`${styles.journeySelfServe} ${activeStep >= 0 ? styles.journeySelfServeActive : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease }}
          >
            <span ref={startMarkerRef} className={styles.journeySelfServeNumber}>0</span>
            <div>
              <h3 className={styles.journeyTitle}>{journey.selfServe.title}</h3>
              <div className={styles.journeySelfServeLinks}>
                <a href={journey.selfServe.readinessHref} target="_blank" rel="noopener noreferrer">
                  {journey.selfServe.readinessLabel} →
                </a>
                <a href={journey.selfServe.casesHref} target="_blank" rel="noopener noreferrer">
                  {journey.selfServe.casesLabel} →
                </a>
              </div>
            </div>
          </motion.aside>

          <ol className={styles.journeyList}>
            {journey.steps.map((step, i) => (
              <motion.li
                key={i}
                ref={(element) => {
                  stepElements.current[i] = element
                }}
                className={`${styles.journeyStep} ${i <= activeStep ? styles.journeyStepActive : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              >
                <span
                  ref={i === journey.steps.length - 1 ? endMarkerRef : undefined}
                  className={styles.journeyNumber}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className={styles.journeyMain}>
                  <h3 className={styles.journeyTitle}>{step.title}</h3>
                  <p className={styles.journeyDescription}>{step.description}</p>
                  <p className={styles.journeyLeaveText}>
                    <span className={styles.journeyLeaveLabel}>{journey.leaveLabel}</span>{' '}
                    {step.leaveWith}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
