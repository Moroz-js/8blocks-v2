'use client'

import { Accordion } from '@mantine/core'
import { motion } from 'framer-motion'
import styles from './FaqAccordion.module.scss'

const ease = 'easeOut' as const

export interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  headline: string
  items: readonly FaqItem[]
}

export function FaqAccordion({ headline, items }: FaqAccordionProps) {
  return (
    <section className={styles.section} aria-label="FAQ">
      <div className={styles.inner}>
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease }}
        >
          {headline}
        </motion.h2>

        <Accordion
          variant="separated"
          multiple
          className={styles.accordion}
          classNames={{
            root: styles.accordionRoot,
            item: styles.accordionItem,
            control: styles.accordionControl,
            label: styles.accordionLabel,
            panel: styles.accordionPanel,
            content: styles.accordionContent,
            chevron: styles.accordionChevron,
          }}
          chevronPosition="right"
        >
          {items.map((item, i) => (
            <Accordion.Item key={i} value={`faq-${i}`} className={styles.item}>
              <Accordion.Control className={styles.control}>
                {item.question}
              </Accordion.Control>
              <Accordion.Panel className={styles.panel}>
                {item.answer}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
