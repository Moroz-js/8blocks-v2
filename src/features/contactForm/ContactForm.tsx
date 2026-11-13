'use client'

import { useState } from 'react'
import { Button, TextField, Textarea } from '@/shared/ds'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { apiPath } from '@/shared/lib/apiPath'
import styles from './ContactForm.module.scss'

type Status = 'idle' | 'loading' | 'success' | 'error'

export interface ContactFormText {
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submitLabel: string
  sendingLabel: string
  failedError: string
  successTitle: string
  successBody: string
}

export function ContactForm({ text }: { text: ContactFormText }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch(apiPath('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const raw = await res.text()
      let data: { success?: boolean; error?: string } = {}
      try {
        data = JSON.parse(raw) as { success?: boolean; error?: string }
      } catch {
        throw new Error(text.failedError)
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || text.failedError)
      }

      setStatus('success')
      trackPlatformEvent('form_submit', { form_id: 'contact', status: 'success' })
    } catch (err) {
      setStatus('error')
      trackPlatformEvent('form_submit', { form_id: 'contact', status: 'error' })
      setErrorMsg(err instanceof Error ? err.message : text.failedError)
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <p className={styles.successTitle}>{text.successTitle}</p>
        <p className={styles.successBody}>{text.successBody}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <TextField
          label={text.nameLabel}
          name="name"
          type="text"
          placeholder={text.namePlaceholder}
          required
          autoComplete="name"
        />
        <TextField
          label={text.emailLabel}
          name="email"
          type="email"
          placeholder={text.emailPlaceholder}
          required
          autoComplete="email"
        />
      </div>
      <Textarea label={text.messageLabel} name="message" placeholder={text.messagePlaceholder} rows={4} required />
      {status === 'error' && (
        <p className={styles.error} role="alert">
          {errorMsg}
        </p>
      )}
      <Button type="submit" fullWidth disabled={status === 'loading'} aria-busy={status === 'loading'} className={styles.submit}>
        {status === 'loading' ? text.sendingLabel : `${text.submitLabel} →`}
      </Button>
    </form>
  )
}
