'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ScrollRevealText } from '@/shared/ui/ScrollRevealText/ScrollRevealText'
import { ContactForm } from '@/features/contactForm/ContactForm'
import { siteConfig, socialLinks } from '@/shared/config/site'
import styles from './ContactPage.module.scss'

const ease = 'easeOut' as const

// ── Calendly inline embed ─────────────────────────────────────────

function CalendlyEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const head = document.head

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    head.appendChild(script)

    return () => {
      if (head.contains(link)) head.removeChild(link)
      if (head.contains(script)) head.removeChild(script)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget"
      data-url="https://calendly.com/care-8blocks/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=a10a63"
      style={{ minWidth: '320px', height: '680px' }}
    />
  )
}

// ── Main component ────────────────────────────────────────────────

export function ContactPage() {
  return (
    <>
      {/* ── 1. Hero: avatar + form ────────────────────────────────── */}
      <section className={styles.hero} aria-label="Контакты">
        <div className={styles.heroInner}>
          <div className={styles.heroGrid}>

            {/* Left: info + avatar */}
            <motion.div
              className={styles.heroLeft}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.05 }}
            >
              <span className={styles.label}>Контакты</span>

              <h1 className={styles.heroHeadline}>Обсудим ваш проект</h1>

              <p className={styles.heroDescription}>
                Пишите по вопросам стратегического консалтинга, токеномики и аудита.
                Если удобнее, сразу выберите слот для звонка.
              </p>

              <div className={styles.personCard}>
                <div className={styles.personAvatar}>
                  <Image
                    src="/team/team-3.png"
                    alt="Оксана"
                    width={72}
                    height={72}
                    className={styles.personImg}
                  />
                </div>
                <div className={styles.personInfo}>
                  <p className={styles.personName}>Оксана</p>
                  <p className={styles.personRole}>COO</p>
                  <a
                    href="https://t.me/Eight_Blocks"
                    className={styles.personTg}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram →
                  </a>
                </div>
              </div>

              <div className={styles.preferEmail}>
                <p className={styles.preferLabel}>Предпочитаете почту?</p>
                <a href={`mailto:${siteConfig.email}`} className={styles.preferValue}>
                  {siteConfig.email}
                </a>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              className={styles.heroRight}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.15 }}
            >
              <ContactForm />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. Secondary contacts ─────────────────────────────────── */}
      <section className={styles.contactsSection} aria-label="Контактная информация">
        <div className={styles.contactsInner}>
          <motion.div
            className={styles.contactCol}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: 0 }}
          >
            <p className={styles.contactColLabel}>Соцсети</p>
            <div className={styles.socialList}>
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={styles.contactCol}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: 0.08 }}
          >
            <p className={styles.contactColLabel}>Адрес</p>
            <a
              href={siteConfig.addressUrl}
              className={styles.contactValue}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.address}
            </a>
          </motion.div>

          <motion.div
            className={styles.contactCol}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: 0.16 }}
          >
            <p className={styles.contactColLabel}>Телефон</p>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className={styles.contactValue}>
              {siteConfig.phone}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Calendly ───────────────────────────────────────────── */}
      <section id="calendly" className={styles.calendlySection} aria-label="Забронировать звонок">
        <div className={styles.calendlyInner}>
          <motion.div
            className={styles.calendlyLeft}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease }}
          >
            <ScrollRevealText text="Забронировать звонок" className={styles.calendlyHeadline} />
            <ScrollRevealText
              text="Выберите удобное время, и мы обсудим задачу, контекст проекта и возможный формат работы."
              className={styles.calendlyDescription}
            />
            <ul className={styles.calendlyList}>
              <li>Стратегический консалтинг</li>
              <li>Разработка токеномики</li>
              <li>Аудит текущей модели</li>
            </ul>
          </motion.div>

          <motion.div
            className={styles.calendlyRight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease, delay: 0.1 }}
          >
            <div className={styles.calendlyEmbed}>
              <CalendlyEmbed />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
