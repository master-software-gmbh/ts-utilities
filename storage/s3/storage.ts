import { randomUUID } from 'crypto';
import { S3Client } from 'bun';
import { MimeTypeToFileExtension } from '../../file/utilities';
import { error, success, type Result } from '../../result';
import { type StorageBackend, type Folder, ROOT_FOLDER } from '../types';

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

  async getFile(key: string): Promise<Result<ReadableStream, 'file_not_found'>> {
    const exists = await this.client.exists(key);

    if (!exists) {
      return error('file_not_found');
    }

    return success(this.client.file(key).stream());
  }

  async createFile(source: ReadableStream, folder: Folder = ROOT_FOLDER, type?: string): Promise<string> {
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
