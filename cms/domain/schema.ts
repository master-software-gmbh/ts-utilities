import {
  array,
  date,
  intersect,
  literal,
  maxValue,
  minValue,
  nonEmpty,
  number,
  object,
  pipe,
  string,
  union,
  type GenericSchema,
  type InferOutput,
} from 'valibot';

export const DocumentSchema = <T extends GenericSchema>(blockSchema: T[]) =>
  object({
    id: pipe(string(), nonEmpty()),
    title: pipe(string(), nonEmpty()),
    createdAt: pipe(date()),
    updatedAt: pipe(date()),
    blocks: pipe(array(union(blockSchema))),
  });

export const BlockSchema = object({
  id: pipe(string(), nonEmpty()),
  type: pipe(string(), nonEmpty()),
  createdAt: pipe(date()),
  updatedAt: pipe(date()),
  documentId: pipe(string(), nonEmpty()),
});

export const HeadingBlockSchema = intersect([
  BlockSchema,
  object({
    type: literal('heading'),
    content: object({
      level: pipe(number(), minValue(1), maxValue(6)),
      text: pipe(string()),
    }),
  }),
]);

export type HeadingBlock = InferOutput<typeof HeadingBlockSchema>;

export const TextBlockSchema = intersect([
  BlockSchema,
  object({
    type: literal('text'),
    content: object({
      text: string(),
    }),
  }),
]);

export type TextBlock = InferOutput<typeof TextBlockSchema>;
