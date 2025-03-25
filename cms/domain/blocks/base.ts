import { type InferOutput, date, nonEmpty, object, pipe, string, unknown } from 'valibot';
import type { FileRefBlock, HeadingBlock, RichTextBlock } from '.';

export const BaseBlockSchema = object({
  id: pipe(string(), nonEmpty()),
  type: pipe(string(), nonEmpty()),
  createdAt: pipe(date()),
  updatedAt: pipe(date()),
  documentId: pipe(string(), nonEmpty()),
  content: unknown(),
});

export type BaseBlock = InferOutput<typeof BaseBlockSchema>;

export type StandardBlock = RichTextBlock | HeadingBlock | FileRefBlock;
