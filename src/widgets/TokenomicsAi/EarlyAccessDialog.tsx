'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, SelectField, TextField } from '@/shared/ds'
import { apiPath } from '@/shared/lib/apiPath'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import type { TokenomicsAiContent } from '@/shared/content/tokenomicsAi'
import { EARLY_ACCESS_HASH } from './earlyAccess'
import { LimitedPill } from './LimitedPill'
import styles from './TokenomicsAiPage.module.scss'

type Status = 'idle' | 'sending' | 'done' | 'error'

/** Early access form in a modal; opens from any link to EARLY_ACCESS_HASH. */
export function EarlyAccessDialog({ copy, limited }: { copy: TokenomicsAiContent['form']; limited: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const viewed = useRef(false)
  const submitting = useRef(false)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const open = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(`a[href$="${EARLY_ACCESS_HASH}"]`)
      if (!link) return
      event.preventDefault()
      dialog.current?.showModal()
      trackPlatformEvent('cta_click', { tool: 'tokenomics_ai', target: 'early_access_modal' })
      if (!viewed.current) {
        viewed.current = true
        trackPlatformEvent('lead_form_view', { tool: 'tokenomics_ai', form: 'tokenomics_ai_early_access' })
      }
    }
    // Capture phase: runs before next/link, which then skips the prevented click.
    document.addEventListener('click', open, true)
    return () => document.removeEventListener('click', open, true)
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setStatus('sending')
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? '').trim()
    const project = value('project')
    const email = value('email')
    const goal = value('goal')
    const stage = value('stage')
    const heard = value('heard')
    try {
      const response = await fetch(apiPath('/api/contact'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: project,
          email,
          message: [
            copy.messageTitle,
            `${copy.messageProject}: ${project}`,
            `${copy.messageGoal}: ${goal}`,
            `${copy.messageStage}: ${stage || copy.notSpecified}`,
            `${copy.messageSource}: ${heard || copy.notSpecified}`,
          ].join('\n'),
        }),
      })
      if (!response.ok) throw new Error('Unable to send request')
      setStatus('done')
      trackPlatformEvent('lead_form_submit', { tool: 'tokenomics_ai', form: 'tokenomics_ai_early_access', goal, stage, heard })
    } catch {
      setStatus('error')
    } finally {
      submitting.current = false
    }
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="ai-access-title"
      data-lenis-prevent
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close()
      }}
    >
      <div className={styles.dialogBody}>
        <button type="button" className={styles.dialogClose} aria-label={copy.close} onClick={() => dialog.current?.close()}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {status === 'done' ? (
          <div className={styles.dialogDone} role="status">
            <h2 id="ai-access-title" className={styles.dialogTitle}>
              {copy.successTitle}
            </h2>
            <p className={styles.dialogNote}>{copy.successText}</p>
          </div>
        ) : (
          <form className={styles.dialogForm} onSubmit={submit}>
            <LimitedPill>{limited}</LimitedPill>
            <h2 id="ai-access-title" className={styles.dialogTitle}>
              {copy.title}
            </h2>
            <TextField
              type="email"
              name="email"
              label={copy.email}
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
              required
              maxLength={254}
            />
            <TextField name="project" label={copy.project} placeholder={copy.projectPlaceholder} required maxLength={200} />
            <SelectField name="goal" label={copy.goal} placeholder={copy.goalPlaceholder} options={copy.goals} required />
            <SelectField name="stage" label={copy.stage} placeholder={copy.stagePlaceholder} options={copy.stages} />
            <SelectField name="heard" label={copy.heard} placeholder={copy.heardPlaceholder} options={copy.sources} />
            {status === 'error' && (
              <p className={styles.dialogError} role="alert">
                {copy.error}
              </p>
            )}
            <Button type="submit" fullWidth disabled={status === 'sending'}>
              {status === 'sending' ? copy.sending : copy.submit}
            </Button>
            <p className={styles.dialogNote}>{copy.note}</p>
          </form>
        )}
      </div>
    </dialog>
  )
}
