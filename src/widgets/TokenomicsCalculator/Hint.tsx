import styles from './Calculator.module.scss'

/** Round «?» with a CSS tooltip, shown on hover and keyboard focus (Figma: calculator preview). */
export function Hint({ text }: { text: string }) {
  return (
    <span className={styles.hint} tabIndex={0} role="img" aria-label={text} data-tip={text}>
      ?
    </span>
  )
}
