'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import type { ReadinessContent } from '@/shared/content/readiness'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import {
  QUESTIONS,
  decodeAnswers,
  encodeAnswers,
  evaluate,
  type Answers,
} from '@/shared/lib/platform/readiness/scoring'
import { RESULT_PATH } from './paths'
import styles from './Quiz.module.scss'

const TOOL = 'da_diagnostic'
const NEXT_DELAY = 260
const FINISH_DELAY = 420
const LAST = QUESTIONS.length - 1

type Draft = Partial<Record<keyof Answers, string>>

/** Seven questions, one at a time; the last answer opens the result page. */
export function Quiz({ content }: { content: ReadinessContent['quiz'] }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Draft>({})
  const started = useRef(false)
  const timer = useRef<number>(undefined)

  /* eslint-disable react-hooks/set-state-in-effect -- one-shot URL hydration on mount («Edit» from the result) */
  useEffect(() => {
    const saved = decodeAnswers(new URLSearchParams(window.location.search).get('a'))
    if (saved) setAnswers(saved)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const question = QUESTIONS[step]
  const copy = content.questions[question.id] as {
    chip: string
    title: string
    help?: string
    options: Record<string, { label: string }>
  }

  function pick(option: string) {
    if (!started.current) {
      started.current = true
      trackPlatformEvent('tool_start', { tool: TOOL })
    }
    const next = { ...answers, [question.id]: option }
    setAnswers(next)
    trackPlatformEvent('tool_step', { tool: TOOL, step: question.id })
    window.clearTimeout(timer.current)
    if (step < LAST) {
      timer.current = window.setTimeout(() => setStep(step + 1), NEXT_DELAY)
      return
    }
    const complete = next as Answers
    const result = evaluate(complete)
    trackPlatformEvent('tool_complete', { tool: TOOL, verdict: result.status, path: result.path })
    timer.current = window.setTimeout(() => router.push(`${RESULT_PATH}?a=${encodeAnswers(complete)}`), FINISH_DELAY)
  }

  return (
    <div id="quiz" className={styles.card}>
      <div className={styles.progress}>
        <p aria-live="polite">
          {content.progress.replace('{n}', String(step + 1)).replace('{total}', String(QUESTIONS.length))}
        </p>
        <div className={styles.segments}>
          {QUESTIONS.map(({ id }, k) => {
            const reachable = k <= step || answers[id] !== undefined
            return (
              <button
                key={id}
                type="button"
                className={clsx(styles.segment, k < step && styles.done, k === step && styles.current)}
                disabled={!reachable}
                aria-label={content.progress.replace('{n}', String(k + 1)).replace('{total}', String(QUESTIONS.length))}
                aria-current={k === step ? 'step' : undefined}
                onClick={() => setStep(k)}
              />
            )
          })}
        </div>
      </div>

      <div className={styles.question}>
        <span className={styles.chip}>{copy.chip}</span>
        <h3 className={styles.title}>{copy.title}</h3>
        {copy.help && <p className={styles.help}>{copy.help}</p>}
      </div>

      <div className={styles.options}>
        {question.options.map((option, k) => {
          const selected = answers[question.id] === option
          return (
            <button
              key={option}
              type="button"
              className={clsx(styles.option, selected && styles.selected)}
              aria-pressed={selected}
              onClick={() => pick(option)}
            >
              <span className={styles.key}>{String.fromCharCode(65 + k)}</span>
              {copy.options[option].label}
            </button>
          )
        })}
      </div>

      <button type="button" className={styles.back} disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
        {content.previous}
      </button>
    </div>
  )
}
