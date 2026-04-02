import { lang } from '@/shared/i18n'
import * as ru from './ru/uiStrings'
import * as en from './en/uiStrings'

const locale = lang === 'ru' ? ru : en

export const uiStrings = locale.uiStrings
