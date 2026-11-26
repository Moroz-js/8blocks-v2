import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public_audits" ADD COLUMN "pdf_file_id" integer
      REFERENCES "media"("id") ON DELETE SET NULL;
    CREATE INDEX "public_audits_pdf_file_idx" ON "public_audits" ("pdf_file_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "public_audits" DROP COLUMN "pdf_file_id";`)
}
