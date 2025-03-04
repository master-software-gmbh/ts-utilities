import type { Kysely } from 'kysely';
import type { CmsDocument } from '../domain/document';
import type { CmsRepository } from '../domain/repository';
import type { DB } from '../database/types';
import type { CmsBlock } from '../domain/block';
import { jsonArrayFrom } from 'kysely/helpers/sqlite';

export class CmsRepositoryImpl implements CmsRepository {
  private readonly database: Kysely<DB>;

  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  async insert(entity: CmsDocument): Promise<void> {
    await this.database.transaction().execute(async (transaction) => {
      await transaction
        .insertInto('cms_document')
        .values({
          id: entity.id,
          title: entity.title,
          created_at: entity.createdAt.getTime(),
          updated_at: entity.updatedAt.getTime(),
        })
        .execute();

      if (entity.blocks.isNotEmpty()) {
        await transaction
          .insertInto('cms_block')
          .values(
            entity.blocks.map((block) => ({
              id: block.id,
              type: block.type,
              document_id: entity.id,
              content: JSON.stringify(block.content),
              created_at: block.createdAt.getTime(),
              updated_at: block.updatedAt.getTime(),
            })),
          )
          .execute();
      }
    });
  }

  async update(entity: CmsDocument): Promise<void> {
    await this.database.transaction().execute(async (transaction) => {
      await transaction
        .updateTable('cms_document')
        .set({
          title: entity.title,
          updated_at: entity.updatedAt.getTime(),
        })
        .where('id', '=', entity.id)
        .execute();

      await transaction.deleteFrom('cms_block').where('cms_block.document_id', '=', entity.id).execute();

      await transaction
        .insertInto('cms_block')
        .values(
          entity.blocks.map((block) => ({
            id: block.id,
            type: block.type,
            document_id: entity.id,
            content: JSON.stringify(block.content),
            created_at: block.createdAt.getTime(),
            updated_at: block.updatedAt.getTime(),
          })),
        )
        .execute();
    });
  }

  async delete(id: string): Promise<void> {
    await this.database.transaction().execute(async (transaction) => {
      await transaction.deleteFrom('cms_block').where('cms_block.document_id', '=', id).execute();
      await transaction.deleteFrom('cms_document').where('cms_document.id', '=', id).execute();
    });
  }

  async findById(id: string): Promise<CmsDocument | null> {
    const result = await this.database
      .selectFrom('cms_document')
      .selectAll()
      .select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('cms_block')
            .select([
              'cms_block.id',
              'cms_block.type',
              'cms_block.content',
              'cms_block.created_at',
              'cms_block.updated_at',
              'cms_block.document_id',
            ])
            .where('cms_block.document_id', '=', eb.ref('cms_document.id')),
        ).as('blocks'),
      )
      .where('cms_document.id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return this.mapDocument(result);
  }

  async findAll(): Promise<CmsDocument[]> {
    const results = await this.database
      .selectFrom('cms_document')
      .selectAll()
      .select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('cms_block')
            .select([
              'cms_block.id',
              'cms_block.type',
              'cms_block.content',
              'cms_block.created_at',
              'cms_block.updated_at',
              'cms_block.document_id',
            ])
            .where('cms_block.document_id', '=', eb.ref('cms_document.id')),
        ).as('blocks'),
      )
      .orderBy('cms_document.updated_at desc')
      .execute();

    return results.map((row) => this.mapDocument(row));
  }

  private mapDocument(row: DB['cms_document'] & { blocks: DB['cms_block'][] }): CmsDocument {
    return {
      id: row.id,
      title: row.title,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      blocks: row.blocks.map((row) => this.mapBlock(row)),
    };
  }

  private mapBlock(row: DB['cms_block']): CmsBlock {
    return {
      id: row.id,
      type: row.type,
      content: row.content,
      documentId: row.document_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
