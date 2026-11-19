import { lang } from '@/shared/i18n'
import * as en from './en/digitalAssets'
import * as ru from './ru/digitalAssets'

export type { CountryId, DigitalAssetsContent } from './en/digitalAssets'

export const digitalAssets = lang === 'ru' ? ru.digitalAssets : en.digitalAssets
