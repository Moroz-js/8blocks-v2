'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BLOG_THEME_STORAGE_KEY, DEFAULT_THEME, isThemeablePath } from './theme'

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
  if (typeof window === 'undefined') return DEFAULT_THEME
  if (!isThemeablePath(window.location.pathname)) return DEFAULT_THEME

  try {
    return localStorage.getItem(BLOG_THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return DEFAULT_THEME
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

  // The user's preference is persisted by ThemeToggle; switching here only applies it.
  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    applyTheme(nextTheme)
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
