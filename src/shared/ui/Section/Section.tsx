import type { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import styles from './Section.module.scss'

interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'primary' | 'secondary' | 'tertiary' | 'none'
}

export function Section({
  spacing = 'lg',
  background = 'none',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={clsx(
        styles.section,
        styles[`spacing-${spacing}`],
        background !== 'none' && styles[`bg-${background}`],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}
