import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $enum_cases_category$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cases_category') THEN
        CREATE TYPE "enum_cases_category" AS ENUM('DeFi', 'GameFi', 'RWA', 'Finance');
      END IF;
    END $enum_cases_category$;

    ALTER TABLE "cases"
      ADD COLUMN IF NOT EXISTS "category" "enum_cases_category";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cases" DROP COLUMN IF EXISTS "category";
    DROP TYPE IF EXISTS "enum_cases_category";
  `)
}
