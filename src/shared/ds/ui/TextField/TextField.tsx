import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import circleAlert from '../../icons/circle-alert.svg'
import styles from './TextField.module.scss'

interface FieldChromeProps {
  /** Visible label above the field (Figma: «Имя *»). */
  label: ReactNode
  /** Error message; switches the field into the error state. */
  error?: ReactNode
  /** Helper text under the field when there is no error. */
  hint?: ReactNode
  className?: string
}

/*
 * Figma: Поля / Текстовое поле (52:407) — five states. Default, hover and focus
 * come from CSS; «Заполнено» is simply a field with a value (white text);
 * «Ошибка» is driven by the `error` prop.
 */

type TextFieldProps = FieldChromeProps & Omit<ComponentPropsWithoutRef<'input'>, 'className'>

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, className, id, ...inputProps },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  return (
    <div className={clsx(styles.field, className)}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <div className={clsx(styles.control, error && styles.invalid)}>
        <input
          ref={ref}
          id={fieldId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...inputProps}
        />
        {error && <Image src={circleAlert} alt="" width={18} height={18} className={styles.alert} />}
      </div>
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  )
})

type TextareaProps = FieldChromeProps & Omit<ComponentPropsWithoutRef<'textarea'>, 'className'>

/** Multi-line variant of TextField (Figma form block: 145px tall field). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, rows = 4, ...textareaProps },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  return (
    <div className={clsx(styles.field, className)}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      <div className={clsx(styles.control, styles.multiline, error && styles.invalid)}>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          className={clsx(styles.input, styles.textarea)}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...textareaProps}
        />
        {error && <Image src={circleAlert} alt="" width={18} height={18} className={styles.alert} />}
      </div>
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </p>
      )}
    </div>
  )
})
