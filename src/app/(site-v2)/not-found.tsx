import type { Metadata } from 'next'
import { Button, Section } from '@/shared/ds'
import { notFoundContent as copy } from '@/shared/content/notFound'
import { NotFoundTracker } from '@/shared/lib/NotFoundTracker'
import styles from './not-found.module.scss'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <Section>
      <NotFoundTracker />
      <div className={styles.root}>
        <p className={styles.code}>{copy.code}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.text}>{copy.text}</p>
        <Button href="/">{copy.action}</Button>
      </div>
    </Section>
  )
}
