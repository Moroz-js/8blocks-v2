'use client'

import { useState } from 'react'
import styles from './NewsletterForm.module.scss'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string)?.trim()

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const raw = await res.text()
      let data: { success?: boolean; error?: string } = {}
      try {
        data = JSON.parse(raw) as { success?: boolean; error?: string }
      } catch {
        throw new Error('Failed to subscribe')
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to subscribe')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <span className={styles.successIcon} aria-hidden="true">✓</span>
        <p className={styles.successText}>You&apos;re subscribed. We&apos;ll be in touch.</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <input
          name="email"
          type="email"
          className={styles.input}
          placeholder="your@email.io"
          required
          autoComplete="email"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          aria-label="Subscribe"
        >
          {status === 'loading' ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : (
            <span aria-hidden="true" style={{ fontFamily: 'Arial, sans-serif' }}>&#8594;</span>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className={styles.error} role="alert">{errorMsg}</p>
      )}
    </form>
  )
}
