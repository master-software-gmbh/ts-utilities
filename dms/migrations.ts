import type { Migration, MigrationProvider } from 'kysely';
import '../kysely/migrations/utils';
import { adHocGeneration } from '../kysely';

export class DmsMigrationProvider implements MigrationProvider {
  private readonly fileRef?: string;
  private readonly creatorRef?: string;

  constructor(fileRef?: string, creatorRef?: string) {
    this.fileRef = fileRef;
    this.creatorRef = creatorRef;
  }

  async getMigrations(): Promise<Record<string, Migration>> {
    return {
      '0001_add_dms_document_table': {
        up: (db) => {
          return db.schema
            .createTable('dms_document')
            .addUUIDColumn('id')
            .addColumn('status', 'text', (col) => col.notNull())
            .execute();
        },
        down: (db) => {
          return db.schema.dropTable('dms_document').execute();
        },
      },
      '0002_add_dms_revision_table': {
        up: (db) => {
          return db.schema
            .createTable('dms_revision')
            .addUUIDColumn('id')
            .addTimestampColumn('created_at')
            .addColumn('title', 'text', (col) => col.notNull())
            .addColumn('file_id', 'text', (col) => {
              col = col.notNull();

              if (this.fileRef) {
                col = col.references(this.fileRef).onUpdate('cascade').onDelete('restrict');
              }

              return col;
            })
            .addColumn('document_id', 'text', (col) =>
              col.notNull().references('dms_document.id').onUpdate('cascade').onDelete('cascade'),
            )
            .addColumn('creator_id', 'text', (col) => {
              col = col.notNull();

              if (this.creatorRef) {
                col = col.references(this.creatorRef).onUpdate('cascade').onDelete('restrict');
              }

              return col;
            })
            .execute();
        },
        down: (db) => {
          return db.schema.dropTable('dms_revision').execute();
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new DmsMigrationProvider());
}
