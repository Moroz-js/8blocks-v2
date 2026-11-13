import { lang } from '@/shared/i18n'
import * as ru from './ru/calculatorV2'
import * as en from './en/calculatorV2'

const locale = lang === 'ru' ? ru : en

export const calculatorV2 = locale.calculatorV2
