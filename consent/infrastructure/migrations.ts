import type { Migration, MigrationProvider } from 'kysely';
import { adHocGeneration } from '../../kysely';

export class ConsentMigrationProvider implements MigrationProvider {
  async getMigrations(): Promise<Record<string, Migration>> {
    return {
      '0001_add_consent_table': {
        up(db) {
          return db.schema
            .createTable('consent')
            .addUUIDColumn('id')
            .addTimestampColumn('created_at')
            .addColumn('status', 'text', (col) => col.notNull())
            .addColumn('subject', 'text', (col) => col.notNull())
            .addColumn('purpose', 'text', (col) => col.notNull())
            .execute();
        },
        down(db) {
          return db.schema.dropTable('consent').execute();
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new ConsentMigrationProvider());
}
