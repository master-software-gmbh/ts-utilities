import { randomUUID } from 'crypto';
import type { FileBlock } from './FileBlock';
import type { StandardBlock } from './StandardBlock';

export abstract class CmsBlock {
  content: unknown;
  id: string;
  type: string;
  position: number;
  documentId: string;
  abstract text: string;
  children: StandardBlock[];
  parentId: string | null;
  embedding?: Float32Array | null;

  constructor(data: {
    content: unknown;
    id?: string;
    type: string;
    position?: number;
    documentId: string;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
  }) {
    this.type = data.type;
    this.content = data.content;
    this.embedding = data.embedding;
    this.id = data.id ?? randomUUID();
    this.documentId = data.documentId;
    this.position = data.position ?? 0;
    this.children = data.children ?? [];
    this.parentId = data.parentId ?? null;
  }

  isFileBlock(): this is FileBlock {
    return this.type === 'file-ref';
  }
}
