'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
      data-url="https://calendly.com/8blocks?background_color=0a0a0a&text_color=ffffff&primary_color=c24e88"
      style={{ minWidth: '320px', height: '660px' }}
    />
  )
}

// ── Copy email button ─────────────────────────────────────────────

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silently
    }
  }

  return (
    <button className={styles.copyBtn} onClick={handleCopy} type="button">
      {copied ? 'Скопировано' : 'Скопировать почту'}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────

export function ContactPage() {
  return (
    <>
      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Контакты — hero">
        <div className={styles.heroInner}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
          >
            Контакты
          </motion.span>

          <motion.h1
            className={styles.heroHeadline}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.12 }}
          >
            Обсудим ваш проект
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.22 }}
          >
            Пишите по вопросам стратегического консалтинга, токеномики и аудита.
            Если удобнее, сразу выберите слот для звонка.
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.32 }}
          >
            <a href={`mailto:${siteConfig.email}`} className={styles.ctaPrimary}>
              Написать на почту
              <span aria-hidden="true">→</span>
            </a>
            <a href="#calendly" className={styles.ctaSecondary}>
              Забронировать звонок
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Giant email ────────────────────────────────────────── */}
      <section className={styles.emailSection} aria-label="Главный контакт">
        <div className={styles.emailInner}>
          <motion.a
            href={`mailto:${siteConfig.email}`}
            className={styles.emailGiant}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease }}
            aria-label={`Написать на ${siteConfig.email}`}
          >
            {siteConfig.email}
          </motion.a>

          <motion.div
            className={styles.emailMeta}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease, delay: 0.12 }}
          >
            <p className={styles.emailSupport}>
              Основной канал для новых проектов, партнерств и рабочих запросов
            </p>
            <CopyEmailButton email={siteConfig.email} />
          </motion.div>
        </div>
      </section>

      {/* ── 3. Secondary contacts ─────────────────────────────────── */}
      <section className={styles.contactsSection} aria-label="Вторичные контакты">
        <div className={styles.contactsInner}>
          {/* Phone */}
          <motion.div
            className={styles.contactCol}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: 0 }}
          >
            <p className={styles.contactColLabel}>Телефон</p>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className={styles.contactValue}>
              {siteConfig.phone}
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            className={styles.contactCol}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: 0.08 }}
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

          {/* Address */}
          <motion.div
            className={styles.contactCol}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, ease, delay: 0.16 }}
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
        </div>
      </section>

      {/* ── 4. Calendly ───────────────────────────────────────────── */}
      <section id="calendly" className={styles.calendlySection} aria-label="Забронировать звонок">
        <div className={styles.calendlyInner}>
          <motion.div
            className={styles.calendlyLeft}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease }}
          >
            <h2 className={styles.calendlyHeadline}>Забронировать звонок</h2>
            <p className={styles.calendlyDescription}>
              Выберите удобное время, и мы обсудим задачу, контекст проекта и возможный формат работы.
            </p>
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
