import Link from 'next/link'
import { Faq, Section, type FaqItem } from '@/shared/ds'
import styles from './ServiceFaq.module.scss'

interface ServiceFaqProps {
  title: string
  items: readonly FaqItem[]
  footer: { text: string; link: string; href: string }
}

export function ServiceFaq({ title, items, footer }: ServiceFaqProps) {
  return (
    <Section narrow>
      <div className={styles.faq}>
        <h2 className={styles.title}>{title}</h2>
        <Faq
          items={items}
          footer={
            <>
              {footer.text} <Link href={footer.href}>{footer.link}</Link>
            </>
          }
        />
      </div>
    </Section>
  )
}
