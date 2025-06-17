import { randomUUID } from 'node:crypto';
import type { FileBlock } from './FileBlock';
import type { StandardBlock } from './StandardBlock';

export abstract class CmsBlock<T extends string> {
  id: string;
  abstract type: T;
  content: unknown;
  position: number;
  abstract text: string;
  children: StandardBlock[];
  parentId: string | null;
  embedding?: Float32Array | null;

  constructor(data: {
    id?: string;
    content: unknown;
    position?: number;
    children?: StandardBlock[];
    parentId?: string | null;
    embedding?: Float32Array | null;
  }) {
    this.content = data.content;
    this.embedding = data.embedding;
    this.id = data.id ?? randomUUID();
    this.position = data.position ?? 0;
    this.children = data.children ?? [];
    this.parentId = data.parentId ?? null;
  }

  isFileBlock(): this is FileBlock {
    return this.type === 'file-ref';
  }

  /**
   * Serialize the block to a JSON string, escaping HTML characters.
   * Safe for injection into script tags of type application/json.
   */
  get serialize(): string {
    return JSON.stringify(this).replace(/</g, '\\u003C').replace(/>/g, '\\u003E').replace(/&/g, '\\u0026');
  }
}
