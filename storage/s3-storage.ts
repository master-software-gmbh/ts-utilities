import { randomUUID } from 'crypto';
import { S3Client } from 'bun';
import { MimeTypeToFileExtension } from '../file';
import type { Folder, StorageBackend } from './types';

export class S3Storage implements StorageBackend {
  private readonly client: S3Client;

  constructor(options: {
    bucket: string;
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    this.client = new S3Client(options);
  }

  async getFile(key: string): Promise<ReadableStream> {
    return this.client.file(key).stream();
  }

  async createFile(source: ReadableStream, folder: Folder, type?: string): Promise<string> {
    const key = this.getUniqueFileKey(folder, type);
    const writer = this.client
      .file(key, {
        type,
      })
      .writer();

    for await (const chunk of source) {
      await writer.write(chunk);
    }

    await writer.end();

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.delete(key);
  }

  private getUniqueFileKey(folder: Folder, type?: string): string {
    const extension = type ? MimeTypeToFileExtension[type]?.at(0) : undefined;

    let filename = randomUUID();

    if (extension) {
      filename += `.${extension}`;
    }

    return [...folder.path, filename].join('/');
  }
}
