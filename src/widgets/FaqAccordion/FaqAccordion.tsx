'use client'

import Link from 'next/link'
import { Accordion } from '@mantine/core'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './FaqAccordion.module.scss'

export interface FaqItem {
  question: string
  answer: string
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

/** Renders an answer string, converting inline `[label](href)` tokens into links. */
function renderAnswer(text: string): React.ReactNode {
  if (!text.includes('](')) return text

  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index))
    const [, label, href] = match
    nodes.push(
      <Link key={key++} href={href} className={styles.link}>
        {label}
      </Link>,
    )
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

interface FaqAccordionProps {
  headline?: string
  items: readonly FaqItem[]
  /** Render only the accordion, without the section wrapper / container / headline. */
  bare?: boolean
}

export function FaqAccordion({ headline, items, bare = false }: FaqAccordionProps) {
  const accordion = (
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
          <Accordion.Control className={styles.control}>{item.question}</Accordion.Control>
          <Accordion.Panel className={styles.panel}>{renderAnswer(item.answer)}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )

  if (bare) {
    return accordion
  }

  return (
    <section className={styles.section} aria-label="FAQ">
      <div className={styles.inner}>
        {headline ? <ScrollRevealText text={headline} className={styles.headline} /> : null}
        {accordion}
      </div>
    </section>
  )
}
