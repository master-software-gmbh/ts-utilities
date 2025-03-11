import type { Migration, MigrationProvider } from 'kysely';
import { adHocGeneration } from '../../kysely';

export class CmsMigrations implements MigrationProvider {
  async getMigrations(): Promise<Record<string, Migration>> {
    return {
      '0001_create_cms_document': {
        up(db) {
          return db.schema
            .createTable('cms_document')
            .addColumn('id', 'text', (col) => col.primaryKey().notNull())
            .addColumn('created_at', 'integer', (col) => col.notNull())
            .addColumn('updated_at', 'integer', (col) => col.notNull())
            .addColumn('title', 'text', (col) => col.notNull())
            .execute();
        },
        down(db) {
          return db.schema.dropTable('cms_document').execute();
        },
      },
      '0002_create_cms_block': {
        up(db) {
          return db.schema
            .createTable('cms_block')
            .addColumn('id', 'text', (col) => col.primaryKey().notNull())
            .addColumn('created_at', 'integer', (col) => col.notNull())
            .addColumn('updated_at', 'integer', (col) => col.notNull())
            .addColumn('type', 'text', (col) => col.notNull())
            .addColumn('content', 'jsonb', (col) => col.notNull())
            .addColumn('document_id', 'text', (col) =>
              col.notNull().references('cms_document.id').onUpdate('cascade').onDelete('cascade'),
            )
            .execute();
        },
        down(db) {
          return db.schema.dropTable('cms_block').execute();
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new CmsMigrations());
}
