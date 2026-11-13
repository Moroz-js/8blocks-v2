import { lang } from '@/shared/i18n'
import * as ru from './ru/vestingBenchmarks'
import * as en from './en/vestingBenchmarks'

export const vestingBenchmarksContent = (lang === 'ru' ? ru : en).vestingBenchmarksContent
