import { type InferOutput, intersect, literal, maxValue, minValue, number, object, pipe, string } from 'valibot';
import { BaseBlockSchema } from './base';

export const HeadingBlockSchema = intersect([
  BaseBlockSchema,
  object({
    type: literal('heading'),
    content: object({
      level: pipe(number(), minValue(1), maxValue(6)),
      text: string(),
    }),
  }),
]);

export type HeadingBlock = InferOutput<typeof HeadingBlockSchema>;
