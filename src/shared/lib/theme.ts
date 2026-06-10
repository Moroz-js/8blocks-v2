/** Theme switching is allowed only on article / research detail pages. */
export const THEME_STORAGE_KEY = '8blocks-theme'
export const BLOG_THEME_STORAGE_KEY = '8blocks-blog-theme'
export const DEFAULT_THEME = 'dark'

/**
 * Path-level heuristic for themeable pages (article / research detail).
 * Used by the pre-hydration head script; actual toggle visibility is driven by
 * ThemeScopeMarker so that blog category archives stay non-themeable.
 */
export function isThemeablePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const segments = pathname.split('/').filter(Boolean)
  return (segments[0] === 'blog' || segments[0] === 'research') && segments.length >= 2
}
