import { randomUUID } from 'node:crypto';
import type { ReadableStream } from 'node:stream/web';
import type { FileContent } from '../../../storage';

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
  data: FileContent;

  constructor(data: {
    id?: string;
    key: string;
    name: string;
    type: string;
    createdAt?: Date;
    data: FileContent;
  }) {
    this.key = data.key;
    this.name = data.name;
    this.type = data.type;
    this.data = data.data;
    this.id = data.id ?? randomUUID();
    this.createdAt = data.createdAt ?? new Date();
  }
}
