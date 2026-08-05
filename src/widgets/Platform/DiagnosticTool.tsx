'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { lang, t } from '@/shared/i18n'
import type {
  Answers,
  DiagnosticResult,
} from '@/shared/lib/platform/diagnostic/types'
import {
  decodeAnswers,
  encodeAnswers,
  evaluate,
  isComplete,
  PILLARS,
  QUESTIONS,
  SAMPLE_ANSWERS,
} from '@/shared/lib/platform/diagnostic/scoring'
import { downloadIcs } from '@/shared/lib/platform/diagnostic/ics'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { platformPagesContent } from '@/shared/content/platformPages'
import styles from './Platform.module.scss'

const TOOL = 'da_diagnostic'
const common = platformPagesContent.common

const pillarByQuestion: Record<string, string> = {
  business_type: t({ ru: 'Бизнес', en: 'Business' }),
  leverage: t({ ru: 'Актив', en: 'Asset' }),
  goal: t({ ru: 'Капитал', en: 'Capital' }),
  capital_need: t({ ru: 'Капитал', en: 'Capital' }),
  revenue: t({ ru: 'Бизнес', en: 'Business' }),
  financing: t({ ru: 'Капитал', en: 'Capital' }),
  timeline: t({ ru: 'Реализация', en: 'Execution' }),
}

function calendlyUrl(result: DiagnosticResult): string {
  const base =
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    (lang === 'ru' ? '/contact' : 'https://8blocks.io/contact')
  const pillars = result.pillars
    .map((pillar) => `${pillar.key} ${pillar.score}/${pillar.max}`)
    .join(', ')
  const params = new URLSearchParams({
    utm_source: TOOL,
    utm_campaign: result.verdict.id,
    a1: `Readiness assessment: ${result.verdict.name}. Pillars: ${pillars}.`,
  })
  return `${base}${base.includes('?') ? '&' : '?'}${params.toString()}`
}

