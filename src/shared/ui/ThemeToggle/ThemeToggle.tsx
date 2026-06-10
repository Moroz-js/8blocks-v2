'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { uiStrings } from '@/shared/content/uiStrings'
import { BLOG_THEME_STORAGE_KEY } from '@/shared/lib/theme'
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

  const handleToggle = () => {
    const next = isLight ? 'dark' : 'light'
    setTheme(next)
    try {
      localStorage.setItem(BLOG_THEME_STORAGE_KEY, next)
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={handleToggle}
      aria-label={isLight ? uiStrings.themeSwitchToDark : uiStrings.themeSwitchToLight}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
