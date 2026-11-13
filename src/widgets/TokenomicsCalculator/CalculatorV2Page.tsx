import Image from 'next/image'
import Link from 'next/link'
import { AccentSurface, Button, Faq, Section } from '@/shared/ds'
import { calculatorV2 as copy } from '@/shared/content/calculatorV2'
import { BinaryScene } from '@/widgets/BinaryArt/BinaryScene'
import { GlyphCards } from '@/widgets/ServicePages/blocks/GlyphCards'
import { Calculator } from './Calculator'
import heroFade from './assets/hero-fade.webp'
import styles from './TokenomicsCalculator.module.scss'

const TOOL_ID = 'calculator'

/** Tokenomics calculator page on design system v2 (Figma «Website», 3608:10888). */
export function CalculatorV2Page() {
  return (
    <>
      {/* Figma 3608:10889 */}
      <section data-under-header className={styles.hero} aria-labelledby="calculator-title">
        <div className={styles.glowWide} aria-hidden="true" />
        <div className={styles.glowNarrow} aria-hidden="true" />
        <div className={styles.art}>
          <BinaryScene scene="hand-coin" className={styles.artCanvas} />
        </div>
        <Image src={heroFade} alt="" className={styles.fade} sizes="100vw" />
        <div className={styles.heroInner}>
          <h1 id="calculator-title" className={styles.heroTitle}>
            <span className={styles.heroEyebrow}>{copy.hero.eyebrow}</span>
            <span>{copy.hero.title}</span>
          </h1>
          <Button href={`#${TOOL_ID}`}>{copy.hero.cta}</Button>
        </div>
      </section>

      {/* Figma 3608:10896 — the design shows the calculator as a picture; this is the live tool. */}
      <Section id={TOOL_ID} className={styles.toolSection}>
        <Calculator />
      </Section>

      {/* Figma 3608:10897 + 3608:10898 */}
      <Section>
        <div className={styles.steps}>
          <h2 className={styles.stepsTitle}>{copy.steps.title}</h2>
          <ol className={styles.stepsCard}>
            <AccentSurface />
            {copy.steps.items.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <h3 className={styles.stepTitle}>
                  {i + 1}. {step.title}
                </h3>
                <ul className={styles.stepPoints}>
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Figma 3608:11074 + 3608:11075 */}
      <Section>
        <div className={styles.features}>
          <h2 className={styles.featuresTitle}>{copy.features.title}</h2>
          <GlyphCards
            columns={3}
            height={360}
            glyph={{ height: 360 }}
            items={copy.features.items.map(({ shape, ...item }) => ({ ...item, glyph: { shape, oy: 0.34, os: 0.42 } }))}
          />
        </div>
      </Section>

      {/* Figma 3608:11096 */}
      <Section narrow>
        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>{copy.faq.title}</h2>
          <Faq
            items={copy.faq.items}
            footer={
              <>
                {copy.faq.footerText}
                <Link href="/contact">{copy.faq.footerLink}</Link>
              </>
            }
          />
        </div>
      </Section>
    </>
  )
}
