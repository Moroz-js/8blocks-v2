import styles from './FitCards.module.scss'

interface FitColumn {
  title: string
  items: readonly string[]
}

/** Two cards: what fits (pink checks) and what does not (muted crosses). */
export function FitCards({ good, bad }: { good: FitColumn; bad: FitColumn }) {
  return (
    <div className={styles.grid}>
      {[
        { ...good, isGood: true },
        { ...bad, isGood: false },
      ].map((column) => (
        <div key={column.title} className={styles.card} data-good={column.isGood || undefined}>
          <h3 className={styles.title}>
            <span className={styles.icon} aria-hidden="true">
              <FitMark good={column.isGood} size={16} />
            </span>
            {column.title}
          </h3>
          <ul className={styles.list}>
            {column.items.map((item) => (
              <li key={item}>
                <span className={styles.bullet} aria-hidden="true">
                  <FitMark good={column.isGood} size={10} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function FitMark({ good, size }: { good: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={good ? 'M3.5 8.3l3 3 6-6.6' : 'M4.5 4.5l7 7M11.5 4.5l-7 7'} />
    </svg>
  )
}
