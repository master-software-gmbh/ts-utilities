import type { Result } from '../../result';
import type { TextEmbeddingOutput } from './types';

export interface TextEmbeddingService {
  generateEmbeddings(text: string): Promise<Result<TextEmbeddingOutput, 'generation_failed'>>;
}
