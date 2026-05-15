import 'katex/dist/katex.min.css'
import { renderKatexHtml } from './renderKatex'
import styles from './RichText.module.scss'

interface Props {
  formula: string
  caption?: string | null
}

export function FormulaView({ formula, caption }: Props) {
  const html = renderKatexHtml(formula)

  return (
    <figure className={styles.formula}>
      <div
        className={styles.formulaBody}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption && <figcaption className={styles.formulaCaption}>{caption}</figcaption>}
    </figure>
  )
}
