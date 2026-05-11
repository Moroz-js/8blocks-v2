import { lang } from '@/shared/i18n'
import * as ru from './ru/mediaPage'
import * as en from './en/mediaPage'

const locale = lang === 'ru' ? ru : en

export const mediaMeta = locale.mediaMeta
export const mediaArchiveContent = locale.mediaArchiveContent
