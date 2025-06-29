import type { Migration, MigrationProvider } from 'kysely';
import { adHocGeneration } from '../../kysely';
import '../../kysely/migrations/utils';

export class FileMigrationProvider implements MigrationProvider {
  async getMigrations(): Promise<Record<string, Migration>> {
    return {
      '0001_add_file_table': {
        up(db) {
          return db.schema
            .createTable('file')
            .addUUIDColumn('id')
            .addTimestampColumn('created_at')
            .addColumn('type', 'text', (col) => col.notNull())
            .addColumn('key', 'text', (col) => col.notNull().unique())
            .execute();
        },
        down(db) {
          return db.schema.dropTable('file').execute();
        },
      },
      '0002_update_file_table': {
        up(db) {
          return db.schema
            .alterTable('file')
            .addColumn('name', 'text', (col) => col.notNull().defaultTo(''))
            .execute();
        },
        down(db) {
          return db.schema.alterTable('file').dropColumn('name').execute();
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new FileMigrationProvider());
}
