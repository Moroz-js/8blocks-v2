'use client'

import { useEffect, useSyncExternalStore } from 'react'

/**
 * Module-level ref-count store that tracks whether the current page is a
 * "themeable" page (an article / research detail page). The theme toggle and
 * theme switching are only enabled while at least one ThemeScopeMarker is mounted.
 *
 * A ref-count (instead of a boolean) avoids a flicker when navigating directly
 * between two themeable pages: the incoming page increments before the outgoing
 * page decrements, so the active state never drops to false in between.
 */
let count = 0
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): boolean {
  return count > 0
}

function getServerSnapshot(): boolean {
  return false
}

export function useThemeScopeActive(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Render this on pages where the light/dark toggle should be available
 * (article and research detail pages — not archives).
 */
export function ThemeScopeMarker() {
  useEffect(() => {
    count += 1
    emit()
    return () => {
      count = Math.max(0, count - 1)
      emit()
    }
  }, [])

  return null
}
