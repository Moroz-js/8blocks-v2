'use client'

import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { tokenLabContent } from '@/shared/content/tokenLabPage'
import styles from './TokenLabPage.module.scss'

const ease = 'easeOut' as const
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease, delay },
})
const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease, delay },
})

const arrow = (
  <span className={styles.ctaArrow} aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

const { hero, howItWorks, features, audience, tiers, cta, methodology } = tokenLabContent

export function TokenLabPage() {
  const surfaceRef = useRef<HTMLDivElement>(null)

  const handleSurfaceMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = surfaceRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    el.style.setProperty('--spot-opacity', '1')
  }, [])

  const handleSurfaceLeave = useCallback(() => {
    surfaceRef.current?.style.setProperty('--spot-opacity', '0')
  }, [])

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Hero">
        <div className={styles.heroBlobs}>
          <div className={`${styles.blob} ${styles.blobA}`} />
          <div className={`${styles.blob} ${styles.blobB}`} />
          <div className={`${styles.blob} ${styles.blobC}`} />
        </div>
        <div className={styles.heroInner}>
          <motion.div className={styles.heroBadges} {...fadeUp(0)}>
            {hero.badges.map((b) => (
              <span key={b} className={styles.heroBadge}>{b}</span>
            ))}
          </motion.div>
          <motion.h1 className={styles.heroHeadline} {...fadeUp(0.08)}>
            {hero.headline}
          </motion.h1>
          <motion.p className={styles.heroDescription} {...fadeUp(0.18)}>
            {hero.description}
          </motion.p>
          <motion.div className={styles.heroCtas} {...fadeUp(0.28)}>
            {hero.ctas.map((c, i) => (
              <Link
                key={c.href}
                href={c.href}
                className={`${styles.heroCta} ${i === 0 ? styles.heroCtaPrimary : ''}`}
              >
                {c.label}
                {arrow}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className={styles.section} aria-label={howItWorks.label}>
        <div className={styles.container}>
          <div className={styles.v1Grid}>
            <div className={styles.v1Left}>
              <p className={styles.sectionLabel}>{howItWorks.label}</p>
              <h2 className={styles.v1LeftHeadline}>
                {howItWorks.headline}
              </h2>
              <Link href="https://t.me/eightblocks_tokenlab_bot/tokenlab" className={styles.v1Cta}>
                {howItWorks.ctaLabel} {arrow}
              </Link>
            </div>

            <div className={styles.v1Flow}>
              <div className={styles.v1FlowLine} aria-hidden="true" />

              {howItWorks.steps.map((step, i) => {
                const visualClasses = [
                  styles.v1Visual,
                  i === 1 ? styles.v1VisualAnalysis : '',
                  i === 2 ? styles.v1VisualOutput : '',
                ].filter(Boolean).join(' ')

                return (
                  <motion.div
                    key={i}
                    className={styles.v1Step}
                    {...fadeInView(i * 0.12)}
                  >
                    <div className={styles.v1Dot} aria-hidden="true" />

                    <div className={styles.v1Text}>
                      <p className={styles.v1StepLabel}>{howItWorks.stepPrefix} {String(i + 1).padStart(2, '0')}</p>
                      <h3 className={styles.v1Title}>{step.title}</h3>
                      <p className={styles.v1Desc}>{step.description}</p>
                    </div>

                    <div className={visualClasses}>
                      {i === 0 && (
                        <>
                          <div className={styles.mockFields}>
                            <div className={styles.mockField}>token name</div>
                            <div className={styles.mockField}>ticker</div>
                            <div className={styles.mockField}>total supply</div>
                          </div>
                          <div className={styles.mockBar}>
                            {[18, 15, 20, 12, 10, 8, 10, 7].map((w, j) => (
                              <div key={j} className={styles.mockSeg} style={{ flex: w }} />
                            ))}
                          </div>
                          <div className={`${styles.mockBadge} ${styles.mockBadgeGreen}`}>✓ 100% allocated</div>
                        </>
                      )}
                      {i === 1 && (
                        <>
                          <svg className={styles.mockChart} viewBox="0 0 200 70" fill="none" preserveAspectRatio="none">
                            <path d="M0 65 L20 65 L20 55 L50 55 L50 42 L80 42 L80 22 L100 22 L100 28 L120 14 L140 14 L160 10 L180 6 L200 6" stroke="url(#cg1)" strokeWidth="2" fill="none" />
                            <path d="M0 65 L20 65 L20 55 L50 55 L50 42 L80 42 L80 22 L100 22 L100 28 L120 14 L140 14 L160 10 L180 6 L200 6 L200 70 L0 70Z" fill="url(#cg1)" opacity="0.06" />
                            <circle cx="100" cy="28" r="3" fill="#fbbf24" />
                            <defs><linearGradient id="cg1" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#C24E88" /><stop offset="1" stopColor="#8E4ABD" /></linearGradient></defs>
                          </svg>
                          <div className={styles.mockMarkers}>
                            <span>TGE</span><span>Cliff</span><span>Linear</span>
                          </div>
                          <div className={`${styles.mockBadge} ${styles.mockBadgeWarn}`}>⚠ Spike detected</div>
                        </>
                      )}
                      {i === 2 && (
                        <>
                          <div className={styles.mockGrade}>A-</div>
                          <div className={styles.mockScoreBars}>
                            {[
                              { label: 'Allocation', pct: 85 },
                              { label: 'Insider', pct: 70 },
                              { label: 'TGE Ready', pct: 90 },
                              { label: 'Vesting', pct: 78 },
                            ].map((s) => (
                              <div key={s.label} className={styles.mockScoreRow}>
                                <span>{s.label}</span>
                                <div className={styles.mockScoreTrack}>
                                  <div className={styles.mockScoreFill} style={{ width: `${s.pct}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className={styles.mockActions}>
                            <span>↓ PDF</span>
                            <span>→ Full audit</span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>


      {/* ── Features — bento grid ──────────────────────────────── */}
      <section className={styles.section} aria-label={features.label}>
        <div className={styles.container}>
          <motion.p className={styles.sectionLabel} {...fadeInView()}>
            {features.label}
          </motion.p>
          <motion.h2 className={styles.sectionHeadline} {...fadeInView(0.06)}>
            {features.headline}
          </motion.h2>

          <div className={styles.bentoGrid}>
            {features.items.map((item, i) => (
              <motion.div
                key={i}
                className={`${styles.bentoCard} ${(i === 0 || i === 3 || i === 4) ? styles.bentoWide : ''}`}
                {...fadeInView(i * 0.06)}
              >
                <h3 className={styles.bentoCardTitle}>{item.title}</h3>
                <p className={styles.bentoCardDesc}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audience — split layout ────────────────────────────── */}
      <section className={styles.section} aria-label={audience.label}>
        <div className={styles.container}>
          <motion.p className={styles.sectionLabel} {...fadeInView()}>
            {audience.label}
          </motion.p>

          <div className={styles.audienceGrid}>
            <div className={styles.audienceLeft}>
              <motion.h2 className={styles.audienceHeadline} {...fadeInView(0.06)}>
                {audience.headline}
              </motion.h2>
            </div>

            <div className={styles.audienceList}>
              {audience.items.map((item, i) => (
                <motion.div
                  key={i}
                  className={styles.audienceItem}
                  {...fadeInView(i * 0.08)}
                >
                  <h3 className={styles.audienceTitle}>{item.title}</h3>
                  <p className={styles.audienceDesc}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tiers — unified surface ────────────────────────────────── */}
      <section className={styles.tiersSection} aria-label={tiers.label}>
        <div className={styles.tiersInner}>
          <motion.div className={styles.tiersIntro} {...fadeInView()}>
            <p className={styles.tiersLabel}>{tiers.label}</p>
            <h2 className={styles.tiersHeadline}>{tiers.headline}</h2>
            <p className={styles.tiersDesc}>{tiers.description}</p>
          </motion.div>

          <motion.div
            className={styles.tiersSurface}
            ref={surfaceRef}
            onMouseMove={handleSurfaceMove}
            onMouseLeave={handleSurfaceLeave}
            {...fadeInView(0.1)}
          >
            <div className={styles.tiersSpotlight} aria-hidden="true" />
            <div className={styles.tiersSeam} aria-hidden="true" />

            <div className={`${styles.tiersZone} ${styles.tiersZoneSelf}`}>
              <p className={styles.tiersZoneTag}>{tiers.selfServe.tag}</p>
              <h3 className={styles.tiersZoneTitle}>{tiers.selfServe.title}</h3>
              <p className={styles.tiersZoneDesc}>{tiers.selfServe.description}</p>
            </div>

            <div className={`${styles.tiersZone} ${styles.tiersZoneExpert}`}>
              <p className={styles.tiersZoneTag}>{tiers.expert.tag}</p>
              <h3 className={styles.tiersZoneTitle}>{tiers.expert.title}</h3>
              <p className={styles.tiersZoneDesc}>{tiers.expert.description}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className={styles.ctaSection} aria-label="Call to action">
        <motion.div className={styles.ctaInner} {...fadeInView()}>
          <h2 className={styles.ctaHeadline}>{cta.headline}</h2>
          <p className={styles.ctaDescription}>{cta.description}</p>
          <div className={styles.ctaActions}>
            <Link href={cta.primaryHref} className={`${styles.heroCta} ${styles.heroCtaPrimary}`}>
              {cta.primaryLabel}
              {arrow}
            </Link>
            <Link href={cta.secondaryHref} className={styles.heroCta}>
              {cta.secondaryLabel}
              {arrow}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Methodology — horizontal rows ──────────────────────── */}
      <section className={styles.section} aria-label={methodology.label}>
        <div className={styles.container}>
          <motion.p className={styles.sectionLabel} {...fadeInView()}>
            {methodology.label}
          </motion.p>
          <motion.h2 className={styles.sectionHeadline} {...fadeInView(0.06)}>
            {methodology.headline}
          </motion.h2>

          <div className={styles.methodologyList}>
            {methodology.items.map((item, i) => (
              <motion.div
                key={i}
                className={styles.methodologyRow}
                {...fadeInView(i * 0.06)}
              >
                <span className={styles.methodologyNumber}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.methodologyTitle}>{item.title}</h3>
                <p className={styles.methodologyDesc}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
