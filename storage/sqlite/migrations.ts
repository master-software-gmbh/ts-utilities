import type { Migration, MigrationProvider } from 'kysely';
import { adHocGeneration } from '../../kysely';
import '../../kysely/migration';

export class BlobMigrationProvider implements MigrationProvider {
  async getMigrations(): Promise<Record<string, Migration>> {
    return {
      '0001_add_storage_blob_table': {
        up(db) {
          return db.schema
            .createTable('storage_blob')
            .addUUIDColumn('id')
            .addTimestampColumn('created_at')
            .addColumn('data', 'blob', (col) => col.notNull())
            .execute();
        },
        down(db) {
          return db.schema.dropTable('storage_blob').execute();
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new BlobMigrationProvider());
}
