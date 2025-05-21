import { type GenericSchema, array, lazy, literal, object, string } from 'valibot';
import type { DocumentBlockDto } from '../dto';
import { StandardBlockSchema } from './standard-block';

export const DocumentContentSchema = object({
  title: string(),
});

export const DocumentBlockSchema: GenericSchema<DocumentBlockDto> = object({
  id: string(),
  type: literal('document'),
  children: lazy(() => array(StandardBlockSchema)),
  content: DocumentContentSchema,
});
