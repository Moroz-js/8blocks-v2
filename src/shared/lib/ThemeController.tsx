'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { BLOG_THEME_STORAGE_KEY, DEFAULT_THEME } from './theme'
import { useThemeScopeActive } from './ThemeScope'

/**
 * Keeps theme scoped to article / research detail pages only.
 * - On a themeable page: restore the saved preference.
 * - Anywhere else (incl. archives): force the default theme without losing the preference.
 *
 * The initial theme for a full page load is already resolved by the pre-hydration
 * head script in the layout, so we intentionally skip the first effect run to avoid
 * a flash (it would otherwise force `dark` before ThemeScopeMarker mounts, then flip
 * back to the saved preference). This only reacts to client-side navigation changes.
 */
export function ThemeController() {
  const active = useThemeScopeActive()
  const { setTheme } = useTheme()
  const prevActiveRef = useRef<boolean | null>(null)

  useEffect(() => {
    const prev = prevActiveRef.current
    prevActiveRef.current = active

    // Initial mount (null) is already resolved by the head script; only react to
    // real scope transitions caused by client-side navigation.
    if (prev === null || prev === active) return

    if (active) {
      let saved: string | null = null
      try {
        saved = localStorage.getItem(BLOG_THEME_STORAGE_KEY)
      } catch {
        saved = null
      }
      setTheme(saved === 'light' ? 'light' : 'dark')
    } else {
      setTheme(DEFAULT_THEME)
    }
  }, [active, setTheme])

  return null
}
