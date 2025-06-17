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
      '0002_update_consent_table': {
        up(db) {
          return db.schema
            .alterTable('consent')
            .addColumn('context', 'jsonb', (col) => col.notNull().defaultTo('{}'))
            .execute();
        },
        down(db) {
          return db.schema.alterTable('consent').dropColumn('context').execute();
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new ConsentMigrationProvider());
}
