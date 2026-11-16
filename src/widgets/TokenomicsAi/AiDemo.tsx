'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AccentSurface } from '@/shared/ds'
import type { TokenomicsAiContent } from '@/shared/content/tokenomicsAi'
import styles from './TokenomicsAiPage.module.scss'

type DemoCopy = TokenomicsAiContent['steps']['demo']

/** Monthly unlocks with two spikes the scoring engine flags. */
const UNLOCKS = [18, 22, 26, 64, 30, 34, 38, 82, 40, 42, 44, 46]

const WELCOME = 2
const STEP_MS = { welcome: [1500, 1900], message: 2300, output: [2600, 2600, 2800, 4800] }
const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }

/**
 * The production page's product demo, on design system v2: greeting, the typed request,
 * the dialogue, then the generated model. Loops while on screen; reduced motion shows the result.
 */
export function AiDemo({ copy }: { copy: DemoCopy }) {
  const rootRef = useRef<HTMLElement>(null)
  // Read after mount: the server render always starts at the greeting.
  const [reduced, setReduced] = useState(false)
  const [phase, setPhase] = useState(0)
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const outputStart = WELCOME + copy.messages.length
  const phases = outputStart + STEP_MS.output.length
  const shown = reduced ? phases - 1 : phase
  const output = shown - outputStart
  const count = Math.max(0, Math.min(copy.messages.length, shown - WELCOME + 1))

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || paused || reduced) return
    const delay =
      phase < WELCOME ? STEP_MS.welcome[phase] : phase < outputStart ? STEP_MS.message : STEP_MS.output[phase - outputStart]
    const timer = window.setTimeout(() => setPhase((current) => (current + 1) % phases), delay)
    return () => window.clearTimeout(timer)
  }, [phase, visible, paused, reduced, outputStart, phases])

  const transition = { duration: reduced ? 0 : 0.45, ease: 'easeOut' as const }

  return (
    <figure ref={rootRef} className={styles.demo}>
      <div className={styles.demoStage} role="img" aria-label={copy.label}>
        <AccentSurface />
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.windowDots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>8Blocks AI</span>
          </div>
          <div className={styles.windowBody} aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              {shown < WELCOME && (
                <motion.div key="welcome" className={styles.windowChat} {...fade} transition={transition}>
                  <span className={styles.orb} />
                  <p className={styles.greeting}>{copy.greeting}</p>
                </motion.div>
              )}
              {shown >= WELCOME && output < 0 && (
                <motion.div key="chat" className={styles.messages} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
                  {copy.messages.slice(0, count).map((message, i) => (
                    <motion.p
                      key={i}
                      layout={!reduced}
                      className={message.user ? styles.messageUser : styles.messageAi}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={transition}
                    >
                      {message.text}
                    </motion.p>
                  ))}
                </motion.div>
              )}
              {output >= 0 && output < 3 && (
                <motion.div key={`output-${output}`} className={styles.windowChat} {...fade} transition={transition}>
                  {output === 0 && <span className={styles.donut} />}
                  {output === 1 && (
                    <span className={styles.unlocks}>
                      {UNLOCKS.map((height, i) => (
                        <i key={i} style={{ height: `${height}%` }} data-spike={height > 60 || undefined} />
                      ))}
                    </span>
                  )}
                  {output === 2 && <span className={styles.progress}>99%</span>}
                  <p className={styles.greeting}>{[copy.drafting, copy.testing, copy.pdf][output]}</p>
                </motion.div>
              )}
              {output === 3 && (
                <motion.div key="model" className={styles.modelStage} {...fade} transition={transition}>
                  <span className={styles.donut} />
                  <div className={styles.model}>
                    <p className={styles.modelHead}>
                      <span className={styles.modelName}>{copy.project}</span>
                      <span className={styles.modelMeta}>{copy.meta}</span>
                    </p>
                    <span className={styles.modelBar}>
                      {[18, 14, 10, 22, 16, 20].map((flex, i) => (
                        <i key={i} style={{ flex }} />
                      ))}
                    </span>
                    <p className={styles.modelMeta}>{copy.ready}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className={styles.demoInput} data-typed={shown === 1 || undefined}>
          {shown === 1 ? copy.request : output >= 0 ? copy.ask : copy.input}
        </p>
      </div>
      <figcaption className={styles.demoFoot}>
        <span className={styles.demoNote}>{copy.note}</span>
        {!reduced && (
          <button type="button" className={styles.demoToggle} onClick={() => setPaused((value) => !value)}>
            {paused ? copy.play : copy.pause}
          </button>
        )}
      </figcaption>
    </figure>
  )
}
