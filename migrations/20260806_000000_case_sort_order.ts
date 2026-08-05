import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cases"
      ADD COLUMN IF NOT EXISTS "sort_order" numeric;

    CREATE INDEX IF NOT EXISTS "cases_sort_order_idx"
      ON "cases" USING btree ("sort_order");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "cases_sort_order_idx";
    ALTER TABLE "cases" DROP COLUMN IF EXISTS "sort_order";
  `)
}