function Verdict({
  result,
  answers,
  isSample,
  onRestart,
}: {
  result: DiagnosticResult
  answers: Answers
  isSample: boolean
  onRestart: () => void
}) {
  const [copied, setCopied] = useState(false)
  const { verdict, pillars, drivers } = result
  const notYet = verdict.id === 'not_yet'

  async function copyResult() {
    const url = `${window.location.origin}${window.location.pathname}?a=${encodeAnswers(answers)}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    trackPlatformEvent('share_link_created', {
      tool: TOOL,
      verdict: verdict.id,
    })
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className={styles.resultStack}>
      {isSample && <div className={styles.notice}>{common.sampleNotice}</div>}
      <section className={styles.resultHero}>
        <span className={styles.label}>{common.verdict}</span>
        <h2 className={styles.resultTitle}>{verdict.name}</h2>
        <p className={styles.muted}>{verdict.forWhom}</p>
        <p className={styles.description}>{verdict.summary}</p>
      </section>

      <section className={styles.card}>
        <span className={styles.label}>{common.pillars}</span>
        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => (
            <div key={pillar.key}>
              <div className={styles.spread}>
                <span>
                  {PILLARS.find((item) => item.key === pillar.key)?.label}
                </span>
                <span className={styles.mono}>
                  {pillar.score}/{pillar.max}
                </span>
              </div>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{ width: `${(pillar.score / pillar.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {drivers.length > 0 && (
          <div className={styles.drivers}>
            <p className={styles.label}>{common.drivers}</p>
            <ul className={styles.list}>
              {drivers.map((driver) => (
                <li key={driver} className={styles.listItem}>
                  {driver}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {notYet ? (
        <div className={styles.pillarGrid}>
          <section className={styles.card}>
            <span className={styles.label}>{common.instead}</span>
            <ul className={styles.list}>
              {verdict.insteadOptions?.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.card}>
            <span className={styles.label}>{common.recheck}</span>
            <ul className={styles.list}>
              {verdict.recheckWhen?.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => {
                downloadIcs()
                trackPlatformEvent('cta_click', {
                  tool: TOOL,
                  target: 'recheck_reminder',
                })
              }}
            >
              {common.reminder}
            </button>
          </section>
        </div>
      ) : (
        <section className={styles.card}>
          <span className={styles.label}>{common.phases}</span>
          <div className={styles.phaseGrid}>
            {verdict.phases.map((phase, index) => (
              <div key={phase.name} className={styles.card}>
                <span className={styles.mono}>
                  {String(index + 1).padStart(2, '0')} · {phase.duration}
                </span>
                <p>{phase.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.card}>
        <span className={styles.label}>{common.watchouts}</span>
        <ul className={styles.list}>
          {verdict.watchouts.map((item) => (
            <li key={item} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <span className={styles.label}>{common.firstStep}</span>
        <p className={styles.description}>{verdict.firstStep}</p>
        <div className={styles.actions}>
          <a
            href={calendlyUrl(result)}
            className={notYet ? styles.secondary : styles.primary}
            onClick={() =>
              trackPlatformEvent('cta_click', {
                tool: TOOL,
                target: 'discovery_call',
                verdict: verdict.id,
              })
            }
          >
            {common.book}
          </a>
          <button type="button" className={styles.secondary} onClick={copyResult}>
            {copied ? common.copied : common.copy}
          </button>
        </div>
      </section>

      <div className={styles.spread}>
        <button type="button" className={styles.secondary} onClick={onRestart}>
          ← {common.restart}
        </button>
        <p className={styles.fine}>{verdict.disclaimer}</p>
      </div>
    </div>
  )
}

export function DiagnosticTool() {
  const [answers, setAnswers] = useState<Answers>({})
  const [cursor, setCursor] = useState(0)
  const [isSample, setIsSample] = useState(false)
  const started = useRef(false)
  const completed = useRef(false)

  /* eslint-disable react-hooks/set-state-in-effect -- one-shot URL hydration on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sample = params.get('sample')
    if (sample) {
      setAnswers(
        sample === 'not-yet'
          ? SAMPLE_ANSWERS.notYet
          : SAMPLE_ANSWERS.assetBacked,
      )
      setIsSample(true)
      setCursor(QUESTIONS.length)
      trackPlatformEvent('sample_verdict_opened', { tool: TOOL, sample })
      return
    }
    const encoded = params.get('a')
    const shared = encoded ? decodeAnswers(encoded) : null
    if (shared) {
      setAnswers(shared)
      setCursor(QUESTIONS.length)
      trackPlatformEvent('shared_view_opened', { tool: TOOL })
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const done = cursor >= QUESTIONS.length && isComplete(answers)
  const result = useMemo(
    () => (done ? evaluate(answers) : null),
    [answers, done],
  )

  useEffect(() => {
    if (!result || completed.current || isSample) return
    completed.current = true
    trackPlatformEvent('tool_complete', {
      tool: TOOL,
      verdict: result.verdict.id,
    })
  }, [isSample, result])

  function select(questionId: string, optionId: string) {
    if (!started.current) {
      started.current = true
      trackPlatformEvent('tool_start', { tool: TOOL })
    }
    setAnswers((current) => ({ ...current, [questionId]: optionId }))
    trackPlatformEvent('tool_step', { tool: TOOL, step: questionId })
    setCursor((current) => current + 1)
  }

  function restart() {
    setAnswers({})
    setCursor(0)
    setIsSample(false)
    completed.current = false
    window.history.replaceState(null, '', window.location.pathname)
  }

  if (result) {
    return (
      <Verdict
        result={result}
        answers={answers}
        isSample={isSample}
        onRestart={restart}
      />
    )
  }

  const question = QUESTIONS[Math.min(cursor, QUESTIONS.length - 1)]
  return (
    <div>
      <div className={styles.progressMeta}>
        <span className={styles.mono}>
          {common.question} {cursor + 1} {common.of} {QUESTIONS.length}
        </span>
        <span className={styles.fine}>
          {platformPagesContent.readiness.privacy}
        </span>
      </div>
      <div className={styles.progress}>
        {QUESTIONS.map((item, index) => (
          <span
            key={item.id}
            className={`${styles.progressItem} ${
              index < cursor ? styles.progressDone : ''
            }`}
          />
        ))}
      </div>
      <section className={styles.questionCard}>
        <span className={styles.badge}>
          {t({ ru: 'Направление', en: 'Pillar' })} ·{' '}
          {pillarByQuestion[question.id]}
        </span>
        <h2 className={styles.questionTitle}>{question.title}</h2>
        {question.help && <p className={styles.muted}>{question.help}</p>}
        <div className={styles.options}>
          {question.options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className={styles.option}
              onClick={() => select(question.id, option.id)}
            >
              <span className={styles.optionCode}>
                {String.fromCharCode(65 + index)}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </section>
      {cursor > 0 && (
        <button
          type="button"
          className={styles.secondary}
          onClick={() => setCursor((current) => Math.max(0, current - 1))}
        >
          ← {common.previous}
        </button>
      )}
    </div>
  )
}
