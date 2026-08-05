'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { t } from '@/shared/i18n'
import { copy } from './copy'
import styles from './TokenLab.module.scss'

export interface WorstDimension {
  name: string
  score: number
}

const framingCopy = t({
  ru: {
    worstTitle: '{name} — самое слабое измерение модели.',
    worstText:
      'Результаты показывают, где именно возникает риск. С этого начинается экспертная доработка.',
    strongTitle: 'Сильная структура. Подготовьте её к проверке инвесторами.',
    strongText:
      'Экспертная проверка подтвердит модель до того, как вы покажете её рынку.',
    weakTitle: 'Мы нашли реальные точки давления. Исправьте их до запуска.',
    weakText:
      'Полный аудит поможет закрыть риски и проверить модель спроса и стимулов.',
  },
  en: {
    worstTitle: '{name} is your weakest dimension.',
    worstText:
      'The results show where the structure breaks. This is the first thing an expert pass fixes.',
    strongTitle: 'Strong structure. Make it investor-proof.',
    strongText:
      'An expert pass confirms the model before you put it in front of investors.',
    weakTitle: 'Real pressure points found. Fix them before launch.',
    weakText:
      'A full audit closes structural risks and checks demand and incentives.',
  },
})

const BRIEF_FIELDS = [
  { id: 'stage', label: copy.cta.stage, options: copy.cta.stageOptions },
  {
    id: 'timeline',
    label: copy.cta.timeline,
    options: copy.cta.timelineOptions,
  },
  { id: 'heard', label: copy.cta.heard, options: copy.cta.heardOptions },
] as const

export function CtaLadder({
  grade,
  score,
  worst,
}: {
  grade: string
  score: number
  worst?: WorstDimension | null
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [project, setProject] = useState('')
  const [brief, setBrief] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>(
    'idle',
  )
  const viewedRef = useRef(false)
  const heading = worst
    ? framingCopy.worstTitle.replace('{name}', worst.name)
    : score >= 70
      ? framingCopy.strongTitle
      : framingCopy.weakTitle
  const subheading = worst
    ? framingCopy.worstText
    : score >= 70
      ? framingCopy.strongText
      : framingCopy.weakText
  const utm = `?utm_source=tokenlab&utm_campaign=tier_${encodeURIComponent(grade)}${
    worst ? `&utm_content=${encodeURIComponent(worst.name)}` : ''
  }`

  useEffect(() => {
    if (viewedRef.current) return
    viewedRef.current = true
    trackPlatformEvent('fakedoor_view', {
      offer: 'ai_token_model_sprint',
      grade,
    })
  }, [grade])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: project || 'Token Lab lead',
          email,
          message: [
            'Source: AI Token Model Sprint waitlist',
            `Structure tier: ${grade}`,
            ...Object.entries(brief).map(([key, value]) => `${key}: ${value}`),
          ].join('\n'),
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setState('done')
      trackPlatformEvent('lead_form_submit', {
        form: 'fakedoor_ai_sprint',
        grade,
        ...brief,
      })
    } catch {
      setState('error')
    }
  }

  return (
    <section>
      <div className={styles.label}>{copy.cta.label}</div>
      <h2>{heading}</h2>
      <p className={styles.ctaIntro}>{subheading}</p>
      <div className={styles.ctaGrid}>
        <article
          className={`${styles.card} ${styles.cardAccent} ${styles.ctaCard}`}
        >
          <span className={styles.label}>{copy.cta.auditPrice}</span>
          <h3>{copy.cta.auditTitle}</h3>
          <p>{copy.cta.auditText}</p>
          <div className={styles.ctaFooter}>
            <a
              href={`/services/audit${utm}`}
              onClick={() =>
                trackPlatformEvent('cta_click', { target: 'audit', grade })
              }
              className={styles.linkButton}
            >
              {copy.cta.auditAction}
            </a>
          </div>
        </article>
        <article className={`${styles.card} ${styles.ctaCard}`}>
          <span className={styles.label}>{copy.cta.workshopPrice}</span>
          <h3>{copy.cta.workshopTitle}</h3>
          <p>{copy.cta.workshopText}</p>
          <div className={styles.ctaFooter}>
            <a
              href={`/product/workshop${utm}`}
              onClick={() =>
                trackPlatformEvent('cta_click', { target: 'workshop', grade })
              }
              className={styles.linkButton}
            >
              {copy.cta.workshopAction}
            </a>
          </div>
        </article>
        <article className={`${styles.card} ${styles.ctaCard}`}>
          <span className={styles.label}>{copy.cta.sprintPrice}</span>
          <h3>{copy.cta.sprintTitle}</h3>
          <p>{copy.cta.sprintText}</p>
          <div className={styles.ctaFooter}>
            {!formOpen ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setFormOpen(true)
                  trackPlatformEvent('cta_click', {
                    target: 'ai_token_model_sprint',
                    grade,
                  })
                  trackPlatformEvent('lead_form_view', {
                    form: 'fakedoor_ai_sprint',
                  })
                }}
              >
                {copy.cta.waitlist}
              </Button>
            ) : state === 'done' ? (
              <p className={styles.good}>{copy.cta.done}</p>
            ) : (
              <form onSubmit={submit} className={styles.form}>
                <input
                  type="email"
                  required
                  placeholder={copy.cta.email}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={styles.input}
                  aria-label="Email"
                />
                <input
                  type="text"
                  placeholder={copy.cta.project}
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  className={styles.input}
                  aria-label={copy.cta.project}
                />
                {BRIEF_FIELDS.map((field) => (
                  <select
                    key={field.id}
                    value={brief[field.id] ?? ''}
                    onChange={(event) =>
                      setBrief((value) => ({
                        ...value,
                        [field.id]: event.target.value,
                      }))
                    }
                    className={styles.select}
                    aria-label={field.label}
                  >
                    <option value="" disabled>
                      {field.label}…
                    </option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ))}
                <Button
                  type="submit"
                  variant="secondary"
                  loading={state === 'sending'}
                >
                  {copy.cta.waitlist}
                </Button>
                {state === 'error' && (
                  <span className={styles.bad}>{copy.cta.error}</span>
                )}
                <span className={styles.fine}>{copy.cta.privacy}</span>
              </form>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
