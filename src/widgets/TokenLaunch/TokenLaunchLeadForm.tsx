'use client'

import { useState } from 'react'
import { tokenLaunchContent } from '@/shared/content/tokenLaunch'
import styles from './TokenLaunch.module.scss'

const { form: formContent } = tokenLaunchContent

type Status = 'idle' | 'loading' | 'success' | 'error'

interface TokenLaunchLeadFormProps {
  idPrefix: string
  submitLabel: string
  /** Дополнительные строки в сообщение лида (модули, расчёт калькулятора) */
  extraMessage?: () => string
}

export function TokenLaunchLeadForm({ idPrefix, submitLabel, extraMessage }: TokenLaunchLeadFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const name = ((formData.get('name') as string) || '').trim()
    const company = ((formData.get('company') as string) || '').trim()
    const email = ((formData.get('email') as string) || '').trim()
    const telegram = ((formData.get('telegram') as string) || '').trim()
    const stage = ((formData.get('stage') as string) || '').trim()
    const task = ((formData.get('task') as string) || '').trim()

    if (!name || !company || !email) {
      setStatus('error')
      setErrorMsg(formContent.requiredError)
      return
    }

    const lines: string[] = []
    if (task) lines.push(task, '')
    lines.push(`${formContent.companyLine}: ${company}`)
    if (telegram) lines.push(`${formContent.telegramLine}: ${telegram}`)
    if (stage) lines.push(`${formContent.stageLine}: ${stage}`)
    const extra = extraMessage?.()
    if (extra) lines.push(extra)
    lines.push(formContent.sourceLine)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: lines.join('\n') }),
      })
      const raw = await res.text()
      let data: { success?: boolean; error?: string } = {}
      try {
        data = JSON.parse(raw) as { success?: boolean; error?: string }
      } catch {
        throw new Error(formContent.errorFallback)
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || formContent.errorFallback)
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : formContent.errorFallback)
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.formSuccess} role="status" aria-live="polite">
        <div className={styles.formSuccessIcon} aria-hidden="true">✓</div>
        <p className={styles.formSuccessTitle}>{formContent.successTitle}</p>
        <p className={styles.formSuccessBody}>{formContent.successBody}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-name`} className={styles.fieldLabel}>
            {formContent.nameLabel}
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            type="text"
            className={styles.input}
            placeholder={formContent.namePlaceholder}
            required
            autoComplete="name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-company`} className={styles.fieldLabel}>
            {formContent.companyLabel}
          </label>
          <input
            id={`${idPrefix}-company`}
            name="company"
            type="text"
            className={styles.input}
            placeholder={formContent.companyPlaceholder}
            required
            autoComplete="organization"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-email`} className={styles.fieldLabel}>
            {formContent.emailLabel}
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            className={styles.input}
            placeholder={formContent.emailPlaceholder}
            required
            autoComplete="email"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-telegram`} className={styles.fieldLabel}>
            {formContent.telegramLabel}{' '}
            <span className={styles.fieldOptional}>({formContent.telegramOptional})</span>
          </label>
          <input
            id={`${idPrefix}-telegram`}
            name="telegram"
            type="text"
            className={styles.input}
            placeholder={formContent.telegramPlaceholder}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${idPrefix}-stage`} className={styles.fieldLabel}>
          {formContent.stageLabel}
        </label>
        <select id={`${idPrefix}-stage`} name="stage" className={styles.select} defaultValue="">
          <option value="" disabled>
            {formContent.stagePlaceholder}
          </option>
          {formContent.stageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${idPrefix}-task`} className={styles.fieldLabel}>
          {formContent.taskLabel}
        </label>
        <textarea
          id={`${idPrefix}-task`}
          name="task"
          className={styles.textarea}
          placeholder={formContent.taskPlaceholder}
          rows={4}
        />
      </div>

      {status === 'error' && (
        <p className={styles.formError} role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        className={styles.ctaPrimary}
        style={{ alignSelf: 'flex-start' }}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            {formContent.sendingLabel}
          </>
        ) : (
          <>
            {submitLabel}
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  )
}
