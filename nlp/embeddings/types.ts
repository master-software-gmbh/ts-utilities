import { array, number, object, type InferOutput } from 'valibot';
import { Mergeable } from '../../map/mergeable';

export class TextEmbeddingServiceConfig extends Mergeable<TextEmbeddingServiceConfig> {
  url: string;
  timeout: number;

  constructor(url: string, timeout = 5000) {
    super();
    this.url = url;
    this.timeout = timeout;
  }
}

export const TextEmbeddingOutputSchema = object({
  embedding: array(number()),
});

export type TextEmbeddingOutput = InferOutput<typeof TextEmbeddingOutputSchema>;
