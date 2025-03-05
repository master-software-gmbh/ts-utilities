import { randomUUID } from 'crypto';
import type { CmsRepository } from './repository';
import type { CmsDocument } from './document';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { getDotPath } from '@standard-schema/utils';
import { logger } from '../../logging';

export class CmsService<DocumentSchema> {
  private readonly repository: CmsRepository;
  private readonly documentSchema: StandardSchemaV1<DocumentSchema>;

  constructor(repository: CmsRepository, documentSchema: StandardSchemaV1<DocumentSchema>) {
    this.repository = repository;
    this.documentSchema = documentSchema;
  }

  async createDocument(
    title: string,
    blocks: {
      type: string;
      content: unknown;
    }[],
  ): Promise<DocumentSchema> {
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

    const validatedDocument = await this.validateDocument(document);

    if (!validatedDocument) {
      logger.error('Failed to validate CMS document', { id, title });
      throw new Error('Failed to validate CMS document');
    }

    await this.repository.insert(document);

    logger.info('Created CMS document', { id, title });

    return validatedDocument;
  }

  async getDocumentById(id: string): Promise<DocumentSchema | null> {
    const document = await this.repository.findById(id);

    if (!document) {
      return null;
    }

    return this.validateDocument(document);
  }

  async getDocuments(): Promise<DocumentSchema[]> {
    const documents = await this.repository.findAll();
    return documents.compactMap((document) => this.validateDocument(document));
  }

  async updateDocument(
    id: string,
    title: string,
    blocks: {
      type: string;
      content: unknown;
    }[],
  ) {
    const document = await this.repository.findById(id);

    if (!document) {
      throw new Error('Document not found');
    }

    const updatedDocument = {
      id,
      title,
      createdAt: document.createdAt,
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
      throw new Error('Failed to validate CMS document');
    }

    logger.info('Updated CMS document', { id, title });

    await this.repository.update(updatedDocument);
  }

  deleteDocument(id: string) {
    return this.repository.delete(id);
  }

  private async validateDocument(document: CmsDocument): Promise<DocumentSchema | null> {
    const result = await this.documentSchema['~standard'].validate(document);

    if (result.issues) {
      const paths = result.issues.map((issue) => getDotPath(issue));
      logger.error('Document validation failed', { id: document.id, title: document.title, paths });

      return null;
    }

    return result.value;
  }
}
