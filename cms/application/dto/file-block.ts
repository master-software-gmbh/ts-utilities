import type { StandardBlockDto } from './standard-block';

export type FileBlockDto = {
  id: string;
  type: 'file-ref';
  children: StandardBlockDto[];
  content: {
    id: string;
    name: string;
    type: string;
  };
};
