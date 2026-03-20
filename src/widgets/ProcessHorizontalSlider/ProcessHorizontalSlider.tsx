'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import styles from './ProcessHorizontalSlider.module.scss'

export interface ProcessSliderStep {
  number: number
  title: string
  description: string
  duration?: string
}

interface ProcessHorizontalSliderProps {
  headline: string
  description?: string
  steps: readonly ProcessSliderStep[]
}

export function ProcessHorizontalSlider({ headline, description, steps }: ProcessHorizontalSliderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [scrollRange, setScrollRange] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      // Measure from the track itself (not trackWrap) so padding-left is accounted for
      const trackLeft = trackRef.current.getBoundingClientRect().left
      const excess = trackRef.current.scrollWidth - (window.innerWidth - trackLeft)
      setScrollRange(Math.max(0, excess))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -scrollRange])
  const x = useSpring(xRaw, { stiffness: 150, damping: 35, restDelta: 0.5 })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={{
        ['--scroll-range' as string]: `${scrollRange}px`,
        ['--scroll-range-buffered' as string]: `${Math.round(scrollRange * 2.5)}px`,
      }}
    >
      {/* Desktop: sticky pinned slider */}
      <div className={styles.sticky}>
        {/* Top: headline + progress bar */}
        <div className={styles.top}>
          <h2 className={styles.headline}>{headline}</h2>
          {description && <p className={styles.description}>{description}</p>}
          <div className={styles.progressTrack} aria-hidden="true">
            <motion.div className={styles.progressFill} style={{ width: progressWidth }} />
          </div>
        </div>

        {/* Bottom: overflowing card track — ref for measuring available width */}
        <div ref={rightRef} className={styles.trackWrap}>
          <motion.div ref={trackRef} className={styles.track} style={{ x }}>
            {steps.map((step) => (
              <article key={step.number} className={styles.card}>
                <span className={styles.cardNumber}>{String(step.number).padStart(2, '0')}</span>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardDescription}>{step.description}</p>
                </div>
                {step.duration && (
                  <span className={styles.chip}>{step.duration}</span>
                )}
              </article>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile: static vertical stack */}
      <div className={styles.mobileStack}>
        <h2 className={styles.mobileHeadline}>{headline}</h2>
        {description && <p className={styles.mobileDescription}>{description}</p>}
        <div className={styles.mobileCards}>
          {steps.map((step) => (
            <article key={step.number} className={styles.mobileCard}>
              <span className={styles.cardNumber}>{String(step.number).padStart(2, '0')}</span>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardDescription}>{step.description}</p>
              </div>
              {step.duration && (
                <span className={styles.chip}>{step.duration}</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
