import { array, type GenericSchema, literal, object, string } from 'valibot';
import { StandardBlock } from './standard-block';

export const DocumentBlockSchema: GenericSchema<DocumentBlock> = object({
  id: string(),
  type: literal('document'),
  children: array(StandardBlock),
  content: object({
    title: string(),
  }),
});

export type DocumentBlock = {
  id: string;
  type: 'document';
  children: StandardBlock[];
  content: {
    title: string;
  };
};
