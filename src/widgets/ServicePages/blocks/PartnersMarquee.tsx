import Image from 'next/image'
import clsx from 'clsx'
import { partnersContent } from '@/shared/content/homePage'
import styles from './PartnersMarquee.module.scss'

/** Endless strip of partner logos; pauses on hover. */
export function PartnersMarquee({ label }: { label: string }) {
  const partners = partnersContent.partners
  return (
    <section className={styles.section} aria-label={label}>
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.group} aria-hidden={copy === 1 || undefined}>
            {partners.map((partner) => {
              const logo = (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={32}
                  className={clsx(styles.logo, partner.name === 'Fibonacci' && styles.logoTall)}
                />
              )
              return (
                <li key={partner.name} className={styles.slot}>
                  {'href' in partner && partner.href ? (
                    <a href={partner.href} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined}>
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </section>
  )
}
