import type { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  loading?: boolean
}

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && icon && (
        <span className={clsx(styles.icon, styles.iconLeft)}>{icon}</span>
      )}
      {children && <span className={styles.text}>{children}</span>}
      {iconPosition === 'right' && icon && (
        <span className={clsx(styles.icon, styles.iconRight)}>{icon}</span>
      )}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={clsx(
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...props}
    >
      {iconPosition === 'left' && icon && (
        <span className={clsx(styles.icon, styles.iconLeft)}>{icon}</span>
      )}
      {children && <span className={styles.text}>{children}</span>}
      {iconPosition === 'right' && icon && (
        <span className={clsx(styles.icon, styles.iconRight)}>{icon}</span>
      )}
    </Link>
  )
}
