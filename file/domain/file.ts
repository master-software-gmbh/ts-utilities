import { randomUUID } from 'node:crypto';
import type { FileContent } from '../../storage';
import type { ReadableStream } from 'node:stream/web';

export interface FileInput {
  name: string;
  type: string;
  stream: () => ReadableStream;
}

export class FileEntity {
  id: string;
  key: string;
  name: string;
  type: string;
  createdAt: Date;
  data: FileContent | null;

  constructor(data: {
    id?: string;
    key: string;
    name: string;
    type: string;
    createdAt?: Date;
    data?: FileContent | null;
  }) {
    this.id = data.id ?? randomUUID();
    this.key = data.key;
    this.name = data.name;
    this.type = data.type;
    this.data = data.data ?? null;
    this.createdAt = data.createdAt ?? new Date();
  }
}
