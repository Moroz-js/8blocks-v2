'use client'

import { useState } from 'react'
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
        throw new Error(data.error || 'Не удалось отправить')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Не удалось отправить')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <div className={styles.successIcon} aria-hidden="true">✓</div>
        <p className={styles.successTitle}>Сообщение отправлено</p>
        <p className={styles.successBody}>Мы ответим в течение одного рабочего дня.</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cf-name" className={styles.label}>Имя</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            className={styles.input}
            placeholder="Иван Иванов"
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
        <label htmlFor="cf-message" className={styles.label}>Сообщение</label>
        <textarea
          id="cf-message"
          name="message"
          className={styles.textarea}
          placeholder="Расскажите о проекте и что вы ищете"
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
            Отправка…
          </>
        ) : (
          <>
            Оставить заявку
            <span className={styles.submitArrow} aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  )
}
