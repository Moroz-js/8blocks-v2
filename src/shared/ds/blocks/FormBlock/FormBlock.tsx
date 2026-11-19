import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from '../../ui/Button'
import styles from './FormBlock.module.scss'

interface FormBlockProps extends Omit<ComponentPropsWithoutRef<'form'>, 'children'> {
  /** Fields: TextField / Textarea. Wrap a pair in <FormRow> for two columns. */
  children: ReactNode
  submitLabel: string
  /** Disables the button and marks the form busy. */
  pending?: boolean
  /** Status line under the button (success / error message). */
  status?: ReactNode
}

/**
 * Figma: «Tell us about your project» (54:2453) — 720px column, 20px between
 * rows, 15px between paired fields, full-width primary button.
 * Presentation only: submission is wired by the feature that uses it.
 */
export function FormBlock({ children, submitLabel, pending = false, status, className, ...formProps }: FormBlockProps) {
  return (
    <form className={clsx(styles.form, className)} aria-busy={pending || undefined} {...formProps}>
      <div className={styles.fields}>{children}</div>
      <Button type="submit" fullWidth disabled={pending}>
        {submitLabel}
      </Button>
      {status && (
        <p className={styles.status} role="status">
          {status}
        </p>
      )}
    </form>
  )
}

/** Two fields side by side (one column on mobile). */
export function FormRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}
