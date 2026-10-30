import { lang } from '@/shared/i18n'
import * as ru from './ru/casesPage'
import * as en from './en/casesPage'

const locale = lang === 'ru' ? ru : en

export const casesContent = locale.casesContent
export const casesMeta = locale.casesMeta
export const casesUiContent = locale.casesUiContent
