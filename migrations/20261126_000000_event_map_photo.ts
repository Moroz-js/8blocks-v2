import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" ADD COLUMN "map_photo_id" integer REFERENCES "media"("id") ON DELETE SET NULL;
    CREATE INDEX "events_map_photo_idx" ON "events" ("map_photo_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "events" DROP COLUMN "map_photo_id";`)
}
