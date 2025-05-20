import { type InferOutput, lazy, union } from 'valibot';
import { DocumentBlockSchema } from './document-block';
import { FileBlockSchema } from './file-block';
import { PlainTextBlockSchema } from './plain-text-block';
import { RichTextBlockSchema } from './rich-text-block';

export const StandardBlock = lazy(() =>
  union([DocumentBlockSchema, RichTextBlockSchema, PlainTextBlockSchema, FileBlockSchema]),
);

export type StandardBlock = InferOutput<typeof StandardBlock>;
