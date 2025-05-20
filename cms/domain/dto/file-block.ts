import { type GenericSchema, array, lazy, literal, nonEmpty, object, pipe, string } from 'valibot';
import { StandardBlock } from './standard-block';

export const FileBlockSchema: GenericSchema<FileBlock> = object({
  id: string(),
  type: literal('file-ref'),
  children: lazy(() => array(StandardBlock)),
  content: object({
    id: pipe(string(), nonEmpty()),
    name: pipe(string()),
    type: pipe(string(), nonEmpty()),
  }),
});

export type FileBlock = {
  id: string;
  type: 'file-ref';
  children: StandardBlock[];
  content: {
    id: string;
    name: string;
    type: string;
  };
};
