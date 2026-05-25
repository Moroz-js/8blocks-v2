'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { uiStrings } from '@/shared/content/uiStrings'
import styles from './ThemeToggle.module.scss'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button type="button" className={styles.toggle} aria-hidden tabIndex={-1}>
        <Sun size={18} />
      </button>
    )
  }

  const isLight = resolvedTheme === 'light'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? uiStrings.themeSwitchToDark : uiStrings.themeSwitchToLight}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
