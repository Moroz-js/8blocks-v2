import { lang } from '@/shared/i18n'
import * as ru from './ru/tokenLaunch'
import * as en from './en/tokenLaunch'

const locale = lang === 'ru' ? ru : en

export const tokenLaunchContent = locale.tokenLaunchContent
export const tokenLaunchMeta = locale.tokenLaunchMeta
