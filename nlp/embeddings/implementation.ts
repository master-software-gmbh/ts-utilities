import { TextEmbeddingOutputSchema, type TextEmbeddingOutput, type TextEmbeddingServiceConfig } from './types';
import type { TextEmbeddingService } from './interface';
import { typedFetch } from '../../http';
import { error, type Result } from '../../result';

export class TextEmbeddingServiceImpl implements TextEmbeddingService<TextEmbeddingServiceConfig> {
  private readonly config: TextEmbeddingServiceConfig;

  constructor(config: TextEmbeddingServiceConfig) {
    this.config = config;
  }

  async generateEmbeddings(
    text: string,
    config?: TextEmbeddingServiceConfig,
  ): Promise<Result<TextEmbeddingOutput, 'generation_failed'>> {
    const mergedConfig = this.config.merge(config);

    const body = {
      text: text,
    };

    const result = await typedFetch(
      mergedConfig.url,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(mergedConfig.timeout),
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
