import type { Migration, MigrationProvider } from 'kysely';
import { adHocGeneration } from '../../kysely';
import { logger } from '../../logging';

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
      '0003_update_cms_block_table': {
        up(db) {
          return db.schema.alterTable('cms_block').dropColumn('created_at').execute();
        },
      },
      '0004_update_cms_block_table': {
        up(db) {
          return db.schema.alterTable('cms_block').dropColumn('updated_at').execute();
        },
      },
      '0005_update_cms_block_table': {
        async up(db) {
          await db.transaction().execute(async (transaction) => {
            await transaction.schema
              .alterTable('cms_block')
              .addColumn('parent_id', 'text', (col) =>
                col.references('cms_block.id').onUpdate('cascade').onDelete('cascade'),
              )
              .execute();

            await transaction.schema
              .alterTable('cms_block')
              .addColumn('position', 'integer', (col) => col.notNull().defaultTo(0))
              .execute();

            // Migrate existing documents to blocks

            const documents = (await transaction.selectFrom('cms_document').selectAll().execute()) as {
              id: string;
              title: string;
            }[];

            for (const document of documents) {
              logger.info('Migrating CMS document', { id: document.id, title: document.title });

              const blocks = (await transaction
                .selectFrom('cms_block')
                .selectAll()
                .where('cms_block.document_id', '=', document.id)
                .execute()) as {
                id: string;
              }[];

              // Create a root block for each document

              await transaction
                .insertInto('cms_block')
                .values({
                  id: document.id,
                  parent_id: null,
                  type: 'document',
                  document_id: document.id,
                  content: JSON.stringify({
                    title: document.title,
                  }),
                })
                .onConflict((oc) => oc.doNothing())
                .execute();

              logger.info('Created root block', { id: document.id });

              // Set parent_id for all blocks in the document

              logger.info('Migrating blocks', { document_id: document.id, block_count: blocks.length });

              for (const [index, block] of blocks.entries()) {
                await transaction
                  .updateTable('cms_block')
                  .set({
                    position: index,
                    parent_id: document.id,
                  })
                  .where('cms_block.id', '=', block.id)
                  .execute();

                logger.info('Updated block with parent_id', { id: block.id, parent_id: document.id, position: index });
              }
            }
          });
        },
      },
    };
  }
}

if (import.meta.main) {
  await adHocGeneration(import.meta.dir, new CmsMigrations());
}
