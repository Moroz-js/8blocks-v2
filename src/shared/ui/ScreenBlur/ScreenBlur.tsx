'use client'

import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import styles from './ScreenBlur.module.scss'

const emptySubscribe = () => () => {}

export function ScreenBlur() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!mounted) return null

  return createPortal(
    <>
      <div className={styles.top} aria-hidden="true" />
      <div className={styles.bottom} aria-hidden="true" />
    </>,
    document.body,
  )
}
