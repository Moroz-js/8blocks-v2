'use client'

import { useId, useState, type ReactNode } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import chevronDown from '../../icons/chevron-down.svg'
import styles from './Faq.module.scss'

export interface FaqItem {
  question: string
  answer: ReactNode
}

interface FaqProps {
  items: readonly FaqItem[]
  /** Index opened initially; `null` — all closed. */
  defaultOpen?: number | null
  /** Line under the list, e.g. «Have other questions? Contact us». */
  footer?: ReactNode
  className?: string
}

/**
 * Figma: FAQ (41:1069 = 47:2126) — 720px accordion, items 2px apart, outer
 * corners 15px. Several items may be open at once.
 */
export function Faq({ items, defaultOpen = 0, footer, className }: FaqProps) {
  const baseId = useId()
  const [open, setOpen] = useState<ReadonlySet<number>>(
    () => new Set(defaultOpen === null ? [] : [defaultOpen]),
  )

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  return (
    <div className={clsx(styles.root, className)}>
      <ul className={styles.list}>
        {items.map((item, i) => {
          const isOpen = open.has(i)
          const buttonId = `${baseId}-q${i}`
          const panelId = `${baseId}-a${i}`
          return (
            <li key={item.question} className={clsx(styles.item, isOpen && styles.open)}>
              <h3 className={styles.heading}>
                <button
                  id={buttonId}
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                >
                  <span>{item.question}</span>
                  <Image src={chevronDown} alt="" width={16} height={16} className={styles.chevron} />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} aria-hidden={!isOpen} inert={!isOpen} className={styles.panel}>
                <div className={styles.answerClip}>
                  <div className={styles.answer}>{item.answer}</div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {footer && <p className={styles.footer}>{footer}</p>}
    </div>
  )
}
