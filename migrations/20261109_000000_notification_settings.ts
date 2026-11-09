import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/** Глобал «Уведомления о заявках» — настройки Telegram-бота. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "notification_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "telegram_enabled" boolean DEFAULT false,
    "telegram_bot_token" varchar,
    "telegram_chat_id" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE INDEX IF NOT EXISTS "notification_settings_updated_at_idx" ON "notification_settings" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "notification_settings_created_at_idx" ON "notification_settings" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "notification_settings" CASCADE;
  `)
}
