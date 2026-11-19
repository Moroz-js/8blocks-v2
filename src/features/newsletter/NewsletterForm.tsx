'use client'

import { useState } from 'react'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { apiPath } from '@/shared/lib/apiPath'
import styles from './NewsletterForm.module.scss'

type Status = 'idle' | 'loading' | 'success' | 'error'

export interface NewsletterFormText {
  placeholder: string
  submit: string
  success: string
  error: string
}

export function NewsletterForm({ text }: { text: NewsletterFormText }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(apiPath('/api/newsletter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const raw = await res.text()
      let data: { success?: boolean; error?: string } = {}
      try {
        data = JSON.parse(raw) as { success?: boolean; error?: string }
      } catch {
        throw new Error(text.error)
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || text.error)
      }

      setStatus('success')
      trackPlatformEvent('form_submit', { form_id: 'newsletter', status: 'success' })
    } catch (err) {
      setStatus('error')
      trackPlatformEvent('form_submit', { form_id: 'newsletter', status: 'error' })
      setErrorMsg(err instanceof Error ? err.message : text.error)
    }
  }

  if (status === 'success') {
    return (
      <p className={styles.success} role="status" aria-live="polite">
        {text.success}
      </p>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <input
          name="email"
          type="email"
          className={styles.input}
          placeholder={text.placeholder}
          aria-label={text.placeholder}
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'loading' || !email.trim()}
          aria-busy={status === 'loading'}
          aria-label={text.submit}
        >
          {status === 'loading' ? <span className={styles.spinner} aria-hidden="true" /> : <span aria-hidden="true">→</span>}
        </button>
      </div>
      {status === 'error' && (
        <p className={styles.error} role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  )
}
