'use client'

import { Suspense, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { usePathname, useSearchParams } from 'next/navigation'

interface LenisProviderProps {
  children: React.ReactNode
}

// ── Inner component uses useSearchParams (requires Suspense boundary) ─────────

function LenisScrollReset({ lenisRef, startLoop, stopLoop }: {
  lenisRef:  React.RefObject<Lenis | null>
  startLoop: (lenis: Lenis) => void
  stopLoop:  () => void
}) {
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const hash  = window.location.hash
    const lenis = lenisRef.current
    if (!lenis) return

    if (hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 })
      }, 300)
      return () => clearTimeout(t)
    }

    // Stop the RAF loop to prevent any pending lenis.raf() from
    // overwriting the targetScroll we're about to reset.
    stopLoop()

    // Reset DOM scroll position and Lenis's internal state simultaneously.
    window.scrollTo(0, 0)
    lenis.scrollTo(0, { immediate: true })

    // Restart the loop from a clean position-0 state.
    startLoop(lenis)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lenisRef/startLoop/stopLoop are stable refs/fns, omit to avoid extra resets
  }, [pathname, searchParams])

  return null
}

// ── Public provider ───────────────────────────────────────────────────────────

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)

  function startLoop(lenis: Lenis) {
    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }
    rafIdRef.current = requestAnimationFrame(raf)
  }

  function stopLoop() {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration:    1.2,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis
    startLoop(lenis)

    return () => {
      stopLoop()
      lenis.destroy()
    }
  }, [])

  // ── In-page hash navigation ────────────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (!hash || !lenisRef.current) return
      const el = document.querySelector(hash)
      if (el) lenisRef.current.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <>
      <Suspense>
        <LenisScrollReset
          lenisRef={lenisRef}
          startLoop={startLoop}
          stopLoop={stopLoop}
        />
      </Suspense>
      {children}
    </>
  )
}
