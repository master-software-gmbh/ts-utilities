import { type InferOutput, intersect, literal, nonEmpty, object, pipe, string } from 'valibot';
import { BaseBlockSchema } from './base';

export const FileRefBlockSchema = intersect([
  BaseBlockSchema,
  object({
    type: literal('file-ref'),
    content: object({
      id: pipe(string(), nonEmpty()),
      name: pipe(string()),
      type: pipe(string(), nonEmpty()),
    }),
  }),
]);

export type FileRefBlock = InferOutput<typeof FileRefBlockSchema>;
