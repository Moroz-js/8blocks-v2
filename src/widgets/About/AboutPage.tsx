import Image from 'next/image'
import clsx from 'clsx'
import { AccentSurface, Button, Cta, Section } from '@/shared/ds'
import { about } from '@/shared/content/about'
import { BinaryScene } from '@/widgets/BinaryArt/BinaryScene'
import type { BinarySceneId } from '@/widgets/BinaryArt/scene/types'
import { ServiceHero } from '@/widgets/ServicePages/blocks/ServiceHero'
import clutch from './assets/clutch.svg'
import styles from './AboutPage.module.scss'

const PRINCIPLE_SCENES: BinarySceneId[] = ['gold-coin', 'bulb', 'briefcase', 'broken-coin']
const WAY_SCENES: BinarySceneId[] = ['way-file', 'way-scales', 'way-puzzle']

/** About page on design system v2 (project 2 «About»). */
export function AboutPage() {
  return (
    <>
      <ServiceHero scene="profiles" artTop={-26} titleSize="md" title={about.hero.title} description={about.hero.description}>
        <Button href={about.hero.primary.href}>{about.hero.primary.label}</Button>
        <Button variant="tertiary" href={about.hero.secondary.href}>
          {about.hero.secondary.label}
        </Button>
      </ServiceHero>

      <Section>
        <p className={styles.statement}>
          <span className={styles.statementMuted}>{about.statement.muted}</span>
          <br />
          <span className={styles.statementBright}>{about.statement.bright}</span>
        </p>
        <ul className={styles.principles}>
          {about.principles.map((item, i) => (
            <li key={item.title} className={styles.principle}>
              <BinaryScene scene={PRINCIPLE_SCENES[i]} className={styles.principleArt} />
              <h3 className={styles.principleTitle}>{item.title}</h3>
              <p className={styles.principleText}>{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="areas" title={about.areas.title} sheen>
        <ul className={styles.areas}>
          {about.areas.items.map((item) => (
            <li key={item.title} className={styles.area}>
              <div className={styles.areaText}>
                <h3 className={styles.areaTitle}>{item.title}</h3>
                <p className={styles.muted}>{item.text}</p>
              </div>
              <div className={styles.areaLinks}>
                {item.links.map((link, i) => (
                  <Button key={link.href} variant={i === 0 ? 'secondary' : 'tertiary'} href={link.href}>
                    {link.label}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className={styles.split}>
          <div className={styles.splitText}>
            <h2 className={clsx(styles.h3, styles.sheen)}>{about.clients.title}</h2>
            <p className={styles.muted}>{about.clients.text}</p>
          </div>
          <ol className={styles.clients}>
            {about.clients.items.map((item, i) => (
              <li key={item.title} className={styles.client}>
                <p className={styles.clientLabel}>
                  {i + 1}. {item.title}
                </p>
                <p className={styles.clientText}>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className={styles.track}>
          <div className={styles.trackText}>
            <h2 className={clsx(styles.h4, styles.sheen)}>{about.track.title}</h2>
            <p className={styles.muted}>{about.track.text}</p>
            <Button variant="secondary" href={about.track.action.href}>
              {about.track.action.label}
            </Button>
          </div>
          <div className={styles.trackStats}>
            <dl className={styles.stats}>
              {about.track.stats.map((stat) => (
                <div key={stat.value} className={styles.stat}>
                  <dt className={styles.statValue}>{stat.value}</dt>
                  <dd className={styles.statLabel}>{stat.label}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.faint}>{about.track.offices}</p>
          </div>
        </div>
      </Section>

      <Section title={about.ways.title} description={about.ways.description} align="center" sheen>
        <ul className={styles.ways} data-accent-group>
          {about.ways.items.map((item, i) => (
            <li key={item.title} className={styles.way}>
              <AccentSurface />
              <BinaryScene scene={WAY_SCENES[i]} className={styles.wayArt} />
              <h3 className={styles.wayTitle}>{item.title}</h3>
              <p className={styles.wayText}>{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={about.proof.title} description={about.proof.description} align="center" sheen>
        <ul className={styles.proof}>
          {about.proof.items.map((item) => (
            <li key={item.title} className={styles.proofCard}>
              <div className={styles.areaText}>
                <h3 className={styles.areaTitle}>{item.title}</h3>
                <p className={styles.muted}>{item.text}</p>
              </div>
              <Button variant="secondary" href={item.action.href}>
                {item.action.label}
              </Button>
            </li>
          ))}
        </ul>
        <div className={styles.clutch}>
          <Image src={clutch} alt={about.clutch.alt} width={203} height={99} />
          <p className={styles.faint}>{about.clutch.text}</p>
          <Button variant="secondary" href={about.clutch.action.href} target="_blank" rel="noopener noreferrer">
            {about.clutch.action.label}
          </Button>
        </div>
      </Section>

      <Section>
        <Cta size="md" title={about.cta.title} description={about.cta.description} primary={about.cta.action} />
      </Section>
    </>
  )
}
