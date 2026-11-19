import type { ReactNode } from 'react'
import styles from './TokenomicsAiPage.module.scss'

/** Pink status pill with a glowing dot («Limited slots available»). */
export function LimitedPill({ children }: { children: ReactNode }) {
  return <p className={styles.pill}>{children}</p>
}
