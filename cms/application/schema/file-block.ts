import { type GenericSchema, array, lazy, literal, nonEmpty, object, pipe, string } from 'valibot';
import type { FileBlockDto } from '../dto';
import { StandardBlockSchema } from './standard-block';

export const FileContentSchema = object({
  id: pipe(string(), nonEmpty()),
  name: pipe(string()),
  type: pipe(string(), nonEmpty()),
});

export const FileBlockSchema: GenericSchema<FileBlockDto> = object({
  id: string(),
  type: literal('file-ref'),
  children: lazy(() => array(StandardBlockSchema)),
  content: FileContentSchema,
});
