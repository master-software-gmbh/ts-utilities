import { type GenericSchema, array, lazy, literal, object, string } from 'valibot';
import { StandardBlockSchema } from './standard-block';
import type { PlainTextBlockDto } from '../dto';

export const PlainTextContentSchema = object({
  text: string(),
});

export const PlainTextBlockSchema: GenericSchema<PlainTextBlockDto> = object({
  id: string(),
  type: literal('plain-text'),
  children: lazy(() => array(StandardBlockSchema)),
  content: PlainTextContentSchema,
});
