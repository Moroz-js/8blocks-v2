'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { CountryId, DigitalAssetsContent } from '@/shared/content/digitalAssets'
import globe from './assets/globe.webp'
import { FLAGS } from './flags'
import styles from './Jurisdictions.module.scss'

/** Marker anchors on the 1280 × 778 globe frame, % (designer's positions). */
const MARKERS: { id: CountryId; x: number; y: number }[] = [
  { id: 'uk', x: 5, y: 52 },
  { id: 'eu', x: 17.3, y: 62 },
  { id: 'ch', x: 10, y: 67.5 },
  { id: 'us', x: 1.5, y: 67.1 },
  { id: 'kz', x: 40, y: 67 },
  { id: 'jp', x: 80, y: 67 },
  { id: 'ae', x: 25, y: 84 },
  { id: 'sg', x: 60, y: 88 },
  { id: 'vg', x: 3, y: 90 },
]

const Chevron = (
  <svg width="6" height="10" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 1l5 5-5 5" />
  </svg>
)

export function Jurisdictions({ content }: { content: DigitalAssetsContent['jurisdictions'] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<CountryId | null>(null)
  const country = open ? content.countries[open] : null

  const show = (id: CountryId) => {
    setOpen(id)
    dialog.current?.showModal()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.globe}>
        <Image src={globe} alt="" fill sizes="100vw" className={styles.globeImage} />
      </div>
      <ul className={styles.markers}>
        {MARKERS.map(({ id, x, y }) => (
          <li key={id} className={styles.marker} style={{ left: `${x}%`, top: `${y}%` }}>
            <button type="button" className={styles.markerButton} onClick={() => show(id)} aria-haspopup="dialog">
              <span className={styles.flag}>{FLAGS[id]}</span>
              <span className={styles.name}>{content.countries[id].name}</span>
              <span className={styles.more}>
                {content.more}
                {Chevron}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="jurisdiction-title"
        data-lenis-prevent
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        {country && (
          <div className={styles.panel}>
            <div className={styles.head}>
              <h3 id="jurisdiction-title" className={styles.dialogTitle}>
                {country.name}
              </h3>
              <button type="button" className={styles.close} aria-label={content.close} onClick={() => dialog.current?.close()}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>
            {country.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </dialog>
    </div>
  )
}
