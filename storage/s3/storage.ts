import { S3Client } from 'bun';
import { type Result, error, success } from '../../result';
import { FileContent, type Folder } from '../types';
import type { StorageBackend } from '../interface';
import { BaseStorageBackend } from '../base';

export class S3Storage extends BaseStorageBackend implements StorageBackend {
  private readonly client: S3Client;

  constructor(
    root: Folder,
    options: {
      bucket: string;
      endpoint: string;
      accessKeyId: string;
      secretAccessKey: string;
    },
  ) {
    super(root);
    this.client = new S3Client(options);
  }

  fileExists(key: string): Promise<boolean> {
    return this.client.exists(key);
  }

  async getFile(key: string): Promise<Result<FileContent, 'file_not_found'>> {
    const { path } = this.getId(key);

    const exists = await this.client.exists(path);

    if (!exists) {
      return error('file_not_found');
    }

    return success(new FileContent(this.client.file(path).stream(), undefined, this.client.file(path).presign()));
  }

  async createFile(source: ReadableStream, data?: { type?: string; key?: string }): Promise<string> {
    const { key, path } = this.getId(data?.key);

    const writer = this.client
      .file(path, {
        type: data?.type,
      })
      .writer();

    for await (const chunk of source) {
      await writer.write(chunk);
    }

    await writer.end();

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    const { path } = this.getId(key);
    await this.client.delete(path);
  }
}
