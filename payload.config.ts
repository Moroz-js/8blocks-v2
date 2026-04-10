import { buildConfig } from 'payload'
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
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  Users,
  Media,
  Categories,
  Articles,
  Leads,
  NewsletterSubscriptions,
} from './payload/collections/index'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
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

  // ── Email (production only — SMTP not available in local dev) ────
  // PAYLOAD_SKIP_EMAIL_INIT=true — для CLI (sync-admin и т.п.), без verify SMTP
  ...(process.env.NODE_ENV === 'production' &&
  process.env.SMTP_HOST &&
  process.env.PAYLOAD_SKIP_EMAIL_INIT !== 'true'
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM || 'hi@токеномика.рф',
          defaultFromName: '8Blocks',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          },
        }),
      }
    : {}),

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
      UploadFeature(),
    ],
  }),

  // ── Collections ─────────────────────────────────────────────────
  collections: [
    Users,
    Media,
    Categories,
    Articles,
    Leads,
    NewsletterSubscriptions,
  ],

  // ── Secret & Security ───────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-in-production',

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
      fileSize: 10_000_000, // 10 MB
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
