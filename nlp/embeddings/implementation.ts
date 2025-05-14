import { TextEmbeddingOutputSchema, type TextEmbeddingOutput, type TextEmbeddingServiceConfig } from './types';
import type { TextEmbeddingService } from './interface';
import { typedFetch } from '../../http';
import { error, type Result } from '../../result';

export class TextEmbeddingServiceImpl implements TextEmbeddingService {
  private readonly config: TextEmbeddingServiceConfig;

  constructor(config: TextEmbeddingServiceConfig) {
    this.config = config;
  }

  async generateEmbeddings(text: string): Promise<Result<TextEmbeddingOutput, 'generation_failed'>> {
    const body = {
      text: text,
    };

    const result = await typedFetch(
      this.config.url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      (response) => response.json(),
      TextEmbeddingOutputSchema,
    );

    if (!result.success) {
      return error('generation_failed');
    }

    return result;
  }
}
