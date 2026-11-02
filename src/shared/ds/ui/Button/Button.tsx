import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

interface CommonProps {
  /** Figma: Button Primary (white) / Secondary (charcoal) / Tertiary (glass, for imagery and gradients). */
  variant?: ButtonVariant
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children?: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps & Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: undefined }
type ButtonAsLink = CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

/** Pill button, 56px. Renders a Next <Link> when `href` is passed. */
export function Button({
  variant = 'primary',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = clsx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
    </>
  )

  if (typeof rest.href === 'string') {
    return (
      <Link className={classes} {...(rest as ComponentPropsWithoutRef<typeof Link>)}>
        {content}
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = rest as ComponentPropsWithoutRef<'button'>
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
