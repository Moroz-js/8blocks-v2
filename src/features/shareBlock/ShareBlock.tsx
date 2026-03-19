'use client'

import { useState } from 'react'
import styles from './ShareBlock.module.scss'

interface Props {
  url: string
  title: string
}

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6.5 9.5a3.536 3.536 0 0 0 5 0l2-2a3.536 3.536 0 0 0-5-5L7.5 3.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M9.5 6.5a3.536 3.536 0 0 0-5 0l-2 2a3.536 3.536 0 0 0 5 5L8.5 12.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M12.6 2H14.9L9.9 7.7L15.8 14H11.1L7.4 9.2L3.2 14H0.9L6.3 7.9L0.6 2H5.4L8.8 6.4L12.6 2ZM11.8 12.6H13.1L4.7 3.3H3.3L11.8 12.6Z" fill="currentColor" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M9.333 9.333H11l.667-2.666H9.333V5.333c0-.747 0-1.333 1.334-1.333H11.667V1.6c-.23-.032-.96-.1-1.738-.1-1.74 0-2.929.893-2.929 2.533V6.667H5v2.666h2V15h2.333V9.333Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.95 2.133a.667.667 0 0 0-.68-.1L1.603 6.7a.667.667 0 0 0 .03 1.247l2.7.9 1.034 3.452a.667.667 0 0 0 1.1.28l1.56-1.559 2.726 2.007a.667.667 0 0 0 1.047-.4l2-9.333a.667.667 0 0 0-.85-.161ZM9.8 11.4l-2.487-1.833-.007-.005 3.76-4.296L6.36 9.407 4.867 8.9l8-3.267L9.8 11.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.667 5.333H5.333V13.333H2.667V5.333ZM4 4a1.333 1.333 0 1 1 0-2.667A1.333 1.333 0 0 1 4 4ZM10.667 5.333c-1.178 0-1.96.427-2.334 1.007V5.333H6v8h2.667V8.667c0-.934.36-1.334 1.093-1.334.733 0 1.24.4 1.24 1.334v4.666H13.333V8.667c0-2-1.04-3.334-2.666-3.334Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ShareBlock({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      id: 'x',
      label: 'Поделиться в X',
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      icon: <IconX />,
    },
    {
      id: 'facebook',
      label: 'Поделиться в Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: <IconFacebook />,
    },
    {
      id: 'telegram',
      label: 'Поделиться в Telegram',
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
      icon: <IconTelegram />,
    },
    {
      id: 'linkedin',
      label: 'Поделиться в LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      icon: <IconLinkedIn />,
    },
  ]

  return (
    <div className={styles.root}>
      <p className={styles.label}>Поделиться</p>
      <div className={styles.buttons}>
        <button
          className={`${styles.btn} ${copied ? styles.copied : ''}`}
          onClick={handleCopy}
          aria-label="Копировать ссылку"
          title="Копировать ссылку"
        >
          {copied ? <IconCheck /> : <IconLink />}
        </button>

        {links.map((link) => (
          <a
            key={link.id}
            className={styles.btn}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  )
}
