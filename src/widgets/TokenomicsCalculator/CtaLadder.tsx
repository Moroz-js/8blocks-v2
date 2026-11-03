'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Button } from '@/shared/ds'
import gradient from './assets/steps-gradient.webp'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { apiPath } from '@/shared/lib/apiPath'
import { t } from '@/shared/i18n'
import { copy } from './copy'
import styles from './Results.module.scss'

export interface WorstDimension {
  name: string
  score: number
}

const framingCopy = t({
  ru: {
    worstTitle: '{name} — самое слабое измерение модели.',
    worstText: 'Результаты показывают, где именно возникает риск. С этого начинается экспертная доработка.',
    strongTitle: 'Сильная структура. Подготовьте её к проверке инвесторами.',
    strongText: 'Экспертная проверка подтвердит модель до того, как вы покажете её рынку.',
    weakTitle: 'Мы нашли реальные точки давления. Исправьте их до запуска.',
    weakText: 'Полный аудит поможет закрыть риски и проверить модель спроса и стимулов.',
    leadName: 'Заявка Token Lab',
    leadSource: 'Источник: лист ожидания AI Token Model Sprint',
    leadTier: 'Уровень структуры',
  },
  en: {
    worstTitle: '{name} is your weakest dimension.',
    worstText: 'The results show where the structure breaks. This is the first thing an expert pass fixes.',
    strongTitle: 'Strong structure. Make it investor-proof.',
    strongText: 'An expert pass confirms the model before you put it in front of investors.',
    weakTitle: 'Real pressure points found. Fix them before launch.',
    weakText: 'A full audit closes structural risks and checks demand and incentives.',
    leadName: 'Token Lab lead',
    leadSource: 'Source: AI Token Model Sprint waitlist',
    leadTier: 'Structure tier',
  },
})

const BRIEF_FIELDS = [
  { id: 'stage', label: copy.cta.stage, options: copy.cta.stageOptions },
  { id: 'timeline', label: copy.cta.timeline, options: copy.cta.timelineOptions },
  { id: 'heard', label: copy.cta.heard, options: copy.cta.heardOptions },
] as const

/** «Where to go from here»: audit, workshop and the AI Token Model Sprint waitlist. */
export function CtaLadder({ grade, score, worst }: { grade: string; score: number; worst?: WorstDimension | null }) {
  const [formOpen, setFormOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [project, setProject] = useState('')
  const [brief, setBrief] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const viewedRef = useRef(false)
  const heading = worst
    ? framingCopy.worstTitle.replace('{name}', worst.name)
    : score >= 70
      ? framingCopy.strongTitle
      : framingCopy.weakTitle
  const subheading = worst ? framingCopy.worstText : score >= 70 ? framingCopy.strongText : framingCopy.weakText
  const utm = `?utm_source=tokenlab&utm_campaign=tier_${encodeURIComponent(grade)}${
    worst ? `&utm_content=${encodeURIComponent(worst.name)}` : ''
  }`

  useEffect(() => {
    if (viewedRef.current) return
    viewedRef.current = true
    trackPlatformEvent('fakedoor_view', { offer: 'ai_token_model_sprint', grade })
  }, [grade])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')
    try {
      const response = await fetch(apiPath('/api/contact'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: project || framingCopy.leadName,
          email,
          message: [
            framingCopy.leadSource,
            `${framingCopy.leadTier}: ${grade}`,
            ...Object.entries(brief).map(([key, value]) => `${BRIEF_FIELDS.find((field) => field.id === key)?.label ?? key}: ${value}`),
          ].join('\n'),
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setState('done')
      trackPlatformEvent('lead_form_submit', { form: 'fakedoor_ai_sprint', grade, ...brief })
    } catch {
      setState('error')
    }
  }

  return (
    <section className={styles.ladder}>
      <p className={styles.eyebrow}>{copy.cta.label}</p>
      <h3 className={styles.ladderTitle}>{heading}</h3>
      <p className={styles.body}>{subheading}</p>
      <div className={styles.offers}>
        <article className={clsx(styles.card, styles.offer, styles.offerAccent)}>
          <Image src={gradient} alt="" fill sizes="(max-width: 1024px) 100vw, 400px" className={styles.offerBg} />
          <p className={styles.eyebrow}>{copy.cta.auditPrice}</p>
          <h4 className={styles.offerTitle}>{copy.cta.auditTitle}</h4>
          <p className={styles.body}>{copy.cta.auditText}</p>
          <Button
            variant="tertiary"
            href={`/services/audit${utm}`}
            onClick={() => trackPlatformEvent('cta_click', { target: 'audit', grade })}
          >
            {copy.cta.auditAction}
          </Button>
        </article>
        <article className={clsx(styles.card, styles.offer)}>
          <p className={styles.eyebrow}>{copy.cta.workshopPrice}</p>
          <h4 className={styles.offerTitle}>{copy.cta.workshopTitle}</h4>
          <p className={styles.body}>{copy.cta.workshopText}</p>
          <Button
            variant="secondary"
            href={`/product/workshop${utm}`}
            onClick={() => trackPlatformEvent('cta_click', { target: 'workshop', grade })}
          >
            {copy.cta.workshopAction}
          </Button>
        </article>
        <article className={clsx(styles.card, styles.offer)}>
          <p className={styles.eyebrow}>{copy.cta.sprintPrice}</p>
          <h4 className={styles.offerTitle}>{copy.cta.sprintTitle}</h4>
          <p className={styles.body}>{copy.cta.sprintText}</p>
          {!formOpen ? (
            <Button
              variant="secondary"
              onClick={() => {
                setFormOpen(true)
                trackPlatformEvent('cta_click', { target: 'ai_token_model_sprint', grade })
                trackPlatformEvent('lead_form_view', { form: 'fakedoor_ai_sprint' })
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
                maxLength={200}
                className={styles.input}
                aria-label={copy.cta.project}
              />
              {BRIEF_FIELDS.map((field) => (
                <select
                  key={field.id}
                  value={brief[field.id] ?? ''}
                  onChange={(event) => setBrief((value) => ({ ...value, [field.id]: event.target.value }))}
                  className={styles.input}
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
              <Button type="submit" variant="secondary" disabled={state === 'sending'}>
                {copy.cta.waitlist}
              </Button>
              {state === 'error' && <span className={styles.bad}>{copy.cta.error}</span>}
              <span className={styles.note}>{copy.cta.privacy}</span>
            </form>
          )}
        </article>
      </div>
    </section>
  )
}
