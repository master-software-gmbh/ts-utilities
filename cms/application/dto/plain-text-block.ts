import type { StandardBlockDto } from './standard-block';

export type PlainTextBlockDto = {
  id: string;
  type: 'plain-text';
  children: StandardBlockDto[];
  content: {
    text: string;
  };
};
