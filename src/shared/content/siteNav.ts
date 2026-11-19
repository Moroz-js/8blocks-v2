import { lang } from '@/shared/i18n'
import * as ru from './ru/siteNav'
import * as en from './en/siteNav'

const locale = lang === 'ru' ? ru : en

export const siteNav = locale.siteNav
export type SiteNav = typeof en.siteNav
export type SiteNavGroup = SiteNav['groups'][number]
