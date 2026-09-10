import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_events_our_role'
      ) THEN
        CREATE TYPE "public"."enum_events_our_role" AS ENUM('none', 'speaker', 'host', 'cohost');
      END IF;
    END $$;

    ALTER TABLE "events"
      ADD COLUMN IF NOT EXISTS "our_role" "public"."enum_events_our_role" NOT NULL DEFAULT 'none';

    -- Migrate old per-representative data: if any representative had is_speaker=true, mark event as speaker
    UPDATE "events" e
    SET "our_role" = 'speaker'
    WHERE EXISTS (
      SELECT 1 FROM "events_representatives" r
      WHERE r._parent_id = e.id AND r.is_speaker = true
    )
    AND e."our_role" = 'none';

    -- Migrate host role: if any representative had host_role != 'none', take the highest role
    UPDATE "events" e
    SET "our_role" = CASE
      WHEN EXISTS (
        SELECT 1 FROM "events_representatives" r
        WHERE r._parent_id = e.id AND r.host_role = 'host'
      ) THEN 'host'::"public"."enum_events_our_role"
      WHEN EXISTS (
        SELECT 1 FROM "events_representatives" r
        WHERE r._parent_id = e.id AND r.host_role = 'cohost'
      ) THEN 'cohost'::"public"."enum_events_our_role"
      ELSE e."our_role"
    END
    WHERE EXISTS (
      SELECT 1 FROM "events_representatives" r
      WHERE r._parent_id = e.id AND r.host_role != 'none'
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" DROP COLUMN IF EXISTS "our_role";
    DROP TYPE IF EXISTS "public"."enum_events_our_role";
  `)
}
