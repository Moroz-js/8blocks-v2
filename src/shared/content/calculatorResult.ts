import { lang } from '@/shared/i18n'
import * as en from './en/calculatorResult'
import * as ru from './ru/calculatorResult'

export type { CalculatorResultContent } from './en/calculatorResult'

export const calculatorResult = lang === 'ru' ? ru.calculatorResult : en.calculatorResult
