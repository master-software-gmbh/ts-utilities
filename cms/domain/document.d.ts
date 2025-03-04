import type { CmsBlock } from './block';

export interface CmsDocument {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  blocks: CmsBlock[];
}
