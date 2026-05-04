import { lang } from '@/shared/i18n'
import * as ru from './ru/workshop'
import * as en from './en/workshop'

const locale = lang === 'ru' ? ru : en

export const workshopContent = locale.workshopContent
export const workshopMeta = locale.workshopMeta
