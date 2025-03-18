import {
  type InferOutput,
  array,
  boolean,
  intersect,
  literal,
  number,
  object,
  pipe,
  record,
  string,
  union,
} from 'valibot';
import { BaseBlockSchema } from './base';

export const SpanSchema = object({
  text: string(),
  attributes: record(string(), union([string(), number(), boolean()])),
});

export type RichTextSpan = InferOutput<typeof SpanSchema>;
export type RichTextAttributeType = RichTextSpan['attributes'][string];

export const RichTextBlockSchema = intersect([
  BaseBlockSchema,
  object({
    type: literal('rich-text'),
    content: object({
      text: pipe(string()),
      spans: pipe(array(SpanSchema)),
    }),
  }),
]);

export type RichTextBlock = InferOutput<typeof RichTextBlockSchema>;
