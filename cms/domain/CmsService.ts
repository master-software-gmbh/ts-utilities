import { randomUUID } from 'crypto';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { getDotPath } from '@standard-schema/utils';
import { logger } from '../../logging';
import { type Result, error, success, successful } from '../../result';
import type { BaseBlock } from './blocks';
import type { BaseDocument } from './document';
import type { CmsRepository } from './CmsRepository';

export class CmsService<BlockSchema extends BaseBlock, DocumentSchema extends BaseDocument> {
  private readonly repository: CmsRepository;
  private readonly documentSchema: StandardSchemaV1<DocumentSchema>;

  constructor(repository: CmsRepository, documentSchema: StandardSchemaV1<DocumentSchema>) {
    this.repository = repository;
    this.documentSchema = documentSchema;
  }

  async createDocument(
    title: string,
    blocks: Pick<BlockSchema, 'type' | 'content'>[],
  ): Promise<Result<DocumentSchema, 'validation_failed'>> {
    const id = randomUUID();
    const date = new Date();

    const document = {
      id,
      title,
      createdAt: date,
      updatedAt: date,
      blocks: blocks.map((block) => ({
        documentId: id,
        createdAt: date,
        updatedAt: date,
        id: randomUUID(),
        type: block.type,
        content: block.content,
      })),
    };

    const result = await this.validateDocument(document);

    if (!result.success) {
      logger.error('Failed to validate CMS document', { id, title });
      return error('validation_failed');
    }

    await this.repository.add(document);

    logger.info('Created CMS document', { id, title });

    return result;
  }

  async getDocumentById(id: string): Promise<Result<DocumentSchema, 'document_not_found' | 'validation_failed'>> {
    const result = await this.repository.ofId(id);

    if (!result.success) {
      return error('document_not_found');
    }

    return this.validateDocument(result.data);
  }

  async getDocuments(): Promise<DocumentSchema[]> {
    const documents = await this.repository.all();
    const results = await documents.compactMapAsync((document) => this.validateDocument(document));
    return successful(results);
  }

  async updateDocument(
    id: string,
    title: string,
    blocks: Pick<BlockSchema, 'type' | 'content'>[],
  ): Promise<Result<undefined, 'document_not_found' | 'validation_failed'>> {
    const result = await this.repository.ofId(id);

    if (!result.success) {
      logger.error('Failed to find CMS document', { id, title });
      return error('document_not_found');
    }

    const updatedDocument = {
      id,
      title,
      createdAt: result.data.createdAt,
      updatedAt: new Date(),
      blocks: blocks.map((block) => ({
        documentId: id,
        id: randomUUID(),
        type: block.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: block.content,
      })),
    };

    const validatedDocument = await this.validateDocument(updatedDocument);

    if (!validatedDocument) {
      logger.error('Failed to validate CMS document', { id, title });
      return error('validation_failed');
    }

    logger.info('Updated CMS document', { id, title });

    await this.repository.update(updatedDocument);

    return success(undefined);
  }

  deleteDocument(id: string) {
    return this.repository.remove(id);
  }

  private async validateDocument(document: BaseDocument): Promise<Result<DocumentSchema, 'validation_failed'>> {
    const result = await this.documentSchema['~standard'].validate(document);

    if (result.issues) {
      const paths = result.issues.map((issue) => getDotPath(issue));
      logger.error('Document validation failed', { id: document.id, title: document.title, paths });

      return error('validation_failed');
    }

    return success(result.value);
  }
}
