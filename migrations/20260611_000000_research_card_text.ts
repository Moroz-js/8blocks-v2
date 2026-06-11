import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "research" ADD COLUMN IF NOT EXISTS "card_text" varchar;
    UPDATE "research" SET "card_text" = "title" WHERE "card_text" IS NULL OR "card_text" = '';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "research" DROP COLUMN IF EXISTS "card_text";
  `)
}
