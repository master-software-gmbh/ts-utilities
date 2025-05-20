import { randomUUID } from 'crypto';

export class CmsBlock<T = unknown> {
  content: T;
  id: string;
  type: string;
  position: number;
  documentId: string;
  children: CmsBlock<T>[];
  parentId: string | null;

  constructor(data: {
    content: T;
    id?: string;
    type: string;
    position: number;
    documentId: string;
    children?: CmsBlock<T>[];
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
