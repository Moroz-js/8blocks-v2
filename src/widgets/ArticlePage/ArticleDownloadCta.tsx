'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ArticleCta } from '@/entities/article'
import { uiStrings } from '@/shared/content/uiStrings'
import { Button } from '@/shared/ui'
import styles from './ArticleDownloadCta.module.scss'

type Status = 'idle' | 'loading' | 'error'

interface Props {
  cta: ArticleCta
  /** Источник для CRM, например blog:slug или research:slug. */
  source: string
}

function triggerDownload(url: string, fileName?: string | null) {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName ?? ''
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function ArticleDownloadCta({ cta, source }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setStatus('idle')
    setErrorMsg('')
  }, [])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  function handleClick() {
    if (cta.requireEmail) {
      setOpen(true)
    } else {
      triggerDownload(cta.fileUrl, cta.fileName)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const email = (new FormData(e.currentTarget).get('email') as string)?.trim()

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        error?: string
      }
      if (!res.ok || !data.success) {
        throw new Error(data.error || uiStrings.downloadGateError)
      }

      close()
      triggerDownload(cta.fileUrl, cta.fileName)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : uiStrings.downloadGateError)
    }
  }

  return (
    <aside className={styles.root} aria-label={uiStrings.ctaAriaLabel}>
      {cta.text && <p className={styles.text}>{cta.text}</p>}
      <Button
        variant="primary"
        onClick={handleClick}
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M1.5 12.5h11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        {cta.buttonLabel}
      </Button>

      {open && (
        <div className={styles.overlay} onClick={close} role="presentation">
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-gate-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label={uiStrings.menuCloseLabel}
            >
              ×
            </button>
            <h3 id="download-gate-title" className={styles.modalTitle}>
              {uiStrings.downloadGateTitle}
            </h3>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <input
                ref={inputRef}
                name="email"
                type="email"
                className={styles.input}
                placeholder={uiStrings.downloadGateEmailPlaceholder}
                required
                autoComplete="email"
                disabled={status === 'loading'}
              />
              <Button type="submit" variant="primary" fullWidth loading={status === 'loading'}>
                {status === 'loading' ? uiStrings.downloadGateSending : uiStrings.downloadGateSubmit}
              </Button>
            </form>
            {status === 'error' && (
              <p className={styles.error} role="alert">
                {errorMsg}
              </p>
            )}
            <p className={styles.hint}>{uiStrings.downloadGateHint}</p>
          </div>
        </div>
      )}
    </aside>
  )
}
