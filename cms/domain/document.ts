import {
  type GenericSchema,
  type InferOutput,
  array,
  date,
  intersect,
  nonEmpty,
  object,
  omit,
  pipe,
  string,
  union,
} from 'valibot';
import { BaseBlockSchema, FileRefBlockSchema, HeadingBlockSchema, RichTextBlockSchema } from './blocks';

export const BaseDocumentSchema = object({
  id: pipe(string(), nonEmpty()),
  title: pipe(string(), nonEmpty()),
  createdAt: pipe(date()),
  updatedAt: pipe(date()),
  blocks: array(BaseBlockSchema),
});

export type BaseDocument = InferOutput<typeof BaseDocumentSchema>;

const TypedDocumentSchema = <T extends GenericSchema>(TypedBlockSchema: T) =>
  intersect([
    omit(BaseDocumentSchema, ['blocks']),
    object({
      blocks: array(TypedBlockSchema),
    }),
  ]);

export const StandardDocumentSchema = TypedDocumentSchema(
  union([RichTextBlockSchema, HeadingBlockSchema, FileRefBlockSchema]),
);

export type StandardDocument = InferOutput<typeof StandardDocumentSchema>;
