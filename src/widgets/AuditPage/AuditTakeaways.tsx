import styles from './AuditTakeaways.module.scss'

interface Props {
  verdict?: string | null
  strength?: string | null
  weakness?: string | null
}

export function AuditTakeaways({ verdict, strength, weakness }: Props) {
  const items = [verdict, strength, weakness].filter(Boolean) as string[]
  if (items.length === 0) return null

  return (
    <section className={styles.root} aria-label="Ключевые выводы">
      <div className={styles.grid}>
        {items.map((text, i) => (
          <div key={i} className={styles.item}>
            <p className={styles.text}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
