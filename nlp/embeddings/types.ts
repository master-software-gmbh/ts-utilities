import { array, number, object, type InferOutput } from 'valibot';

export type TextEmbeddingServiceConfig = {
  url: string;
};

export const TextEmbeddingOutputSchema = object({
  embedding: array(number()),
});

export type TextEmbeddingOutput = InferOutput<typeof TextEmbeddingOutputSchema>;
