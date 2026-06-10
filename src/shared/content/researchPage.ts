import { lang } from '@/shared/i18n'
import * as ru from './ru/researchPage'
import * as en from './en/researchPage'

const locale = lang === 'ru' ? ru : en

export const researchMeta = locale.researchMeta
export const researchArchiveContent = locale.researchArchiveContent
