import { randomUUID } from 'crypto';

export class CmsBlock {
  content: unknown;
  id: string;
  type: string;
  position: number;
  documentId: string;
  children: CmsBlock[];
  parentId: string | null;

  constructor(data: {
    content: unknown;
    id?: string;
    type: string;
    position: number;
    documentId: string;
    children?: CmsBlock[];
    parentId?: string | null;
  }) {
    this.type = data.type;
    this.content = data.content;
    this.position = data.position;
    this.id = data.id ?? randomUUID();
    this.documentId = data.documentId;
    this.children = data.children ?? [];
    this.parentId = data.parentId ?? null;
  }
}
