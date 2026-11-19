'use client'

import type { ReactElement } from 'react'
import { Tooltip } from '@mantine/core'
import styles from './Hint.module.scss'

/** Tooltip stays within the viewport, including touch and keyboard interactions. */
export function HintTooltip({ text, children }: { text: string; children: ReactElement }) {
  return (
    <Tooltip
      label={text}
      multiline
      w={260}
      withinPortal
      events={{ hover: true, focus: true, touch: true }}
      classNames={{ tooltip: styles.tooltip }}
    >
      {children}
    </Tooltip>
  )
}

export function Hint({ text }: { text: string }) {
  return (
    <HintTooltip text={text}>
      <span className={styles.hint} tabIndex={0} role="img" aria-label={text}>
        ?
      </span>
    </HintTooltip>
  )
}
