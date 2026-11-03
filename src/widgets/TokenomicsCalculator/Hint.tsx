import { Tooltip } from '@mantine/core'
import styles from './Calculator.module.scss'

/** Tooltip stays within the viewport, including touch and keyboard interactions. */
export function Hint({ text }: { text: string }) {
  return (
    <Tooltip
      label={text}
      multiline
      w={260}
      withinPortal
      events={{ hover: true, focus: true, touch: true }}
      classNames={{ tooltip: styles.hintTooltip }}
    >
      <span className={styles.hint} tabIndex={0} role="img" aria-label={text}>
        ?
      </span>
    </Tooltip>
  )
}
