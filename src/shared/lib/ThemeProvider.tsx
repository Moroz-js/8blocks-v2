'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => undefined,
})

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const segments = window.location.pathname.split('/').filter(Boolean)
  const isThemeable =
    (segments[0] === 'blog' ||
      segments[0] === 'research' ||
      segments[0] === 'audits') &&
    segments.length >= 2

  if (!isThemeable) return 'dark'

  try {
    return localStorage.getItem('8blocks-blog-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    applyTheme(nextTheme)
    try {
      localStorage.setItem('8blocks-theme', nextTheme)
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme: theme, setTheme }),
    [setTheme, theme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
