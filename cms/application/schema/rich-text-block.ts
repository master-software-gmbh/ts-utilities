import {
  type GenericSchema,
  array,
  boolean,
  lazy,
  literal,
  number,
  object,
  pipe,
  record,
  string,
  union,
} from 'valibot';
import { StandardBlockSchema } from './standard-block';
import type { RichTextBlockDto } from '../dto';

export const RichTextContentSchema = object({
  spans: pipe(
    array(
      object({
        text: string(),
        attributes: record(string(), union([string(), number(), boolean()])),
      }),
    ),
  ),
});

export const RichTextBlockSchema: GenericSchema<RichTextBlockDto> = object({
  id: string(),
  type: literal('rich-text'),
  children: lazy(() => array(StandardBlockSchema)),
  content: RichTextContentSchema,
});
