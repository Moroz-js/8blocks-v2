import type { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import styles from './Container.module.scss'

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  as?: React.ElementType
  size?: 'default' | 'narrow' | 'wide'
}

export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={clsx(styles.container, styles[`size-${size}`], className)} {...props}>
      {children}
    </Tag>
  )
}
