import { lang } from '@/shared/i18n'
import * as ru from './ru/casesPage'
import * as en from './en/casesPage'

const locale = lang === 'ru' ? ru : en

export type { CaseTag } from './ru/casesPage'
export type { CaseStudy } from './ru/casesPage'

export const casesContent = locale.casesContent
export const cases = locale.cases
export const allTags = locale.allTags
export const casesMeta = locale.casesMeta
export const casesUiContent = locale.casesUiContent
