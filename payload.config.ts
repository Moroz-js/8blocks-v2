import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  lexicalEditor,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
  InlineCodeFeature,
  HorizontalRuleFeature,
  LinkFeature,
  UploadFeature,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  Users,
  Media,
  Authors,
  Categories,
  Articles,
  Leads,
  NewsletterSubscriptions,
  MediaMentions,
  MediaCategories,
  PublicAudits,
  Research,
  LaunchModules,
  Cases,
  EventOrganizers,
  Events,
} from './payload/collections/index.ts'
import { SiteSeo } from './payload/globals/index.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const payloadSecret = process.env.PAYLOAD_SECRET

if (!payloadSecret) {
  throw new Error('PAYLOAD_SECRET is required')
}

export default buildConfig({
  // ── Admin UI language (Payload), не путать с NEXT_PUBLIC_LANG на фронте ──
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: 'ru',
    translations: {
      ru: {
        general: {
          true: 'Да',
          false: 'Нет',
        },
      },
    },
  },

  // ── Admin ───────────────────────────────────────────────────────
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' | 8Blocks CMS',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // ── Global rich text default editor ────────────────────────────
  editor: lexicalEditor({
    features: [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      BlockquoteFeature(),
      InlineCodeFeature(),
      HorizontalRuleFeature(),
      LinkFeature(),
      UploadFeature({ maxDepth: 2 }),
    ],
  }),

  // ── Collections ─────────────────────────────────────────────────
  collections: [
    Users,
    Media,
    Authors,
    Categories,
    Articles,
    Leads,
    NewsletterSubscriptions,
    MediaMentions,
    MediaCategories,
    PublicAudits,
    Research,
    LaunchModules,
    Cases,
    EventOrganizers,
    Events,
  ],

  globals: [SiteSeo],

  // ── Secret & Security ───────────────────────────────────────────
  secret: payloadSecret,

  // ── TypeScript output ───────────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ── Database ─────────────────────────────────────────────────────
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Явный UTF-8 на канале клиента ↔ Postgres (иначе кириллица может стать «?» при несовпадении кодировок).
      options: '-c client_encoding=UTF8',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: false,
  }),

  // ── Image processing ─────────────────────────────────────────────
  sharp,

  // ── Uploads ──────────────────────────────────────────────────────
  upload: {
    limits: {
      fileSize: 100_000_000, // 100 MB: записи событий и презентации
    },
  },

  // ── Localization (not required yet, single language) ─────────────
  // localization: undefined,

  // ── Routes ───────────────────────────────────────────────────────
  routes: {
    admin: '/admin',
    api: '/api',
  },
})
