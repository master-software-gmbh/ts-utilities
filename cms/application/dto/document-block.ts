import type { StandardBlockDto } from './standard-block';

export type DocumentBlockDto = {
  id: string;
  type: 'document';
  children: StandardBlockDto[];
  content: {
    title: string;
  };
};
