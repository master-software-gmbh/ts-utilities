import type { Result } from '../../result';
import type { TextEmbeddingOutput } from './types';

export interface TextEmbeddingService<T> {
  generateEmbeddings(text: string, config?: Partial<T>): Promise<Result<TextEmbeddingOutput, 'generation_failed'>>;
}
