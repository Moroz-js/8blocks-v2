'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { platformPagesContent } from '@/shared/content/platformPages'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import styles from './Platform.module.scss'

const content = platformPagesContent.ai
const TOOL = 'tokenomics_ai'

const demoValues = [
  ['Project', 'Nova Protocol'],
  ['Sector', 'DeFi'],
  ['Stage', 'Pre-TGE'],
  ['Goal', 'Investor round'],
]

function DemoPanel({ phase, tick }: { phase: number; tick: number }) {
  if (phase === 0) {
    return (
      <div className={styles.options}>
        {demoValues.slice(0, Math.min(tick + 1, demoValues.length)).map(
          ([key, value]) => (
            <div key={key} className={`${styles.option} ${styles.spread}`}>
              <span className={styles.label}>{key}</span>
              <span className={styles.mono}>{value}</span>
            </div>
          ),
        )}
      </div>
    )
  }
  if (phase === 1) {
    return (
      <div className={styles.options}>
        {[
          'AI: Planned raise size and rounds?',
          'You: $2M seed, then a community round',
          'AI: Any allocations already promised?',
        ]
          .slice(0, Math.min(tick + 1, 3))
          .map((line) => (
            <div key={line} className={styles.option}>
              {line}
            </div>
          ))}
      </div>
    )
  }
  if (phase === 2) {
    return (
      <ul className={styles.list}>
        {[
          'drafting 8 allocation buckets',
          'checking committed investor allocation',
          'testing unlock spikes',
          'refining day-one float',
          'final Structure Score: 86',
        ]
          .slice(0, Math.min(tick + 1, 5))
          .map((line) => (
            <li key={line} className={styles.listItem}>
              {line}
            </li>
          ))}
      </ul>
    )
  }
  return (
    <div className={styles.resultStack}>
      <div className={styles.statValue}>86 · Rock Solid</div>
      {[
        ['Community allocation', 88],
        ['Day-one float', 82],
        ['Supply overhang', 84],
        ['Insider lock discipline', 100],
      ].map(([label, value]) => (
        <div key={String(label)}>
          <div className={styles.spread}>
            <span>{label}</span>
            <span className={styles.mono}>{value}</span>
          </div>
          <div className={styles.bar}>
            <div
              className={styles.barFill}
              style={{ width: `${Number(value)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PipelineDemo() {
  const [time, setTime] = useState(0)
  const phaseLengths = [4, 3, 5, 4]
  const total = phaseLengths.reduce((sum, length) => sum + length, 0)
  let remaining = time % total
  let phase = 0
  for (let index = 0; index < phaseLengths.length; index += 1) {
    if (remaining < phaseLengths[index]) {
      phase = index
      break
    }
    remaining -= phaseLengths[index]
  }

  useEffect(() => {
    const interval = window.setInterval(
      () => setTime((current) => current + 1),
      1300,
    )
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className={styles.demoGrid}>
      <div className={styles.demoSteps}>
        {content.demoSteps.map(([title, line], index) => (
          <div
            key={title}
            className={`${styles.demoStep} ${
              index === phase ? styles.demoStepActive : ''
            }`}
          >
            <span className={styles.mono}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{title}</h3>
            <p className={styles.fine}>{line}</p>
          </div>
        ))}
      </div>
      <div className={`${styles.card} ${styles.demoPanel}`}>
        <div className={styles.spread}>
          <span className={styles.label}>
            demo · {content.demoSteps[phase][0]}
          </span>
          <span className={styles.simulatedBadge}>{content.simulatedLabel}</span>
        </div>
        <DemoPanel phase={phase} tick={remaining} />
        <p className={styles.fine}>
          {content.simulationDisclaimer}
        </p>
      </div>
    </div>
  )
}

export function EarlyAccessCta({ label = content.request }: { label?: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [project, setProject] = useState('')
  const [goal, setGoal] = useState('')
  const [stage, setStage] = useState('')
  const [heard, setHeard] = useState('')
  const [state, setState] = useState<
    'idle' | 'sending' | 'done' | 'error'
  >('idle')
  const viewed = useRef(false)

  function openModal() {
    setOpen(true)
    trackPlatformEvent('cta_click', {
      tool: TOOL,
      target: 'early_access_modal',
    })
    if (!viewed.current) {
      viewed.current = true
      trackPlatformEvent('lead_form_view', {
        tool: TOOL,
        form: 'tokenomics_ai_early_access',
      })
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')
    const message = [
      'Tokenomics AI early access',
      `Project: ${project}`,
      `Goal: ${goal}`,
      `Stage: ${stage || 'Not specified'}`,
      `Source: ${heard || 'Not specified'}`,
    ].join('\n')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: project, email, message }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setState('done')
      trackPlatformEvent('lead_form_submit', {
        tool: TOOL,
        form: 'tokenomics_ai_early_access',
        goal,
        stage,
        heard,
      })
    } catch {
      setState('error')
    }
  }

  return (
    <>
      <button type="button" className={styles.primary} onClick={openModal}>
        {label} →
      </button>
      {open && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tokenomics-ai-modal-title"
          >
            <div className={styles.spread}>
              <div>
                <span className={styles.label}>{content.modalEyebrow}</span>
                <h2 id="tokenomics-ai-modal-title">{content.modalTitle}</h2>
              </div>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            {state === 'done' ? (
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>{content.success}</h3>
                <p className={styles.sectionLead}>{content.successText}</p>
                <Link href="/product/calculator" className={styles.secondary}>
                  {content.calculator} →
                </Link>
              </div>
            ) : (
              <form className={styles.form} onSubmit={submit}>
                <input
                  className={styles.input}
                  type="email"
                  required
                  placeholder={content.emailPlaceholder}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  required
                  placeholder={content.projectPlaceholder}
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                />
                <select
                  className={styles.input}
                  required
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                >
                  <option value="" disabled>
                    {content.goalPlaceholder}
                  </option>
                  {content.goals.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select
                  className={styles.input}
                  value={stage}
                  onChange={(event) => setStage(event.target.value)}
                >
                  <option value="" disabled>
                    {content.stagePlaceholder}
                  </option>
                  {content.stages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select
                  className={styles.input}
                  value={heard}
                  onChange={(event) => setHeard(event.target.value)}
                >
                  <option value="" disabled>
                    {content.heardPlaceholder}
                  </option>
                  {content.heard.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className={styles.primary}
                  disabled={state === 'sending'}
                >
                  {state === 'sending' ? content.sending : content.waitlist}
                </button>
                {state === 'error' && (
                  <p className={styles.error}>{content.error}</p>
                )}
                <p className={styles.fine}>{content.disclaimer}</p>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  )
}
