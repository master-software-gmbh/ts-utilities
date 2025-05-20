import { lazy, union, type InferOutput } from 'valibot';
import { DocumentBlockSchema } from './document-block';
import { FileBlockSchema } from './file-block';
import { RichTextBlockSchema } from './rich-text-block';
import { PlainTextBlockSchema } from './plain-text-block';

export const StandardBlock = lazy(() =>
  union([DocumentBlockSchema, RichTextBlockSchema, PlainTextBlockSchema, FileBlockSchema]),
);

export type StandardBlock = InferOutput<typeof StandardBlock>;
