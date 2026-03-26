'use client'

import { useState } from 'react'
import { t } from '@/shared/i18n'
import styles from './ContactForm.module.scss'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json() as { success?: boolean; error?: string }

      if (!res.ok || !data.success) {
        throw new Error(data.error || t({ ru: 'Не удалось отправить', en: 'Failed to send' }))
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : t({ ru: 'Не удалось отправить', en: 'Failed to send' }))
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <div className={styles.successIcon} aria-hidden="true">✓</div>
        <p className={styles.successTitle}>{t({ ru: 'Сообщение отправлено', en: 'Message sent' })}</p>
        <p className={styles.successBody}>{t({ ru: 'Мы ответим в течение одного рабочего дня.', en: "We'll respond within one business day." })}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cf-name" className={styles.label}>{t({ ru: 'Имя', en: 'Name' })}</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            className={styles.input}
            placeholder={t({ ru: 'Иван Иванов', en: 'John Doe' })}
            required
            autoComplete="name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="cf-email" className={styles.label}>Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="ivan@company.io"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className={`${styles.field} ${styles.fieldGrow}`}>
        <label htmlFor="cf-message" className={styles.label}>{t({ ru: 'Сообщение', en: 'Message' })}</label>
        <textarea
          id="cf-message"
          name="message"
          className={styles.textarea}
          placeholder={t({ ru: 'Расскажите о проекте и что вы ищете', en: 'Tell us about your project and what you are looking for' })}
          rows={4}
          required
        />
      </div>

      {status === 'error' && (
        <p className={styles.errorMsg} role="alert">{errorMsg}</p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            {t({ ru: 'Отправка…', en: 'Sending…' })}
          </>
        ) : (
          <>
            {t({ ru: 'Оставить заявку', en: 'Submit request' })}
            <span className={styles.submitArrow} aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  )
}
