'use client'

import { usePathname } from 'next/navigation'
import { lang } from '@/shared/i18n'
import styles from './StagingBar.module.scss'

const buildAt = process.env.NEXT_PUBLIC_BUILD_AT
const enBaseUrl = process.env.NEXT_PUBLIC_STAGING_EN_URL || 'https://staging.8blocks.io'
const ruBaseUrl = process.env.NEXT_PUBLIC_STAGING_RU_URL || 'https://staging.8blocks.io/ru'

function formatBuildDate(value: string | undefined) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date)
}

function joinUrl(base: string, pathname: string) {
  const normalizedBase = base.replace(/\/$/, '')
  const normalizedPath = pathname === '/' ? '' : pathname
  return `${normalizedBase}${normalizedPath}`
}

export function StagingBar() {
  const pathname = usePathname()
  const languageNeutralPath = pathname.replace(/^\/ru(?=\/|$)/, '') || '/'
  const formattedBuildAt = formatBuildDate(buildAt)

  return (
    <aside className={styles.bar} aria-label={lang === 'ru' ? 'Панель стейджинга' : 'Staging toolbar'}>
      <div className={styles.inner}>
        <span className={styles.updated}>
          {formattedBuildAt
            ? `${lang === 'ru' ? 'Обновлено' : 'Updated'} ${formattedBuildAt}`
            : lang === 'ru' ? 'Стейджинг' : 'Staging'}
        </span>

        <nav className={styles.languages} aria-label={lang === 'ru' ? 'Версия сайта' : 'Site version'}>
          {lang === 'en' ? (
            <span className={styles.active} aria-current="page">EN</span>
          ) : (
            <a className={styles.link} href={joinUrl(enBaseUrl, languageNeutralPath)}>EN</a>
          )}
          {lang === 'ru' ? (
            <span className={styles.active} aria-current="page">RU</span>
          ) : (
            <a className={styles.link} href={joinUrl(ruBaseUrl, languageNeutralPath)}>RU</a>
          )}
        </nav>
      </div>
    </aside>
  )
}
