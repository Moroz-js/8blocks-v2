import { lang } from '@/shared/i18n'
import * as ru from './ru/tokenLabPage'
import * as en from './en/tokenLabPage'

const locale = lang === 'ru' ? ru : en

export const tokenLabContent = locale.tokenLabContent
export const tokenLabMeta = locale.tokenLabMeta
