'use client'

import { useEffect, useState } from 'react'

export function MarketingSections({
  children,
}: {
  children: React.ReactNode
}) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const hide = () => setHidden(true)
    window.addEventListener('tokenlab:started', hide)
    return () => window.removeEventListener('tokenlab:started', hide)
  }, [])

  if (hidden) return null
  return <>{children}</>
}
