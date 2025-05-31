import { logger } from '../../logging';
import type { TextEmbeddingService } from '../../nlp';
import { type Result, error, success } from '../../result';
import { secondsToMilliseconds } from '../../time';
import type { CmsRepository } from '../domain/CmsRepository';
import { DocumentBlock, FileBlock, PlainTextBlock, RichTextBlock } from '../domain/model';
import type { StandardBlock } from '../domain/model/StandardBlock';
import type { StandardBlockDto } from './dto';

export class CmsService {
  private readonly repository: CmsRepository;
  private readonly debouncedEmbeddingUpdates: Map<string, Timer>;
  private readonly embeddingService?: TextEmbeddingService<unknown>;
  private readonly EMBEDDING_UPDATE_TIMEOUT = secondsToMilliseconds(10);

  constructor(repository: CmsRepository, embeddingService?: TextEmbeddingService<unknown>) {
    this.repository = repository;
    this.embeddingService = embeddingService;
    this.debouncedEmbeddingUpdates = new Map();
  }

  async saveDto(dto: StandardBlockDto) {
    const model = this.mapDto(dto, dto.id, null, 0);
    return this.saveBlock(model);
  }

  private mapDto(
    block: StandardBlockDto,
    documentId: string,
    parentId: string | null,
    position: number,
  ): StandardBlock {
    const children = block.children.map((child, index) => this.mapDto(child, documentId, block.id, index));

    if (block.type === 'document') {
      return new DocumentBlock({
        type: 'document',
        id: block.id,
        documentId,
        parentId,
        position,
        children,
        content: block.content,
      });
    }

    if (block.type === 'plain-text') {
      return new PlainTextBlock({
        type: 'plain-text',
        id: block.id,
        documentId,
        parentId,
        position,
        children,
        content: block.content,
      });
    }

    if (block.type === 'rich-text') {
      return new RichTextBlock({
        type: 'rich-text',
        id: block.id,
        documentId,
        parentId,
        position,
        children,
        content: block.content,
      });
    }

    return new FileBlock({
      type: 'file-ref',
      id: block.id,
      documentId,
      parentId,
      position,
      children,
      content: block.content,
    });
  }

  async saveBlock(block: StandardBlock): Promise<Result<void, 'validation_failed'>> {
    await this.repository.save(block);

    logger.info('Saved CMS document', { id: block.id });

    this.debounceUpdateBlockEmbedding(block.id);

    return success();
  }

  async getBlockById(id: string): Promise<Result<StandardBlock, 'document_not_found' | 'validation_failed'>> {
    const result = await this.repository.ofId(id);

    if (!result.success) {
      return error('document_not_found');
    }

    return result;
  }

  async getRootBlocks(): Promise<StandardBlock[]> {
    return this.repository.byParent(null).all();
  }

  async deleteBlocks(rootId: string): Promise<Result<void, 'document_not_found'>> {
    const result = await this.repository.remove(rootId);

    if (result.error) {
      return error('document_not_found');
    }

    logger.info('Deleted CMS document', { id: rootId });

    return success();
  }

  private debounceUpdateBlockEmbedding(id: string) {
    if (this.debouncedEmbeddingUpdates.has(id)) {
      clearTimeout(this.debouncedEmbeddingUpdates.get(id));
    }

    const timeout = setTimeout(() => {
      this.updateBlockEmbedding(id);
      this.debouncedEmbeddingUpdates.delete(id);
    }, this.EMBEDDING_UPDATE_TIMEOUT);

    this.debouncedEmbeddingUpdates.set(id, timeout);
  }

  async updateBlockEmbedding(
    id: string,
  ): Promise<Result<void, 'missing_dependency' | 'block_not_found' | 'embedding_failed'>> {
    if (!this.embeddingService) {
      return error('missing_dependency');
    }

    const { data: block } = await this.getBlockById(id);

    if (!block) {
      return error('block_not_found');
    }

    const { data: embedding } = await this.embeddingService.generateEmbeddings(block.text);

    if (!embedding) {
      return error('embedding_failed');
    }

    block.embedding = new Float32Array(embedding.embedding);

    await this.repository.save(block);

    logger.info('Updated CMS document embedding', { id: block.id });

    return success();
  }
}
