'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import styles from './WorkshopSpecialists.module.scss'

const ease = 'easeOut' as const

const ICON_LINKEDIN = '/icons/ln-icon.svg'
const ICON_X = '/icons/x-icon.svg'
const ICON_SIZE = 18

interface Specialist {
    name: string
    role: string
    tags: readonly string[]
    bio: string
    linkedin: string
    twitter: string
}

interface WorkshopSpecialistsProps {
    headline: string
    description: string
    items: readonly Specialist[]
}

export function WorkshopSpecialists({ headline, description, items }: WorkshopSpecialistsProps) {
  return (
    <section className={styles.section} aria-label="Team specialists">
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollRevealText text={headline} className={styles.headline} />
          <ScrollRevealText text={description} className={styles.description} />
        </div>

        <div className={styles.grid}>
          {items.map((specialist, i) => (
            <motion.article
              key={i}
              className={styles.card}
              itemScope
              itemType="https://schema.org/Person"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <div className={styles.cardTopBorder} aria-hidden="true" />

              <div className={styles.avatar} aria-hidden="true">
                <span className={styles.avatarInitials}>
                  {specialist.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.name} itemProp="name">
                  {specialist.name}
                </h3>
                <span className={styles.role} itemProp="jobTitle">
                  {specialist.role}
                </span>

                <div className={styles.tags}>
                  {specialist.tags.map((tag, j) => (
                    <span key={j} className={styles.tag} itemProp="knowsAbout">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className={styles.bio} itemProp="description">
                  {specialist.bio}
                </p>

                <div className={styles.links}>
                  <a
                    href={specialist.linkedin}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${specialist.name} — LinkedIn`}
                    itemProp="sameAs"
                  >
                    <Image
                      src={ICON_LINKEDIN}
                      alt=""
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                      className={styles.linkIcon}
                      aria-hidden
                    />
                    LinkedIn
                  </a>
                  <a
                    href={specialist.twitter}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${specialist.name} — X (Twitter)`}
                    itemProp="sameAs"
                  >
                    <Image
                      src={ICON_X}
                      alt=""
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                      className={styles.linkIcon}
                      aria-hidden
                    />
                    X
                  </a>
                </div>
              </div>

              <meta itemProp="worksFor" content="8Blocks" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
