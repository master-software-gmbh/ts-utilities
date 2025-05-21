import { type ExpressionWrapper, type Kysely, sql } from 'kysely';
import type { ExpressionBuilder, RawBuilder } from 'kysely';
import type { SqlBool } from 'kysely';
import { type Result, error, success } from '../../result';
import type { DB } from '../database/types';
import type { CmsRepository } from '../domain/CmsRepository';
import '../../array';
import { logger } from '../../logging';
import type { StandardBlock } from '../domain/model/StandardBlock';
import { CmsRepositoryMapper } from './CmsRepositoryMapper';

type WhereBuilder = (eb: ExpressionBuilder<DB, 'cms_block'>) => ExpressionWrapper<DB, 'cms_block', SqlBool>;

export class CmsRepositoryImpl implements CmsRepository {
  private readonly database: Kysely<DB>;
  private readonly whereBuilder: WhereBuilder;

  constructor(database: Kysely<DB>, whereBuilder?: WhereBuilder) {
    this.database = database;
    this.whereBuilder = whereBuilder ?? ((eb) => eb.and([]));
  }

  byParent(parentId: string | null) {
    return new CmsRepositoryImpl(this.database, (eb) => {
      if (parentId === null) {
        return eb.and([this.whereBuilder(eb), eb('cms_block.parent_id', 'is', null)]);
      }

      return eb.and([this.whereBuilder(eb), eb('cms_block.parent_id', '=', parentId)]);
    });
  }

  async add(entity: StandardBlock): Promise<Result<void, 'entity_already_exists'>> {
    return this.database.transaction().execute(async (transaction) => {
      const exists = await this.doesBlockExist(transaction, entity.id);

      if (exists) {
        return error('entity_already_exists');
      }

      await this.upsert(transaction, entity);

      return success();
    });
  }

  async update(entity: StandardBlock): Promise<Result<void, 'entity_doesnt_exist'>> {
    return this.database.transaction().execute(async (transaction) => {
      const exists = await this.doesBlockExist(transaction, entity.id);

      if (!exists) {
        return error('entity_doesnt_exist');
      }

      await this.upsert(transaction, entity);

      return success();
    });
  }

  async save(entity: StandardBlock): Promise<void> {
    await this.database.transaction().execute(async (transaction) => {
      await this.upsert(transaction, entity);
    });
  }

  private async upsert(transaction: Kysely<DB>, entity: StandardBlock): Promise<void> {
    const handleBlock = async (block: StandardBlock) => {
      // Upsert block itself

      let embedding: RawBuilder<Buffer> | undefined | null;

      if (block.embedding) {
        embedding = sql`vec_normalize(vec_f32(${block.embedding}))`;
      } else if (block.embedding === null) {
        embedding = null;
      }

      await transaction
        .insertInto('cms_block')
        .values({
          id: block.id,
          type: block.type,
          text: block.text,
          embedding: embedding,
          position: block.position,
          parent_id: block.parentId,
          document_id: block.documentId,
          content: JSON.stringify(block.content),
        })
        .onConflict((oc) =>
          oc.doUpdateSet({
            type: block.type,
            text: block.text,
            embedding: embedding,
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

  async ofId(id: string): Promise<Result<StandardBlock, 'entity_doesnt_exist'>> {
    const result = await this.database
      .withRecursive('blocks', (database) =>
        database
          .selectFrom('cms_block')
          .select([
            'cms_block.id',
            'cms_block.type',
            'cms_block.text',
            'cms_block.content',
            'cms_block.position',
            'cms_block.parent_id',
            'cms_block.embedding',
            'cms_block.document_id',
          ])
          .where('cms_block.id', '=', id)
          .unionAll(
            database
              .selectFrom('cms_block')
              .innerJoin('blocks', 'cms_block.parent_id', 'blocks.id')
              .select([
                'cms_block.id',
                'cms_block.type',
                'cms_block.text',
                'cms_block.content',
                'cms_block.position',
                'cms_block.parent_id',
                'cms_block.embedding',
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

    const entity = CmsRepositoryMapper.mapToEntity(root, result);

    if (!entity) {
      logger.warn('Entity mapping failed', {
        id: id,
      });

      return error('entity_doesnt_exist');
    }

    return success(entity);
  }

  async all(): Promise<StandardBlock[]> {
    const rows = await this.database
      .selectFrom('cms_block')
      .selectAll()
      .where(this.whereBuilder)
      .orderBy('cms_block.position', 'asc')
      .execute();

    return rows.compactMap((root) => CmsRepositoryMapper.mapToEntity(root, rows));
  }

  private async doesBlockExist(transaction: Kysely<DB>, id: string): Promise<boolean> {
    return transaction
      .selectFrom('cms_block')
      .select('cms_block.id')
      .where('cms_block.id', '=', id)
      .execute()
      .then((rows) => rows.length > 0);
  }
}
