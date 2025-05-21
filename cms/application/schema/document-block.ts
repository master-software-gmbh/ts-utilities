import { type GenericSchema, array, lazy, literal, object, string } from 'valibot';
import { StandardBlockSchema } from './standard-block';
import type { DocumentBlockDto } from '../dto';

export const DocumentContentSchema = object({
  title: string(),
});

export const DocumentBlockSchema: GenericSchema<DocumentBlockDto> = object({
  id: string(),
  type: literal('document'),
  children: lazy(() => array(StandardBlockSchema)),
  content: DocumentContentSchema,
});
