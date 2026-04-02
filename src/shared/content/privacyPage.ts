// Privacy policy page — single source of truth
import { t } from '@/shared/i18n'

const localize = <T>(ru: T, en?: T) => t({ ru, en: en ?? ru })

export const privacyMeta = localize({
  title: 'Политика конфиденциальности',
  description:
    'Политика конфиденциальности 8Blocks — как мы собираем, используем и защищаем ваши персональные данные.',
  ogTitle: 'Политика конфиденциальности | 8Blocks',
  ogDescription: 'Как 8Blocks собирает, использует и защищает ваши персональные данные.',
} as const, {
  title: 'Privacy Policy',
  description: '8Blocks Privacy Policy — how we collect, use, and protect your personal data.',
  ogTitle: 'Privacy Policy | 8Blocks',
  ogDescription: 'How 8Blocks collects, uses, and protects your personal data.',
} as const)
