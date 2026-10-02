'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ProductDemo } from './ProductDemo'
import { useReducedMotion } from './useReducedMotion'
import { copy } from './copy'
import { pagePath } from './paths'
import styles from './TokenomicsAi.module.scss'

const stories = [
  [copy('You describe the project'), copy('Name, sector, stage, goal'), copy('The 8Blocks scoring engine flags structural risks and refines the model. You get the refined design and a report for your data room.')],
  [copy('AI asks what matters'), copy('A short dialogue fills the gaps'), copy('Tell us about your planned raise, funding rounds, and any allocations already promised. AI asks the questions a form cannot.')],
  [copy('Model is generated'), copy('Allocations + vesting'), copy('AI drafts eight allocation buckets and vesting schedules. The scoring engine tests unlock spikes and refines the model against category benchmarks.')],
  [copy('You get the package'), copy('Ready for your data room'), copy('Your refined model, Structure Score, and branded investor PDF — together in one investor-ready package.')],
]
const markerCircumference = 2 * Math.PI * 20

export function StickyStory({ onRequest }: { onRequest: () => void }) {
  const wrapperRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const wrapper = wrapperRef.current
    const stage = stageRef.current
    if (!wrapper || !stage) return
    let frame = 0
    let start = 0
    let distance = 1
    const measure = () => {
      if (window.matchMedia('(max-width: 760px)').matches) {
        const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 57
        const availableHeight = document.documentElement.clientHeight - headerHeight
        const top = headerHeight + Math.max(24, (availableHeight - stage.offsetHeight) / 2)
        stage.style.setProperty('--story-sticky-top', `${top}px`)
      } else {
        stage.style.removeProperty('--story-sticky-top')
      }
      const wrapperStyle = getComputedStyle(wrapper)
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0
      const padding = parseFloat(wrapperStyle.paddingTop) || 0
      const bottomPadding = parseFloat(wrapperStyle.paddingBottom) || 0
      // Scale the full pinned travel, including the responsive stage-height offset.
      const baseHeight = window.matchMedia('(max-width: 760px)').matches ? 640 : 709
      wrapper.style.setProperty('--story-extra-scroll', `${(baseHeight - stage.offsetHeight - padding - bottomPadding) * 1.5}px`)
      start = wrapper.getBoundingClientRect().top + window.scrollY + padding - stickyTop
      distance = Math.max(1, wrapper.offsetHeight - stage.offsetHeight - padding - bottomPadding)
    }
    const update = () => {
      frame = 0
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance))
      const next = Math.min(stories.length - 1, Math.floor(progress * stories.length))
      if (activeRef.current !== next) {
        activeRef.current = next
        setActive(next)
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const resize = () => { measure(); schedule() }
    const observer = new ResizeObserver(resize)
    observer.observe(wrapper)
    observer.observe(stage)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section ref={wrapperRef} className={styles.storySection} aria-label={copy('How Tokenomics AI works')}>
      <div ref={stageRef} className={styles.storyStage}>
        <div className={styles.storyContent} data-story-step={active}>
          <div className={styles.storyRail} aria-hidden="true">
            <div className={styles.storyMarker}>
              <motion.i className={styles.storyPulse} animate={{ boxShadow: reducedMotion ? '0 0 0 0 #f00b5f00' : ['0 0 0 0 #f00b5f00', '0 0 0 8px #f00b5f18', '0 0 0 12px #f00b5f00'] }} key={active} transition={{ duration: reducedMotion ? 0 : .65 }} />
              <svg className={styles.storyRing} viewBox="0 0 44 44"><motion.circle cx="22" cy="22" r="20" strokeDasharray={markerCircumference} strokeLinecap="round" initial={false} animate={{ strokeDashoffset: markerCircumference * (1 - (active + 1) / stories.length) }} transition={{ duration: reducedMotion ? 0 : .55, ease: 'easeOut' }} /></svg>
              <div className={styles.storyNumber}><AnimatePresence initial={false}><motion.span key={active} initial={{ y: reducedMotion ? 0 : 18, opacity: 0, rotateX: reducedMotion ? 0 : -70 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: reducedMotion ? 0 : -18, opacity: 0, rotateX: reducedMotion ? 0 : 70 }} transition={{ duration: reducedMotion ? 0 : .35 }}>{active + 1}</motion.span></AnimatePresence></div>
            </div>
          </div>
          <div className={styles.storyText}>
            {stories.map(([title, subtitle, description], index) => (
              <motion.div key={title} className={styles.storyCopy} aria-hidden={index !== active} initial={false} animate={{ opacity: index === active ? 1 : 0, y: reducedMotion || index === active ? 0 : index < active ? -12 : 12 }} transition={{ duration: reducedMotion ? 0 : 0.4 }}>
                <h2>{title}</h2>
                <p className={styles.storySubtitle}>{subtitle}</p>
                <p className={styles.storyDescription}>{description}</p>
              </motion.div>
            ))}
          </div>
          <div className={styles.storyActions}><button type="button" className={styles.primary} onClick={onRequest}>{copy('Request early access')}</button><a className={styles.secondary} href={pagePath('/contact')}>{copy('Contact sales')}</a></div>
        </div>
        <ProductDemo />
      </div>
    </section>
  )
}
