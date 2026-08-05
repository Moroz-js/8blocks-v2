'use client'

import { useEffect } from 'react'

interface ReplainWidgetProps {
  id: string
}

export function ReplainWidget({ id }: ReplainWidgetProps) {
  useEffect(() => {
    let loaded = false

    const load = () => {
      if (loaded) return
      loaded = true

      ;(window as Window & { replainSettings?: { id: string } }).replainSettings = { id }
      const script = document.createElement('script')
      script.id = 'replain-client'
      script.src = 'https://widget.replain.cc/dist/client.js'
      script.async = true
      document.body.append(script)
    }

    const timeout = window.setTimeout(load, 15_000)
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart']
    events.forEach((event) => window.addEventListener(event, load, { once: true, passive: true }))

    return () => {
      window.clearTimeout(timeout)
      events.forEach((event) => window.removeEventListener(event, load))
    }
  }, [id])

  return null
}
