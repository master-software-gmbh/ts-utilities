import {
  type GenericSchema,
  type InferOutput,
  array,
  boolean,
  literal,
  number,
  object,
  pipe,
  record,
  string,
  union,
} from 'valibot';
import { StandardBlock } from './standard-block';

export const SpanSchema = object({
  text: string(),
  attributes: record(string(), union([string(), number(), boolean()])),
});

export type RichTextSpan = InferOutput<typeof SpanSchema>;
export type RichTextAttributeType = RichTextSpan['attributes'][string];

export const RichTextBlockSchema: GenericSchema<RichTextBlock> = object({
  id: string(),
  type: literal('rich-text'),
  children: array(StandardBlock),
  content: object({
    text: pipe(string()),
    spans: pipe(array(SpanSchema)),
  }),
});

export type RichTextBlock = {
  id: string;
  type: 'rich-text';
  children: StandardBlock[];
  content: {
    text: string;
    spans: RichTextSpan[];
  };
};
