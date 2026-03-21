'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './ScreenBlur.module.scss'

export function ScreenBlur() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <>
      <div className={styles.top} aria-hidden="true" />
      <div className={styles.bottom} aria-hidden="true" />
    </>,
    document.body,
  )
}
