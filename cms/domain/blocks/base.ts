import { type InferOutput, nonEmpty, object, pipe, string, unknown } from 'valibot';
import type { FileRefBlock, HeadingBlock, RichTextBlock } from '.';

export const BaseBlockSchema = object({
  id: pipe(string(), nonEmpty()),
  type: pipe(string(), nonEmpty()),
  content: unknown(),
});

export type BaseBlock = InferOutput<typeof BaseBlockSchema>;

export type StandardBlock = RichTextBlock | HeadingBlock | FileRefBlock;
