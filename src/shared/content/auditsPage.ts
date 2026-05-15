import { lang } from '@/shared/i18n'
import * as ru from './ru/auditsPage'
import * as en from './en/auditsPage'

const locale = lang === 'ru' ? ru : en

export const auditsMeta = locale.auditsMeta
export const auditsArchiveContent = locale.auditsArchiveContent
