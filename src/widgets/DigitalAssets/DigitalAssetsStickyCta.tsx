'use client'

import { useEffect, useState } from 'react'
import { digitalAssetsContent } from '@/shared/content/digitalAssets'
import styles from './DigitalAssets.module.scss'

const { hero } = digitalAssetsContent

export function DigitalAssetsStickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const heroElement = document.querySelector('[aria-label="Hero"]')
    const finalElement = document.querySelector('[aria-label="Call to action"]')
    if (!heroElement || !finalElement) return

    let heroLeftViewport = false
    let finalIsVisible = false
    const sync = () => setVisible(heroLeftViewport && !finalIsVisible)

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroLeftViewport = !entry.isIntersecting
      sync()
    })
    const finalObserver = new IntersectionObserver(([entry]) => {
      finalIsVisible = entry.isIntersecting
      sync()
    }, { threshold: 0.1 })

    heroObserver.observe(heroElement)
    finalObserver.observe(finalElement)

    return () => {
      heroObserver.disconnect()
      finalObserver.disconnect()
    }
  }, [])

  return (
    <div className={`${styles.stickyCta} ${visible ? styles.stickyCtaVisible : ''}`} aria-hidden={!visible}>
      <span>{hero.ctaLabel}</span>
      {visible && (
        <a href={hero.ctaHref} target="_blank" rel="noopener noreferrer" className={styles.stickyCtaButton}>
          {hero.ctaLabel}
        </a>
      )}
    </div>
  )
}
