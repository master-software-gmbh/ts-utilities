import type { StandardSchemaV1 } from '@standard-schema/spec';
import { getDotPath } from '@standard-schema/utils';
import { logger } from '../../logging';
import { type Result, error, success, successful } from '../../result';
import type { CmsRepository } from '../domain/CmsRepository';
import type { BaseBlock } from '../domain/dto';
import { CmsBlock } from '../domain/model/CmsBlock';

export class CmsService<BlockSchema extends BaseBlock> {
  private readonly repository: CmsRepository;
  private readonly schema: StandardSchemaV1<BlockSchema>;

  constructor(repository: CmsRepository, schema: StandardSchemaV1<BlockSchema>) {
    this.schema = schema;
    this.repository = repository;
  }

  async saveBlock(document: BlockSchema): Promise<Result<void, 'validation_failed'>> {
    const result = await this.validateDocument(document);

    if (!result.success) {
      logger.error('Failed to validate CMS document', { id: document.id });
      return error('validation_failed');
    }

    const model = this.mapDto(document, document.id, null, 0);

    await this.repository.save(model);

    logger.info('Saved CMS document', { id: document.id });

    return success();
  }

  async getBlockById(id: string): Promise<Result<BlockSchema, 'document_not_found' | 'validation_failed'>> {
    const result = await this.repository.ofId(id);

    if (!result.success) {
      return error('document_not_found');
    }

    return this.validateDocument(result.data);
  }

  async getRootBlocks(): Promise<BlockSchema[]> {
    const documents = await this.repository.byParent(null).all();
    const promises = documents.map((document) => this.validateDocument(document));
    const results = await Promise.all(promises);

    return successful(results);
  }

  async deleteBlocks(rootId: string): Promise<Result<void, 'document_not_found'>> {
    const result = await this.repository.remove(rootId);

    if (result.error) {
      return error('document_not_found');
    }

    logger.info('Deleted CMS document', { id: rootId });

    return success();
  }

  private mapDto(block: BaseBlock, documentId: string, parentId: string | null, position: number): CmsBlock {
    const children = block.children.map((child, index) => this.mapDto(child, documentId, block.id, index));

    return new CmsBlock({
      id: block.id,
      type: block.type,
      children: children,
      position: position,
      parentId: parentId,
      documentId: documentId,
      content: block.content,
    });
  }

  private async validateDocument(document: BaseBlock): Promise<Result<BlockSchema, 'validation_failed'>> {
    const result = await this.schema['~standard'].validate(document);

    if (result.issues) {
      const paths = result.issues.map((issue) => getDotPath(issue));
      logger.error('Document validation failed', { id: document.id, paths });

      return error('validation_failed');
    }

    return success(result.value);
  }
}
