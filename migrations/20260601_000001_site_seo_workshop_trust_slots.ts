import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Поля глобала «Глобальное SEO» для текста про слоты воркшопа (RU/EN).
 * Вынесено отдельно: initial_schema уже мог быть применён до появления колонок.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_seo" ADD COLUMN IF NOT EXISTS "workshop_trust_slots_note_ru" varchar;
  ALTER TABLE "site_seo" ADD COLUMN IF NOT EXISTS "workshop_trust_slots_note_en" varchar;

  UPDATE "site_seo"
  SET "workshop_trust_slots_note_ru" = 'Сейчас доступно 2 слота на май.'
  WHERE "workshop_trust_slots_note_ru" IS NULL;

  UPDATE "site_seo"
  SET "workshop_trust_slots_note_en" = 'Currently 2 slots available in May.'
  WHERE "workshop_trust_slots_note_en" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_seo" DROP COLUMN IF EXISTS "workshop_trust_slots_note_en";
  ALTER TABLE "site_seo" DROP COLUMN IF EXISTS "workshop_trust_slots_note_ru";
  `)
}
