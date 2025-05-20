import type { Kysely, Selectable } from 'kysely';
import { type Result, error, success } from '../../result';
import type { DB } from '../database/types';
import type { CmsRepository } from '../domain/CmsRepository';
import { CmsBlock } from '../domain/model/CmsBlock';

export class CmsRepositoryImpl implements CmsRepository {
  private readonly database: Kysely<DB>;

  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  async add(entity: CmsBlock): Promise<Result<void, 'entity_already_exists'>> {
    return this.database.transaction().execute(async (transaction) => {
      const exists = await this.doesBlockExist(transaction, entity.id);

      if (exists) {
        return error('entity_already_exists');
      }

      await this.upsert(transaction, entity);

      return success();
    });
  }

  async update(entity: CmsBlock): Promise<Result<void, 'entity_doesnt_exist'>> {
    return this.database.transaction().execute(async (transaction) => {
      const exists = await this.doesBlockExist(transaction, entity.id);

      if (!exists) {
        return error('entity_doesnt_exist');
      }

      await this.upsert(transaction, entity);

      return success();
    });
  }

  async save(entity: CmsBlock): Promise<void> {
    await this.database.transaction().execute(async (transaction) => {
      await this.upsert(transaction, entity);
    });
  }

  private async upsert(transaction: Kysely<DB>, entity: CmsBlock): Promise<void> {
    const handleBlock = async (block: CmsBlock) => {
      // Upsert block itself

      await transaction
        .insertInto('cms_block')
        .values({
          id: block.id,
          type: block.type,
          position: block.position,
          parent_id: block.parentId,
          document_id: block.documentId,
          content: JSON.stringify(block.content),
        })
        .onConflict((oc) =>
          oc.doUpdateSet({
            type: block.type,
            position: block.position,
            parent_id: block.parentId,
            document_id: block.documentId,
            content: JSON.stringify(block.content),
          }),
        )
        .execute();

      // Delete removed children

      const childrenIds = block.children.map((child) => child.id);

      if (childrenIds.isEmpty()) {
        await transaction.deleteFrom('cms_block').where('cms_block.parent_id', '=', block.id).execute();
      } else {
        await transaction
          .deleteFrom('cms_block')
          .where('cms_block.parent_id', '=', block.id)
          .where('cms_block.id', 'not in', childrenIds)
          .execute();
      }

      // Handle children recursively

      await Promise.all(block.children.map((child) => handleBlock(child)));
    };

    // Upsert document as a placeholder until constraint is removed

    await transaction
      .insertInto('cms_document')
      .values({
        id: entity.documentId,
        title: 'Placeholder Document',
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      })
      .onConflict((oc) => oc.doNothing())
      .execute();

    await handleBlock(entity);
  }

  async remove(id: string): Promise<Result<void, 'entity_doesnt_exist'>> {
    await this.database.transaction().execute(async (transaction) => {
      await transaction.deleteFrom('cms_block').where('cms_block.id', '=', id).execute();

      // Handle legacy documents
      await transaction.deleteFrom('cms_document').where('cms_document.id', '=', id).execute();
    });

    return success();
  }

  async ofId(id: string): Promise<Result<CmsBlock, 'entity_doesnt_exist'>> {
    const result = await this.database
      .withRecursive('blocks', (database) =>
        database
          .selectFrom('cms_block')
          .select([
            'cms_block.id',
            'cms_block.type',
            'cms_block.content',
            'cms_block.position',
            'cms_block.parent_id',
            'cms_block.document_id',
          ])
          .where('id', '=', id)
          .unionAll(
            database
              .selectFrom('cms_block')
              .innerJoin('blocks', 'cms_block.parent_id', 'blocks.id')
              .select([
                'cms_block.id',
                'cms_block.type',
                'cms_block.content',
                'cms_block.position',
                'cms_block.parent_id',
                'cms_block.document_id',
              ]),
          ),
      )
      .selectFrom('blocks')
      .selectAll()
      .orderBy('blocks.position', 'asc')
      .execute();

    const root = result.find((row) => row.parent_id === null);

    if (!root) {
      return error('entity_doesnt_exist');
    }

    return success(this.mapDocument(root, result));
  }

  async all(): Promise<CmsBlock[]> {
    return this.database
      .selectFrom('cms_block')
      .selectAll()
      .orderBy('cms_block.position', 'asc')
      .execute()
      .then((rows) => rows.filter((row) => row.parent_id === null).map((root) => this.mapDocument(root, rows)));
  }

  private async doesBlockExist(transaction: Kysely<DB>, id: string): Promise<boolean> {
    return transaction
      .selectFrom('cms_block')
      .select('cms_block.id')
      .where('cms_block.id', '=', id)
      .execute()
      .then((rows) => rows.length > 0);
  }

  private mapDocument(root: Selectable<DB['cms_block']>, rows: Selectable<DB['cms_block']>[]): CmsBlock {
    const getChildren = (id: string) => rows.filter((block) => block.parent_id === id);

    const mapBlock: (r: Selectable<DB['cms_block']>) => CmsBlock = (row: Selectable<DB['cms_block']>) => {
      return new CmsBlock({
        id: row.id,
        type: row.type,
        content: row.content,
        position: row.position,
        parentId: row.parent_id,
        documentId: row.document_id,
        children: getChildren(row.id).map(mapBlock),
      });
    };

    return mapBlock(root);
  }
}
