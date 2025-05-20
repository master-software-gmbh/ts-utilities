import { array, type GenericSchema, lazy, literal, object, string } from 'valibot';
import { StandardBlock } from './standard-block';

export const PlainTextBlockSchema: GenericSchema<PlainTextBlock> = object({
  id: string(),
  type: literal('plain-text'),
  children: lazy(() => array(StandardBlock)),
  content: object({
    text: string(),
  }),
});

export type PlainTextBlock = {
  id: string;
  type: 'plain-text';
  children: StandardBlock[];
  content: {
    text: string;
  };
};
