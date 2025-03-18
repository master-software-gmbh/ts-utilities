import { type InferOutput, intersect, literal, object, string } from 'valibot';
import { BaseBlockSchema } from './base';

export const PlainTextBlockSchema = intersect([
  BaseBlockSchema,
  object({
    type: literal('plain-text'),
    content: object({
      text: string(),
    }),
  }),
]);

export type PlainTextBlock = InferOutput<typeof PlainTextBlockSchema>;
